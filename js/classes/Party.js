var Party = Class.extend({
	init: function(){
	    this.gold = 0;
	    this.levelcomplete = 0;
	    this.store = [0,0,0,0,0,0];
	    this.members = [];
	    this.passcode = "";
	}
});

var Equip = Class.extend({
	init: function() {},
	load: function(){
		// Create UI vars
		this.ui = $('.ui-dialog .equip');
		var ui = this.ui;
		
		// Create UI - player types/items, shared items, buyable items
		var tabs = "";
		for(var i=0; i<Party.members.length; i++){
			var p = Party.members[i];
			tabs += '<li data-type="'+p.type+'" class="player '+ p.type +'">'+p.name+'</li>';
			ui.find('.itemgroupstmp').clone()
				.removeClass('itemgroupstmp')
				.addClass('itemgroups '+ p.type)
				.appendTo(ui);
			
			// Populate UI w/ Player data
			$('.itemgroups.' + p.type).find('.pack li').each(function(k, v){
				$(this).data('type', 'pack');
				$(this).data('ofType', 'pack');
				$(this).data('default', $(this).text());
				if (p.inven[k] != undefined) {
					$(this).text(p.inven[k].name);
					$(this).addClass('filled').removeClass('empty');
					$(this).data('refID', p.inven[k].refID);
				} else { $(this).addClass('empty'); }
			});
			
			$('.itemgroups.' + p.type).find('.weapons li').each(function(k, v){
				$(this).data('ofType', 'weapons');
				$(this).data('default', $(this).text());
				switch (k) {
					case 0: $(this).data('type', 'head'); break;
					case 1: $(this).data('type', 'hand'); break;
					case 2: $(this).data('type', 'hand'); break;
					case 3: $(this).data('type', 'feet'); break;
					default: break;
				}
				if (p.wields[k] != "") {
					$(this).text(p.wields[k].name);
					$(this).addClass('filled').removeClass('empty');
					$(this).data('refID', p.wields[k].refID);
				} else { $(this).addClass('empty'); }
			});
			
			$('.itemgroups.' + p.type).find('.armor li').each(function(k, v){
				$(this).data('ofType', 'armor');
				$(this).data('default', $(this).text());
				switch (k) {
					case 0: $(this).data('type', 'helmet'); break;
					case 1: $(this).data('type', 'bodyarmor'); break;
					case 2: $(this).data('type', 'gloves'); break;
					case 3: $(this).data('type', 'boots'); break;
					default: break;
				}
				if (p.wears[k] != "") {
					$(this).text(p.wears[k].name);
					$(this).addClass('filled').removeClass('empty');
					$(this).data('refID', p.wears[k].refID);
				} else { $(this).addClass('empty'); }
			});
		}
		
		ui.find('.players').html(tabs);
		ui.find('.players .player').click(function(){
			ui.find('.itemgroups').css('display', 'none');
			ui.find('.itemgroups.' + $(this).attr('data-type')).css('display', 'table');
		});
		ui.find('.itemgroups.hero').css('display', 'table');
		
		ui.append('<div class="group shared"><span class="title">A little blanket</span>\
			<ul class="items">\
			    <li class="empty" data-group="shared" data-default="Empty"><i>Empty</i></li>\
			    <li class="empty" data-group="shared" data-default="Empty"><i>Empty</i></li>\
			    <li class="empty" data-group="shared" data-default="Empty"><i>Empty</i></li>\
				<li class="empty" data-group="shared" data-default="Empty"><i>Empty</i></li>\
				<li class="empty" data-group="shared" data-default="Empty"><i>Empty</i></li>\
				<li class="empty" data-group="shared" data-default="Empty"><i>Empty</i></li>\
			</ul>');
			
		// Drag/drop opts
		var emptyItemOpts = {
			drop: function(e, u) {
				var dropped = $(u.draggable);
				
				$(this).addClass('filled')
					.removeClass('empty')
					.addClass(dropped.data('ofType'))
					.text(dropped.text())
					.data('type', dropped.data('type'))
					.data('ofType', dropped.data('ofType'))
					.data('refID', dropped.data('refID'))
					.droppable('destroy')
					.draggable({
						revert: 'invalid'
					});
				
				// Reset list item
				dropped.clone()
					.insertBefore(dropped)
					.removeClass()
					.addClass('empty')
					.attr('style', '')
					.text(dropped.attr('data-default'))
					.data('type', dropped.data('type'))
					.data('ofType', dropped.data('ofType'))
					.data('refID', dropped.data('refID'))
					.droppable(emptyItemOpts);
				dropped.remove();
				
				// update droppable after each drop
			},
			accept: function(u){
				if ($(this).attr('data-group') == "shared") {
					return true;
				} else {
					if(u.data('type') == $(this).data('type')){
						return true;
					}
				}
			}
		};
		
		// Init draggable items
		ui.find('.items li.filled').draggable({ revert: 'invalid' });
		
		// Init droppoable areas
		ui.find('.items li.empty').droppable(emptyItemOpts);
	},
	save: function(){
		var error = false;
		$('#savealert').remove();
		
		// Make sure no shared items hanging out
		$('.shared .items li').each(function(){
			if($(this).hasClass('filled')){
				error = true;
			}
		});
		
		if(error){ 
			$('.ui-dialog-buttonpane').prepend('<p id="savealert" style="float:left; color: red; font-weight: bold;">Don\'t leave anything on the blanket!</p>');
			return false;
		}
		
		// Save items to player, shared, etc.
		for(var i=0; i<Party.members.length; i++){
			var p = Party.members[i];
			p.inven = [];
			p.wields = [];
			p.wears = [];
			
			$('.itemgroups.' + p.type).find('.pack li').each(function(k, v){
				if($(this).hasClass('filled')){
					var pitem = ( new Function('var j = new ' + InventoryItems[$(this).data('refID')] + '(); return j;') )();
					p.inven.push(pitem);
				}
			});
			
			$('.itemgroups.' + p.type).find('.weapons li').each(function(k, v){
				if($(this).hasClass('filled')){
					var pitem = ( new Function('var j = new ' + Weapons[$(this).data('refID')] + '(); return j;') )();
					p.wields[k] = pitem;
				} else { p.wields[k] = ''; }
			});
			
			$('.itemgroups.' + p.type).find('.armor li').each(function(k, v){
				if($(this).hasClass('filled')){
					var pitem = ( new Function('var j = new ' + Armors[$(this).data('refID')] + '(); return j;') )();
					p.wears[k] = pitem;
				} else { p.wears[k] = ''; }
			});
		}
		oDialog.dialog('close');
	}
});
