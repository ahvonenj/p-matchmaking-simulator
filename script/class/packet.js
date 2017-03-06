function Packet(error, client, server)
{
	this.error = error || null;
	this.client = client || null;
	this.server = server || null;
}