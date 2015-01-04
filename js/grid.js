function Grid(size, gameContainer) {
	this.size = size;
	this.totalTiles = size * size;
	this.gameContainer = gameContainer;
	this.isWhitesTurn = true;
	this.numPlayed = 0;
	this.grid = [];
}

Grid.prototype.initBoard = function() {
	this.grid = [];

	for (var x = 0; x < this.size; x++) {
		var row = this.grid[x] = [];

		for (var y = 0; y < this.size; y++) {
			var color = null;

			//create center pieces
			if ((x == 3 && y == 3) || (x == 4 && y == 4)) {
				color = "white";
			}
			if ((x == 4 && y == 3) || (x == 3 && y == 4)) {
				color = "black";
			}
			this.numPlayed = 4;

			var tile = new Tile(new PIXI.Sprite.fromImage("images/white_tile.jpg"), x, y, color);
			// add the tile
			this.gameContainer.addChild(tile.sprite);
			tile.sprite.mousedown = tile.sprite.touchstart = this.makeMove.bind(this, x, y);

		  	row.push(tile);
		}
	}

	this.setTurnColor("white");
}


Grid.prototype.makeMove = function(x, y){
	var tile = this.grid[x][y];

	//if the tile is already used
	if (tile.color != null) {
		tile.noFlipAnimate();
		return;
	}

	var currPlayerColor = this.isWhitesTurn ? "white": "black";

	//find a Array of tiles that needs to be flipped
	var allAlteredTiles = this.findAlteredTiles(tile, currPlayerColor);
	if (allAlteredTiles.length <= 1) {
		tile.noFlipAnimate();
	} else {
		this.isWhitesTurn = !this.isWhitesTurn;
		this.setTurnColor(this.isWhitesTurn ? "white": "black");
		this.numPlayed += 1;

		//flip all pieces
		for (var i = 0; i < allAlteredTiles.length; i++) {
			allAlteredTiles[i].flip(currPlayerColor);
		}

		//TODO: Add animations. Detect winning conditions
		if (this.numPlayed == 8) {
			document.getElementById("whiteIndicator").style.visibility = 'visible';
			document.getElementById("blackIndicator").style.visibility = 'visible';
			if (this.numColor("white") >= this.numColor("black")) {
				document.getElementById("crown1").style.visibility = 'visible';
			}
			if (this.numColor("black") >= this.numColor("white")){
				document.getElementById("crown2").style.visibility = 'visible';
			}
		}
	}
}


Grid.prototype.findAlteredTiles = function(tile, currPlayerColor) {
	var tiles = [];
	tiles.push(tile); //add the tile itself

	//For all 8 directions, find the tiles that needs to be flipped
	for (var i = -1; i <= 1; i++) {
		for (var j = -1; j <= 1; j++) {
			if (i != 0 || j != 0) {
				//add the tiles that need to be flipped for a particular direction
				tiles.push.apply(tiles, this.findTilesByDir(tile, currPlayerColor, i, j)); //i and j represent direction
			}
		}
	}

	return tiles;

}

//finds the tiles that needs to be flipped for a certain direction
Grid.prototype.findTilesByDir = function(tile, currPlayerColor, dirX, dirY) {
	var tiles = [];
	var currRow = tile.row + dirX;
	var currCol = tile.col + dirY;
	while (this.inBounds(currRow, currCol)) {
		if (!this.grid[currRow][currCol].color) break;
		if (this.grid[currRow][currCol].color === currPlayerColor) {
			return tiles;
		}
		//otherwise it is a opposite colored tile. push it to the array
		tiles.push(this.grid[currRow][currCol]);
		currRow += dirX;
		currCol += dirY;
	}

	//no tiles can be flipped in this direction
	return [];
}

Grid.prototype.inBounds = function(x, y) {
	return (x >= 0 && y >= 0 && x < this.size && y < this.size);
}

//return current amount of tiles that are colored white or black
Grid.prototype.numColor = function(color){
	var res = 0;
	for (var i = 0; i < this.size; i++) {
		for (var j = 0; j < this.size; j++) {
			if (this.grid[i][j].color == color) res += 1;
		}
	}
	return res;
}

Grid.prototype.setTurnColor = function(color) {
	var wt = document.getElementById("whiteIndicator");
	var bt = document.getElementById("blackIndicator");

	if (color == "white") {
		wt.style.visibility = 'visible';
		bt.style.visibility = 'hidden';
	} else if (color == "black") {
		bt.style.visibility = 'visible';
		wt.style.visibility = 'hidden';
	}
}