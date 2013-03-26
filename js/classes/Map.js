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
					p.locIt(Players[i].currentSquare, p.previousSquare);
				}
				
				// Center map
				centerOn(Players[0]);
				input.mapTouchDrag(m.mg);
				m.mg.draggable({
					cursor: 'move'
				});
				
				// Add monsters			
				$.each(m.opts.monsters, function(key, value){
					key_fmt = key.substr(0, key.length-2);
					mon = ( new Function('var m = new ' + key_fmt + '(); return m;') )();
					mon.locIt(getSquare(value).id);
				});
				
				// Sort out play order
				World.doorderofplay();
			}
		});
	};
	/*
		// m-> map
		this.saveMe = function(m){
			m.mg.draggable( "option", "disabled", true );
			m.lastPrev = me.previousSquare;
			m.mapCoords = me.coords;
			m.lastID = getSquare(me.coords).id;// + '_' + m.group.length;
			m.mapHTML = m.mg.html();
			m.mg.remove();
		};
		// m-> map, e-> entering or exiting
		this.loadMe = function(m, e){
			activeMap = m;
			// Set background color to match terrain
			mapContainerCell.removeClass();
			mapContainerCell.addClass(m.terr);
			// Place player back on map
			me.location = m;
			// Set current map identity
			setIdent(m.id);
			// Clear out the map container, add map grid back in
			m.mapGrid = newGrid();
			mapContainer.append(m.mapGrid);
			m.mg = getGrid();
			m.mg.append(m.mapHTML);
			// Rebind squares to html
			rebindSquares();
			if(e == "enter"){
				// Set player location
				var startX = 0;
				var startY = 0;
				var dir = me.lastDir;
				switch (dir) {
					case "up" :
						startX = Math.floor(m.startCols/2);
						startY = m.startRows-1;
						break;
					case "down" : 
						startX = Math.floor(m.startCols/2);
						break;
					case "left" : 
						startX = m.startCols-1;
						startY = Math.floor(m.startRows/2);
						break;
					case "right" : 
						startY = Math.floor(m.startRows/2);
						break;
				}
				me.coords = [startX, startY];
			}
			else {
				me.coords = m.mapCoords;
			}
			
			me.currentSquare = getSquare(me.coords).id;
			me.locIt(me.currentSquare, m.lastPrev);
			
			// Center the map
			centerOn(me);
			input.mapTouchDrag(m.mg);
			m.mg.draggable({
				cursor: 'move',
				disabled: false
			});
		};
	*/
};
