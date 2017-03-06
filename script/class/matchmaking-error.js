(function()
{
	var GeneralErrorCodes = 
	{
		'1000': 'Connection successful',
		'1001': 'Connection refused (already connected)',


		'2000': 'Disconnection successful',
		'2001': 'Disconnection failed (already disconnected)',


		'3000': 'Grouping successful',
		'3001': 'Failed to join group',
		'3002': 'Failed to join group (already in group)',
		'3003': 'Failed to join group (group is full)',

		'3004': 'Leaving group successful',
		'3005': 'Failed to leave group (not in group)'

	}

	var ClientErrorCodes = 
	{
		'1000': 'Connected',
		'1001': 'Connection refused (already connected)',


		'2000': 'Disconnected',
		'2001': 'Disconnection refused (already disconnected)',


		'3000': 'Grouped',
		'3001': 'Failed to join group',
		'3002': 'Failed to join group (already in group)',
		'3003': 'Failed to join group (group is full)',

		'3004': 'Left group',
		'3005': 'Failed to leave group (not in group)'

	}

	var ServerErrorCodes = 
	{
		'1000': 'Connection accepted',
		'1001': 'Connection refused (client already connected)',


		'2000': 'Disconnection accepted',
		'2001': 'Disconnection refused (client already disconnected)',


		'3000': 'Client grouped',
		'3001': 'Failed to group client',
		'3002': 'Failed to group client (already in group)',
		'3003': 'Failed to group client (group is full)',

		'3004': 'Client was removed from group',
		'3005': 'Failed to remove client from group (not in group)'
	}

	function MatchmakingError(code, success)
	{
		this.code = code;
		this.success = success;
		
		if(typeof GeneralErrorCodes[this.code] !== 'undefined')
			this.msg = GeneralErrorCodes[this.code];
		else
			this.msg = null;

		if(typeof ServerErrorCodes[this.code] !== 'undefined')
			this.servermsg = ServerErrorCodes[this.code];
		else
			this.servermsg = null;

		if(typeof ClientErrorCodes[this.code] !== 'undefined')
			this.clientmsg = ClientErrorCodes[this.code];
		else
			this.clientmsg = null;
	}

	window.MatchmakingError = MatchmakingError;
})();