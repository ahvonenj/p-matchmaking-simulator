function Matchmaker()
{
	var self = this;

	this.$log = $('#matchmaker-log');

	this.pool = [];
}

Matchmaker.prototype.Start = function()
{
	this._log('Matchmaker started');
}

Matchmaker.prototype.AddToPool = function(client)
{
	var self = this;

	client.matchmaking.isInPool = true;

	if(client.group.isGrouped)
	{
		var avglevel = 0;
		var clients = {};
		var sum = client.stats.level;
		var c = 1;

		_.each(client.group.members, function(member)
		{
			member.matchmaking.isInPool = true;
			clients[member.id] = member;
			sum += member.stats.level;
			c++;
		});

		avglevel = sum / c;
		clients[client.id] = client;
	}
	else
	{
		var avglevel = client.stats.level;
		var clients = {};
		clients[client.id] = client;
	}

	this.pool.push(new PoolEntity(avglevel, clients));
}

Matchmaker.prototype.FindInPool = function(clientToFind)
{
	var ret = null;

	_.each(this.pool, function(poolentity)
	{
		_.each(poolentity.clients, function(client)
		{
			if(client.id === clientToFind.id)
			{
				ret = client;
			}
		});

		if(ret !== null)
			return;
	});

	return ret;
}

Matchmaker.prototype.Tick = function()
{

}








Matchmaker.prototype._log = function(str)
{
	var v = this.$log.val();
	v += str + '\n';
	this.$log.val(v);
	this.$log.scrollTop(this.$log[0].scrollHeight);
}