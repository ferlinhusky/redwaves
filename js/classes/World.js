// THE WORLD IS AN ENGINE
var World = function(){
	this.resetvars = function(){
		this.orderOfPlay = [];
		this.currentPlay = 0;
		this.activePlayer = null;
		this.gameover = false;
	}
	
	this.build = function(){
        // Zero out vars
        this.resetvars();
        
        // Build map
        this.Level = ( new Function('var mw = new ' + MapWorld + '(); return mw;') )();
        Map.init(this.Level);
        Input.M_Dialog("standard", this.Level.events.preamble, this.Level.title, false, 375);
	};
	
	this.doorderofplay = function(){
		for(var i=0; i<Players.length; i++){
			Players[i].wait = true;
		}
		
		for(var i=0; i<Players.length + Monsters.length; i++){
			if(Players[i] != undefined){
				this.orderOfPlay.push(Players[i]);
			}
			if(Monsters[i] != undefined){
				this.orderOfPlay.push(Monsters[i]);
			}
		}
        this.activePlayer = this.orderOfPlay[0];
		this.endturn(); // Start
	};
	
	this.playnext = function(){
		// Clear out map squares
		Squares = [];
                
		// Delete remaining monsters
		for (var i=0; i<Monsters.length; i++){
			delete Monsters[i];
		}
		Monsters = [];
		
		// Reset Players & party table
		Players = [];
		$('#party tr.player_row').remove();
		$('#party').css('display', 'table');
		for (var i=0; i<Party.members.length; i++) {
			Party.members[i].HP = Party.members[i].maxHP;
			Party.members[i].movement = Party.members[i].maxMove;
			Party.members[i].readyItem = null;
                        //Party.members[i].readySpell = null;
                        //Party.members[i].readyWeapon = null;
			Party.members[i].dead = false;
			Party.members[i].paralyzed = 0;
			Party.members[i].slow = false;
			Party.members[i].medication = [];
			Players[i] = Party.members[i];
                        Players[i].updatetable(); // update ui
		}
		
		// Clear out the UI
		$('.m_grid').remove();
		$('#status').empty();
		$('#dialog').dialog('close');

		// Load the next adventure
		var curradv = Adventures[Party.levelcomplete];
		MapWorld = curradv.type;
		World.build();
	};
	
	this.endgame = function(wl, state){
            this.gameover = true;
	    this.resetUI();
	    if (state == "win") {
                // Update current adventure
                Party.levelcomplete += 1;
                Party.gold += this.Level.opts.gold;
				
                // Dialog content
                var dialogcontent = wl + $('#passcode_addon').html();
                if (Party.levelcomplete >= Adventures.length){
                        dialogcontent += "<p><b>You have completed all available adventures. Come back later for more\
                        or <a href='http://www.twitter.com/HuskyFerlin'>keep up with the feed</a> to see when another has been added. Thanks!</b></p>"
                }
                
                // Passcode addon should show next adventure, and not return to home screen
                Input.M_Dialog("standard", dialogcontent, this.Level.title, {
                    "Play on": function(){
                            //World.playnext();
							Input.M_Dialog('equip');
                    },
                    "Email passcode": function(){
                            $('.ui-dialog #emailpasscoderesponse').css('color', '#333');
                            $('.ui-dialog #emailpasscoderesponse').text('Attempting to send...');
                            $.ajax({
                                    url: 'email.php?passcode='+ $('.ui-dialog #passcode').text() +'&email='+$(".ui-dialog #emailpasscode").val() + '&adventure='+Adventures[Party.levelcomplete-1].title,
                                    type: 'POST',
                                    success: function(data){
                                            if (data != "Success") {
                                                    $('.ui-dialog #emailpasscoderesponse').css('color', 'red');
                                            } else {
                                                    $('.ui-dialog #emailpasscoderesponse').css('color', 'green');
                                            }
                                            
                                            $('.ui-dialog #emailpasscoderesponse').text(data);
                                    },
                                    error: function(){
                                            $('.ui-dialog #emailpasscoderesponse').css('color', 'red');
                                            $('.ui-dialog #emailpasscoderesponse').text('Unknown error. Sorry :(');
                                    }
                            })
                    }
                }, 375);
				
				// If last adventure, disable Play On
				if (Party.levelcomplete >= Adventures.length) {
					$(".ui-dialog-buttonpane button:contains('Play on')").button("disable");
				}
                
                // Get passcode
                Input.saveGame();	
            } else {
                Input.M_Dialog("standard", wl, this.Level.title, {
                    "Try again": function(){
                                    World.playnext();
                            }
                    }, 375);
            }
	};
	
	this.resetUI = function(){
            // Reset UI bits
            btnEndTurn.removeClass('blink')
                .button('disable');                
            btnOpenClose.button('disable');
            btnPickup.button('disable');
            
            /*btnSpell.removeClass('blink');
            SpellSet.find('.button').button('disable');
            Input.hideSpellMenu();*/
            
            Input.spellOn = false;
            Input.weaponOn = false;
            Input.itemOn = false;
            
            $('.m_grid').removeClass('zoom dogvision');

	    unbuildAllMenus();
		
            $('.p').removeClass('blink'); // remove any character blinks
	    $('.lit, .unlit').removeClass(allranges); // remove all spell ranges
	    monstersMoving.hide('fast');
	};
	
	this.endturn = function(){
		// Reset UI bits
		this.resetUI();
                
		// Save map lit/unlit for players
		if( World.activePlayer.ofType == "player" && World.activePlayer.dead == false ){
			World.activePlayer.map = "";
			$('.m_grid td').each(function(key, value){
				if($(this).hasClass('lit')){
				    World.activePlayer.map += "1";
				} else if ($(this).hasClass('visited')){
                                    World.activePlayer.map += "2";
                                } else { World.activePlayer.map += "0"; }
			});
		} else if ( World.activePlayer.ofType == "monster" && World.activePlayer.dead == false ){
                    // Attach tooltips
                    $('.' + World.activePlayer.ID).tooltip({
                            items: "div[class]",
                            position: {my: 'center top+10', at: 'center middle'},
                            content: World.activePlayer.name
                    });
                }
		
		// Check for Players/Monsters defeated & victory condition(s)
		switch(this.Level.victory.type){
			case "kill":
				for(var i=0; i<Dead.length; i++){
					if(this.Level.victory.value[0] == Dead[i].name)
					{
						this.endgame(World.Level.events.win, "win");
						break;
					}
				}
				break;
			default: break;
		}
		if(Monsters.length == 0 && this.gameover == false){
			this.endgame(this.Level.events.win, "win");
			return false;
		}
		if(Players.length == 0 && this.gameover == false){
			this.endgame(this.Level.events.lose, "lose");
			return false;
		}
		
		// If game not over, continue with next turn
		if(this.gameover == false){
			// Zero out unused moves for player
			MO_set(this.activePlayer, this.activePlayer.movement - this.activePlayer.currMove);
			
			// Get new active Character
			this.activePlayer = this.orderOfPlay[this.currentPlay];
			
			// Call before Monster move or get stuck in a loop FOREVER
			this.currentPlay++;
			if(this.currentPlay >= this.orderOfPlay.length) { this.currentPlay = 0; }
			
			// Remove tooltips; end turn if activePlayer dead - else check paralyzed
			if($('.' + this.activePlayer.ID).tooltip()){
				$('.' + this.activePlayer.ID).tooltip('destroy');
			}
			if (this.activePlayer.dead == true) {
				this.endturn();
				return false;
			} else if (this.activePlayer.paralyzed > 0){
				Statuss.update('<span>' + this.activePlayer.name + ' is paralyzed</span>');
				this.activePlayer.paralyzed--;
				this.endturn();
				return false;
			}
			
			// Need to skip over lost players or remove them from the queue upon .killed()
			if(this.activePlayer.ofType == "player"){
				// (Re)build the item menu
				//buildItemMenu();
				buildAllMenus();
									
				// If canine, add dogvision
				if(this.activePlayer.type == "wolfman"){
					$('.m_grid').addClass('dogvision');
				}
				
				// Show by-player fog of war
				$('.m_grid td').removeClass('lit visited')
					.addClass('unlit');
				if(this.activePlayer.map.length > 0){
					$('.m_grid td').each(function(key, value){
						if(World.activePlayer.map.charAt(key) != "0"){
							$(this).addClass('visited');
						}
					});
				}
				
				// Update line of sight / fog of war for doors, etc. that may have been opened
				getLineOfSight(this.activePlayer.coords);
				
				// Show who active player is
				$('.p.'+this.activePlayer.type).addClass('blink');
				
				// Indicate active player
				centerOn(this.activePlayer);
				
				// Turn off player move wait
				MO_reset(this.activePlayer);
				this.activePlayer.wait = false;
				
				// Activate "end turn" button
				btnEndTurn.button('enable');
				
				// Check for doors, items
				anyDoors(this.activePlayer.coords);
				anyItems(this.activePlayer.coords);
                                
                                // Check for keenness
                                this.activePlayer.checkKeenness();
				
				// Check for Wizard
				if(this.activePlayer.type == "wizard"){
					SpellSet.find('.button').button('enable');
				}
			} else if(this.activePlayer.ofType == "monster"){
				 this.activePlayer.doTurn();
			}
		}
	};
};
