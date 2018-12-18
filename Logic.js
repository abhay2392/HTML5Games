
var canvas = null;
var context = null;
var paddle = null;
var ballX = 50;
var ballY = 50;
var mouseX = 0;
var paddleX = 0;
var score = 0;
var dx = 5;
var dy = 2;
const BALL_RADIUS = 7;
const PADDLE_HEIGHT = 15;
const PADDLE_WIDTH = 150;
const MIN_HEIGHT_TO_CHECK = PADDLE_HEIGHT + 5;
const PADDLE_COLOR='white';
var flagToCheck = true;
var ballColor = '';
const OBSTACLE_HEIGHT = 50;
const OBSTACLE_WIDTH = 50;
var obstacleMap = [];
var  taggedcolor = '#';
var paddelStrikeMusic;
var bgMusic;
var cardMap=[1,2,3,4,5,1,2,3,4,5,1,2,3,4,5,1,2,3,4,5,1,2,3,4,5];
var paytable=[];

window.onload = function (e) {
    initializeGame();
    drawRandomRectangle();
    // context.beginPath();

    canvas.addEventListener('mousemove', function (evt) {
        var mousePos = getMousePos(canvas, evt);
        if (mousePos.x > PADDLE_WIDTH / 2 && mousePos.x < canvas.width - PADDLE_WIDTH / 2) {
            paddleX = mousePos.x - PADDLE_WIDTH / 2;
        }
    }, false);


    //Move Ball
    var intrvl = setInterval(
        function () {
 bgMusic.play();
 if(bgMusic.sound.currentTime >=27)
 {
     bgMusic.reset();
     //bgMusic.play();
 }


            document.getElementById('score').innerHTML = score;
            ballX += dx;
            ballY += dy;


            if (Math.abs(ballY) > canvas.height - MIN_HEIGHT_TO_CHECK) {
                if (flagToCheck) {
                    if (Math.abs(ballX) > paddleX && Math.abs(ballX) < paddleX + PADDLE_WIDTH) {
                        score++;
                        setRandomColor();
                        ballColor = taggedcolor;
                        paddelStrikeMusic.play();
                       
                          drawRandomRectangle();
                         console.log(obstacleMap);
                         console.log(paytable);
                         paytable=[];
                        flagToCheck = false;
                    }
                    else {
                        alert('lost');
                        context.clearRect(0, 0, canvas.width, canvas.height);
                        //initializeGame();
                        clearInterval(intrvl);

                    }


                }
            }
            else {
                flagToCheck = true;

            }

            //Craete Ball
            if (ballX >= 0) {
                if (ballX > canvas.width) {
                    ballX = -ballX;
                    // ballY=-ballY;
                }
            }



            if (ballX <= 0 && ballY >= 0) {
                moveBall(-ballX, ballY);

            }

            if (ballY > canvas.height) {
                ballY = -ballY;
            }

            if (ballX <= 0 && ballY <= 0) {
                moveBall(-ballX, -ballY);

            }

            if (ballX >= 0 && ballY <= 0) {
                moveBall(ballX, -ballY);

            }
            if (ballX > 0 && ballY > 0) {
                moveBall(ballX, ballY);
            }
        },
        15
    );

};

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

//Move the Ball
function moveBall(x, y) {


  
 
   
    //Create Paddle
    context.globalAlpha = 0.3;
  
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.globalAlpha = 1;




    context.beginPath();
    context.fillStyle = ballColor;
    context.arc(x, y, BALL_RADIUS, 0, Math.PI * 2, false);
    context.fill();

    context.fillStyle = PADDLE_COLOR;
    context.fillRect(paddleX, canvas.height - PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT);

  //drawRandomRectangle();
  drawObstacle();
   
   collisionCheck(x, y);



}

function movePaddle(x) {
    context.fillStyle = PADDLE_COLOR;
    context.fillRect(x, canvas.height - PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT);


}


function initializeGame() {
    canvas = document.getElementById("canvasGame");
    context = canvas.getContext('2d');
    setRandomColor();
    ballColor=taggedcolor;
    paddelStrikeMusic=new sound("assets/bounce.mp3",false);
    bgMusic=new sound("assets/bg.mp3",true);
  
  
}


function setRandomColor() {
    var letters = '0123456789ABCDEF';
  taggedcolor='#';
    for (var i = 0; i < 6; i++) {
        taggedcolor += letters[Math.floor(Math.random() * 16)];
    }
    
}

function collisionCheck(x, y) {
   
   var flag=true;
    obstacleMap.forEach(function (item) {
        if (x > item.ox && x < item.ox + OBSTACLE_WIDTH) {
            if (y > item.oy && y < item.oy + OBSTACLE_HEIGHT) {

                drawImage(item.ox,item.oy,item.card);
                if(flag)
                {
                paytable.push(item.card);
                flag=false;
                }
              // 
                
            }
        }
    })

}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function drawRandomRectangle() {
obstacleMap=[];
shuffleArray(cardMap);

var count=0;
    for (var i = 1; i <= 5; i++) {
        for (var j = 1; j <= 5; j++) {
 

            var obstacle = { ox: j * 100, oy: i * 70 , card:cardMap[count] };
            obstacleMap.push(obstacle);
          drawObstacle(j*100,i*70,'white');
          count++;
        }


        //    context.fillStyle = 'black';
        // context.fillRect(i, 200, PADDLE_WIDTH, PADDLE_HEIGHT);

    }

}

function drawObstacle()
{

     obstacleMap.forEach(function (item) {
      
  context.beginPath();
            context.rect(item.ox,item.oy, OBSTACLE_WIDTH, OBSTACLE_HEIGHT);
            context.fillStyle = "white";
            context.closePath();
            context.strokeStyle='grey';
            context.stroke();
            context.fill();
              //  drawImage(item.ox,item.oy,item.card);
              // 
                
           
    

     });
}


function sound(src,flag) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    if(flag)
    {
    this.sound.setAttribute("loop",flag);
    }
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }    
    this.reset=function()
    {
        this.sound.currentTime=0;
        this.sound.play();
    }
}

function drawImage(x,y,card)
{
  
      var imageObj = new Image();
       imageObj.src = "assets/"+card+".png";
               
        context.drawImage(imageObj, x, y,OBSTACLE_WIDTH,OBSTACLE_HEIGHT);
     
                
            
}