const sprites = new Image()
sprites.src = './Sprite_images.png';

let Game_over = false;
const globais = {};
let frames = 0;


const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

const hit_effect = new Audio();
hit_effect.src = './Effects/hit.wav';

const jump_effect = new Audio();
jump_effect.src = './Effects/jump.wav';

const score_effect = new Audio();
score_effect.src = './Effects/score.wav';
// Criating the floor

function createFloor() {

    const floor = {
        initx: 0,
        inity: 610,
        widthx: 224,
        heighty: 112,
        canvax: 0,
        canvay: canvas.height - 112,
        Draw() {
            contexto.drawImage(
                sprites,
                floor.initx, floor.inity,
                floor.widthx, floor.heighty,
                floor.canvax, floor.canvay,
                floor.widthx, floor.heighty
            );
            contexto.drawImage(
                sprites,
                floor.initx, floor.inity,
                floor.widthx, floor.heighty,
                floor.canvax +this.widthx, floor.canvay,
                floor.widthx, floor.heighty
            );
        },
        Refresh(){
            const moveSpeed = 1;
            const repeat = this.widthx / 2;
            const movement = this.canvax - moveSpeed 

            this.canvax = movement % repeat;

        },
    }
    return floor;
}

// Creating the background
function createBackground() {
    
    const background = {
        initx: 390,
        inity: 0,
        widthx: 276,
        heighty: 204,
        canvax: 0,
        canvay: canvas.height -204 - 112,
    
        Draw() {
            contexto.fillStyle = '#70c5ce';
            contexto.fillRect(0, 0, canvas.width, canvas.height);

            contexto.drawImage(
                sprites,
                background.initx, background.inity,
                background.widthx, background.heighty,
                background.canvax, background.canvay,
                background.widthx, background.heighty
            );
            contexto.drawImage(
                sprites,
                background.initx, background.inity,
                background.widthx, background.heighty,
                background.canvax + this.widthx, background.canvay,
                background.widthx, background.heighty
            );
        },
        Refresh(){
            const moveSpeed = 1;
            const repeat = this.widthx / 2;
            const movement = this.canvax - moveSpeed 

            this.canvax = movement % repeat;

        },
    }
    return background;
}
//Creating the first screen
const entryImage = {
    initx: 134,
    inity: 0,
    widthx: 174,
    heighty: 150,
    canvax: (canvas.width - (canvas.width / 2) - (174/2)),
    canvay: 50, 
    Game_over:false,
    Draw() {
        contexto.drawImage(
            sprites,
            entryImage.initx, entryImage.inity,
            entryImage.widthx, entryImage.heighty,
            entryImage.canvax, entryImage.canvay,
            entryImage.widthx, entryImage.heighty
        );
    }
}

//game over screen

const overSign = {
    initx: 134,
    inity: 153,
    widthx: 226,
    heighty: 200,
    canvax: (canvas.width - (canvas.width / 2) - (226/2)),
    canvay: 50, 
    Draw() {
        contexto.drawImage(
            sprites,
            overSign.initx, overSign.inity,
            overSign.widthx, overSign.heighty,
            overSign.canvax, overSign.canvay,
            overSign.widthx, overSign.heighty
        );
    },
    Click(){
        if (Game_over === true){
            setTimeout(() => switchScreen(screens.start), 500);
            Game_over = false;
        }
    }
        
}

// function to create pipes

