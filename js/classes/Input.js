var Input = function(){
	/*
		Functions to bind to
	*/
		// Capture mobile tap
		this.doMapClick = function(e){

			e.preventDefault();
			e.stopPropagation();
			
			// Get target touched; set up empty square classes container
			var targetsq = $(e.currentTarget);
			var sqClasses = [];
			
			// If the target has classes, put them in the square classes container
			if(targetsq.attr('class') != undefined){
				// Get all attached square classes
				sqClasses = targetsq.attr('class').split(' ');
			}
			
			// Check if trying to attack ranged target or move
			if($.inArray('range', sqClasses) > -1){
				this.checkRangedTarget(targetsq);
			} else {
				var oe = e.originalEvent;
				
				if(oe.targetTouches){
					oe = oe.changedTouches[0]; // changedTouches to capture touchend
				}
				
				myPos = Squares[World.activePlayer.currentSquare].onMap.offset();
				offX = Math.abs(oe.pageX-myPos.left);
				offY = Math.abs(oe.pageY-myPos.top);
								
				var v1 = {x: myPos.left+7.5, y: myPos.top+7.5}; // center to square
				var v2 = {x: oe.pageX, y: oe.pageY};
				var v3 = {x: v2.x-v1.x, y: v2.y-v1.y};
				
				var angleRad = Math.atan2(v3.y, v3.x);
				var angleDeg = (angleRad * 180 / Math.PI);
				
				if (angleDeg < 0) {
					angleDeg += 360; // 0-359deg
				}
				
				//console.log("me X: %f, click X: %f", v1.x, v2.x);
				//console.log("radians: %f, degrees: %f", angleRad, angleDeg);
				
				// Need 8 divisions of 45deg, 0/180 on horiz
				if (angleDeg > 337.5 || angleDeg <= 22.5) { World.activePlayer.move('right'); }
				else if (angleDeg > 22.5 && angleDeg <= 67.5) { World.activePlayer.move('right_down'); }
				else if (angleDeg > 67.5 && angleDeg <= 112.5) { World.activePlayer.move('down'); }
				else if (angleDeg > 112.5 && angleDeg <= 157.5) { World.activePlayer.move('left_down'); }
				else if (angleDeg > 157.5 && angleDeg <= 202.5) { World.activePlayer.move('left'); }
				else if (angleDeg > 202.5 && angleDeg <= 247.5) { World.activePlayer.move('left_up'); }
				else if (angleDeg > 247.5 && angleDeg <= 292.5) { World.activePlayer.move('up'); }
				else if (angleDeg > 292.5 && angleDeg <= 337.5) { World.activePlayer.move('right_up'); }
			}
		};
		
		// Bind actions to map
		this.unbindFromMap = function(){
			doc.unbind('keyup');
			doc.unbind('keydown');
			mapContainerCell.unbind('touchend');
		};
		
		this.bindToMap = function(){
			doc.bind('keydown', this.doKeyDown);
			doc.bind('keyup', this.doKeyUp);
			mapContainerCell.bind('touchend', this.doMapClick);
		};
		
		// Wait
		var wait = function(){};
		
		// Leave locations
		this.leaveLoc = function(){
			if(activeMap.type != "overland") {
				this.unbindFromMap();
				var msg = 'Leave ' + getLocation() + '?';
				oDialog.html(msg);
				oDialog.dialog({
					close: function(){
						Input.bindToMap();
					},
					buttons: { 
						"Y": function() {
							Map.saveMe(activeMap);
							if(previousMaps.length > 0) {
								var justPreviousMap = previousMaps.pop();
								Map.loadMe(justPreviousMap, 'exit');
							}
							else {
								Map.createContainer(activeMap);
							}
							$(this).dialog('close');
							statuss.whereami();
							Story.updateTime(true);
						},
						"N": function() {
							$(this).dialog('close');
						}
					},
					title: capIt(getLocation()),
					modal: true,
					zIndex: 5000
				});
			}
		};
		
		// Enter location
		this.enterLoc = function(){
			var sq = Squares[World.activePlayer.currentSquare];
			if(sq.b != undefined){
				previousMaps.push(activeMap);
				Map.saveMe(activeMap);
				LoadMap(sq);
				statuss.whereami();
				Story.updateTime(true);
			}
		};
		
		// Do open-close door
		this.openCloseDoor = function(){
			loc = World.activePlayer.coords;
			var x = new Number(loc[0]);
			var y = new Number(loc[1]);
			var xSq = [x-1, x, x+1];
			var ySq = [y-1, y, y+1];
			for (i=0; i<ySq.length; i++){
				for (j=0; j<xSq.length; j++){
					var scoords = [xSq[i],ySq[j]];
					var s = getMapSq(scoords);
					var sobj = getSquare(scoords);
					if(sobj.t != undefined){
						if(sobj.t.type == 'closed_door'){
							s.removeClass('closed_door');
							s.addClass('open_door');
							sobj.t = OpenDoor;
							sobj.cthru = true;
							// Update line of sight
							getLineOfSight(loc);
							// Range check
							if(Input.spellOn == true){
								getRange(World.activePlayer, "spell");
							} else if (Input.weaponOn == true){
								getRange(World.activePlayer, "weapon");
							}
						} else if(sobj.t.type == 'open_door') {
							s.removeClass('open_door');
							s.addClass('closed_door');
							sobj.t = ClosedDoor;
							sobj.cthru = false;
							// Update line of sight
							getLineOfSight(loc);
							// Range check
							if(Input.spellOn == true){
								getRange(World.activePlayer, "spell");
							} else if (Input.weaponOn == true){
								getRange(World.activePlayer, "weapon");
							}
						}
					}
				}
			}
		};
		
	/*
		Spells and Ranged Attacks (and using Items)
	*/
		// Check for ranged target > tsq: target square
		// If found, cast spell or attack ranged....
		// Check here for action points available!!!
		this.checkRangedTarget = function(tsq){
			var sobj = Squares[tsq.attr('data-sid')];
                        var p = World.activePlayer;
			var remaining_moves = p.movement - p.currMove;
			if(Input.spellOn == true && remaining_moves >= 2){
				p.readySpell.cast(sobj);
			} else if (Input.weaponOn == true && remaining_moves >= 2 && sobj.occupiedBy.ofType != "player"){
				var battle = new Battle(p, sobj.occupiedBy);
				p.handleactioncost("ranged");
			}
		};
		
		// Square click
		this.squareClick = function(k){
			// Capture click
			k.preventDefault();
			
			var targetsq = $(k.currentTarget);
			
			// Get all attached square classes
			var sqClasses = targetsq.attr('class').split(' ');
			
			// Check if attempting to click a target in range
			if($.inArray('range', sqClasses) > -1){
				this.checkRangedTarget(targetsq);
			}
		};
		
		// Handle spellcasting
		this.spellOn = false;
		this.spellMenu = false;
		
		this.showSpellMenu = function(){
			var offH = menuSelectSpell.outerHeight();
			menuSelectSpell
				.css({
				   top: btnSpell.position().top - offH,
				   left: (btnSelectSpell.position().left + btnSelectSpell.outerWidth()) - menuSelectSpell.outerWidth(),
				   display: 'block'
				});
			this.spellMenu = true;
		};
		
		this.hideSpellMenu = function(){
			menuSelectSpell.css({
				top: '-1000px',
				display: 'none'
			});
			this.spellMenu = false;
		};
		
		this.setSpell = function(s){
			var spell = World.activePlayer.spells[s];
			btnSpell.button('option', 'label', spell.name);
			World.activePlayer.readySpell = spell;
			this.hideSpellMenu();
			if(this.spellOn == true){
				getRange(World.activePlayer, "spell");
			}
		}

		this.selectSpell = function(){
			if(!this.spellMenu) {
				this.showSpellMenu();
			} else {
				this.hideSpellMenu();
			}
		};
		this.handleSpell = function(){
			Input.hideSpellMenu();
			btnSpell.removeClass('blink');
			
			if(World.activePlayer.readySpell != null){
				$('.lit, .unlit').removeClass('range'); // remove all spell ranges
			}

			if(Input.spellOn == false && World.activePlayer.readySpell != null){                    
				// Deactive weapon
				if(Input.weaponOn == true){
					Input.handleWeapon();
				}
					
				// Zoom on small screens
				if($(window).width() <= 480 ){
					$('.m_grid').addClass('zoom'); // make only for small screen
					centerOn(World.activePlayer);
				}
				
				// Activate spell
				btnSpell.addClass('blink');
				this.spellOn = true;
				getRange(World.activePlayer, "spell");
			} else {
				if($('.m_grid').hasClass('zoom')){
					$('.m_grid').removeClass('zoom');
					centerOn(World.activePlayer);
				}
				this.spellOn = false;
			}
		};
		
	/*
		Item handling
	*/
		this.itemOn = false;
		this.itemMenu = false;
		
		this.showItemMenu = function(){
			var offH = menuSelectItem.outerHeight();
			menuSelectItem
				.css({
				   top: btnItem.position().top - offH,
                                   left: (btnSelectItem.position().left + btnSelectItem.outerWidth()) - menuSelectItem.outerWidth(),
				   display: 'block'
				});
			this.itemMenu = true;
		};
		
		this.hideItemMenu = function(){
			menuSelectItem.css({
				top: '-1000px',
				display:'none'
			});
			this.itemMenu = false;
		};
		
		this.setItem = function(s){
			var zitem = World.activePlayer.inven[s];
			btnItem.button('option', 'label', zitem.name);
			World.activePlayer.readyItem = zitem;
			this.hideItemMenu();
		};

		this.selectItem = function(){
			if(!this.itemMenu) {
				this.showItemMenu();
			} else {
				this.hideItemMenu();
			}
		};
		
		this.handleItem = function(){
			World.activePlayer.readyItem.use();
		};
		
	/*
		Pickup/Drop handling
	 */
		this.pickupOn = false;
		this.pickupMenu = false;
		
		this.showPickupMenu = function(){
			var square = getSquare(World.activePlayer.coords);
			var items = square.containsA;
			
			// Reset pickup menu
			menuSelectPickup.empty();
			menuSelectPickup.menu();
			menuSelectPickup.menu('destroy');
			
			// Populate pickup menu
			for(var i=0; i<items.length; i++){
				menuSelectPickup.append('<li><a href="javascript:void(0);" onclick="Input.pickupItem('+i+');">'+items[i].name);
			}
			
			// Create pickup menu
			menuSelectPickup.menu();
			
			var offH = menuSelectPickup.outerHeight();
			menuSelectPickup.css({
				   top: btnPickup.position().top - offH,
                                   left: btnPickup.position().left,
				   display: 'block'
				});
			this.pickupMenu = true;
		};
		
		this.hidePickupMenu = function(){
			menuSelectPickup.css({
				top: '-1000px',
				display:'none'
			});
			this.pickupMenu = false;
		};
		
		this.selectPickup = function(){
			if(!this.pickupMenu) {
				this.showPickupMenu();
			} else {
				this.hidePickupMenu();
			}
		};
		
		this.pickupItem = function(id){
			var square = getSquare(World.activePlayer.coords);
			var item = square.containsA[id];
			item.pickup(square.id, id);
			if(square.containsA.length > 0){
				btnPickup.button('enable');
			} else {
				btnPickup.button('disable');
			}
		}
		
		this.dropOn = false;
		this.dropMenu = false;
		this.dropList = [];
		
		this.showDropMenu = function(){
			for(var i=0; i<World.activePlayer.wields.length; i++){
				if(World.activePlayer.wields[i] != "" && World.activePlayer.wields[i].supclass != "appendage"){
					Input.dropList.push(World.activePlayer.wields[i]);
				}
			}
			
			for(var i=0; i<World.activePlayer.wears.length; i++){
				if(World.activePlayer.wears[i] != ""){
					Input.dropList.push(World.activePlayer.wears[i]);
				}
			}
			
			for(var i=0; i<World.activePlayer.inven.length; i++){
				Input.dropList.push(World.activePlayer.inven[i]);
			}
			
			// Reset drop menu
			menuSelectDrop.empty();
			menuSelectDrop.menu();
			menuSelectDrop.menu('destroy');
			
			// Populate drop menu
			for(var i=0; i<Input.dropList.length; i++){
				menuSelectDrop.append('<li><a href="javascript:void(0);" onclick="Input.dropItem('+i+');">'+Input.dropList[i].name);
			}
			
			// Create drop menu
			if(Input.dropList.length > 0){
				menuSelectDrop.menu();
				
				var offH = menuSelectDrop.outerHeight();
				menuSelectDrop.css({
					   top: btnDrop.position().top - offH,
                                           left: btnDrop.position().left,
					   display: 'block'
					});
				this.dropMenu = true;
			}
		};
		
		this.hideDropMenu = function(){
			menuSelectDrop.css({
				top: '-1000px',
				display:'none'
			});
			this.dropMenu = false;
			this.dropList = [];
		};
		
		this.selectDrop = function(){
			if(!this.dropMenu) {
				this.showDropMenu();
			} else {
				this.hideDropMenu();
			}
		};
		
		this.dropItem = function(id){
			var square = getSquare(World.activePlayer.coords);
			Input.dropList[id].drop(World.activePlayer, square.id);
		};

	/*
		Weapon handling
	*/
		this.weaponOn = false;
		this.weaponMenu = false;
		
		this.showWeaponMenu = function(){
			var offH = menuSelectWeapon.outerHeight();
			menuSelectWeapon
				.css({
				   top: btnWeapon.position().top - offH,
				   left: (btnSelectWeapon.position().left + btnSelectWeapon.outerWidth()) - menuSelectWeapon.outerWidth(),
				   display: 'block'
				});
			this.weaponMenu = true;
		};
		
		this.hideWeaponMenu = function(){
			menuSelectWeapon.css({
				top: '-1000px',
				display:'none'
			});
			this.weaponMenu = false;
		};
		
		this.setWeapon = function(s){
			var zitem = World.activePlayer.wields[s];
			btnWeapon.button('option', 'label', zitem.name);
			World.activePlayer.readyWeapon = zitem;
			if(World.activePlayer.readyWeapon.supclass != "firearm") {
				$('.lit, .unlit').removeClass('range'); // remove all ranges
				btnWeapon.removeClass('blink');
				Input.weaponOn = false;
			}
			World.activePlayer.updateWpn();
			this.hideWeaponMenu();
		};

		this.selectWeapon = function(){
			// If the menu is closed and there are weapons to show, show menu
			if(!this.weaponMenu && World.activePlayer.wields.join('')!="") {
				this.showWeaponMenu();
			} else {
				this.hideWeaponMenu();
			}
		};
		
		this.handleWeapon = function(){
			// If ranged, show range etc.
			if(World.activePlayer.readyWeapon.supclass == "firearm"){
				Input.hideWeaponMenu();
				$('.lit, .unlit').removeClass('range'); // remove all ranges
				btnWeapon.removeClass('blink');
				if(Input.weaponOn == false){
					// Deactive spell
					if(Input.spellOn == true){
						Input.handleSpell();
					}
					
					// Zoom on small screens
					if($(window).width() <= 480 ){
						$('.m_grid').addClass('zoom'); // make only for small screen
						centerOn(World.activePlayer);
					}
				
					// Activate weapon
					btnWeapon.addClass('blink');
					this.weaponOn = true;
					getRange(World.activePlayer, "weapon");    
				} else {
					if($('.m_grid').hasClass('zoom')){
						$('.m_grid').removeClass('zoom');
						centerOn(World.activePlayer);
					}
					this.weaponOn = false;
				}
			}
		};
	
	/*
		Check Victory
	*/
		this.checkVictory = function(){
			if (World.infinitybox == true && Squares[World.activePlayer.currentSquare].onMap.hasClass('infinity_box')) {
				World.endgame(World.Level.events.win, "win");
			}
		}
		
	/*
		Key Captures
	*/	
		// High-level connectors
		var moveUp = function(){ World.activePlayer.move('up'); };
		var moveRight = function(){ World.activePlayer.move('right'); };
		var moveDown = function(){ World.activePlayer.move('down'); };
		var moveLeft = function(){ World.activePlayer.move('left'); };
		
		var moveRightUp = function(){ World.activePlayer.move('right_up'); };
		var moveRightDown = function(){ World.activePlayer.move('right_down'); };
		var moveLeftUp = function(){ World.activePlayer.move('left_up'); };
		var moveLeftDown = function(){ World.activePlayer.move('left_down'); };
		
		this.downkey = "";
		this.diaglast = false;
		// Capture key down for diagonals
		this.doKeyDown = function(k) {
				// Capture key
				k.preventDefault();
				k.stopPropagation();
				if (Input.downkey == "") {
					switch (k.which) {
						// left
						case 37: Input.downkey = "left"; break;
						// up
						case 38: Input.downkey = "up"; break;
						// right
						case 39: Input.downkey = "right"; break;
						// down
						case 40: Input.downkey = "down"; break;
						default: break;
					}	
				}
		}
		
		// Key press functions
		this.doKeyUp = function(k) {
			// Capture key
			k.preventDefault();
			k.stopPropagation();
			switch (k.which) {
				// return
				case 13: wait(); break;
				// spacebar (enter bldg)
				case 32: Input.enterLoc(); break;
				// left
				case 37:
					if (Input.downkey == "up") {
									moveLeftUp();
									Input.diaglast = true;
					} else if (Input.downkey == "down") {
									moveLeftDown();
									Input.diaglast = true;
					} else if (Input.diaglast == false) {
									moveLeft();
									Input.downkey = "";
					} else { Input.diaglast = false; Input.downkey = ""; }
					break;
				// up
				case 38:
					if (Input.downkey == "right") {
									moveRightUp();
									Input.diaglast = true;
					} else if (Input.downkey == "left") {
									moveLeftUp();
									Input.diaglast = true;
					} else if (Input.diaglast == false) {
									moveUp();
									Input.downkey = "";
					} else { Input.diaglast = false; Input.downkey = ""; }
					break;
				// right
				case 39:
					if (Input.downkey == "up") {
									moveRightUp();
									Input.diaglast = true;
					} else if (Input.downkey == "down") {
									moveRightDown();
									Input.diaglast = true;
					} else if (Input.diaglast == false) {
									moveRight();
									Input.downkey = "";
					} else { Input.diaglast = false; Input.downkey = ""; }
					break;
				// down
				case 40:
					if (Input.downkey == "right") {
									moveRightDown();
									Input.diaglast = true;
					} else if (Input.downkey == "left") {
									moveLeftDown();
									Input.diaglast = true;
					} else if (Input.diaglast == false) {
									moveDown();
									Input.downkey = "";
					} else { Input.diaglast = false; Input.downkey = ""; }
					break;
				default: break;
			}
		};
	/*
		Dialogs (type, [content, title, buttons])
	*/
		this.M_Dialog = function(type, content, title, buttons, height, width) {
			var M_D;
			var M_D_title;
			var M_D_buttons;
			var M_D_height, M_D_width;
			var M_D_create;
			Input.unbindFromMap();
			switch(type){
				case "inventory" 	: M_D = D_Inventory; break;
				case "options" 		: M_D = D_Options; break;
				case "help" 		: M_D = D_Help; break;
				case "welcome" 		: M_D = D_Welcome; break;
				case "select_team" 	: M_D = D_Select_Team; break;
				case "standard"		: M_D = D_Standard; break;
				case "equip"		: M_D = D_Equip; break;
				default: break;
			}
			if(type=="standard"){
                            oDialog.html(content);
                            M_D_title = title;
                            M_D_height = "auto";
                            M_D_width = width;
                            M_D_create = new Function('return false');
                            if(buttons != false) {
                                M_D_buttons = buttons;
                            } else {
                                M_D_buttons = {
                                    "Ok": function() {
                                        $(this).dialog('close');
                                    }
                                }
                            }
			} else {
                            oDialog.html(M_D.content);
                            M_D_title = M_D.title;
                            M_D_buttons = M_D.buttons;
                            
                            if(M_D.height != undefined){
                                    M_D_height = M_D.height;
                            } else { M_D_height = "auto"; }
                            
                            if(M_D.width != undefined){
                                    M_D_width = M_D.width;
                            } else { M_D_width = 300; }
                                                            
                            if(M_D.create != undefined){
                                    M_D_create = M_D.create;
                            } else { M_D_create = new Function('return false'); }
			}
			oDialog.dialog({
                            closeOnEscape: false,
                            create: M_D_create(),
                            dialogClass: 'no-close',
                            close: function(){
                                Input.bindToMap();
                                if($('.dialog_content').dialog()){
                                        $('.dialog_content').dialog('destroy');
                                }
                            },
                            buttons: M_D_buttons,
                            title: M_D_title,
                            modal: true,
                            height: M_D_height,
                            width: M_D_width,
                            resizable: false
			});
		}
		
		/*
			Save Game
		*/
		this.saveGame = function(){
			var jsonObj = {};
			var jsonPlayers = [];
			
			for(var j=0; j<Party.members.length; j++){
			
				var pwields=[]; var pwears=[]; var pinven=[]; var pspells=[];
				
				for(var i=0; i < Party.members[j].wields.length; i++){ pwields.push(Party.members[j].wields[i]); }
				for(var i=0; i < Party.members[j].wears.length; i++){ pwears.push(Party.members[j].wears[i]); }
				for(var i=0; i < Party.members[j].inven.length; i++){ pinven.push(Party.members[j].inven[i]); }
				for(var i=0; i < Party.members[j].spells.length; i++){ pspells.push(Party.members[j].spells[i]); }
				
				jsonPlayers.push({
					type: Party.members[j].type,
					gender: Party.members[j].gender.demo,
					level: Party.members[j].level,
					str: Party.members[j].STR.base,
					con: Party.members[j].CON.base,
					dex: Party.members[j].DEX.base,
					int_: Party.members[j].INT.base,
					wis: Party.members[j].WIS.base,
					cha: Party.members[j].CHA.base,
					skills: Party.members[j].skills,
					weapons: pwields,
					wears: pwears,
					inven: pinven,
					spells: pspells
				});
			}
			
			jsonObj.players = jsonPlayers;
			jsonObj.levelcomplete = Party.levelcomplete;
			jsonObj.gold = Party.gold;
			jsonObj.store = Party.store;
			
			var postData = JSON.stringify(jsonObj);
			var postArray = {playerdata:postData};
			
			$.ajax({
				url: 'save.php',
				data: postArray,
				type: 'POST',
				success: function(data){
					Party.passcode = data;
					$('.ui-dialog #passcode').text(data);
				},
				error: function(xhr, a, b){
					alert(a + ": " + b);
				}
			})
		}
		
		/*
			Load Game
		*/
		this.loadgame = function(data){
			// Reset player/party stuff
			$('#party tr.player_row').remove();
			$('#party').css('display', 'table');
			Players = [];
			Party.levelcomplete = 0;
			Party.gold = 0;
			Party.store = [0,0,0,0,0,0];
			
			// Create Players
			for(var j=0; j<data.players.length; j++){
				var pdata = data.players[j];
				var player = ( new Function('var p = new ' + capitalise(pdata.type) + '(); return p;') )();

				// Update player attributes/wpsn/items/etc.
							
				//gender
				player.gender = setGender(pdata.gender);
							
				//level
				player.XP = pdata.level;
							
				//attributes
				player.STR.base = pdata.str;
				player.CON.base = pdata.con;
				player.DEX.base = pdata.dex;
				player.WIS.base = pdata.wis;
				player.INT.base = pdata.int_;
				player.CHA.base = pdata.cha;
				
				player.STR.v = pdata.str;
				player.CON.v = pdata.con;
				player.DEX.v = pdata.dex;
				player.WIS.v = pdata.wis;
				player.INT.v = pdata.int_;
				player.CHA.v = pdata.cha;
				
				//update hp/move
				player.calcstats();
				
				//inventory
				player.inven = [];
				for (var i=0; i<pdata.inventory.length; i++) {
					var tmp;
					if (pdata.inventory[i] != 0) {
						tmp = ( new Function('var p = new ' + InventoryItems[pdata.inventory[i]] + '(); return p;') )();
						player.inven.push(tmp);
					}
				}

				//weapons
				player.wields = [];
				for (var i=0; i<pdata.weapons.length; i++) {
					var tmp;
					if (pdata.weapons[i] != 0) {
						tmp = ( new Function('var p = new ' + Weapons[pdata.weapons[i]] + '(); return p;') )();
						player.wields.push(tmp);
					} else { player.wields.push(""); }
				}

				//armor
				player.wears = [];
				for (var i=0; i<pdata.armor.length; i++) {
					var tmp;
					if (pdata.armor[i] != 0) {
						tmp = ( new Function('var p = new ' + Armors[pdata.armor[i]] + '(); return p;') )();
						player.wears.push(tmp);
					} else { player.wears.push(""); }
				}

				//skills
				player.skills = [];
				for (var i=0; i<pdata.skills.length; i++) {
					var tmp;
					if (pdata.skills[i] != 0) {
						tmp = ( new Function('var p = new ' + Skills[pdata.skills[i]] + '(); return p;') )();
						player.skills.push(tmp);
					}
				}
				
				// skillnames
				player.skillnames = [];
				for (var i=0; i<player.skills.length; i++) {
					player.skillnames.push(player.skills[i].name);
				}
						
				//spells
				player.spells = [];
				for (var i=0; i<pdata.spells.length; i++) {
					var tmp;
					if (pdata.spells[i] != 0) {
						tmp = ( new Function('var p = new ' + Spells[pdata.spells[i]] + '(); return p;') )();
						player.spells.push(tmp);
					}
				}
			}
					
			// Update Party
			Party.levelcomplete = data.levelcomplete;
			Party.gold = data.gold;
			Party.store = data.store;
			
			// Load up next adventure
			if (Party.levelcomplete >= Adventures.length) {
				$('.ui-dialog .next_adventure').html("You've done 'em all. <a href='http://www.twitter.com/HuskyFerlin'>When more?</a>");
				$('.ui-dialog .next_adventure').css({
                                    "color": "#333",
                                    "background-color": "#fff"
				});
				$(".ui-dialog-buttonpane button:contains('Play')").button("disable");
			} else {
				var curradv = Adventures[Party.levelcomplete];
				MapWorld = curradv.type;
				$('.ui-dialog .next_adventure').text(curradv.title);
				$('.ui-dialog .next_adventure').css({
                                    "color": curradv.titlecolors[0],
                                    "background-color": curradv.titlecolors[1]
				});
			}
		}
		
		/*
			Verify passcode
		*/
		this.passcodeverified = false;
		this.verifypasscode = function(){
			var pcode = $('.ui-dialog .enter_passcode').val();
			if (pcode.length > 0) {
				$.ajax({
					url:'load.php?passcode='+pcode,
					dataType: 'json',
					success: function(data){
						$('.ui-dialog .enter_passcode').css('color', 'white');
						if (data.error) {
							alert(data.error);
							$('.ui-dialog .enter_passcode').css('background-color', 'red');
						} else {
							Input.passcodeverified = true;
							$('.ui-dialog .enter_passcode').css('background-color', 'green');
							Input.loadgame(data);
						}
					},
					error: function(){
							alert("Error loading data. Sorry :(");
					}
				});
			}
		};
		
	/*
		Button bindings, etc.
	*/
		// Action Buttons
		btnOpts.button({ 
			icons: {primary:'ui-icon-wrench',secondary:''},
			disabled: true,
			text: false
		});
		
		btnHelp.button({ 
			icons: {primary:'ui-icon-lightbulb',secondary:''},
			disabled: false,
			text: false
		});
		
		btnCloseHelp.button({ 
			icons: {primary:'ui-icon-lightbulb',secondary:''},
			disabled: false,
			text: true
		});
		
		btnSave.button({ 
			disabled: true,
			text: true
		});
				
		btnWeapon.button({ 
			icons: {primary:'ui-icon-star',secondary:''},
			disabled: false,
			text: true
		}).next().button({
			text: false,
			disabled: false,
			icons: {primary: "ui-icon-triangle-1-s"}
			}).parent().buttonset();
		
		btnSpell.button({ 
			icons: {primary:'ui-icon-script',secondary:''},
			disabled: true,
			text: true
		}).next().button({
			text: false,
			disabled: true,
			icons: {primary: "ui-icon-triangle-1-s"}
			}).parent().buttonset();
			
		btnItem.button({ 
			icons: {primary:'ui-icon-suitcase',secondary:''},
			disabled: true,
			text: true
		}).next().button({
			text: false,
			disabled: true,
			icons: {primary: "ui-icon-triangle-1-s"}
			}).parent().buttonset();
			
		btnOpenClose.button({ 
			icons: {primary:'ui-icon-key',secondary:''},
			disabled: true,
			text: false
		});
		btnPickup.button({ 
			icons: {primary:'ui-icon-arrowreturnthick-1-n',secondary:''},
			disabled: true,
			text: false
		});
		btnDrop.button({ 
			icons: {primary:'ui-icon-arrowreturnthick-1-s',secondary:''},
			disabled: true,
			text: false
		});
		btnEndTurn.button({ 
			icons: {primary:'ui-icon-refresh',secondary:''},
			disabled: true,
			text: false
		});
		
		// Touch events
		btnOpts.bind('click touchend', function(e){e.preventDefault(); Input.M_Dialog('options');});
		btnHelp.bind('click touchend', function(e){
			e.preventDefault();
			$('.ui-widget-overlay, .ui-dialog').addClass('hideforfullscreen');
			$('#container').css('display', 'none');
			$('#fullscreen').css('display', 'table');
			$('html, body').css({
				overflow: 'auto',
			});
			$(window).unbind('touchmove');
			Input.unbindFromMap();
		});
		btnCloseHelp.bind('click touchend', function(e){
			e.preventDefault();
			$('.ui-widget-overlay, .ui-dialog').removeClass('hideforfullscreen');
			$('#container').css('display', 'block');
			$('#fullscreen').css('display', 'none');
			$('html, body').css({
				overflow: 'hidden',
			});
			$(window).bind('touchmove', function(e) { 
					// Tell Safari not to move the window. 
					e.preventDefault(); 
				});
			Input.bindToMap();
		});
		//btnSave.bind('click touchend', function(e){e.preventDefault(); World.endgame(World.Level.events.win, "win"); });
		btnSave.bind('click touchend', function(e){e.preventDefault(); Input.checkVictory();});
		btnSpell.bind('click touchend', function(e){e.preventDefault(); Input.handleSpell();});
		btnSelectSpell.bind('click touchend', function(e){e.preventDefault(); Input.selectSpell();});
		btnWeapon.bind('click touchend', function(e){e.preventDefault(); Input.handleWeapon();});
		btnSelectWeapon.bind('click touchend', function(e){e.preventDefault(); Input.selectWeapon();});
		btnItem.bind('click touchend', function(e){e.preventDefault(); Input.handleItem();});
		btnSelectItem.bind('click touchend', function(e){e.preventDefault(); Input.selectItem();});
		btnOpenClose.bind('click touchend', function(e){e.preventDefault(); Input.openCloseDoor();});
		btnPickup.bind('click touchend', function(e){e.preventDefault(); Input.selectPickup();});
		btnDrop.bind('click touchend', function(e){e.preventDefault(); Input.selectDrop();});
		btnEndTurn.bind('click touchend', function(e){e.preventDefault(); btnEndTurn.button('disable'); World.endturn();}); // disable the button immediately or it takes too long
	
		// Update Action Buttons
		var updateBtnState = function(b, val){
			b.button( "option", "disabled", val );
		};
	/*
		Map Drag (touch)
	*/
		this.preventSquareClick = false; // tied to Square...keep it from registering click after drag
		this.mapTouchDrag = function(mg){
			mg.bind('touchstart', function(e){
				e.preventDefault();
				e.stopPropagation();
				var oe = e.originalEvent;
				if(oe.targetTouches.length != 1){
						return false;
				}
				var touch = oe.targetTouches[0];
				var startX = mg.position().left;
				var startY = mg.position().top;
				var tStartX = touch.pageX;
				var tStartY = touch.pageY;
				mg.bind('touchmove', function(e){
						e.preventDefault();
						Input.preventSquareClick = true;
						var oe = e.originalEvent;
						var touch = oe.targetTouches[0];
						mg.css('left', startX + (touch.pageX - tStartX));
						mg.css('top', startY + (touch.pageY - tStartY));
						return false;
				});
				mg.bind('touchend', function(e){
						e.preventDefault();
						if(Math.abs(mg.position().left - startX)<10 && Math.abs(mg.position().top - startY) <10){
							Input.doMapClick(e); // do a map click if the movement is incidental
						}
						Input.preventSquareClick = false;
						mg.unbind('touchmove touchend');
						return false;
				});
				return false;
			});
		};
	
	/*
		Window
	*/
		// Hide menus if user clicks outside of them
		$('#map_container_cell').click(function(){
			// Hide all menus
			if (Input.itemMenu) Input.selectItem();
			if (Input.weaponMenu) Input.selectWeapon();
			if (Input.spellMenu) Input.selectSpell();
			if (Input.pickupMenu) Input.selectPickup();
			if (Input.dropMenu) Input.selectDrop();
		});
		
		// Do window bindings
		$(window).bind('touchmove', function(e) { 
			// Tell Safari not to move the window. 
			e.preventDefault(); 
		});
		// Init based on window size
		if($(window).width() <= 480  && $('#button_container').find('.action').button()){
			$('#button_container').find('.action').button('option', 'text', false);
		}
		// Re-center on window resize
		$(window).resize(function(){

				// There's no activeMap until a selection is made at start
				if(activeMap != null){
					centerOn(World.activePlayer);
				}
				
				oDialog.dialog('option', 'position', 'center');
				
				// Buttons become icon-only on small screens (small viewports)
				if($(this).width() <= 480 && $('#button_container').find('.action').button()){
					btnWeapon.button('option', 'text', false);
					btnSpell.button('option', 'text', false);
					btnItem.button('option', 'text', false);
				} else if($('#button_container').find('.action').button()) {
					btnWeapon.button('option', 'text', true);
					btnSpell.button('option', 'text', true);
					btnItem.button('option', 'text', true);
					btnSelectWeapon.button('option', 'text', false);
					btnSelectSpell.button('option', 'text', false);
					btnSelectItem.button('option', 'text', false);
				}
				
				
				// Make sure the menu dropdown (up?) doesn't unattach itself
				if(Input.itemMenu == true){
					var offH = menuSelectItem.outerHeight();
					 menuSelectItem.css({
					   top: btnItem.position().top - offH,
					   left: (btnSelectItem.position().left + btnSelectItem.outerWidth()) - menuSelectItem.outerWidth()
					});
				}
				if(Input.weaponMenu == true){
					var offH = menuSelectWeapon.outerHeight();
					 menuSelectWeapon.css({
					   top: btnWeapon.position().top - offH,
					   left: (btnSelectWeapon.position().left + btnSelectWeapon.outerWidth()) - menuSelectWeapon.outerWidth()
					});
				}
				if(Input.spellMenu == true){
					var offH = menuSelectSpell.outerHeight();
					 menuSelectSpell.css({
					   top: btnSpell.position().top - offH,
					   left: (btnSelectSpell.position().left + btnSelectSpell.outerWidth()) - menuSelectSpell.outerWidth()
					});
				}
				if(Input.pickupMenu == true){
					var offH = menuSelectPickup.outerHeight();
					 menuSelectPickup.css({
					   top: btnPickup.position().top - offH,
					   left: btnPickup.position().left
					});
				}
				if(Input.dropMenu == true){
					var offH = menuSelectDrop.outerHeight();
					 menuSelectDrop.css({
					   top: btnDrop.position().top - offH,
					   left: btnDrop.position().left
					});
				}
		});
		// Make everything unselectable
		$('.m_grid td.lit .quad').bind('selectstart', function(){return false;});
	/*
		Init
	*/
		// Bind starting actions to map
		this.bindToMap();
};
