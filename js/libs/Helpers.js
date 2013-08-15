// 
// Helper Functions
//

// Capitalize a string
function capitalise(str) { return str.charAt(0).toUpperCase() + str.slice(1); }

// Load up adventure selection
var Loadwelcome = function(){
	Input.M_Dialog('welcome');

	// Load up next adventure - move this to Input.loadgame
	var curradv = Adventures[Party.levelcomplete];
	MapWorld = curradv.type;
	$('.ui-dialog .next_adventure').text(curradv.title);
	$('.ui-dialog .next_adventure').css({
		"color": curradv.titlecolors[0],
		"background-color": curradv.titlecolors[1]
	});
}

var checkSelectedTeam = function(){
	if($('.select_team_opt:checked').length == 3){
		$('.ui-dialog-buttonpane button:contains("Ready")').button('enable');
	} else { $('.ui-dialog-buttonpane button:contains("Ready")').button('disable'); }
}
var Loadselectteam = function(){
	Input.M_Dialog('select_team');
	if ($('.select_team_opt').button()) {
		$('.select_team_opt').button('destroy');
	}
	
	checkSelectedTeam();
		
	$('.select_team_opt').button().change(checkSelectedTeam);
}

// Return a random number
var getRandom = function(r){
	var temp = Math.floor(Math.random()*r);
	return temp;
};

// Get exact map square id from coords
var getMapSq = function(c){
	return $('#c_'+c[0]+'_'+c[1]+'_'+ident);
};
// Get square ID
var getSquare = function(c){
		var s = Squares[$('#c_'+c[0]+'_'+c[1]+'_'+ident).attr('data-sID')];
		if(s != undefined){
			return s;
		} else { return false; }
	};
var getSquareId = function(c){
	var s = $('#c_'+c[0]+'_'+c[1]+'_'+ident).attr('data-sID');
	if(s != undefined){
			return s;
		} else { return false; }
};
// Clone object to overlay
var cloneToOverlay = function(obj){
	var loc = getMapSq(obj.coords);
	var temp = loc.clone().appendTo('.m_grid');
        temp.css({
            position: 'absolute',
            top: loc.position().top, left: loc.position().left
        });
	return temp;
};

// Get Location
var getLocation = function(){
	if(World.activePlayer.location.name != undefined){
		return World.activePlayer.location.name;
	} else {
		return World.activePlayer.location.type;
	}
};

// Light up squares	
var lightUpLoc = function(loc){
	var x = new Number(loc[0]);
	var y = new Number(loc[1]);
	var xSq = [x-1, x, x+1];
	var ySq = [y-1, y, y+1];
	for (i=0; i<ySq.length; i++){
		for (j=0; j<xSq.length; j++){
			var s = getMapSq([xSq[i],ySq[j]]);
			s.removeClass('unlit');
			s.addClass('lit');
		}
	}
};

// Any doors?
var anyDoors = function(loc){
	btnOpenClose.button('disable');
	
	var x = new Number(loc[0]);
	var y = new Number(loc[1]);
	var xSq = [x-1, x, x+1];
	var ySq = [y-1, y, y+1];
	for (i=0; i<ySq.length; i++){
		for (j=0; j<xSq.length; j++){
			var s = getMapSq([xSq[i],ySq[j]]);
			var sobj = getSquare([xSq[i],ySq[j]]);
			// Must be a door, and not be occupied
			if( (s.hasClass('closed_door')||s.hasClass('open_door')) && !sobj.occupied ){
				btnOpenClose.button('enable');
			}
		}
	}
}

// Any items?
var anyItems = function(loc){
	var square = getSquare(loc);
	if(square.containsA.is == "item"){
		btnPickup.button('enable');
	} else {
		btnPickup.button('disable');
	}
}

// Grid helpers
var newGrid = function(){
	return '<table id="'+ident+'_grid" cellspacing="0" cellpadding="0" class="m_grid '+World.Level.type+'_grid"></table>';
};
var getGrid = function(){
	return $('#'+ident+'_grid');
};

// Row helpers
var newRow = function(r){
	return '<tr id="'+ident+'_row_'+r+'"></tr>';
};
var getRow = function(r){
	return  $('#'+ident+'_row_'+r);
};