function createPipes() {
    const pipes = {
        
        widthx: 52,
        heighty:400,
        floor:{
            initx:0,
            inity:169,
        },
        ceiling: {
            initx:52,
            inity:169,
        },
        gap: 90,

        //FIXING NEEDED
        
        Draw() {

            pipes.pairs.forEach(function(pair) {
                
                const yRand = pair.y;
                const canvaCx = pair.x; 
                const canvaCy = yRand;
                contexto.drawImage(
                    sprites,
                    pipes.ceiling.initx, pipes.ceiling.inity,
                    pipes.widthx, pipes.heighty,
                    canvaCx, (canvaCy - (pipes.gap / 2)),
                    pipes.widthx, pipes.heighty
                );
                const canvaFx = pair.x; 
                const canvaFy = pipes.heighty + yRand;
                contexto.drawImage(
                    sprites,
                    pipes.floor.initx, pipes.floor.inity,
                    pipes.widthx, pipes.heighty,
                    canvaFx, (canvaFy + (pipes.gap / 2)),
                    pipes.widthx, pipes.heighty
                );
                
            },
        )},
        coliderBird (pair){ 
            const head = globais.flappyBird.canvay;
            const coliderTop = pair.y + pipes.heighty - (pipes.gap / 2);
            const bottom = globais.flappyBird.canvay + globais.flappyBird.heighty;
            const coliderBottom = coliderTop + pipes.gap;

            if (globais.flappyBird.canvax >= pair.x - (pipes.widthx/2)){
                console.log("invasão // colidertop: "+coliderTop + " // head: " + head)
                console.log("invasão // coliderBottom: "+coliderBottom + " // Bottom: " + head)

                if(head <= coliderTop){
                    console.log("colisão top")
                    return true;
                }
                else if(bottom >= coliderBottom){
                    console.log("colisão bot")
                    return true;
                }
                else if (globais.flappyBird.canvax > pair.x + pipes.widthx-40){
                    score_effect.play()
                    return false;
                }
            }
        },
        pairs: [],

        Refresh(){
            const crossedKeyFrame = frames % 100 === 0;
            if (crossedKeyFrame){
                pipes.pairs.push({
                    x:canvas.width,
                    y:-140 * (Math.random()+1),
                })
            }

            pipes.pairs.forEach(function (pair) {

                if (pipes.coliderBird(pair) === true){
                    hit_effect.play();
                    Game_over = true;
                    return
                }
                if (pair.x + pipes.widthx <= 0){
                    pipes.pairs.shift();
                }
                pair.x = pair.x - 2;
                
            })
            
        }
    }
    return pipes;
}

// Creating the score

let record = 0;

function createScore() {
    const score = {
        actualScore: 0,
    
        Draw() {
            contexto.font =  '35px VT323';
            contexto.textAlign = 'right'
            contexto.fillStyle = 'white';
            contexto.fillText (`${score.actualScore}`, canvas.width-35, 35)
        },

        bestScore(){
            if (Game_over === true){
                if(this.actualScore > record){
                    record = this.actualScore;
                }
                contexto.font =  '35px VT323';
                contexto.fillStyle = 'white';
                contexto.fillText (`${this.actualScore}`, ((canvas.width / 2) + 88 ), (overSign.heighty/2 + 47))
                contexto.font =  '35px VT323';
                contexto.fillStyle = 'white';
                contexto.fillText (`${record}`, ((canvas.width / 2) + 88 ), (overSign.heighty/2+90))
            }
        },

        Refresh(){
            const keyFrame = 10;
            const crossedKeyFrame = frames % keyFrame === 0;
            if (crossedKeyFrame)
                this.actualScore++;
            if (Game_over === true){
                score.bestScore();
            }

        },
    }
    return score;
}
function CreateFinalScore() {
    const finalScore = {
        finalScore: globais.score.actualScore,
        finalBestScore: record,
        medals:[
            {initx: 0, inity: 79, widthx:44, heighty:44},
            {initx: 48, inity: 79, widthx:44, heighty:44},
            {initx: 0, inity: 125, widthx:44, heighty:44},
            {initx: 48, inity: 125, widthx:44, heighty:44},
        ],
        Draw (){
            contexto.font =  '35px VT323';
            contexto.fillStyle = 'white';
            contexto.fillText (`${globais.score.actualScore}`, ((canvas.width / 2) + 88 ), (overSign.heighty/2 + 47))
            contexto.font =  '35px VT323';
            contexto.fillStyle = 'white';
            contexto.fillText (`${record}`, ((canvas.width / 2) + 88 ), (overSign.heighty/2+90))
            if (record < 50){
                const reward = this.medals [3]
                contexto.drawImage(
                    sprites,
                    reward.initx, reward.inity,
                    reward.widthx, reward.heighty,
                    (canvas.width / 2) - 87 , (overSign.heighty / 2 + 38),
                    reward.widthx, reward.heighty
                );
            }
            else if (record >= 50 && record < 100){
                const reward = this.medals [1]
                contexto.drawImage(
                    sprites,
                    reward.initx, reward.inity,
                    reward.widthx, reward.heighty,
                    (canvas.width / 2) - 87 , (overSign.heighty / 2 + 38),
                    reward.widthx, reward.heighty
                );
            }
            if (record >= 100 && record < 150){
                const reward = this.medals [0]
                contexto.drawImage(
                    sprites,
                    reward.initx, reward.inity,
                    reward.widthx, reward.heighty,
                    (canvas.width / 2) - 87 , (overSign.heighty / 2 + 38),
                    reward.widthx, reward.heighty
                );
            }
            if (record > 150){
                const reward = this.medals [2]
                contexto.drawImage(
                    sprites,
                    reward.initx, reward.inity,
                    reward.widthx, reward.heighty,
                    (canvas.width / 2) - 87 , (overSign.heighty / 2 + 38),
                    reward.widthx, reward.heighty
                );
            }
        },
    
        Refresh(){
            if (Game_over === true){
                this.Draw();
             }
        },
    }

    return finalScore;
}





