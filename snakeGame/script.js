//define html elements
const board=document.querySelector('#game-board');
const instructionText=document.querySelector('#instruction-text');
const logo=document.getElementById('logo')
const score=document.getElementById('score');
const highScoreText=document.getElementById('highScore');
let highScore=0;
const gridSize=20;
let snake=[{x:10,y:10}];
let food=generateFood();
let direction="right";
let gameInterval;
let gameSpeedDelay=300;
let gameStart=false;
//Draw game,map,snake,food
function draw(){
    board.innerHTML='';
    drawSnake();
    drawFood();
    updateScore();
}
function drawSnake(){
    snake.forEach((segment)=>{
        const snakeElement=createGameElement('div','snake');
        setPosition(snakeElement,segment);
        board.appendChild(snakeElement);
    })
}
//create a snake,food
function createGameElement(tag,className){
    const gameElement=document.createElement(tag);
    gameElement.className=className;
    return gameElement;
}

//set the position of snake or food
function setPosition(element,position){
    element.style.gridColumn=position.x;
    element.style.gridRow=position.y;
}

//draw food
function drawFood(){
    if(gameStart){
        const foodElement=createGameElement('div','food');
        setPosition(foodElement,food)
        board.appendChild(foodElement);
    }
}
//generate food
function generateFood(){
    const x=Math.floor(Math.random()*gridSize) + 1;
    const y=Math.floor(Math.random()*gridSize) + 1;
    return {x,y};
}

//Moving the snake
function move(){
    const head={...snake[0]}
    switch (direction) {
        case 'right':
            head.x++;
            break;
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        
        default:
            break;
    }
    snake.unshift(head);

    if(head.x==food.x&&head.y==food.y){
        food=generateFood();
        increaseSpeed();
        clearInterval(gameInterval);    //clear past interval
        gameInterval=setInterval(()=>{
            move();
            checkCollision()
            draw();
        },gameSpeedDelay);
    }
    else{
        snake.pop();
    }
}

//start game 
function startGame(){
    gameStart=true; //keep track of a running game
    instructionText.style.display='none';
    logo.style.display='none';
    gameInterval=setInterval(()=>{
        move();
        checkCollision();
        draw();
    },gameSpeedDelay);
}

//keypress event listener
function handleKeyPress(event){
    if((!gameStart&&event.code==='Space')||(!gameStart&&event.key===' ') ){
        startGame();
    }

    else{
        switch (event.key) {
            case 'ArrowUp':
                if(direction==='down'){
                    resetGame();
                }
                direction='up';
                break;
            case 'ArrowDown':
                if(direction==='up'){
                    resetGame();;
                }
                direction='down';
                break;
            case 'ArrowLeft':
                if(direction==='right'){
                    resetGame();;
                }
                direction='left';
                 break;
            case 'ArrowRight':
                if(direction==='left'){
                    resetGame();;
                }
                 direction='right';
                break;
        }
    }
}

document.addEventListener('keydown',handleKeyPress);
//test moving
// setInterval(()=>{
//     move(); 
//     draw();
// },200)
function increaseSpeed(){
    console.log(gameSpeedDelay);
    if(gameSpeedDelay>250){
        gameSpeedDelay-=8;
    }
    else if(gameSpeedDelay>200){
        gameSpeedDelay-=5;
    }
    else if(gameSpeedDelay>100){
        gameSpeedDelay-=4;
    }
    else{
        gameSpeedDelay-=2;
    }
}

function checkCollision(){
    const head=snake[0];
    if(head.x<1||head.x>gridSize||head.y<1||head.y>gridSize){
        resetGame();
    }

    for(let i=1;i<snake.length;i++){
        if(head.x===snake[i].x&&head.y===snake[i].y){
            resetGame();
        }
    }
}

function resetGame(){
    updateHighScore();
    stopGame();
    snake=[{x:10,y:10}];
    food=generateFood();
    direction='right';
    gameSpeedDelay=300;
    updateScore();
}

function updateScore(){
    const currScore=snake.length-1;
    score.textContent=currScore.toString().padStart(3,'0');
}
function stopGame(){
    clearInterval(gameInterval);
    gameStart=false;
    instructionText.style.display='block';
    logo.style.display='block';
}

function updateHighScore(){
    const currScore=snake.length-1;
    if(currScore>highScore){
        highScore=currScore;
        highScoreText.textContent=highScore.toString().padStart(3,'0');
    }
    highScoreText.style.display='block';
}