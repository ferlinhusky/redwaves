var Input = function(){
	/*
		Functions to bind to
	*/
		// Capture mobile tap
		this.doMapClick = function(e){
			e.preventDefault();
			e.stopPropagation();
			var oe = e.originalEvent;
			if(oe.targetTouches){
				oe = oe.changedTouches[0]; // changedTouches to capture touchend
			}
			myPos = Squares[me.currentSquare].onMap.offset();
			offX = Math.abs(oe.pageX-myPos.left);
			offY = Math.abs(oe.pageY-myPos.top);
			if(offX > offY){
				if(oe.pageX > myPos.left) { me.move('right'); }
				else { me.move('left'); }
				} else {
				if(oe.pageY > myPos.top) { me.move('down'); }
				else { me.move('up'); }
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
						input.bindToMap();
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
			var sq = Squares[me.currentSquare];
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
			loc = me.coords;
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
							sobj.passable = true;
							// Update line of sight
							getLineOfSight(loc);
							// Wizard check
							if(me.type == "wizard" && input.spellOn == true){
								getSpellRange(me);
							}
						} else if(sobj.t.type == 'open_door') {
							s.removeClass('open_door');
							s.addClass('closed_door');
							sobj.t = ClosedDoor;
							sobj.passable = false;
							// Update line of sight
							getLineOfSight(loc);
							// Wizard check
							if(me.type == "wizard" && input.spellOn == true){
								getSpellRange(me);
							}
						}
					}
				}
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
                    var spell = me.spells[s];
                    btnSpell.button('option', 'label', spell.name);
                    me.readySpell = spell;
                    this.hideSpellMenu();
                    if(this.spellOn == true){
                        getSpellRange(me);
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
                    $('.lit, .unlit').removeClass('range'); // remove all spell ranges
		    btnSpell.removeClass('blink');
                    if(this.spellOn == false && me.readySpell != null){
                            if(me.type == "wizard"){ // doesn't hurt to make sure again
                                    btnSpell.addClass('blink');
                                    this.spellOn = true;
                                    getSpellRange(me);
                            } else { btnSpell.button('disable'); return false; }
                    } else {
                            this.spellOn = false;
                    }
		};
		
		// Square click
		this.squareClick = function(k){
			// Capture click
			k.preventDefault();
			k.stopPropagation();
			
			var targetsq = $(k.currentTarget);
			
			// Get all attached square classes
			var sqClasses = targetsq.attr('class').split(' ');
			
			// Activate spell
			if($.inArray('range', sqClasses) > -1){
				var sobj = Squares[targetsq.attr('data-sid')];
				if(sobj.occupiedBy.ofType == "monster" && me.currMove < me.movement){
					var battle = new Battle(me, sobj.occupiedBy);
					
					// Track/update movement if not dead
                                        me.move(); // update movement, activate end turn if necessary
				} else if (me.currMove == me.movement){
                                    btnSpell.removeClass('blink')
                                        .button('disable');
                                    btnSelectSpell.button('disable');
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
				case 32: input.enterLoc(); break;
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
			input.unbindFromMap();
			switch(type){
				case "inventory" 	: M_D = D_Inventory; break;
				case "notes" 		: M_D = D_Notes; break;
				case "options" 		: M_D = D_Options; break;
				case "help" 		: M_D = D_Help; break;
				case "welcome" 		: M_D = D_Welcome; break;
				case "standard"		: M_D = D_Standard; break;
				default: break;
			}
			if(type=="standard"){
				oDialog.html(content);
				M_D_title = title;
				if(buttons) {
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
				open: M_D.open,
				close: function(){
					input.bindToMap();
				},
				buttons: M_D_buttons,
				title: M_D_title,
				modal: true,
				height: M_D_height,
				zIndex: 5000
			});
		}
	/*
		Bindings and such
	*/
		// High-level connectors
		var moveUp = function(){ me.move('up'); };
		var moveRight = function(){ me.move('right'); };
		var moveDown = function(){ me.move('down'); };
		var moveLeft = function(){ me.move('left'); };
		
		// Action Buttons
		btnInventory.button({
			icons: {primary:'ui-icon-suitcase',secondary:''},
			disabled: true,
			text: false
		});
		btnEnter.button({ 
			icons: {primary:'ui-icon-home',secondary:''},
			disabled: true,
			text: false
		});
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
		btnSpell.button({ 
			icons: {primary:'ui-icon-script',secondary:''},
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
		btnEndTurn.button({ 
			icons: {primary:'ui-icon-refresh',secondary:''},
			disabled: true,
			text: true
		});
		
		// Touch events
		btnInventory.bind('click touchend', function(e){e.preventDefault(); input.M_Dialog('inventory');});
		btnEnter.bind('click touchend', function(e){e.preventDefault(); input.enterLoc();});
		btnOpts.bind('click touchend', function(e){e.preventDefault(); input.M_Dialog('options');});
		btnHelp.bind('click touchend', function(e){e.preventDefault(); input.M_Dialog('help');});
		btnSpell.bind('click touchend', function(e){e.preventDefault(); input.handleSpell();});
                btnSelectSpell.bind('click touchend', function(e){e.preventDefault(); input.selectSpell();});
		btnOpenClose.bind('click touchend', function(e){e.preventDefault(); input.openCloseDoor();});
		btnEndTurn.bind('click touchend', function(e){e.preventDefault(); World.endturn();});
	
		// Update Action Buttons
		var updateBtnState = function(b, val){
			b.button( "option", "disabled", val );
		};
		this.updateActionButtons = function(s){
			s.b != undefined ? updateBtnState(btnEnter, false) : updateBtnState(btnEnter, true)
		};
	/*
		Map Drag (touch)
	*/
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
					var oe = e.originalEvent;
					var touch = oe.targetTouches[0];
					mg.css('left', startX + (touch.pageX - tStartX));
					mg.css('top', startY + (touch.pageY - tStartY));
					return false;
				});
				mg.bind('touchend', function(e){
					e.preventDefault();
					if(Math.abs(mg.position().left - startX)<10 && Math.abs(mg.position().top - startY) <10){
							input.doMapClick(e); // do a map click if the movement is incidental
					}
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
                    centerOn(me);
                    oDialog.dialog('option', 'position', 'center');
                    if($(this).width() <= 480 && $('#button_container').find('.action').button()){
                        $('#button_container').find('.action').button('option', 'text', false);
                    } else if($('#button_container').find('.action').button()) {
                        $('#button_container').find('.action').button('option', 'text', true);
                        btnSelectSpell.button('option', 'text', false);
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