// Centering things
var centerIt = function(m){
	m.css({
		'top': (mapContainerCell.height()/2)-(m.height()/2),
		'left': (mapContainerCell.width()/2)-(m.width()/2)
	});
};
var centerOn = function(i){
	var sq = getMapSq(i.coords);
	var pageCenterX = mapContainerCell.width()/2;
	var pageCenterY = mapContainerCell.height()/2;
	var mapX = activeMap.mg.offset().left;
	var mapY = activeMap.mg.offset().top;
	var xDiff = new Number(pageCenterX - sq.offset().left);
	var yDiff = new Number(pageCenterY - sq.offset().top);
	//activeMap.mg.css('top', (mapY+yDiff)-22);
	//activeMap.mg.css('left', (mapX+xDiff)-22);
	
	activeMap.mg.animate({
		top: (mapY+yDiff)-22,
		left: (mapX+xDiff)-22
		}, 100);
};

// sq-> Square.onMap, q -> quadrant of square, i-> class to add/remove
var findAndAdd = function(sq, q, i){
	sq.find(q).addClass(i);
};
var findAndRemove = function(sq, q, i){
	sq.find(q).removeClass(i);
};

// Set global ident var
var setIdent = function(i){
	ident =  MapWorld + '_' + i;
};

// Capitalize first letter
var capIt = function(s){
	s = s.replace('_', ' ');
	return s.charAt(0).toUpperCase() + s.slice(1);
};

// Remove any html tags
var stripTags = function(s){
 	return s.replace(/<\/?[^>]+(>|$)/g, "");
}

// Reattach square references when loading a map
var rebindSquares = function(){
	var sq = activeMap.squares;
	for(i=0; i<sq.length; i++){
		sq[i].onMap = getMapSq([sq[i].x,sq[i].y]);
		bindMapLabel(sq[i]);
	}
};
var bindMapLabel = function(s){
	s.onMap.find('.t_label .l_minmax').click(function(){
		var labelText = $(this).parent().find('.l_text');
		if($(this).hasClass('off')){
			labelText.removeClass('off');
			$(this).removeClass('off');
		} else {
			labelText.addClass('off');
			$(this).addClass('off');
		}
	});
};

// Add a label to the map at a particular square
var addMapLabel = function(s){
	var sID = s.id;
	var l = s.label;
	s.onMap.append(mapLabel);
	s.onMap.find('.t_label').prop('id', 't_label_'+sID);
	var labelID = $('#t_label_'+sID);
	var l_content = '<div class="l_text">' + l + "</div><a href='javascript:void(0);' class='l_minmax'>&nbsp;</a>";
	labelID.html(l_content);
	labelID.fadeTo(0, '.6');
	labelID.css({
		'z-index': i+3000,
		'margin-top': -s.onMap.height() + ((s.onMap.height()-labelID.height())/2)-3,
		'margin-left': ((s.onMap.width()-labelID.width())/2)-3
	});
	bindMapLabel(s);
};

// Context replace strings for name and such
var contextReplace = function(s){
	var sr = s.replace('{name}', World.activePlayer.name);
	return sr;
}

// Date & Time
var Days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
var Months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
var addLeadingZero = function(num, isHours){
		if(isHours){
			if(num == 0){ num = 12; }
			if(num > 12){ num -= 12; }
		}
		return ( num < 10 ? "0" : "" ) + num;  
};
var getAMPM = function(h){
	return h > 11 ? "P<br/>M" : "A<br/>M";
}

// Format party table
var formatPartyTable = function(){
	$('#party thead tr th').each(function(c){
	    var col = "<col>";
	    if(c%2 == 0){
		if(c!=0){ var col = '<col class="even">'; }
	    } else { var col = '<col class="odd">'; }
	    $('#party colgroup').append(col);
	});
	$('#party tbody tr').each(function(c){
	    if(c%2 == 0){
		$(this).find('td').each(function(d){
		    if(d%2 == 0){
			if(d!=0){ $(this).addClass('odd'); }
		    } else { $(this).addClass('even'); }
		});
	    }
	}); 
}

// Set properties and update UI
var HP_set = function(obj, value){
	obj.HP += value;
	if(obj.HP < 0) { obj.HP = 0; } // No negative HP values
	if(obj.hasSkill('tenacity')){
		if (obj.HP >= 0 && obj.HP <= 2) {
			obj.HP += Math.round(Math.random());
			status_line = '<span class="red">' + obj.name + ' tries to hang on just a little longer!</span>';
			Statuss.update(status_line);
		}
	}
	if(obj.HP > obj.maxHP) { obj.HP = obj.maxHP; } // No greater than maxHP values
	$('tr.' + obj.type + ' .HP').text(obj.HP);
};
var MO_set = function(obj, value){
	obj.currMove += value;
	var remaining_move = obj.movement - obj.currMove;
	$('tr.' + obj.type + ' .MO').text(remaining_move);
};
var MO_reset = function(obj){
	obj.currMove = 0;
	$('tr.' + obj.type + ' .MO').text(obj.movement);
};
var MO_zero = function(obj){
	obj.currMove = obj.movement;
	$('tr.' + obj.type + ' .MO').text('0');
};

