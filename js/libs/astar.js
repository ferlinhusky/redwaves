// javascript-astar
// http://github.com/bgrins/javascript-astar
// Freely distributable under the MIT License.
// Implements the astar search algorithm in javascript using a binary heap.

var astar = {
    init: function(grid) {
        for(var x = 0, xl = grid.length; x < xl; x++) {
			var node = grid[x];
			node.f = 0;
			node.g = 0;
			node.h = 0;
			node.cost = node.passable ? 0 : 1;
			node.visited = false;
			node.closed = false;
			node.parent = null;
		}
    },
    heap: function() {
        return new BinaryHeap(function(node) { 
            return node.f; 
        });
    },
    search: function(grid, start, end, diagonal, heuristic) {
        astar.init(grid);
        heuristic = heuristic || astar.manhattan;
        diagonal = !!diagonal;

        var openHeap = astar.heap();

        openHeap.push(start);

        while(openHeap.size() > 0) {

            // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
            var currentNode = openHeap.pop();

            // End case -- result has been found, return the traced path.
            if(currentNode === end) {
                var curr = currentNode;
                var ret = [];
                while(curr.parent) {
                    ret.push(curr);
                    curr = curr.parent;
                }
                return ret.reverse();
            }

            // Normal case -- move currentNode from open to closed, process each of its neighbors.
            currentNode.closed = true;

            // Find all neighbors for the current node. Optionally find diagonal neighbors as well (false by default).
            var neighbors = astar.neighbors(grid, currentNode, diagonal);

            for(var i=0, il = neighbors.length; i < il; i++) {
                var neighbor = neighbors[i];

                //if(neighbor.closed || neighbor.isWall()) {
		if(neighbor.closed || !neighbor.t.passable || neighbor.occupiedBy.ofType == "monster") {
                    // Not a valid node to process, skip to next neighbor.
		    // If the node is occupied by a "player", end the path and re-target
                    continue;
                }

                // The g score is the shortest distance from start to current node.
                // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
                var gScore = currentNode.g + neighbor.cost;
                var beenVisited = neighbor.visited;

                if(!beenVisited || gScore < neighbor.g) {

                    // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
                    neighbor.visited = true;
                    neighbor.parent = currentNode;
                    neighbor.h = neighbor.h || heuristic(neighbor, end);
                    neighbor.g = gScore;
                    neighbor.f = neighbor.g + neighbor.h;

                    if (!beenVisited) {
                        // Pushing to heap will put it in proper place based on the 'f' value.
                        openHeap.push(neighbor);
                    }
                    else {
                        // Already seen the node, but since it has been rescored we need to reorder it in the heap
                        openHeap.rescoreElement(neighbor);
                    }
                }
            }
        }

        // No result was found - empty array signifies failure to find path.
        return [];
    },
    manhattan: function(pos0, pos1) {
        // See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
        var d1 = Math.abs (pos1.x - pos0.x);
        var d2 = Math.abs (pos1.y - pos0.y);
        return d1 + d2;
    },
    neighbors: function(grid, node, diagonals) {
		var adjacent=[];
		var startX = node.x-1;
		var startY = node.y-1;
		var endX = node.x+1;
		var endY = node.y+1;
		
		if(diagonals){
			for(ax=startX; ax<=endX; ax++){
				for(ay=startY; ay<=endY; ay++){
					if(getMapSq([ax, ay]).length > 0){
						var s = getMapSq([ax, ay]);
						var sID = s.attr('data-sID');
						adjacent.push(Squares[sID]);
					}
				}
			}
		} else {
			var tempa = [];
			var a = getMapSq([node.x-1, node.y]); tempa.push(a);
			var b = getMapSq([node.x+1, node.y]); tempa.push(b);
			var c = getMapSq([node.x, node.y-1]); tempa.push(c);
			var d = getMapSq([node.x, node.y+1]); tempa.push(d);
			for(var i=0; i<4; i++){
				if(tempa[i].length > 0){
					var sID = tempa[i].attr('data-sID');
					adjacent.push(Squares[sID]);
				}
			}
		}
		return adjacent;
    }
};


