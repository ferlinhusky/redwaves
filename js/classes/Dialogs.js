var D_Standard = {}

var D_Loading = function(){
	this.openMe = function(t,s){
		Input.unbindFromMap();
		oDialog.html(s);
		oDialog.dialog({
			close: function(){
				Input.bindToMap();
			},
			title: t,
			modal: true,
			zIndex: 5000
		});
	};
	this.updateMe = function(s){
		oDialog.html(s);
	};
	this.closeMe = function(){
		oDialog.dialog('close');
	};
}

var D_Welcome = {
	title: 'Over red waves of sand (BETA)',
	content: $('#dialog_welcome').html(),
	buttons: {
		"How to play": function(){
			$('.ui-widget-overlay, .ui-dialog').addClass('hideforhelp');
			$('#container').css('display', 'none');
			$('#help').css('display', 'table');
			$('html, body').css({
				overflow: 'auto',
			});
			$(window).unbind('touchmove');
			Input.unbindFromMap();
		},
		"Play": function() {
			// If passcode used, jump straight into the game
			if(Input.passcodeverified)
			{
				Input.passcodeverified = false;
				//Input.M_Dialog('equip');
				World.playnext();
			} else { Loadselectteam(); }
		}
	},
	height:stddialogheight
}

var D_Equip = {
	title: 'A blue wooden house',
	content: $('#dialog_equip').html(),
	create: function(){
		Equip.load();	
	},
	buttons: {
		"OK": function() {
			Equip.save();
			World.playnext();
		}
	},
	height:500,
	width: 535
}

var D_Select_Team = {
	title: 'You come right out of a comic book.',
	content: $('#dialog_select_team').html(),
	buttons: {
		"Back": function(){
			Loadwelcome();	
		},
		"Ready!": function() {
			$('#party').css('display', 'table');

			var hero = new Hero();
			$('.select_team_opt:checked').each(function(){
				var player = ( new Function('var p = new ' + $(this).val() + '(); return p;') )();
			});
			World.build();
		}
	},
	height:stddialogheight
}

var D_Help = {
	title: 'Help & About',
	content: $('#dialog_help').html(),
	buttons: {
		"Ok": function() {
			$(this).dialog('close');
		}
	},
	height:stddialogheight
}

var D_Options = {
	title: 'Game Options',
	open: function(){
		$('#optHideFeatureNames').attr('checked', hideFeatureNames);
	},
	content: "\
		<input id='optHidePlaceNames' type='checkbox' disabled/><label for='optHidePlaceNames' disabled>Hide Place Names</label><br/>\
		<input id='optHideFeatureNames' type='checkbox'/><label for='optHideFeatureNames'>Hide Feature Names</label>\
	",
	buttons: {
		/*"Save": function() {
			$(this).dialog('close');
		},*/
		"Close": function() {
			$(this).dialog('close');
		}
	}
}
