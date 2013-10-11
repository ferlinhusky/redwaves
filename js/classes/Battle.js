var Battle = function(att, def){
	this.success;
	this.doBattle = function(a1, d1){
		// If a player hidden to the user is attacked, show player's position
		if(def.ofType == "player" && def.map.length > 0){
			$('.m_grid td').each(function(key, value){
				$(this).removeClass('lit');
				
				if(def.map.charAt(key)=="1"){
					$(this).addClass('lit');
				}
			});
		}
					
		// Check each part of the body for a weapon
		var weapon = a1.readyWeapon;
		var tot_attks, wpn_dmg;
		
		if(weapon.supclass == "firearm"){
			tot_attks = 1; // only one attack with a weapon at close range
			wpn_dmg = new Number(weapon.dmg_cl.split('d')[1]);; // get close range damage
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
		
		// Check martial arts
		if(weapon.type == "hands"){
		    if(a1.hasSkill('martialarts1')) { wpn_dmg += 1; }
		    if(a1.hasSkill('martialarts2')) { wpn_dmg += 2; }
		    if(a1.hasSkill('martialarts3')) { wpn_dmg += 3; }
		}

		// Attack for each die; e.g. 2d4
		for(var j=0; j<tot_attks; j++){
			// Is it a hit?
			var ishit;
			var roll = Math.floor(Math.random()*20) + 1; // 1-20

			var ac = def.ac;
			
			var tohit = a1.thac0[a1.level];
			
			// STR mod
			if (a1.attributes[0].name == "STR") {
				tohit -= a1.STR.mod()/2;
			}
			
			// Check for swordsmanship
			if(a1.hasSkill('swordsmanship') && weapon.supclass == "sword"){
			    tohit -= 2;
			}
			
			// implement thac0			
    			var target = tohit - def.ac;
						
			if(roll >= target){
			    ishit = true;
			} else { ishit = false; }
			
			// 1 always misses, 20 always hits
			if(roll == 1) { ishit = false; }
			if(roll == 20) { ishit = true; }

			// If 0, attacker misses; otherwise update defender HP and status line
			if(!ishit) {
				status_line = a1.name + ' misses ' + d1.name + ' with ' + a1.gender.poss + ' '  + weapon.name;
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
				
				// Add STR mod
				if (a1.attributes[0].name == "STR") {
					att_dmg += Math.floor(a1.STR.mod()/2);
				}
				
				// Check for swordsmanship
				if(a1.hasSkill('swordsmanship') && weapon.supclass == "sword"){
				    att_dmg += 2;
				}
				
				// Check for paralyze attack
				if(a1.hasSkill('paralyze')){
					var paralyze_turns = (Math.floor(Math.random() * 2));
					var more_txt;
					if(d1.paralyzed > 0) { more_txt = " more "; } else { more_txt = " "; }
					d1.paralyzed += paralyze_turns;
					if(paralyze_turns > 0){
						var turn_txt;
						if(paralyze_turns == 1) { turn_txt = "turn"; } else { turn_txt = "turns"; }
						status_line = '<span class="red">' + a1.name + '\'s attack paralyzes ' + d1.name + ' for ' + paralyze_turns + more_txt + turn_txt +'</span>';
						Statuss.update(status_line);
					}
				}
				
				// Check for heroism skill; double dmg on attack, half dmg when defending against boss monster
				if(World.Level.victory.type == "kill"){
					if(World.Level.victory.value[0] == d1.name && a1.hasSkill('heroism')){
						att_dmg *= 2;
					} else if (World.Level.victory.value[0] == a1.name && d1.hasSkill('heroism')){
						var temp_att_dmg = att_dmg;
						att_dmg = Math.floor(temp_att_dmg/2);
					}
				}
				if(att_dmg <= 1) { att_dmg = 1; }
				HP_set(d1, -att_dmg);
				status_line = '<span class="red">' + a1.name + ' hits ' + d1.name + ' for ' + att_dmg + ' with ' + a1.gender.poss + ' ' + weapon.name + '</span>';
			}
			Statuss.update(status_line);
		}
    };
	this.doRangedAttack = function(a1, d1, type){
	    var item;
	    
	    switch(type){
		case "weapon": item = a1.readyWeapon; break;
		case "spell": item = a1.readySpell; break;
		default: break;
	    }
	    
	    // Get attack damage
	    var item_dmg = new Number(item.dmg.split('d')[1]);
	    var att_dmg = Math.floor(Math.random() * item_dmg);
	    
	    // Check for marksmanship; -3 dmg if not marksman
	    if(type == "weapon" && !a1.hasSkill('marksmanship')){
			att_dmg -= 3;
	    }
	    
	    // Settle attack
	    if(att_dmg <= 0) {
		    status_line = a1.name + ' misses ' + d1.name + ' with ' + a1.gender.poss + ' ' + item.name;
	    } else {
		    // Check for necromancy; half spell damage to defender w/ it
		    if(type == "spell" && d1.hasSkill('necromancy')){
			    var temp_att_dmg = att_dmg;
			    att_dmg = Math.floor(temp_att_dmg/2);
		    }
		    HP_set(d1, -att_dmg);
		    status_line = '<span class="red">' + a1.name + ' hits ' + d1.name + ' for ' + att_dmg + ' with ' + a1.gender.poss + ' ' + item.name + '</span>';
	    }
	    Statuss.update(status_line);
	};
    this.doKilled = function(a1, d1){
		Statuss.update('<b class="red">' + a1.name + ' kills ' + d1.name + '!</b>');
		d1.killed();
    };
	this.initBattle = function(){
		this.success = true;
		var status_line;
			
		findAndAdd(Squares[att.currentSquare].onMap, '.p', 'attacker');
		findAndAdd(Squares[def.currentSquare].onMap, '.p', 'defender');
		
		if(Input.spellOn == true){ // spell attack
			this.doRangedAttack(att, def, "spell");
		} else if (Input.weaponOn == true){
			this.doRangedAttack(att, def, "weapon");
		} else { this.doBattle(att, def); }
		
		// If defender killed
		if(def.HP <= 0){
			this.doKilled(att, def);
		} else if(def.paralyzed > 0){
			// ...else if defender paralyzed
			status_line = '<span class="red">' + def.name + ' is powerless to counterattack!</span>';
			Statuss.update(status_line);
		} else if(Input.spellOn != true && Input.weaponOn != true) {
			// else if not a ranged attack, do counterattack
			this.doBattle(def, att);
			
			// If attacker killed
			if(att.HP <= 0){
				this.doKilled(def, att);
			}
		}
		
		setTimeout(function(){ $('.p').removeClass('attacker defender') }, 250);
	};
    this.init = function(){
		if(!def.dead){
			if (def.ofType == "npc" && att.ofType == "player") {
				if (def.killconfirm == 0) {
					Statuss.update("Really attack " + def.name + "?");
					def.killconfirm = 1;
					this.success = false;
				} else {
					this.initBattle();
				}
			} else {
				this.initBattle();
			}
		}
        delete this;
    };
	
	// Init
    this.init();
};