function Client(id, stats, clienthandler)
{
	var self = this;

	this.clienthandler = clienthandler;

	this.id = id;
	this.simpleid = this.id.substring(0, this.id.indexOf('-'));
	this.humanid = chance.name({ nationality: 'en' });
	this.id2 = this.simpleid + ' | ' + this.humanid;
	this.id3 = this.simpleid + ' | ' + this.humanid.substring(0, this.humanid.indexOf(' '));

	if(stats === null)
	{
		this.stats = 
		{
			level: 0
		}
	}
	else
	{
		this.stats = stats;
	}

	this.connection = 
	{
		isConnected: false,
		server: null
	}

	this.group = 
	{
		isGrouped: false,
		isLeader: false,
		leaderClient: null,
		members: {}
	}

	this.matchmaking = 
	{
		isInPool: false
	}
}

Client.prototype.toString = function(full)
{
	full = full || false;

	if(full)
	{
		var s = '<<\n\tClient: (' + this.id + ')' + 
		',\n\tName: ' + this.humanid +
		',\n\tGroup:\n\t{\n\t\tisGrouped: ' + this.group.isGrouped +
		',\n\t\tisLeader: ' + this.group.isLeader + 
		',\n\t\tMembers: ';

		_.each(this.group.members, function(member)
		{
			s += '(' + member.simpleid + '[' + member.stats.level + ']), ';
		});

		s += '\n\t},\n\tStats:\n\t{\n\t\tLevel: ' + this.stats.level + '\n\t}' + 
		',\n\tMatchmaking:\n\t{\n\t\t' + 
		'isInPool: ' + this.matchmaking.isInPool + '\n\t}\n>>';
	}
	else
	{
		var s = '<< Client (' + this.id2 + ')' + 
		', Group { isGrouped: ' + this.group.isGrouped +
		', isLeader: ' + this.group.isLeader + 
		', Members: ' + Object.keys(this.group.members).length + 
		', Stats: { Level: ' + this.stats.level + ' } >>';
	}
	
	return s;
}

Client.prototype._log = function(str)
{
	if(typeof this.clienthandler !== 'undefined' && 
		this.clienthandler !== null)
	{
		this.clienthandler._log(str);
	}
}

Client.prototype.Connect = function(server)
{
	return server.RequestConnection(this);
}

Client.prototype.Disconnect = function(server)
{
	return server.Disconnect(this);
}

Client.prototype.InviteGroup = function(conn2)
{
	var self = this;

	if(this.id === conn2.id)
	{
		this._log('Client (' + this.id2 + ') cannot invite itself');
		return false;
	}

	if(typeof this.group.members[conn2.id] !== 'undefined')
	{
		this._log('Client (' + conn2.id2 + ') is already grouped with (' + this.id2 + ')');
		return false;
	}

	if(Object.keys(this.group.members) >= Global.MAX_GROUP_MEMBERS)
	{
		this._log('Client (' + this.id2 + ') cannot invite (' + conn2.id2 + ') - ' + this.id2 + ' group is full');
		return false;
	}

	if(!this.connection.isConnected)
	{
		this._log('Client (' + this.id2 + ') cannot invite (' + conn2.id2 + ') - ' + this.id2 + ' is not connected');
		return false;
	}

	if(!conn2.connection.isConnected)
	{
		this._log('Client (' + this.id2 + ') cannot invite (' + conn2.id2 + ') - ' + conn2.id2 + ' is not connected');
		return false;
	}
}

Client.prototype.AddMemberToGroup = function(conn2)
{
	var self = this;

	if(this.id === conn2.id)
	{
		this._log('Client (' + this.id2 + ') cannot group with itself');
		return false;
	}

	if(typeof this.group.members[conn2.id] !== 'undefined')
	{
		this._log('Client (' + conn2.id2 + ') is already grouped with (' + this.id2 + ')');
		return false;
	}

	if(Object.keys(this.group.members) >= Global.MAX_GROUP_MEMBERS)
	{
		this._log('Client (' + this.id2 + ') cannot invite (' + conn2.id2 + '), group is full');
		return false;
	}

	if(!this.group.isGrouped)
	{
		this.group.isGrouped = true;
		this.group.isLeader = true;
		conn2.group.isGrouped = true;
		conn2.group.isLeader = false;

		this.group.members[conn2.id] = conn2;
		conn2.group.members[this.id] = this;

		this.group.leaderClient = this;
		conn2.group.leaderClient = this;

		this._log('Client (' + this.id2 + ') added (' + conn2.id + ') to group');
		return true;
	}
	else
	{
		_.each(this.group.members, function(member)
		{
			member.group.members[conn2.id] = conn2;
			conn2.group.members[member.id] = member;
		});

		conn2.group.isGrouped = true;
		conn2.group.isLeader = false;
		conn2.group.leaderClient = this.group.leaderClient;

		this.group.members[conn2.id] = conn2;
		conn2.group.members[this.id] = this;

		this._log('Client (' + this.id2 + ') added (' + conn2.id2 + ') to existing group');
		return true;
	}
}


Client.prototype.Remove = function()
{
	this.LeaveGroup();
	this.connections.server.Disconnect(this);
}