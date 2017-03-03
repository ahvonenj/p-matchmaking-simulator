var program = null;

$(document).ready(function()
{
	Events.BindAllEvents();

	program = new Program();
	program.Run();
});