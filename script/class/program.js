function Program()
{
	var self = this;

	this.clienthandler = new ClientHandler();
	this.server = new Server();
}

Program.prototype.Run = function()
{
	this.clienthandler.Start();
	this.server.Start();
}