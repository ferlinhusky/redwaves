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
				if(offX > offY){
					if(oe.pageX > myPos.left) {
						World.activePlayer.move('right');
					} else { World.activePlayer.move('left'); }
				} else {
					if(oe.pageY > myPos.top) {
						World.activePlayer.move('down');
					} else { World.activePlayer.move('up'); }
				}
			}
		};
		
		// Bind actions to map
		this.unbindFromMap = function(){
			doc.unbind('keyup');
			mapContainerCell.unbind('touchend');
		};
		
		this.bindToMap = function(){
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
							// Wizard check
							if(World.activePlayer.type == "wizard" && Input.spellOn == true){
								getSpellRange(World.activePlayer);
							}
						} else if(sobj.t.type == 'open_door') {
							s.removeClass('open_door');
							s.addClass('closed_door');
							sobj.t = ClosedDoor;
							sobj.cthru = false;
							// Update line of sight
							getLineOfSight(loc);
							// Wizard check
							if(World.activePlayer.type == "wizard" && Input.spellOn == true){
								getSpellRange(World.activePlayer);
							}
						}
					}
				}
			}
		};
		
	/*
		Spells and Ranged Attacks
	*/
		
		// Handle spellcasting
		this.spellOn = false;
		this.spellMenu = false;
		
		this.showSpellMenu = function(){
			var offH = menuSelectSpell.outerHeight();
			menuSelectSpell
				.css({
				   top: btnSpell.position().top - offH,
				   left: btnSpell.position().left,
				   width: SpellSet.width() - 8
				})
				.animate({
					opacity: 1
				}, 250);
			this.spellMenu = true;
		};
		
		this.hideSpellMenu = function(){
			menuSelectSpell.animate({
						opacity: 0
					}, 250);
			this.spellMenu = false;
		};
		
		this.setSpell = function(s){
			var spell = World.activePlayer.spells[s];
			btnSpell.button('option', 'label', spell.name);
			World.activePlayer.readySpell = spell;
			this.hideSpellMenu();
			if(this.spellOn == true){
				getSpellRange(World.activePlayer);
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
			$('.lit, .unlit').removeClass('range'); // remove all spell ranges
			btnSpell.removeClass('blink');
			if(this.spellOn == false && World.activePlayer.readySpell != null){
				if(World.activePlayer.type == "wizard"){ // doesn't hurt to make sure again
					if($(window).width() <= 480 ){
                                            $('.m_grid').addClass('zoom'); // make only for small screen
                                            centerOn(World.activePlayer);
                                        }
                                        btnSpell.addClass('blink');
					this.spellOn = true;
					getSpellRange(World.activePlayer);
				} else { btnSpell.button('disable'); return false; }
			} else {
                            if($('.m_grid').hasClass('zoom')){
                                $('.m_grid').removeClass('zoom');
                                centerOn(World.activePlayer);
                            }
			    this.spellOn = false;
			}
		};
		
		// Check for ranged target > tsq: target square
		// If found, cast spell
		this.checkRangedTarget = function(tsq){
			var sobj = Squares[tsq.attr('data-sid')];
            World.activePlayer.readySpell.cast(sobj);
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
				   left: btnItem.position().left,
				   width: ItemSet.width() - 8
				})
				.animate({
					opacity: 1
				}, 250);
			this.itemMenu = true;
		};
		
		this.hideItemMenu = function(){
			menuSelectItem.animate({
						opacity: 0
					}, 250, function(){
						menuSelectItem.css('top', '-10000px');
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
                
                this.pickupItem = function(){
                    var square = getSquare(World.activePlayer.coords);
                    var item = square.containsA;
                    item.pickup(square.id);
                    btnPickup.button('disable');
                }
		
	/*
		Key Captures
	*/	
		// High-level connectors
		var moveUp = function(){ World.activePlayer.move('up'); };
		var moveRight = function(){ World.activePlayer.move('right'); };
		var moveDown = function(){ World.activePlayer.move('down'); };
		var moveLeft = function(){ World.activePlayer.move('left'); };
		
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
				case 37: moveLeft(); break;
				// up
				case 38: moveUp(); break;
				// right
				case 39: moveRight(); break;
				// down
				case 40: moveDown(); break;
				default: break;
			}
		};
	/*
		Dialogs (type, [content, title, buttons])
	*/
		this.M_Dialog = function(type, content, title, buttons, height) {
			var M_D;
			var M_D_title;
			var M_D_buttons;
            var M_D_height;
			Input.unbindFromMap();
			switch(type){
				case "inventory" 	: M_D = D_Inventory; break;
				case "options" 		: M_D = D_Options; break;
				case "help" 		: M_D = D_Help; break;
				case "welcome" 		: M_D = D_Welcome; break;
                                case "select_team" 	: M_D = D_Select_Team; break;
				case "standard"		: M_D = D_Standard; break;
				default: break;
			}
			if(type=="standard"){
				oDialog.html(content);
				M_D_title = title;
                                M_D_height = height;
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
			}
			oDialog.dialog({
                                closeOnEscape: false,
                                open: function(event, ui) { $(".ui-dialog-titlebar-close", ui.dialog).hide(); },
				//open: M_D.open,
				close: function(){
					Input.bindToMap();
				},
				buttons: M_D_buttons,
				title: M_D_title,
				modal: true,
				height: M_D_height,
				zIndex: 5000
			});
		}
		
		/*
		    Save Game
		*/
		this.saveGame = function(){
                    var jsonObj = {};
                    var jsonPlayers = [];
                    
                    for(var j=0; j<Players.length; j++){
                    
                        var pwields=[]; var pwears=[]; var pinven=[]; var pspells=[];
                        
                        for(var i=0; i < Players[j].wields.length; i++){ pwields.push(Players[j].wields[i]); }
                        for(var i=0; i < Players[j].wears.length; i++){ pwears.push(Players[j].wears[i]); }
                        for(var i=0; i < Players[j].inven.length; i++){ pinven.push(Players[j].inven[i]); }
                        for(var i=0; i < Players[j].spells.length; i++){ pspells.push(Players[j].spells[i]); }
                        
                        jsonPlayers.push({
                                    type: Players[j].type,
                                    gender: Players[j].gender.demo,
                                    level: Players[j].level,
                                    hp: Players[j].maxHP,
                                    move: Players[j].maxMove,
                                    skills: Players[j].skills,
                                    weapons: pwields,
                                    wears: pwears,
                                    inven: pinven,
                                    spells: pspells
                                }
                        );
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
                    for(var i=0; i<data.players.length; i++){
						var pdata = data.players[i];
                        var player = ( new Function('var p = new ' + capitalise(pdata.type) + '(); return p;') )();
                        // Update player attributes/wpsn/items/etc.
								//gender
								player.gender = setGender(pdata.gender);
								//level
								//hp
								//movement
								//inventory
								//weapons
								//armor
								//skills
								//spells
                    }
                    
                    // Update Party
                    Party.levelcomplete = data.levelcomplete;
                    Party.gold = data.gold;
                    Party.store = data.store;
                    
                    // Load up next adventure
                    var curradv = Adventures[Party.levelcomplete];
                    MapWorld = curradv.type;
                    $('.ui-dialog .next_adventure').text(curradv.title);
                    $('.ui-dialog .next_adventure').css({
                            "color": curradv.titlecolors[0],
                            "background-color": curradv.titlecolors[1]
                    });
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
			text: true
		});
		
		btnSave.button({ 
			icons: {primary:'ui-icon-disk',secondary:''},
			disabled: false,
			text: true
		});
		
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
			text: true
		});
                btnPickup.button({ 
			icons: {primary:'ui-icon-arrowreturnthick-1-n',secondary:''},
			disabled: true,
			text: true
		});
		btnEndTurn.button({ 
			icons: {primary:'ui-icon-refresh',secondary:''},
			disabled: true,
			text: true
		});
		
		// Touch events
		btnOpts.bind('click touchend', function(e){e.preventDefault(); Input.M_Dialog('options');});
		btnHelp.bind('click touchend', function(e){e.preventDefault(); Input.M_Dialog('help');});
		/*TEST*/btnSave.bind('click touchend', function(e){e.preventDefault(); World.endgame(World.Level.events.win, "win"); });
		btnSpell.bind('click touchend', function(e){e.preventDefault(); Input.handleSpell();});
		btnSelectSpell.bind('click touchend', function(e){e.preventDefault(); Input.selectSpell();});
		btnItem.bind('click touchend', function(e){e.preventDefault(); Input.handleItem();});
		btnSelectItem.bind('click touchend', function(e){e.preventDefault(); Input.selectItem();});
		btnOpenClose.bind('click touchend', function(e){e.preventDefault(); Input.openCloseDoor();});
                btnPickup.bind('click touchend', function(e){e.preventDefault(); Input.pickupItem();});
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
					$('#button_container').find('.action').button('option', 'text', false);
				} else if($('#button_container').find('.action').button()) {
					$('#button_container').find('.action').button('option', 'text', true);
					btnSelectSpell.button('option', 'text', false);
					btnSelectItem.button('option', 'text', false);
				}
				
				// Make sure the Spell select dropdown (up?) doesn't unattach itself
				if(menuSelectSpell.css('opacity') > 0){
					var offH = menuSelectSpell.outerHeight();
					 menuSelectSpell.css({
					   top: btnSpell.position().top - offH,
					   left: btnSpell.position().left,
					   width: SpellSet.width() - 8
					});
				}
				
				// Make sure the Spell select dropdown (up?) doesn't unattach itself
				if(menuSelectItem.css('opacity') > 0){
					var offH = menuSelectItem.outerHeight();
					 menuSelectItem.css({
					   top: btnItem.position().top - offH,
					   left: btnItem.position().left,
					   width: ItemSet.width() - 8
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
