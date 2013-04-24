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
	title: 'Over red waves of sand',
	content: $('#dialog_welcome').html(),
	buttons: {
		"Load": function() {
			MapWorld = $('#pick_a_map').val();
			World.build();
		}
	},
	height:300
}

var D_Help = {
	title: 'Help & About',
	content: $('#dialog_help').html(),
	buttons: {
		"Ok": function() {
			$(this).dialog('close');
		}
	},
	height:375
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
// Option settings
var hideFeatureNames = false;
$('#optHideFeatureNames').live('change',function(){
	if($(this).attr('checked')=='checked'){
		hideFeatureNames = 'checked';
		$('.t_label').hide(0);
	}
	else{
		hideFeatureNames = false;
		$('.t_label').show(0);
	}
});