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
	init: function(){
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
			$('.itemgroups.' + p.type).find('.items li').each(function(k, v){
				$(this).attr('data-type', 'pack');
				$(this).attr('data-ofType', 'pack');
				$(this).attr('data-default', $(this).text());
				
				if (p.inven[k] != undefined) {
					$(this).text(p.inven[k].name);
					$(this).addClass('filled');
				} else { $(this).addClass('empty'); }
			});
			
			$('.itemgroups.' + p.type).find('.weapons li').each(function(k, v){
				$(this).attr('data-ofType', 'weapons');
				switch (k) {
					case 0: $(this).attr('data-type', 'head'); break;
					case 1: $(this).attr('data-type', 'hand'); break;
					case 2: $(this).attr('data-type', 'hand'); break;
					case 3: $(this).attr('data-type', 'feet'); break;
					default: break;
				}
				$(this).attr('data-default', $(this).text());
				if (p.wields[k] != "") {
					$(this).text(p.wields[k].name);
					$(this).addClass('filled');
				} else { $(this).addClass('empty'); }
			});
			
			$('.itemgroups.' + p.type).find('.armor li').each(function(k, v){
				$(this).attr('data-ofType', 'armor');
				switch (k) {
					case 0: $(this).attr('data-type', 'helmet'); break;
					case 1: $(this).attr('data-type', 'bodyarmor'); break;
					case 2: $(this).attr('data-type', 'gloves'); break;
					case 3: $(this).attr('data-type', 'boots'); break;
					default: break;
				}
				$(this).attr('data-default', $(this).text());
				if (p.wears[k] != "") {
					$(this).text(p.wears[k].name);
					$(this).addClass('filled');
				} else { $(this).addClass('empty'); }
			});
		}
		
		ui.find('.players').html(tabs);
		ui.find('.players .player').click(function(){
			ui.find('.itemgroups').css('display', 'none');
			ui.find('.itemgroups.' + $(this).attr('data-type')).css('display', 'table');
		});
		ui.find('.itemgroups.hero').css('display', 'table');
		
		ui.append('<div class="group shared"><span class="title">Shared</span>\
			<ul class="items">\
			    <li class="empty" data-default="Empty"><i>Empty</i></li>\
			    <li class="empty" data-default="Empty"><i>Empty</i></li>\
			    <li class="empty" data-default="Empty"><i>Empty</i></li>\
			    <li class="empty" data-default="Empty"><i>Empty</i></li>\
			    <li class="empty" data-default="Empty"><i>Empty</i></li>\
			    <li class="empty" data-default="Empty"><i>Empty</i></li>\
			</ul>');
			
		// Drag/drop opts
		var emptyItemOpts = {
			drop: function(e, u) {
				var dropped = $(u.draggable);
				
				$(this).addClass('filled')
					.removeClass('empty')
					.addClass(dropped.attr('data-ofType'))
					.attr('data-type', dropped.attr('data-type'))
					.text(dropped.text())
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
					.droppable(emptySharedOpts);
				dropped.remove();
				
				// update droppable after each drop
			},
			accept: function(u){
				if(u.data('type') === $(this).data('type')){
					return true;
				}
			}
		};
		
		var emptySharedOpts = {
			drop: function(e, u) {
				var dropped = $(u.draggable);
				
				$(this).addClass('filled')
					.removeClass('empty')
					.addClass(dropped.attr('data-ofType'))
					.attr('data-type', dropped.attr('data-type'))
					.text(dropped.text())
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
					.droppable(emptyItemOpts);
				dropped.remove();
				
				// update droppable after each drop
			},
			accept: '.itemgroups li.filled' 
		};
		
		// Init draggable items
		ui.find('.items li.filled').draggable({ revert: 'invalid' });
		
		// Init droppoable areas - Shared
		ui.find('.shared .items li.empty').droppable(emptySharedOpts);
		
		// Init droppoable areas - Held items
		ui.find('.itemgroups li.empty').droppable(emptyItemOpts);
	},
	save: function(){
		// Save items to player, shared, etc.
	}
});
