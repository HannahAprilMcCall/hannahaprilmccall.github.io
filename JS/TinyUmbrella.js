var TinyUmbrella = new p5(function(p) {

    let umbrella;
    let droplet;
    let splash;
    let splash1;
    let splash2;
    let splash3;
    let splash4;
    let bg1;
    let bg2;
    let bg3;
    let bg4;
    let bg5;
    let hand;
    let face;
    let water1;
    let water2;
    let water3;
    let water4;
    let water5;
    let shantellBold;
    let shantellMed;

    p.preload = function(){
    umbrella = p.loadImage("../JS/TinyUmbrellaAssets/umbrella.png");
    droplet = p.loadImage("../JS/TinyUmbrellaAssets/droplet.png");
    splash = p.loadImage("../JS/TinyUmbrellaAssets/splash.png");
    splash1 = p.loadImage("../JS/TinyUmbrellaAssets/splash_1.png");
    splash2 = p.loadImage("../JS/TinyUmbrellaAssets/splash_2.png");
    splash3 = p.loadImage("../JS/TinyUmbrellaAssets/splash_3.png");
    splash4 = p.loadImage("../JS/TinyUmbrellaAssets/splash_4.png");
    bg1 = p.loadImage("../JS/TinyUmbrellaAssets/BG_1.png");
    bg2 = p.loadImage("../JS/TinyUmbrellaAssets/BG_2.png");
    bg3 = p.loadImage("../JS/TinyUmbrellaAssets/BG_3.png");
    bg4 = p.loadImage("../JS/TinyUmbrellaAssets/BG_4.png");
    bg5 = p.loadImage("../JS/TinyUmbrellaAssets/BG_5.png");
    hand = p.loadImage("../JS/TinyUmbrellaAssets/hand.png");
    face = p.loadImage("../JS/TinyUmbrellaAssets/Face.png");
    water1 = p.loadImage("../JS/TinyUmbrellaAssets/water_1.png");
    water2 = p.loadImage("../JS/TinyUmbrellaAssets/water_2.png");
    water3 = p.loadImage("../JS/TinyUmbrellaAssets/water_3.png");
    water4 = p.loadImage("../JS/TinyUmbrellaAssets/water_4.png");
    water5 = p.loadImage("../JS/TinyUmbrellaAssets/water_5.png");
    shantellBold = p.loadFont("../JS/TinyUmbrellaAssets/ShantellSans-Bold.ttf");
    shantellMed = p.loadFont("../JS/TinyUmbrellaAssets/ShantellSans-Medium.ttf");
    }

    let time = 0;
    let canvasWidth = 360;
    let canvasHeight = 540;
    var player;
    let squares = [];
    let splashes = [];
    let killSquare = false;
    let squareSpeed = 2;
    let score = 0;
    let circleRadius = 28;
    let squareSpacing = 5;
    let missedSquares = 0;
    var healthBar;
    let gameOver = false;
    let highScore = 0;
    let newHighScore = false;
    let newGame = true;

    p.setup = function() {
        var canvas = p.createCanvas(canvasWidth, canvasHeight);
        canvas.parent("p5project3");
        
        // initial 3 squares
        for (var k = 0; k < squareSpacing; k++){
            squares.push( new Raindrop(-10 - (canvasHeight / squareSpacing) * k) );
        }
        
        player = new Umbrella();
        
        healthBar = new HealthBar();
        
        backgroundImage = new Background();
        
        p.textFont(shantellMed);
    }

    p.draw = function() {
        p.frameRate(60);
        time ++;
        
        if (time % 8 == 0){
            backgroundImage.update();
            healthBar.update()
        }
        
        backgroundImage.display(); 
        gameOver = healthBar.gameOverCheck();

        if (gameOver == true){
            
            if (score > highScore){
                newHighScore = true
                highScore = score;
            }
            
            if (newHighScore == true){
                p.textSize (40)
                p.text ("new highscore!", canvasWidth / 2, 220)
            }
            
            p.textAlign("center");
            p.fill(0);
            p.textSize (60)
            p.text("score: " + score, canvasWidth / 2, 280);
            p.textSize(20);
            p.text("click to restart",canvasWidth / 2,350);
            
        }else if (newGame == true){
            p.textAlign("center");
            p.fill(0);
            p.textSize (45)
            p.text("Tiny Umbrella", canvasWidth / 2, 260);
            p.textSize(20);
            p.text("click to start",canvasWidth / 2,300);

            squares = [];
            splashes = [];
            for (var k = 0; k < squareSpacing; k++){
                squares.push( new Raindrop(-10 - (canvasHeight / squareSpacing) * k) );
            }
            
        }else{
            
            for (var squareIndex in squares){
                squares[squareIndex].display();
            }

            if (killSquare != true){

            }else{
                squares.splice(0, 1);
                killSquare = false;
                squares.push(  new Raindrop(-10));
            }

            player.display();

            var xRangeUp = p.mouseX + circleRadius;
            var xRangeLow = p.mouseX - circleRadius;
            var yRangeUp =  350 + circleRadius / 3;
            var yRangeLow = 350 - circleRadius;

            for (var squareIndex2 in squares){
                var squareXPos = squares[squareIndex2].getXPos();
                var squareYPos = squares[squareIndex2].getYPos();
                if ((squareXPos > xRangeLow && squareXPos < xRangeUp) && (squareYPos > yRangeLow && squareYPos < yRangeUp)) {
                    squares[squareIndex2].eaten();
                }
            }
            
            for (i = 0; i < splashes.length; i++){
                splashes[i].display();
            }
            
            if (splashes.length > 6){
                splashes.splice(0,1)
            }

            squareSpeed += 0.00025;
            p.fill(0,0,0);
            p.textSize(50);
            //text(squareSpeed, 350, 10)
            p.textAlign("right")
            p.text(score, canvasWidth - 20, 50);
        }
        
        p.image(face, 0, canvasHeight - 81, canvasWidth, 81);
            
        healthBar.display();
        
        
    }

    class Raindrop {
        constructor (initialYPos) {
            this.initialXPos = p.random(canvasWidth * 0.8 + canvasWidth * 0.1) ;
            this.initialYPos = initialYPos;
            this.currentYPos = initialYPos;
            this.isEaten = false;
        }
        
        display() {
            this.currentYPos = this.initialYPos += squareSpeed;
            
            if (!this.isEaten){
                p.image(droplet, this.initialXPos, this.currentYPos, 20, 20)
            }
            
            if (this.currentYPos > canvasHeight + 10){
                killSquare = true;
                if (!this.isEaten){
                    missedSquares += 1;
                }
            }
        }
        
        getXPos(){
            return this.initialXPos;
        }
        
        getYPos(){
            return this.initialYPos += squareSpeed;
        }
        
        eaten(){
            if (!this.isEaten){
                splashes.push( new Splash(this.initialXPos, this.initialYPos += squareSpeed) );
                score += 1;
                this.isEaten = true;
            }
        }
        }

        class Umbrella {
        constructor(){
        }
        
        display(){
            p.image(umbrella, p.mouseX - 30, 320, 60,60);
            p.image(hand, p.mouseX - 75, 338, 100, 250);
        }
        
        }

        class HealthBar {
        constructor(){
            this.health = 100;
            this.randomNum = p.floor(p.random(0, 5))
        }
        
        display(){
            switch (this.randomNum){
            case 0: 
                p.image(water1, 0, canvasHeight - missedSquares * 7 - 10, 360, 230);
                break;
            case 1: 
                p.image(water2, 0, canvasHeight - missedSquares * 7 - 10, 360, 230);
                break;
            case 2: 
                p.image(water3, 0, canvasHeight - missedSquares * 7 - 10, 360, 230);
                break;
            case 3: 
                p.image(water4, 0, canvasHeight - missedSquares * 7 - 10, 360, 230);
                break;
            case 4: 
                p.image(water5, 0, canvasHeight - missedSquares * 7 - 10, 360, 230);
                break;
            }
        }
        
        update(){
            this.randomNum = p.floor(p.random(0, 5));
        }
        
        gameOverCheck(){
            if (canvasWidth - missedSquares * 40 <= 0){
            return true;
            }
        }
    }

    class Splash {
        constructor(xPos, yPos){
            this.xPos = xPos;
            this.yPos = yPos;
            this.startTime = time;
        }
        
        display(){   
            if (time < this.startTime + 4){
                p.image (splash1, this.xPos - 20, this.yPos - 20, 40, 40)
            }else if (time < this.startTime + 8){
                p.image (splash2, this.xPos - 20, this.yPos - 20, 40, 40)
            }
        }
    }

    p.mousePressed = function(){
        if (p.mouseX >= 0 && p.mouseX <= canvasWidth && p.mouseY >= 0 && p.mouseY <= canvasWidth) {

            console.log("mouse pressed")
            if (gameOver == true){
                squares = [];
                for (var k = 0; k < squareSpacing; k++){
                    squares.push(new Raindrop(-10 - (canvasWidth / squareSpacing) * k));
                }
                gameOver = false;
                squareSpeed = 2;
                score = 0;
                missedSquares = 0;
                newHighScore = false;
                splashes = [];
            }else if(newGame == true){
                newGame = false;
            }
        }
    
    }

    class Background {
        constructor(){
            this.randomNum = p.floor(p.random(0, 5))
        }
        
        display(){
            switch (this.randomNum){
            case 0: 
                p.image(bg1, 0, 0, 360, 540);
                break;
            case 1: 
                p.image(bg2, 0, 0, 360, 540);
                break;
            case 2: 
                p.image(bg3, 0, 0, 360, 540);
                break;
            case 3: 
                p.image(bg4, 0, 0, 360, 540);
                break;
            case 4: 
                p.image(bg5, 0, 0, 360, 540);
                break;
            }
        }
        
        update(){
            this.randomNum = p.floor(p.random(0, 5));
        }
    }
})