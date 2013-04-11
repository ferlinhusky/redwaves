var Battle = function(att, def){
	this.doBattle = function(a1, d1){
		// Check each part of the body for a weapon
		for(var i=0; i < a1.wields.length; i++){
			if(a1.wields[i] != ""){
				var weapon = a1.wields[i];
				var tot_attks, wpn_dmg;
				
				if(weapon.supclass == "firearm"){
					tot_attks = 1; // only one attack with a weapon at close range
					wpn_dmg = weapon.dmg_cl; // get close range damageS
				} else {
					tot_attks = new Number(weapon.dmg.split('d')[0]);
					for(var j=0; j<a1.medication.length; j++){
					    switch(a1.medication[j].name){
						case "Mad dog": tot_attks += 1; break;
						case "Tron" : tot_attks += 2; break;
						default: break;
					    }
					}
					wpn_dmg = new Number(weapon.dmg.split('d')[1]);
				}
	
				// Attack for each die; e.g. 2d4
				for(var j=0; j<tot_attks; j++){
					// Is it a hit?
					var ishit;
					var roll = Math.ceil(Math.random() * (20+j)); // 1-(20+j)
	
					var ac = def.ac;
	
					var target = 10 + def.ac;
					if(target <= 0) { target = 1; }
					if(roll <= target){
						ishit = true;
					} else { ishit = false; }
	
					// If 0, attacker misses; otherwise update defender HP and status line
					if(!ishit) {
						status_line = a1.name + ' misses ' + d1.name + ' with ' + a1.gender.ppro + ' '  + weapon.name;
					} else {
						var dmg_red = 0; // damage reduction
						if(ac < 0){
							var tac = Math.ceil(Math.random() * Math.abs(ac));
							ac = -tac; // from -1 to neg ac value;
	
							var tdmg_red = Math.ceil(Math.random() * Math.abs(ac));
							dmg_red = -tdmg_red; // set damage reduction
						}
						// Get attack damage
						var att_dmg = (Math.floor(Math.random() * wpn_dmg)) + dmg_red;
						if(att_dmg <= 0) { att_dmg = 1; }
						HP_set(d1, -att_dmg);
						status_line = '<span class="red">' + a1.name + ' hits ' + d1.name + ' for ' + att_dmg + ' with ' + a1.gender.ppro + ' ' + weapon.name + '</span>';
					}
					Statuss.update(status_line);
				}
			}
		}
    };
	this.doSpellAttack = function(a1, d1){
	    var spell = a1.readySpell;
	    
	    // Get attack damage
	    var att_dmg = Math.floor(Math.random() * spell.dmg);
	    if(att_dmg <= 0) {
		    status_line = a1.name + ' misses ' + d1.name + ' with ' + a1.gender.ppro + ' ' + spell.name;
	    } else {
		    HP_set(d1, -att_dmg);
		    status_line = '<span class="red">' + a1.name + ' hits ' + d1.name + ' for ' + att_dmg + ' with ' + a1.gender.ppro + ' ' + spell.name + '</span>';
	    }
	    Statuss.update(status_line);
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
			
			if(input.spellOn == true){ // spell attack
				this.doSpellAttack(att, def);
			} else { this.doBattle(att, def); }
			
			// If defender killed
			if(def.HP <= 0){
				this.doKilled(att, def);
			} else if(!input.spellOn) {
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