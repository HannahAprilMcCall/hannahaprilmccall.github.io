var FallingSand = new p5(function(p) {

    let canvasWidth = 500;
    let gridSize = 5;
    let gridA = [];
    let gridB = [];
    let dropBlockSize = 5;
    let changeValue = 1;

    p.setup = function() {
        let canvas = p.createCanvas(canvasWidth, canvasWidth);
        canvas.parent("p5project2");
        p.frameRate(60);
        
        for (let i = 0; i < canvasWidth / gridSize; i++) {
            let col = [];
            for (let j = 0; j < canvasWidth / gridSize; j++) {
                col.push(0); // Initialize with 0 to indicate empty cells
            }
            gridA.push(col);
        }
    }

    p.draw = function() {
        p.background(50);

        // Draw gridA
        for (let i = 0; i < canvasWidth / gridSize; i++) {
            for (let j = 0; j < canvasWidth / gridSize; j++) {
                if (gridA[i][j] != 0) {
                    p.noStroke();
                    p.fill(gridA[i][j]);
                    p.square(i * gridSize, j * gridSize, gridSize);
                }
            }
        }
    
        // Initialize gridB for the next frame
        gridB = [];
        for (let i = 0; i < canvasWidth / gridSize; i++) {
            let col = [];
            for (let j = 0; j < canvasWidth / gridSize; j++) {
            col.push(0); // Initialize with 0
            }
            gridB.push(col);
        }

        // Update gridB based on gridA
        for (let i = 0; i < canvasWidth / gridSize; i++) {
            for (let j = 0; j < canvasWidth / gridSize; j++) {
            if (gridA[i][j] != 0) {
                // Below is free
                if (j + 1 < canvasWidth / gridSize && gridA[i][j + 1] === 0) {
                gridB[i][j] = 0;
                gridB[i][j + 1] = gridA[i][j];
                } 
                // Below is not free but below and to the left is
                else if (i + 1 < canvasWidth / gridSize && j + 1 < canvasWidth / gridSize && gridA[i + 1][j + 1] === 0) {
                gridB[i][j] = 0;
                gridB[i + 1][j + 1] = gridA[i][j];
                } 
                // Below is not free but below and to the right is
                else if (i > 0 && j + 1 < canvasWidth / gridSize && gridA[i - 1][j + 1] === 0) {
                gridB[i][j] = 0;
                gridB[i - 1][j + 1] = gridA[i][j];
                } else {
                gridB[i][j] = gridA[i][j];
                }
            }
        }
    }

    // Copy gridB to gridA for the next frame
    for (let i = 0; i < canvasWidth / gridSize; i++) {
        for (let j = 0; j < canvasWidth / gridSize; j++) {
            gridA[i][j] = gridB[i][j];
        }
    }
    if (p.mouseX >= 0 && p.mouseX <= canvasWidth && p.mouseY >= 0 && p.mouseY <= canvasWidth) {
        if (p.keyIsDown(p.SHIFT)) {
            changeValue = 0; // To remove particles
        } else {
            changeValue = p.color(p.random(235,255), p.random(185,210), p.random(120,130)); // Assign a random color
        }
    }
    }

    p.mouseDragged = function() {
        let gridX = Math.floor(p.mouseX / gridSize);
        let gridY = Math.floor(p.mouseY / gridSize);
        
        if (p.mouseX >= 0 && p.mouseX <= canvasWidth && p.mouseY >= 0 && p.mouseY <= canvasWidth) {

            for (let q = -Math.floor(dropBlockSize / 2); q <= Math.floor(dropBlockSize / 2); q++) {
                for (let r = -Math.floor(dropBlockSize / 2); r <= Math.floor(dropBlockSize / 2); r++) {
                    let newX = gridX + q;
                    let newY = gridY + r;
                    
                    if (newX >= 0 && newX < canvasWidth / gridSize && newY >= 0 && newY < canvasWidth / gridSize) {
                        if (p.random(1) > 0.8) {
                            gridA[newX][newY] = changeValue;
                        }
                    }
                }
            }
        }
    }
})
