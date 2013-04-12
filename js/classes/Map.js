var Map = function(){
	// m-> map
	this.init = function(m){
		activeMap = m;
		m.id = 0;
		m.squares = [];
		var startPoints = [];
		me.location = m;
		
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
							//me.coords = [j,i];
							startPoints.push([j,i]);
						}
					}
				}
				
				// Place player
				for(var i=0; i<Players.length; i++){
					p = Players[i];
					p.currentSquare = getSquare(startPoints[i]).id;
					p.locIt(Players[i].currentSquare, p.previousSquare, true);
				}
				
				// Center map
				centerOn(Players[0]);
				input.mapTouchDrag(m.mg);
				m.mg.draggable({
					cursor: 'move'
				});
				
				// Add monsters			
				$.each(m.opts.monsters, function(key, value){
					var spliton = key.lastIndexOf("_");
					key_fmt = key.substr(0, spliton);
					mon = ( new Function('var m = new ' + key_fmt + '(); return m;') )();
					mon.locIt(getSquare(value).id);
				});
				
				// Sort out play order
				World.doorderofplay();
			}
		});
	};
};
