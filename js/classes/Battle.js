var Battle = function(att, def){
    this.doBattle = function(a1, d1){
	// Check each part of the body for a weapon
	for(var i=0; i < a1.wields.length; i++){
	    if(a1.wields[i] != ""){
		var weapon = a1.wields[i];
		var tot_attks = weapon.dmg.split('d')[0];
		
		// Attack for each die; e.g. 2d4
		for(var j=0; j<tot_attks; j++){
		    // Get attack damage
		    var att_dmg = Math.floor(Math.random() * weapon.dmg.split('d')[1]);
		
		    // If 0, attacker misses; otherwise update defender HP and status line
		    if(att_dmg == 0) {
			    status_line = a1.name + ' misses ' + d1.name + ' with ' + a1.gender.ppro + ' '  + weapon.name;
		    } else {
			    HP_set(d1, -att_dmg);
			    status_line = '<span class="red">' + a1.name + ' hits ' + d1.name + ' for ' + att_dmg + ' with ' + a1.gender.ppro + ' ' + weapon.name + '</span>';
		    }
		    Statuss.update(status_line);
		}
	    }
	}
    };
    this.doKilled = function(a1, d1){
	Statuss.update('<b class="red">' + a1.name + ' kills ' + d1.name + '!</b>');
	d1.killed();
    };
    this.init = function(){
		if(!def.dead){
			var status_line;
			
			findAndAdd(Squares[att.currentSquare].onMap, '.p', 'attacker');
			findAndAdd(Squares[def.currentSquare].onMap, '.p', 'defender');
			
			this.doBattle(att, def);
			
			// If defender killed
			if(def.HP <= 0){
				this.doKilled(att, def);
			} else {
				// else do counterattack
				this.doBattle(def, att);
				
				// If attacker killed
				if(att.HP <= 0){
					this.doKilled(def, att);
				}
			}
			
			setTimeout(function(){ $('.p').removeClass('attacker defender') }, 250);
		}
        delete this;
    };
	
	// Init
    this.init();
};