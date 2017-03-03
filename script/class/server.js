function Server()
{
	var self = this;

	this.$log = $('#server-log');

	this.matchmaker = new Matchmaker();
}

Server.prototype.Start = function()
{
	this._log('Server started');
	this._log('Awaiting connections...');
	this.matchmaker.Start();
}





Server.prototype._log = function(str)
{
	var v = this.$log.val();
	v += str + '\n';
	this.$log.val(v);
}