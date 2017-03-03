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
	});

	$('#disconnect-client-btn').on('click', function()
	{
		Events.Defaults('Disconnect client');
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