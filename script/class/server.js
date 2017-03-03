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
	var s = 'Client (' + client.id + ') connecting... ';
	

	if(typeof this.connections[client.id] === 'undefined')
	{
		this.connections[client.id] = client;
		this._log(s + 'accepted');
		return true;
	}
	else
	{
		this._log(s + 'refused');
	}
}





Server.prototype._log = function(str)
{
	var v = this.$log.val();
	v += str + '\n';
	this.$log.val(v);
}