// Set gender
var setGender = function(g){
	var gender = {};
	if (g=="male") {
		gender = {
			"demo": "male",
			"type": "man",
			"pro": "him",
			"ppro": "his"
		};
	} else {
		gender = {
			"demo": "female",
			"type": "woman",
			"pro": "her",
			"ppro": "her"
		};
	}
	return gender;
}

// Get Line of Sight
var getLineOfSight = function(c){
	/*
		Starting from c (player coords), attempt to draw a line to every exterior block
		Top: (0,0), (1,0)...(activeMap.width, 0)
		Left: (0,0), (0,1)...(0, activeMap.height)
		Right: (activeMap.width, 0), (activeMap.width, 1)...(activeMap.width, activeMap.height)
		Bottom: (0, activeMap.height), (1, activeMap.height)...(activeMap.width, activeMap.height)
		
		Break on lighting up/drawing line when an obstacle is hit (but light up the obstacle)
	*/
	
	// Height and width aren't zero-indexed in data files
	var mw = activeMap.width-1;
	var mh = activeMap.height-1;
	
	var hilite = "lit";
	
	var rng = 10;
	var c0m = c[0]-rng;
	var c0p = c[0]+rng;
	var c1m = c[1]-rng;
	var c1p = c[1]+rng;
	
	// Hit the corner 1 square in
	Bresenham(c[0], c[1], c0m+1, c1m+1, hilite, true);
	Bresenham(c[0], c[1], c0m+1, c1p-1, hilite, true);
	
	Bresenham(c[0], c[1], c0p-1, c1m+1, hilite, true);
	Bresenham(c[0], c[1], c0p-1, c1p-1, hilite, true);
	
	// Loop borders, skipping corners
	for(var i=-rng; i<=rng; i++){
		// Don't hit far corners (where i = range)
		if(Math.abs(i)!= Math.abs(rng)){
			Bresenham(c[0], c[1], c[0]-i, c1m, hilite, true);
			Bresenham(c[0], c[1], c[0]+i, c1p, hilite, true);
			Bresenham(c[0], c[1], c0m, c[1]-i, hilite, true);
			Bresenham(c[0], c[1], c0p, c[1]+i, hilite, true);
		}
	}
	
	/* Range -> map perimeter
	// Four corners separate, otherwise they're calculated twice each
	Bresenham(c[0], c[1], 0, 0, hilite, true);
	Bresenham(c[0], c[1], 0, mw, hilite, true);
	
	Bresenham(c[0], c[1], mw, 0, hilite, true);
	Bresenham(c[0], c[1], mw, mh, hilite, true);
	
	// Loop borders, skipping corners
	for(i=1; i<=mw; i++){
		Bresenham(c[0], c[1], i, 0, hilite, true);
		Bresenham(c[0], c[1], i, mh-1, hilite, true);
	}
	for(i=1; i<=mh; i++){
		Bresenham(c[0], c[1], 0, i, hilite, true);
		Bresenham(c[0], c[1], mw-1, i, hilite, true);
	}*/
	
	$('.lit').removeClass('unlit visited');
};

// Get Range
var allranges = "range fire ice energy earth steel wood light";
var getRange = function(character, type){
	$('.lit, .unlit').removeClass(allranges); // remove all spell ranges
	
	var c = character.coords;
	var item;
	
	switch(type){
		case "spell": item = character.readySpell; break;
		case "weapon": item = character.readyWeapon; break;
		default: break;
	}
	
	var rng = item.rng;
	var hilite = "range " + item.material;
	var c0m = c[0]-rng;
	var c0p = c[0]+rng;
	var c1m = c[1]-rng;
	var c1p = c[1]+rng;
	
	// Hit the corner 1 square in
	Bresenham(c[0], c[1], c0m+1, c1m+1, hilite, false);
	Bresenham(c[0], c[1], c0m+1, c1p-1, hilite, false);
	
	Bresenham(c[0], c[1], c0p-1, c1m+1, hilite, false);
	Bresenham(c[0], c[1], c0p-1, c1p-1, hilite, false);
	
	// Loop borders, skipping corners
	for(var i=-rng; i<=rng; i++){
		// Don't hit far corners (where i = range)
		if(Math.abs(i)!= Math.abs(rng)){
			Bresenham(c[0], c[1], c[0]-i, c1m, hilite, false);
			Bresenham(c[0], c[1], c[0]+i, c1p, hilite, false);
			Bresenham(c[0], c[1], c0m, c[1]-i, hilite, false);
			Bresenham(c[0], c[1], c0p, c[1]+i, hilite, false);
		}
	}
}

