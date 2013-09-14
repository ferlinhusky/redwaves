var Map = function(){
	// m-> map
	this.init = function(m){
		activeMap = m;
		m.id = 0;
		m.squares = [];
		var startPoints = [];
		
		// Generate map
		setIdent(m.id);
		m.mapGrid = newGrid();
		mapContainer.append(m.mapGrid);
		m.mg = getGrid();
		
		// Get Map
		$.ajax({
			url: 'maps/'+m.map,
			dataType: 'script',
			success: function(data){
				m.height = m.opts.height;
				m.width = m.opts.width;
				
				// Generate Squares+Terrain
				for (i=0; i<m.opts.height; i++) {
					m.mg.append(newRow(i));
					var row = getRow(i);
					for (j=0; j<m.opts.width; j++) {
						var n = new Square([j, i]);
						m.squares.push(n);
						n.addToRow(row, false, map_ascii.charAt(n.id));
						if(map_ascii.charAt(n.id) == "^"){
							startPoints.push([j,i]);
						}
					}
				}
				
				// Add players
				for(var i=0; i<Players.length; i++){
					p = Players[i];
					p.currentSquare = getSquare(startPoints[i]).id;
					p.locIt(Players[i].currentSquare, p.previousSquare, true);
				}
				
				// Add monsters			
				$.each(m.opts.monsters, function(key, value){
					var spliton = key.lastIndexOf("_");
					key_fmt = key.substr(0, spliton);
					mon = ( new Function('var m = new ' + key_fmt + '(); return m;') )();
					mon.locIt(getSquare(value).id);
					// Attach tooltips
					$('.' + mon.ID).tooltip({
						items: "div[class]",
						position: {my: 'center top+10', at: 'center middle'},
						content: mon.name
					});
				});
				
				// Add NPCs			
				$.each(m.opts.npcs, function(key, value){
					var spliton = key.lastIndexOf("_");
					key_fmt = key.substr(0, spliton);
					npc = ( new Function('var m = new ' + key_fmt + '(); return m;') )();
					npc.locIt(getSquare(value).id);
					// Attach tooltips
					$('.' + npc.ID).tooltip({
						items: "div[class]",
						position: {my: 'center top+10', at: 'center middle'},
						content: npc.name
					});
				});
				
				// Add items			
				$.each(m.opts.items, function(key, value){
					var spliton = key.lastIndexOf("_");
					key_fmt = key.substr(0, spliton);
					item = ( new Function('var i = new ' + key_fmt + '(); return i;') )();
					
					// Update square
					var curr = getSquare(value).id;
					Squares[curr].contains = true;
					Squares[curr].containsA.push(item);
					
					// Get item position
					var current = Squares[curr].onMap;
					
					// Add item to current square
					findAndAdd(current, '.p', 'item ' + item.ofType);
				});
				
				// Add actions
				for(var i=0; i < m.actsq.length; i++){
					var asq = m.actsq[i];
					var sq = getSquare(asq.s);
					sq.action = asq.a;
				}
				
				// Center map
				centerOn(Players[0]);
				Input.mapTouchDrag(m.mg);
				m.mg.draggable({
					cursor: 'move'
				});
				
				// Sort out play order
				World.doorderofplay();
			}
		});
	};
};
