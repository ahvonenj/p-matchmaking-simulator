function Client(id)
{
	var self = this;

	this.id = id;
	this.connection = 
	{
		isConnected: false
	}
}

Client.prototype.Connect = function(server)
{
	if(server.RequestConnection(this))
	{
		this.connection.isConnected = true;
		return true;
	}
	else
	{
		this.connection.isConnected = false;
		return false;
	}
}