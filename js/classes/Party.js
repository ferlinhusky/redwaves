var Party = Class.extend({
	init: function(){
	    this.gold = 2750;
	    this.levelcomplete = 0;
	    this.store = [0,0,0,0,0,0];
	    this.members = [];
	    this.passcode = "";
	}
});

var Equip = Class.extend({
	init: function() {
		this.emporium = [
				// Weapons
				new battleaxe, new crossbow, new longbow, new shotgun, new sixshooter,
				// Armor
				new chainmail, new cowboyhat, new plate,
				// Items
				new phyton, new maddog
		];
	},
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
			
			// Medicine
			$('.itemgroups.' + p.type).find('.medicine li').each(function(k, v){
				$(this).data('type', 'medicine')
					.data('ofType', 'medicine')
					.data('default', $(this).text());
				if (p.inven[k] != undefined) {
					$(this).text(p.inven[k].name)
						.addClass('filled').removeClass('empty')
						.data('refID', p.inven[k].refID);
				} else { $(this).addClass('empty'); }
			});
			
			// Weapons
			$('.itemgroups.' + p.type).find('.weapon li').each(function(k, v){
				$(this).data('ofType', 'weapon');
				$(this).data('default', $(this).text());
				switch (k) {
					case 0: $(this).data('type', 'head'); break;
					case 1: $(this).data('type', 'hand'); break;
					case 2: $(this).data('type', 'hand'); break;
					case 3: $(this).data('type', 'feet'); break;
					default: break;
				}
				
				var ishand = k==1||k==2;
				
				if (p.wields[k] != "" && p.wields[k].name != "Hands") {
					$(this).data('refID', p.wields[k].refID)
						.text(p.wields[k].name)
						.addClass('filled').removeClass('empty')
					if (p.wields[k].supclass == "appendage") {
						$(this).addClass('appendage');
					}
				} else if (ishand){
					$(this).addClass('empty');
				} else { $(this).hide('fast'); }
			});
			
			// Armor
			$('.itemgroups.' + p.type).find('.armor li').each(function(k, v){
				$(this).data('ofType', 'armor');
				$(this).data('default', $(this).text());
				switch (k) {
					case 0: $(this).data('type', 'helmet'); break;
					case 1: $(this).data('type', 'bodyarmor'); break;
					case 2: $(this).data('type', 'shield'); break;
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
				
				if (dropped.hasClass('emporium')) {
					// Confirm purchase
					ui.find('.items li.filled').hide('fast');
					var slot = $(this);
					var ofType = dropped.data('ofType');
					var price = dropped.data('price');
					var name = dropped.data('name');
					var type = dropped.data('type');
					var refID = dropped.data('refID');
					
					$('<div>Buy the ' + name + '?</div>').dialog({
						title: 'Purchase',
						modal: true,
						dialogClass: 'no-close',
						buttons: {
							'Yes': function(){
								// Update gold
								Party.gold -= price;
								$('.buy .gold').text(Party.gold + 'GP');
								
								// Add to inventory
								slot.addClass('filled')
									.removeClass('empty')
									.addClass(ofType)
									.text(name)
									.data('type', type)
									.data('ofType', ofType)
									.data('refID', refID)
									.droppable('destroy')
									.draggable({
										revert: 'invalid'
									});
								
								// Remove the purchased item from emporium
								dropped.remove();
								
								$(this).dialog('close');
								ui.find('.items li.filled').show('fast');
								
								// Disable unaffordable items
								$('.emporium').each(function(){
									if($(this).data('price') > Party.gold && $(this).draggable()){
										$(this).draggable('disable');
									}
								});
							},
							'No': function(){
								dropped.animate({
									'top': 0, 'left': 0
								}, 500);
								$(this).dialog('close');
								ui.find('.items li.filled').show('fast');
							}
						}
					});
					
					// Update UI
					dropped.remove();
				} else {
					var droppedrefID = 0;
					var droppedclass = "empty";
					if($(this).hasClass('appendage')){
						droppedrefID = $(this).data('refID'); // old refID
						droppedclass = "empty appendage";
					}
					
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
						.addClass(droppedclass)
						.attr('style', '')
						.text(dropped.data('default'))
						.data('type', dropped.data('type'))
						.data('ofType', dropped.data('ofType'))
						.data('refID', droppedrefID)
						.data('default', dropped.data('default'))
						.droppable(emptyItemOpts);
					dropped.remove();	
				}
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
		
		// Populate store
		$('.buy .gold').text(Party.gold + 'GP');
		for (var i=0; i<this.emporium.length; i++) {
			var emp = this.emporium[i];
			var type;
			switch (emp.ofType) {
				case "weapon":
					type = emp.wieldin;
					break;
				case "armor":
					type = emp.supclass;
					break;
				case "medicine":
					type = emp.ofType;
					break;
				default: break;
			}
			
			var item = $('<li class="emporium filled '+emp.ofType+'">'+emp.name+' ('+emp.price+')</li>')
				.data('type', type)
				.data('name', emp.name)
				.data('price', emp.price)
				.data('ofType', emp.ofType)
				.data('refID', emp.refID);
			$('.buy .items').append(item);
		}
		
		// Init draggable items
		ui.find('.items li.filled').draggable({
			revert: 'invalid', stack: 'li'
		});
		ui.find('.items li.appendage').draggable({ disabled: true });
		
		// Disable/make undraggable unaffordable items
		$('.emporium').each(function(){
			if($(this).data('price') > Party.gold && $(this).draggable()){
				$(this).draggable('disable');
			}
		});
		
		// Init droppable areas
		ui.find('.items li.empty').droppable(emptyItemOpts);
		ui.find('.trash').droppable({
			drop: function(e, u) {
				var dropped = $(u.draggable);
				
				ui.find('.items li.filled').hide('fast');
				
				$('<div>Throw away the ' + dropped.text() + '?</div>').dialog({
					title: 'Trash',
					modal: true,
					dialogClass: 'no-close',
					buttons: {
						'Yes': function(){
							
							// Reset list item
							dropped.clone()
								.insertBefore(dropped)
								.removeClass()
								.addClass('empty')
								.attr('style', '')
								.text(dropped.data('default'))
								.data('type', dropped.data('type'))
								.data('ofType', dropped.data('ofType'))
								.data('refID', dropped.data('refID'))
								.droppable(emptyItemOpts);
							dropped.remove();
							
							$(this).dialog('close');
							ui.find('.items li.filled').show('fast');
						},
						'No': function(){
							dropped.animate({
								'top': 0, 'left': 0
							}, 500);
							$(this).dialog('close');
							ui.find('.items li.filled').show('fast');
						}
					}
				});
			},
			accept: function(u){
				if (u.data('price') == undefined) {
					return true;
				}
			},
			hoverClass: 'hover'
		});
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
			p.wields = ["","","",""];
			p.wears = ["","","",""];
			
			$('.itemgroups.' + p.type).find('.medicine li').each(function(k, v){
				if($(this).hasClass('filled')){
					var pitem = ( new Function('var j = new ' + InventoryItems[$(this).data('refID')] + '(); return j;') )();
					p.inven.push(pitem);
				}
			});
			
			$('.itemgroups.' + p.type).find('.weapon li').each(function(k, v){
				if($(this).hasClass('filled') || $(this).hasClass('appendage')){
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
			
			// Check for no weapons
			p.checkwielding();
			
			// Update party table UI
			$('#party tr.' + p.type).remove();
			p.updatetable();
		}
		oDialog.dialog('close');
	}
});
