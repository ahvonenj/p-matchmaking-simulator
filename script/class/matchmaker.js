function Matchmaker()
{
	var self = this;

	this.$log = $('#matchmaker-log');
}

Matchmaker.prototype.Start = function()
{
	this._log('Matchmaker started');
}










Matchmaker.prototype._log = function(str)
{
	var v = this.$log.val();
	v += str + '\n';
	this.$log.val(v);
}