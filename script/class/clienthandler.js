function ClientHandler(server)
{
	var self = this;

	this.$log = $('#clienthandler-log');
	this.$clientlistsingle = $('#client-select-single');
	this.$clientlistmulti1 = $('#client-select-multi-1');
	this.$clientlistmulti2 = $('#client-select-multi-2');
	this.$clientlistserver = $('#server-select-single');

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

ClientHandler.prototype.AddClientToPool = function(client)
{
	if(typeof this.clientlist[client.id] === 'undefined')
	{
		this.clientlist[client.id] = client;
	}
}

ClientHandler.prototype.RemoveClientFromPool = function(client)
{
	if(typeof this.clientlist[client.id] !== 'undefined')
	{
		this.clientlist[client.id].Remove();
		delete this.clientlist[client.id];
	}
}

ClientHandler.prototype.RebuildClientLists = function()
{
	var self = this;

	this.$clientlistsingle.find('option').remove();
	this.$clientlistmulti1.find('option').remove();
	this.$clientlistmulti2.find('option').remove();
	this.$clientlistserver.find('option').remove();

	_.each(this.clientlist, function(client)
	{
		self.$clientlistsingle.append('<option value = "' + client.id + '">' + client.id2 + '</option>');
		self.$clientlistmulti1.append('<option value = "' + client.id + '">' + client.id2 + '</option>');
		self.$clientlistmulti2.append('<option value = "' + client.id + '">' + client.id2 + '</option>');
		self.$clientlistserver.append('<option value = "' + client.id + '">' + client.id2 + '</option>');
	})
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

			this.AddClientToPool(client);
		}
	}

	this.RebuildClientLists();
}

ClientHandler.prototype.ConnectAll = function()
{
	var self = this;

	this._log('Connecting all clients in the pool...');

	_.each(self.clientlist, function(client)
	{
		(function(client)
		{
			$.when(client.Connect(self.server)).then(function(connected)
			{
				if(connected)
				{
					client.connection.server = self.server;
					client.connection.isConnected = true;
					self._log('Connecting client (' + client.id2 + ')... connection accepted');
				}
				else
				{
					self._log('Connecting client (' + client.id2 + ')... connection refused');
				}
			});
		})(client);
		
	});

	this._log('All clients connected');
}




ClientHandler.prototype._log = function(str)
{
	var v = this.$log.val();
	v += str + '\n';
	this.$log.val(v);
	this.$log.scrollTop(this.$log[0].scrollHeight);
}