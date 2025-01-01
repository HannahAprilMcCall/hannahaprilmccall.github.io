var Othello = new p5(function(p) {
  var canvasWidth = 360;
  var canvasHeight = 360;
  var gridCellsAcross = 10; // must be even
  var pieceColour = [];
  var currentPlayer = 1;
  var turnP;
  var blackScoreP;
  var blackScore = 0;
  var whiteScore = 0;

  setup = function() 
  {
    turnP = p.createP();
    turnP.parent("p5project1");
    turnP.id("turn-paragraph");
    turnP.html("Black's turn");
    
    blackScoreP = p.createP();
    blackScoreP.parent("p5project1");
    blackScoreP.id("blackScore-paragraph");
    blackScoreP.html("Black: 2");
    
    whiteScoreP = p.createP();
    whiteScoreP.parent("p5project1");
    whiteScoreP.id("whiteScore-paragraph");
    whiteScoreP.html("White: 2");
    
    let canvas = p.createCanvas(canvasWidth, canvasHeight);
    canvas.parent("p5project1");
    
    var centralSquares = [
      [gridCellsAcross/2      ,gridCellsAcross/2    ],
      [gridCellsAcross/2 + 1  ,gridCellsAcross/2    ],
      [gridCellsAcross/2 + 1  ,gridCellsAcross/2 + 1],
      [gridCellsAcross/2      ,gridCellsAcross/2 + 1]
    ];
    
    // track cell colours
    for (let i = 0; i < gridCellsAcross; i++){  
      pieceColour[i] = [];
      for (let j = 0; j < gridCellsAcross; j++){
        // white pieces setup
        if (i == gridCellsAcross/2 - 1 && j == gridCellsAcross/2 - 1){
          pieceColour[i][j] = 1;
        }else if (i == gridCellsAcross/2 && j == gridCellsAcross/2){
          pieceColour[i][j] = 1;
        }else if (i == gridCellsAcross/2 && j == gridCellsAcross/2 - 1){
          pieceColour[i][j] = -1;
        }else if (i == gridCellsAcross/2 - 1 && j == gridCellsAcross/2){
          pieceColour[i][j] = -1;
        }else{
          // all other pieces are invisible
          pieceColour[i][j] = 0;
        }
      }
    }
  }

  p.draw = function() 
  {
    p.background([0,92,35]);
    
    // draw grid
    var gridSpacing = canvasWidth / gridCellsAcross;
    for (let i = 0; i < gridCellsAcross; i++){   
      for (let j = 0; j < gridCellsAcross; j++){
        drawGridCell(i ,j, gridSpacing);
        drawPiece(i,j, gridSpacing);
      }
    }
  }


  function drawGridCell(i,j, gridSpacing)
  {
    var x = gridSpacing * i;
    var y = gridSpacing * j;
    
    p.noStroke();
    p.fill([0,75,29])
    p.beginShape();
    p.vertex(x + gridSpacing * 0.1, y + gridSpacing * 0.1);
    p.vertex(x + gridSpacing * 0.9, y + gridSpacing * 0.1);
    p.vertex(x + gridSpacing * 0.9, y + gridSpacing * 0.9);
    p.vertex(x + gridSpacing * 0.8, y + gridSpacing * 0.8);
    p.vertex(x + gridSpacing * 0.8, y + gridSpacing * 0.2);
    p.vertex(x + gridSpacing * 0.2, y + gridSpacing * 0.2);
    p.endShape(CLOSE);
    
    p.noStroke();
    p.fill([0,110,42])
    p.beginShape();
    p.vertex(x + gridSpacing * 0.1, y + gridSpacing * 0.1);
    p.vertex(x + gridSpacing * 0.2, y + gridSpacing * 0.2);
    p.vertex(x + gridSpacing * 0.2, y + gridSpacing * 0.8);
    p.vertex(x + gridSpacing * 0.8, y + gridSpacing * 0.8);
    p.vertex(x + gridSpacing * 0.9, y + gridSpacing * 0.9);
    p.vertex(x + gridSpacing * 0.1, y + gridSpacing * 0.9);
    p.endShape(CLOSE);
    
  }

  function drawPiece(i,j, gridSpacing)
  {
    var x = gridSpacing * i;
    var y = gridSpacing * j;
    var circleShift = (canvasWidth / gridCellsAcross) / 2;
    
    if (pieceColour[i][j] == 1){
      p.fill(255,255,255,255);
    }else if (pieceColour[i][j] == -1){
      p.fill(0,0,0,255);
    }else{
      p.fill(0,0,0,0);
    }
    
    //stroke(0,0,0);
    //strokeWeight(4);
    p.ellipse(x + circleShift, y + circleShift, (canvasWidth / gridCellsAcross) * 0.625);
  }

  p.mousePressed = function() {

    var gridSpacing = canvasWidth / gridCellsAcross;
    var i = p.floor(p.mouseX / gridSpacing);
    var j = p.floor(p.mouseY / gridSpacing);
    
    if (checkValidMove(i, j, currentPlayer)) {
      if (currentPlayer == 1) {
        if (pieceColour[i][j] != -1) {
          pieceColour[i][j] = -1;
          flipPieces(i, j, -1);
          currentPlayer = -1;
          turnP.html("White's turn");
        } else {
          console.log("Illegal move");
        }
      } else {
        if (pieceColour[i][j] != 1) {
          pieceColour[i][j] = 1;
          flipPieces(i, j, 1);
          currentPlayer = 1;
          turnP.html("Black's turn");
        } else {
          console.log("Illegal move");
        }
      }
    }
    //console.log([i,j]);
    
    var scores = scoreCount();
    //console.log("black: " +  + ", white: " + scores[1])
    
    blackScoreP.html("Black: " + scores[0]);
    whiteScoreP.html("White: " + scores[1]);
    
    if (scores[0] + scores[1] == gridCellsAcross * gridCellsAcross){
      if (scores[0] > scores[1]) {
        turnP.html("Black Wins");
      }else{
        turnP.html("White Wins");
      }
    }
  }

  function checkValidMove(xPos, yPos, currentPlayer) 
  {
    var i = xPos;
    var j = yPos;
    var player = currentPlayer * -1;

    // define the bounds of the loop
    var iMin = max(0, i - 1);
    var jMin = max(0, j - 1);
    var iMax = min(gridCellsAcross - 1, i + 1);
    var jMax = min(gridCellsAcross - 1, j + 1);

      if (abs(pieceColour[i][j]) != 0){
      return false;
    }else{
      // loop over the neighborhood of the cell
      for (var ii = iMin; ii <= iMax; ii++) {
        for (var jj = jMin; jj <= jMax; jj++) {
          // ignore the cell itself
          if (ii != i || jj != j) {
            if (abs(pieceColour[ii][jj]) == 1) {
              //console.log("piece adjacent");
              
              if (wouldFlip(i, j, player)){
                return true;
              }
            }
          }
        }
      }
      //console.log("illegal move");
      return false;
    }
  }

  function wouldFlip(i, j, currentPlayer) {
    // Define all 8 directions
    var directions = [
      [-1, -1], [0, -1], [1, -1],
      [-1,  0],          [1,  0],
      [-1,  1], [0, 1], [1, 1]
    ];

    // Define the opponent
    var opponent = currentPlayer == 1 ? -1 : 1;

    // Initialize a counter to track flipped pieces
    var flipped = 0;

    // For each direction
    for (var d = 0; d < directions.length; d++) {
      var x = i;
      var y = j;
      var dx = directions[d][0];
      var dy = directions[d][1];

      var flip = [];  // Potential pieces to be flipped
      
      // Travel in this direction as long as you stay within the board
      while (x + dx >= 0 && x + dx < gridCellsAcross && y + dy >= 0 && y + dy < gridCellsAcross) {
        x += dx;
        y += dy;

        // If you find a piece of the opponent's color, add it to the flip list
        if (pieceColour[x][y] == opponent) {
          flip.push([x, y]);
        }
        // If you find a piece of the player's color
        else if (pieceColour[x][y] == currentPlayer) {
          // Add the length of flip list to the flipped counter
          flipped += flip.length;
          break;
        }
        // If you find no piece, stop
        else {
          break;
        }
      }
    }
    
    // If no pieces would be flipped, return false
    if (flipped == 0){
      return false;
    }

    // Some pieces would be flipped, so the move is valid
    return true;
  }

  function flipPieces(i, j, currentPlayer) {
    // Define all 8 directions
    var directions = [
      [-1, -1], [0, -1], [1, -1],
      [-1,  0],          [1,  0],
      [-1,  1], [0, 1],  [1,  1]
    ];

    // Define the opponent
    var opponent = currentPlayer == 1 ? -1 : 1;

    // For each direction
    for (var d = 0; d < directions.length; d++) {
      var x = i;
      var y = j;
      var dx = directions[d][0];
      var dy = directions[d][1];

      var flip = [];  // Pieces to be flipped
      
      // Travel in this direction as long as you stay within the board
      while (x + dx >= 0 && x + dx < gridCellsAcross && y + dy >= 0 && y + dy < gridCellsAcross) {
        x += dx;
        y += dy;

        // If you find a piece of the opponent's color, add it to the flip list
        if (pieceColour[x][y] == opponent) {
          flip.push([x, y]);
        }
        // If you find a piece of the player's color
        else if (pieceColour[x][y] == currentPlayer) {
          // Flip all pieces in the flip list
          for (var f = 0; f < flip.length; f++) {
            pieceColour[flip[f][0]][flip[f][1]] = currentPlayer;
          }
          break;
        }
        // If you find no piece, stop
        else {
          break;
        }
      }
    }
  }

  function scoreCount()
  {  
    blackScore = 0;
    whiteScore = 0;
    
    for (let i = 0; i < gridCellsAcross; i++){   
      for (let j = 0; j < gridCellsAcross; j++){
        if (pieceColour[i][j] === -1){
          blackScore += 1;
        }
        if (pieceColour[i][j] === 1){
          whiteScore += 1;
        }
      }
    }
    return [blackScore, whiteScore];
  }

  function bot(player)
  {
    var possibleMoves = [];
    
    for (let i = 0; i < gridCellsAcross; i++){   
      for (let j = 0; j < gridCellsAcross; j++){
        if (checkValidMove(i, j, currentPlayer) === true){
          possibleMoves.push([i,j]);
        }
      }
    }
    
    // for debug
    for (k = 0; k <possibleMoves.length; k++){
      console.log(possibleMoves.length + " possible moves")
    }
  }

})


