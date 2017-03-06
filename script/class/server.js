function Server()
{
	var self = this;

	this.$log = $('#server-log');

	this.matchmaker = new Matchmaker();

	this.connections = {};
}

Server.prototype.Start = function()
{
	this._log('Server started');
	this._log('Awaiting connections...');
	this.matchmaker.Start();
}

Server.prototype.RequestConnection = function(client)
{
	var self = this;

	this._log('Client (' + client.id2 + ') connecting... ');

	var $conn_def = $.Deferred();
	
	setTimeout(function()
	{
		if(client.connection.isConnected)
		{
			var error = new MatchmakingError(1001, false);
			self._log('Client (' + client.id2 + ') ' + error.servermsg);
			$conn_def.resolve(new Packet(error, client, self));
			return;
		}

		if(typeof self.connections[client.id] === 'undefined')
		{
			var error = new MatchmakingError(1000, true);
			self.connections[client.id] = client;
			self._log('Client (' + client.id2 + ') ' + error.servermsg);
			$conn_def.resolve(new Packet(error, client, self));
			return;
		}
		else
		{
			var error = new MatchmakingError(1001, false);
			self._log('Client (' + client.id2 + ') ' + error.servermsg);
			$conn_def.resolve(new Packet(error, client, self));
			return;
		}
	}, this.GetLatency());

	return $conn_def;
}

Server.prototype.Disconnect = function(client)
{
	var self = this;

	var s = 'Client (' + client.id2 + ') disconnecting... ';

	var $disconn_def = $.Deferred();

	setTimeout(function()
	{
		if(typeof self.connections[client.id] === 'undefined')
		{
			var error = new MatchmakingError(2001, false);
			self._log('Client (' + client.id2 + ') ' + error.servermsg);
			$disconn_def.resolve(new Packet(error, client, self));
			return;
		}
		else
		{
			var error = new MatchmakingError(2000, true);
			self._log('Client (' + client.id2 + ') ' + error.servermsg);
			delete self.connections[client.id];
			$disconn_def.resolve(new Packet(error, client, self));
			return;
		}
	}, this.GetLatency());

	return $disconn_def;
}

Server.prototype.GetLatency = function()
{
	if(Global.INSTANT_SERVER)
	{
		return 0;
	}
	else
	{
		if(Global.SERVER_RANDOM_LATENCY)
		{
			return chance.integer(
			{ 
				min: Global.SERVER_RANDOM_LATENCY_MIN,
				max: Global.SERVER_RANDOM_LATENCY_MAX
			});
		}
		else
		{
			return Global.SERVER_LATENCY_MS;
		}
	}
}

Server.prototype._log = function(str)
{
	var v = this.$log.val();
	v += str + '\n';
	this.$log.val(v);
	this.$log.scrollTop(this.$log[0].scrollHeight);
}