// Creating the bird class which contains all its sprites and colider functions

function Colision(flappy, object) {
    const flappY = flappy.canvay + flappy.heighty;
    const colider = object.heighty;
    if(flappY <= flappy.heighty || flappY >= canvas.height - colider)  
        return true;      
    else return false;
}

function createBird() {
    
    const flappyBird = {
             speed: 0,
             gravity: 0.25,
             flight: 4.6,
             initx: 0,
             inity: 0,
             widthx: 34,
             heighty: 24,     
             canvax: 10,
             canvay: 50, 
         Click(){
            jump_effect.play();
            this.speed = - this.flight;
         },
         //Refresh function
         Refresh(){
           if (Colision(flappyBird, globais.floor) === true){
               hit_effect.play();
               Game_over = true;
               return
           }
           this.speed = this.speed + this.gravity;
           this.canvay = this.canvay + this.speed;
           
         },
         movement: [
            {initx: 0, inity: 0,},
            {initx: 0, inity: 26,},
            {initx: 0, inity: 52,},
            {initx: 0, inity: 26,},
        ],
        currentFrame: 0,
        updateFrame(){
            const keyFrame = 10;
            const crossedKeyFrame = frames % keyFrame === 0;
            if (crossedKeyFrame){
                const incrementBase = 1;
                const increment = incrementBase + this.currentFrame;
                const frameRepeat = flappyBird.movement.length;
                flappyBird.currentFrame = increment % frameRepeat;
            }
        },
         //Draw function
         Draw(){
             this.updateFrame();
             const { initx, inity} = this.movement[this.currentFrame]
             contexto.drawImage(
                 sprites, //Sprite da imagem
                 initx, inity,   // posição x e y
                 flappyBird.widthx, flappyBird.heighty, // Largura x e altura y
                 flappyBird.canvax, flappyBird.canvay, 
                 flappyBird.widthx, flappyBird.heighty
             );
         }
    }
    return flappyBird;
}

// screens and functions

let selectedScreen = {}
function switchScreen (newScreen) {
    selectedScreen = newScreen;
    if (selectedScreen.Initialize){
        selectedScreen.Initialize();
    }
} 

const screens = {
    start:{
        Initialize(){
            globais.background = createBackground ();
            globais.floor = createFloor();
            globais.flappyBird = createBird();
            globais.pipes = createPipes();
        },
        Draw(){
           globais.background.Draw();
           globais.floor.Draw();
           globais.flappyBird.Draw();
           entryImage.Draw();
        },
        Click(){
            switchScreen(screens.inGame);
        },
        Refresh(){
            globais.floor.Refresh();
        },
    },
    inGame: {
        Initialize(){
            globais.score = createScore();
        },
        Draw(){
            globais.background.Draw();
            globais.flappyBird.Draw();
            globais.pipes.Draw()
            globais.floor.Draw();
            globais.score.Draw();

            },
        Click(){
            globais.flappyBird.Click();
        },
        Refresh(){
            globais.floor.Refresh();
            globais.flappyBird.Refresh();
            globais.pipes.Refresh();
            globais.score.Refresh();
        },
    },
    gameOver: {
        Initialize(){
            globais.finalScore = CreateFinalScore();
        },
        Draw(){
            overSign.Draw();
            globais.finalScore.Draw();
        },
        Click(){
            overSign.Click();
        },
        Refresh() {
            globais.finalScore.Refresh();
            globais.floor.Refresh();
        }
    }
};

// game initializer

function loop() {
    frames ++;
    selectedScreen.Draw();
    selectedScreen.Refresh();
    if (Game_over === true){
        switchScreen(screens.gameOver);
    }
    requestAnimationFrame(loop);
};

window.addEventListener('click', function () {
    if (selectedScreen.Click){
        selectedScreen.Click();
    }
});

switchScreen(screens.start);
loop();