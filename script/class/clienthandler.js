function ClientHandler(server)
{
	var self = this;

	this.$log = $('#clienthandler-log');

	this.server = server;

	this.clientlist = {};
}

ClientHandler.prototype.Start = function()
{
	this._log('Clienthandler stared');
	this._generateClients(100);
	this.ConnectAll();
}

ClientHandler.prototype.GenerateRandomClient = function()
{
	var uuid = Utility.UUID();
	var client = new Client
	(
		uuid, 
		{ 
			level: chance.integer({ min: Global.MIN_CLIENT_LEVEL, max: Global.MAX_CLIENT_LEVEL })
		},
		this
	);

	return client;
}

ClientHandler.prototype._generateClients = function(n)
{
	this._log('Generating ' + n + ' clients');

	var clients = {};

	for(var i = 0; i < n; i++)
	{
		var client = this.GenerateRandomClient();
		clients[client.id] = client;
		this._log('Generated client ' + i + ' with UUID: ' + client.id);
		this._log(client.toString());
	}

	for(var key in clients)
	{
		if(clients.hasOwnProperty(key))
		{
			var client = clients[key];

			if(typeof this.clientlist[client.id] === 'undefined')
			{
				this.clientlist[client.id] = client;
			}
		}
	}
}

ClientHandler.prototype.ConnectAll = function()
{
	var self = this;

	this._log('Connecting all clients in the pool...');

	_.each(self.clientlist, function(client)
	{
		if(client.Connect(self.server))
			self._log('Connecting client (' + client.id2 + ')... connection accepted');
		else
			self._log('Connecting client (' + client.id2 + ')... connection refused');
	});

	this._log('All clients connected');
}




ClientHandler.prototype._log = function(str)
{
	var v = this.$log.val();
	v += str + '\n';
	this.$log.val(v);
}