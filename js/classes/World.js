// THE WORLD IS AN ENGINE
var World = function(){
	this.orderOfPlay = [];
	var currentPlay = 0;
	this.activePlayer;
	
	this.build = function(){
		// Build map
		this.Level = ( new Function('Map.init(new ' + MapWorld + '());') )();
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
		this.endturn(); // Start
	};
	
	this.endturn = function(){
		// Reset UI bits
		$('.p').removeClass('blink'); // remove any character blinks
		$('.lit, .unlit').removeClass('range'); // remove all spell ranges
		btnEndTurn.removeClass('blink'); input.spellOn = false;
		btnOpenClose.button('disable');
		btnSpell.removeClass('blink');
		SpellSet.find('.button').button('disable');
		monstersMoving.hide('fast');
		
		// Check for Players/Monsters defeated
		if(Players.length == 0){ alert("YOU LOSE! (refresh to restart for now)"); return false; } // temporary
		if(Monsters.length == 0){ alert("YOU WIN! (refresh to restart for now)"); return false; } // temporary

		// Zero out unused moves for player
		MO_set(me, me.movement - me.currMove);
		
		// Get new active Character
		this.activePlayer = this.orderOfPlay[currentPlay];
		
		// Call before Monster move or get stuck in a loop FOREVER
		currentPlay++;
		if(currentPlay >= this.orderOfPlay.length) { currentPlay = 0; }
		
		// Need to skip over lost players or remove them from the queue upon .killed()
		if(this.activePlayer.ofType == "player"){
			if (this.activePlayer.dead == true) {
				this.endturn();
			} else {
				$('.p.'+this.activePlayer.type).addClass('blink');
				me = this.activePlayer;
				// Indicate active player
				centerOn(me);
				// Turn off player move wait
				MO_reset(me);
				me.wait = false;
				// Activate "end turn" button
				btnEndTurn.button('enable');
				// Check for doors
				anyDoors(me.coords);
				// Check for Wizard
				if(me.type == "wizard"){ SpellSet.find('.button').button('enable'); }
			}
		} else if(this.activePlayer.ofType == "monster"){
			if (this.activePlayer.dead == true) {
				this.endturn();
			} else {
				centerOn(this.activePlayer);
				btnEndTurn.button('disable');
				this.activePlayer.doTurn();
			}
		}
	};
};