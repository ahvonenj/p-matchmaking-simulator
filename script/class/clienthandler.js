function ClientHandler()
{
	var self = this;

	this.$log = $('#clienthandler-log');
}

ClientHandler.prototype.Start = function()
{
	this._log('Clienthandler stared');
	this._generateClients(100);
}

ClientHandler.prototype._generateClients = function(n)
{
	this._log('Generating ' + n + ' clients');

	var clients = {};

	for(var i = 0; i < n; i++)
	{
		var uuid = Utility.UUID();


		var client = new Client(uuid);

		clients[uuid] = client;

		this._log('Generated client ' + i + ' with UUID: ' + uuid);
	}
}






ClientHandler.prototype._log = function(str)
{
	var v = this.$log.val();
	v += str + '\n';
	this.$log.val(v);
}