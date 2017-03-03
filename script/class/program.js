function Program()
{
	var self = this;

	this.server = new Server();
	this.clienthandler = new ClientHandler(this.server);
}

Program.prototype.Run = function()
{
	this.server.Start();
	this.clienthandler.Start();
}