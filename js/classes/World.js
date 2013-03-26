// THE WORLD IS AN ENGINE
var World = function(){
	var orderOfPlay = [];
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
				orderOfPlay.push(Players[i]);
			}
			if(Monsters[i] != undefined){
				orderOfPlay.push(Monsters[i]);
			}
		}
		this.endturn(); // Start
	};
	
	this.endturn = function(){
		$('.p').removeClass('blink');
		btnEndTurn.removeClass('blink');
		btnOpenClose.button('disable');
		monstersMoving.hide('fast');
		if(Players.length == 0){ alert("YOU LOSE! (refresh to restart for now)"); return false; } // temporary
		if(Monsters.length == 0){ alert("YOU WIN! (refresh to restart for now)"); return false; } // temporary
		/*if(Monsters.length == 0) {
			alert("All monsters defeated"); // do end game stuff here
		} else {*/
			// Zero out unused moves for player
			MO_set(me, me.movement - me.currMove);
			
			// Get new active player
			this.activePlayer = orderOfPlay[currentPlay];
			
			// Call before Monster move or get stuck in a loop
			currentPlay++;
			if(currentPlay >= orderOfPlay.length) { currentPlay = 0; }
			
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
		//}
	};
};