
var canvas = null;
var context = null;
var paddle = null;
var ballX = 50;
var ballY = 50;
var mouseX=0;

const BALL_RADIUS = 5;
const PADDLE_HEIGHT = 15;
const PADDLE_WIDTH = 150;

window.onload = function (e) {
    canvas = document.getElementById("canvasGame");
    context = canvas.getContext('2d');

   // context.beginPath();

 canvas.addEventListener('mousemove', function(evt) {
        var mousePos = getMousePos(canvas, evt);
        movePaddle(mousePos.x);
      }, false);

   
    //Move Ball
    setInterval(
        function () {

             ballX+=5;
            ballY+=2;

            //Craete Ball
            if(ballX>=0)
            {
            if(ballX>canvas.width)
            {
                ballX=-ballX;
               // ballY=-ballY;
            }
            }
           
           
           
           if(ballX<=0 && ballY>=0)
           {
                 moveBall(-ballX, ballY);

           }

           if(ballY>canvas.height)
           {
               ballY=-ballY;
           }

            if(ballX<=0 && ballY<=0)
           {
                 moveBall(-ballX, -ballY);

           }

            if(ballX>=0 && ballY<=0)
           {
                 moveBall(ballX, -ballY);

           }
           if(ballX>0 && ballY>0){
            moveBall(ballX, ballY);
           }
        },
        25
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
function moveBall(x,y) {

 //Create Paddle
 context.fillStyle = 'white';
 context.fillRect(0,0,700,700);
 
   
  context.fillStyle = 'black';
    context.fillRect(0, canvas.height - PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT);
 
    context.beginPath();
    context.arc(x,y, BALL_RADIUS,0,Math.PI*2,false);
    
   
    context.fill();

}

function   movePaddle(x)
{
  context.fillStyle = 'black';
    context.fillRect(x, canvas.height - PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT);
 
   
}