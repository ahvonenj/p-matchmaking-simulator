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
		members: {}
	}
}

Client.prototype.toString = function(full)
{
	full = full || false;

	if(full)
	{
		var s = '<< Client (' + this.id + ')' + 
		', Group { isGrouped: ' + this.group.isGrouped +
		', isLeader: ' + this.group.isLeader + 
		', Members: ';

		_.each(this.group.members, function(member)
		{
			s += '(' + member.simpleid + '[' + member.stats.level + ']), ';
		});

		s += '}, Stats: { Level: ' + this.stats.level + ' } >>';
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

Client.prototype.Disconnect = function()
{
	this.connection.isConnected = false;
	this.connection.server = null;
}

Client.prototype.InviteGroup = function(conn2)
{
	var self = this;

	if(Object.keys(this.group.members) >= Global.MAX_GROUP_MEMBERS)
	{
		this._log('Client (' + this.id2 + ') cannot invite (' + conn2.id2 + ') - ' + this.id2 + ' group is full');
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

	if(this.group.isGrouped)
	{
		if(this.group.isLeader)
		{
			var group2 = conn2.group;

			_.each(this.group.members, function(member)
			{
				member.AddMember(conn2);
			});

			this.AddMember(conn2);
		}
		else
		{

		}
	}
	else
	{
		if(conn2.JoinGroup(this))
		{
			this.group.isGrouped = true;
			this.group.isLeader = true;
			this.group.members[conn2.id] = conn2;
		}
	}
}

Client.prototype.LeaveGroup = function()
{
	var self = this;

	if(!this.group.isGrouped)
		return;

	if(this.group.isLeader)
	{
		this.group.isLeader = false;

		var leaderAssigned = false;

		_.each(this.group.members, function(member)
		{
			if(!leaderAssigned)
			{
				member.group.isLeader = true;
				leaderAssigned = true;
			}

			member.UnGroup(self);
		});
	}
	else
	{
		_.each(this.group.members, function(member)
		{
			member.UnGroup(self);
		});
	}

	this.group.isGrouped = false;
}

Client.prototype.UnGroup = function(conn2)
{
	this.RemoveMember(conn2);

	if(Object.keys(this.group.members).length === 0)
	{
		this.group.isGrouped = false;
		this.group.isLeader = false;
	}
}

Client.prototype.JoinGroup = function(conn2)
{
	var self = this;

	if(Object.keys(conn2.group.members) >= Global.MAX_GROUP_MEMBERS)
	{
		this._log('Client (' + this.id2 + ') cannot join (' + conn2.id2 + ') - ' + conn2.id2 + ' group is full');
	}

	if(this.group.isGrouped)
	{
		if(typeof conn2.group.members[this.id] !== 'undefined' ||
			this.group.members[conn2.id] !== 'undefined')
		{
			this._log('Client (' + this.id2 + ') is already grouped with (' + conn2.id2 + ')');
			return false;
		}
	}

	this.LeaveGroup();

	_.each(conn2.group.members, function(member)
	{
		member.AddMember(self);
	});

	conn2.addMember(self);

	return true;
}

Client.prototype.AddMember = function(conn2)
{
	if(typeof this.group.members[conn2.id] !== 'undefined')
		this.group.members[conn2.id] = conn2;
}

Client.prototype.RemoveMember = function(conn2)
{
	if(typeof this.group.members[conn2.id] !== 'undefined')
		delete this.group.members[conn2.id];
}

Client.prototype.Remove = function()
{
	this.LeaveGroup();
	this.connections.server.Disconnect(this);
}