// Bresenham's Line Algorithm
var Bresenham = function (x0, y0, x1, y1, hilite, hitpass){
	var dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
	var dy = Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1; 
	var err = (dx>dy ? dx : -dy)/2;

	while (true) {
		var sq = getSquare([x0,y0]);
		var msq = getMapSq([x0,y0]);
		
		
		if(!sq.cthru && !hitpass) return false; // If you don't want to highlight non-cthru areas, break now
		
		if(hilite != "monster_target" && hilite != "player_killed"){
			msq.removeClass(hilite);
			msq.addClass(hilite);
		}
		
		// Check player in view of monster
		if(World.activePlayer.ofType == "player" && sq.occupied){
			if(sq.occupiedBy.ofType == "monster"){
				sq.occupiedBy.addTarget(World.activePlayer);
			}
		}
		
		if (x0 === x1 && y0 === y1){
			if(hilite == "monster_target" || hilite == "player_killed") { return true; } // Targeting for Monsters / Monster sees player killed
			return false; // end of the line
		}
		
		if (!sq.cthru){
			return false;
		}
		var e2 = err;
		if (e2 > -dx) { err -= dy; x0 += sx; }
		if (e2 < dy) { err += dx; y0 += sy; }
	}
}

var unbuildAllMenus = function(){
	unbuildItemMenu();
	unbuildWeaponMenu();
	unbuildSpellMenu();
}

var buildAllMenus = function(){
	buildItemMenu();
	buildWeaponMenu();
	buildSpellMenu();
}

// Item menu
var unbuildItemMenu = function(){
	Input.hideItemMenu();
	menuSelectItem.empty();
	menuSelectItem.menu();
	menuSelectItem.menu('destroy');
	btnItem.button('option', 'label', 'Item');
	ItemSet.find('.button').button('disable');
};

var buildItemMenu = function(){
	World.activePlayer.readyItem = null;
	// Rebuild item menu, if necessary
	for(var i=0; i<World.activePlayer.inven.length; i++){
		menuSelectItem.append('<li><a href="javascript:void(0);" onclick="Input.setItem('+i+');">'+World.activePlayer.inven[i].name);
	}
	if(World.activePlayer.inven.length > 0){
		ItemSet.find('.button').button('enable');
	} else {
		ItemSet.find('.button').button('disable');
	}
	menuSelectItem.menu();
};

// Weapon menu
var unbuildWeaponMenu = function(){
	Input.hideWeaponMenu();
	menuSelectWeapon.empty();
	menuSelectWeapon.menu();
	menuSelectWeapon.menu('destroy');
	btnWeapon.button('option', 'label', 'Weapon')
		.removeClass('blink');
	WeaponSet.find('.button').button('disable');
};

var buildWeaponMenu = function(){
	var isready=-1;
	
	// Rebuild weapon menu
	for(var i=0; i<World.activePlayer.wields.length; i++){
		if (World.activePlayer.wields[i] != "") {
			if (World.activePlayer.wields[i].name == World.activePlayer.readyWeapon.name) {
				isready = i;
			}
			menuSelectWeapon.append('<li><a href="javascript:void(0);" onclick="Input.setWeapon('+i+');">'+World.activePlayer.wields[i].name);
		}
	}
	
	var remaining_move = World.activePlayer.movement - World.activePlayer.currMove;
	if(remaining_move < 2){
		WeaponSet.find('.button').button('disable');
	} else { WeaponSet.find('.button').button('enable');
	menuSelectWeapon.menu();
	
	if (isready >= 0) {
		Input.setWeapon(isready);
	}
};

// Weapon menu
var unbuildSpellMenu = function(){
	Input.hideSpellMenu();
	menuSelectSpell.empty();
	menuSelectSpell.menu();
	menuSelectSpell.menu('destroy');
	btnSpell.button('option', 'label', 'Spell')
		.removeClass('blink');
	SpellSet.find('.button').button('disable');
};

var buildSpellMenu = function(){
	var isready=-1;
	
	// Rebuild spell menu
	for(var i=0; i<World.activePlayer.spells.length; i++){
		if (World.activePlayer.spells[i] != "") {
			if (World.activePlayer.readySpell != null && World.activePlayer.spells[i].name == World.activePlayer.readySpell.name) {
				isready = i;
			}
			menuSelectSpell.append('<li><a href="javascript:void(0);" onclick="Input.setSpell('+i+');">'+World.activePlayer.spells[i].name);
		}
	}
	
	if(World.activePlayer.spells.length > 0){
		SpellSet.find('.button').button('enable');
		menuSelectSpell.menu();
	}
	
	if (isready >= 0) {
		Input.setSpell(isready);
	}
};