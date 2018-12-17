
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
var flagToCheck = true;
var ballColor = '';
const OBSTACLE_HEIGHT = 40;
const OBSTACLE_WIDTH = 50;
var obstacleMap = [];
var  taggedcolor = '#';


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



            document.getElementById('score').innerHTML = score;
            ballX += dx;
            ballY += dy;


            if (Math.abs(ballY) > canvas.height - MIN_HEIGHT_TO_CHECK) {
                if (flagToCheck) {
                    if (Math.abs(ballX) > paddleX && Math.abs(ballX) < paddleX + PADDLE_WIDTH) {
                        score++;
                        setRandomColor();
                        ballColor = taggedcolor;
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
    context.fillStyle = 'white';
    context.fillRect(0, 0, 700, 700);
     
    context.globalAlpha = 1;




    context.beginPath();
    context.fillStyle = ballColor;
    context.arc(x, y, BALL_RADIUS, 0, Math.PI * 2, false);
    context.fill();

    context.fillStyle = 'black';
    context.fillRect(paddleX, canvas.height - PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT);

   drawRandomRectangle();
   collisionCheck(x, y);


}

function movePaddle(x) {
    context.fillStyle = 'black';
    context.fillRect(x, canvas.height - PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT);


}


function initializeGame() {
    canvas = document.getElementById("canvasGame");
    context = canvas.getContext('2d');
    setRandomColor();
    ballColor=taggedcolor;
}

function setRandomColor() {
    var letters = '0123456789ABCDEF';
  taggedcolor='#';
    for (var i = 0; i < 6; i++) {
        taggedcolor += letters[Math.floor(Math.random() * 16)];
    }
    
}

function collisionCheck(x, y) {
   
    obstacleMap.forEach(function (item) {
        if (x > item.ox && x < item.ox + OBSTACLE_WIDTH) {
            if (y > item.oy && y < item.oy + OBSTACLE_HEIGHT) {
                drawObstacle(item.ox,item.oy,taggedcolor);
            }
        }
    })

}



function drawRandomRectangle() {



    for (var i = 1; i <= 5; i++) {
        for (var j = 1; j <= 5; j++) {

            var obstacle = { ox: j * 100, oy: i * 70 };
            obstacleMap.push(obstacle);
          drawObstacle(j*100,i*70,'black');
        }


        //    context.fillStyle = 'black';
        // context.fillRect(i, 200, PADDLE_WIDTH, PADDLE_HEIGHT);

    }

}

function drawObstacle(x,y,color)
{
      context.beginPath();
            context.rect(x,y, OBSTACLE_WIDTH, OBSTACLE_HEIGHT);
            context.fillStyle = color;
            context.closePath();
            context.fill();
}