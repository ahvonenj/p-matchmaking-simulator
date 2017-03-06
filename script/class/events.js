var Events = 
{

}

Events.Defaults = function(source)
{
	console.log('Trigger: ' + source);
}

Events.BindAllEvents = function()
{
	// CLIENTHANDLER
	$('#add-client-btn').on('click', function()
	{
		Events.Defaults('Add client');
	});

	$('#add-random-client-btn').on('click', function()
	{
		Events.Defaults('Add random client');
	});

	$('#remove-client-btn').on('click', function()
	{
		Events.Defaults('Remove client');
	});

	$('#print-client-btn').on('click', function()
	{
		Events.Defaults('Print client');
	});

	$('#clients-group').on('click', function()
	{
		Events.Defaults('Group clients');
	});

	$('#clients-ungroup').on('click', function()
	{
		Events.Defaults('Ungroup clients');
	});


	// SERVER
	$('#connect-client-btn').on('click', function()
	{
		Events.Defaults('Connect client');

		var client = program.clienthandler.GetClient($('#server-select-single').val());

		$.when(client.Connect(program.server)).then(function(packet)
		{
			if(packet.error.success)
			{
				client.connection.isConnected = true;
				client.connection.server = packet.server;

				client._log('Client (' + client.id2 + ') ' + packet.error.clientmsg);
			}
			else
			{
				client._log('Client (' + client.id2 + ') ' + packet.error.clientmsg);
			}
		});
	});

	$('#disconnect-client-btn').on('click', function()
	{
		Events.Defaults('Disconnect client');

		var client = program.clienthandler.GetClient($('#server-select-single').val());

		$.when(client.Disconnect(program.server)).then(function(packet)
		{
			if(packet.error.success)
			{
				client.connection.isConnected = false;
				client.connection.server = null;

				client._log('Client (' + client.id2 + ') ' + packet.error.clientmsg);
			}
			else
			{
				client._log('Client (' + client.id2 + ') ' + packet.error.clientmsg);
			}
		});
	});


	// CONSOLES
	$('#client-clear-console').on('click', function()
	{
		Events.Defaults('Clear client console');
	});

	$('#server-clear-console').on('click', function()
	{
		Events.Defaults('Clear server console');
	});

	$('#matchmaker-clear-console').on('click', function()
	{
		Events.Defaults('Clear matchmaker console');
	});
}