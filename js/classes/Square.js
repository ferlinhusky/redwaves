var Squares = [];
var Square = function(loc){
	// Position and contents
	this.loc = loc;
	this.active = false;
	this.x = this.loc[0];
	this.y = this.loc[1];
	this.id = Squares.length;
	this.b;	this.t; this.i; this.p;
	
	// In-map
	this.passable;
	this.cthru;
	this.isFeature = false;
	this.occupied;
	this.occupiedBy = {};
	this.occupiedBy.ofType = "";
	this.contains;
	this.containsA = {};
	this.containsA.ofType = "";
	
	// Methods
	this.setContents = function(sym){
		// Terrain
		switch (sym) {
			case "." : this.t = Floor; break;
			case "|" : this.t = Wall; break;
			case "_" : this.t = Wall; break;
			case "+" : this.t = ClosedDoor; break;
			case "-" : this.t = OpenDoor; break;
			case "^" : this.t = Start; break;
			case "~" : this.t = River; break;
			case ";" : this.t = Grass; break;
			case "," : this.t = Dirt; break;
			default : this.t = Floor; break;
		}
		this.passable = this.t.passable;
		this.cthru = this.t.cthru;
		
		this.onMap.addClass(this.t.type);
		
		this.onMap.bind('click', function(e){
			e.preventDefault();
			Input.squareClick(e);
		}).bind('touchend', function(e){
			e.preventDefault();
			if(Input.preventSquareClick == false){
				Input.doMapClick(e);
			}
		});
	};
	
	this.lookAround = function(r){
		var adjacent=[];
		var startX = this.x-r;
		var startY = this.y-r;
		var endX = this.x+r;
		var endY = this.y+r;
		
		for(ax=startX; ax<=endX; ax++){
			for(ay=startY; ay<=endY; ay++){
				if(getMapSq([ax, ay]).length > 0){
					var s = getMapSq([ax, ay]);
					var sID = s.attr('data-sID');
					adjacent.push(Squares[sID]);
				}
				else{
					adjacent.push('');
				}
			}
		}
		return adjacent;
	};
	this.addToRow = function(row, prepend, sym){
		var cellTemplate = '<td id="c_'+this.x+'_'+this.y+'_'+ident+'" data-sID="'+this.id+'"></td>';
		this.hasBuilding = false;
		prepend ? row.prepend(cellTemplate) : row.append(cellTemplate)
		this.onMap = getMapSq([this.x, this.y]);
		this.onMap.append(SquareTemplate);
		this.onMap.addClass('unlit');
		//this.onMap.addClass('lit');
		this.setContents(sym);
		this.active = true;
	};
	this.whatsHere = function(){
		var s = "<div class='whatshere'>";
		if(this.b != undefined){
			var wb = this.b.type;
				wb = wb.replace('_', ' ');
			s += "<b>Location</b> " + wb + "<br/>";
		}
		var wt = this.t.type;
			wt = wt.replace('_', ' ');
		s += "<b>Terrain</b> " + wt + "<br/>";
		s += "</div>";
		statuss.show(s);
	};
	Squares.push(this);
}
