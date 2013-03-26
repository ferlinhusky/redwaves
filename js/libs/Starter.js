// Assign document
var doc = $(document);

// Loading image
var LoadingAnim = '<img src="images/ajax-loader.gif" id="loading_anim" />';

// Template for all map squares
var SquareTemplate = '<div class="sq"><div class="quad b">&nbsp;</div><div class="quad t">&nbsp;</div><div class="quad i">&nbsp;</div><div class="quad p">&nbsp;</div></div>';

var partyTable = '<table id="party" cellpadding="5">\
	    <colgroup></colgroup>\
		<tr id="label_row">\
			<td class="label">&nbsp;</td>\
			<td class="label">HP</td>\
			<td class="label">MO</td>\
			<td class="label">WPN</td>\
			<td class="label">ATK</td>\
		</tr>\
	</table>';

// Assign main
var main = $('#main');
main.append('\
	<table id="game_table" cellspacing="5" cellpadding="0">\
		<tr>\
			<td width="100%" valign="top" id="left_col">'+partyTable+'</td>\
			<td id="status"></td>\
		</tr>\
		<tr>\
			<td id="map_container_cell" height="100%" colspan="2"><div id="map_container"></div></td>\
		</tr>\
		<tr>\
			<td id="left_column" valign="top" colspan="2"><div id="bottom_cell"></div></td>\
		</tr>\
	</table>\
');

// Create status
var oStatus = $('#status');

/*
    main.append('\
            <div id="clock">\
                    <div class="ddmm"><div class="dd"></div><div class="mm"></div></div>\
                    <div class="hm"><span class="h"></span>:<span class="m"></span></div>\
                    <div class="ampm"></div>\
                    <div class="clearing"></div>\
                    <div class="y"></div>\
            </div>');
    var oClock = $('#clock');

    main.append('<div id="whereami"></div>');
    var oWhereami = $('#whereami');
*/

// Create left column
var LeftColumn = $('#bottom_cell');
    // Create direction buttons container
    LeftColumn.append('<div id="button_container"></div>');
var ButtonContainer = $('#button_container');
    // Add buttons to container
    ButtonContainer.append('<div id="btn_inventory" class="button action">Inventory</div>');
    ButtonContainer.append('<div id="btn_enter" class="button action">Enter</div>');
    ButtonContainer.append('<div id="btn_opts" class="button action">Options</div>');
    ButtonContainer.append('<div id="btn_help" class="button action">Help</div>');
	ButtonContainer.append('<div id="btn_open_close" class="button action">Door</div>');
    ButtonContainer.append('<div id="btn_end_turn" class="button action">End Turn</div>');
    ButtonContainer.append('<div id="monsters_moving" class="button action" style="display:none"></div>');
var btnInventory = $('#btn_inventory');
var btnNotes = $('#btn_notes');
var btnEnter = $('#btn_enter');
var btnOpts = $('#btn_opts');
var btnHelp = $('#btn_help');
var btnOpenClose = $('#btn_open_close');
var btnEndTurn = $('#btn_end_turn');
var monstersMoving = $('#monsters_moving');

// Create map container
var mapContainerCell = $('#map_container_cell');
var mapContainer = $('#map_container');

// Create dialog
main.append('<div id="dialog"></div>');
var oDialog = $('#dialog');

// Create map label
var mapLabel = "<div class='t_label'></div>";
