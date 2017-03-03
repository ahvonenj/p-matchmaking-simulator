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
			self._log('Client (' + client.id2 + ') REFUSED, already connected');
			$conn_def.resolve(false);
			return;
		}

		if(typeof self.connections[client.id] === 'undefined')
		{
			self.connections[client.id] = client;
			self._log('Client (' + client.id2 + ') CONNECTED');
			$conn_def.resolve(true);
			return;
		}
		else
		{
			self._log('Client (' + client.id2 + ') REFUSED');
			$conn_def.resolve(false);
			return;
		}
	}, this.GetLatency());

	return $conn_def;
}

Server.prototype.Disconnect = function(client)
{
	var s = 'Client (' + client.id2 + ') disconnecting... ';

	if(typeof this.connections[client.id] === 'undefined')
	{
		this._log(s + 'already disconnected');
		return true;
	}
	else
	{
		delete this.connections(client.id);
		this._log(s + 'disconnected');
		return true;
	}
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