

var credit=10;
var bet=1;
var win=0;
var canvas = null;
var canvasSlot = null;
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
const MIN_HEIGHT_TO_CHECK = PADDLE_HEIGHT + 9;
const PADDLE_COLOR = '#ff8d00';
var flagToCheck = true;
var ballColor = '';
const OBSTACLE_HEIGHT = 50;
const OBSTACLE_WIDTH = 50;
var obstacleMap = [];
var taggedcolor = '#';
var paddelStrikeMusic;
var bgMusic;
var cardMap = [1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5];
var slotTable = [];
var orderCount=0;

window.onload = function (e) {
   init();

};


function init()
{
    initializeGame();
    drawRandomRectangle();
    // context.beginPath();

    canvas.addEventListener('mousemove', function (evt) {
        var mousePos = getMousePos(canvas, evt);
        if (mousePos.x > 0 && mousePos.x < canvas.width ) {
            paddleX = mousePos.x  ;
        }
    }, false);


    //Move Ball
    var intrvl = setInterval(
        function () {
            bgMusic.play();
            if (bgMusic.sound.currentTime >= 27) {
                bgMusic.reset();
                //bgMusic.play();
            }


           
            ballX += dx;
            ballY += dy;


            if (Math.abs(ballY) > canvas.height - MIN_HEIGHT_TO_CHECK) {
                if (flagToCheck) {
                    if (Math.abs(ballX) > paddleX && Math.abs(ballX) < paddleX + PADDLE_WIDTH) {
                        score++;
                        setRandomColor();
                        ballColor = taggedcolor;
                        paddelStrikeMusic.play();

                        obstacleMap.sort(function(a, b){return a.order - b.order});
 console.log(obstacleMap);

                        for(var i=0;i<obstacleMap.length;i++)
                        {

                            if (slotTable.length <25) {
                                if (obstacleMap[i].show) {
                                    slotTable.push(obstacleMap[i].card);
                                }
                                if(slotTable.length==25)
                                {
                                    paintSlot();
                                    // updateConsole();
                                     checkForPayline();
                                     clearInterval(intrvl);
                                     document.getElementById('btnPlay').style.display='inline-block';
                                   break;

                                }
                            }
                            else {
                                paintSlot();
                               // updateConsole();
                                checkForPayline();
                                clearInterval(intrvl);
                                document.getElementById('btnPlay').style.display='inline-block';
                              break;
                               //paintPayLine();
                            }
                        }
                     
                        paintSlot();
                       console.log(slotTable);
                        drawRandomRectangle();
                        flagToCheck = false;
                        collisionWithWallEffect(PADDLE_HEIGHT);

                    }
                    else {
                        alert('lost');
                        context.clearRect(0, 0, canvas.width, canvas.height);
                        //initializeGame();
                        clearInterval(intrvl);
                        document.getElementById('btnPlay').style.display='inline-block';

                    }


                }
            }
            else {
                flagToCheck = true;

            }
                collisionWithWallEffect(0);

        
        },
        15
    );
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function collisionWithWallEffect( paddleHight)
{
        //Craete Ball
        if (ballX >= 0) {
            if (ballX+BALL_RADIUS > canvas.width) {
                ballX = -ballX;
                // ballY=-ballY;
            }
        } 



        if (ballX <= 0 && ballY >= 0) {
            moveBall(-ballX, ballY);

        }

        if (ballY+BALL_RADIUS+paddleHight > canvas.height-PADDLE_HEIGHT) {
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


    drawObstacle();

    collisionCheck(x, y);



}

function movePaddle(x) {


    context.fillStyle = PADDLE_COLOR;
    context.fillRect(x, canvas.height - PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT);

}


function initializeGame() {
    orderCount=0;
    document.getElementById('btnPlay').addEventListener('click',playGame);
    canvas = document.getElementById("canvasGame");
    context = canvas.getContext('2d');

    canvasSlot = document.getElementById("canvasSlot");
    contextSlot = canvasSlot.getContext('2d');
    setRandomColor();
    ballColor = taggedcolor;
    paddelStrikeMusic = new sound("assets/bounce.mp3", false);
    bgMusic = new sound("assets/bg.mp3", true);
    initConsole();
    ballX=paddleX+PADDLE_WIDTH/2;
    ballY=canvas.height-PADDLE_HEIGHT;
    document.getElementById('btnPlay').style.display='none';


}

function playGame()
{
    document.getElementById('btnPlay').style.display='none';
    var element = document.body.classList.remove("illumination");
    slotTable=[];
    flagToCheck=false;
    contextSlot.clearRect(0,0,canvasSlot.width,canvasSlot.height);
    init();

}


function setRandomColor() {
    var letters = '0123456789ABCDEF';
    taggedcolor = '#';
    for (var i = 0; i < 6; i++) {
        taggedcolor += letters[Math.floor(Math.random() * 16)];
    }

}

function collisionCheck(x, y) {

    
    obstacleMap.forEach(function (item) {
        if (x > item.ox && x < item.ox + OBSTACLE_WIDTH) {
            if (y > item.oy && y < item.oy + OBSTACLE_HEIGHT) {
                item.show = true;
                item.order=orderCount++;
console.log(item.card);

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
    obstacleMap = [];
    shuffleArray(cardMap);

    var count = 0;
    for (var i = 1; i <= 5; i++) {
        for (var j = 1; j <= 5; j++) {


            var obstacle = { ox: j * 100, oy: i * 70, card: cardMap[count], show: false, order:null };
            obstacleMap.push(obstacle);

            count++;
        }




    }

}

function drawObstacle() {



    drawImage();

}


function sound(src, flag) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    if (flag) {
        this.sound.setAttribute("loop", flag);
    }
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.play();
    }
    this.stop = function () {
        this.sound.pause();
    }
    this.reset = function () {
        this.sound.currentTime = 0;
        this.sound.play();
    }
}

function paintSlot() {
    var n = 0; var m = 0; var y = 15;
    for (var i = 1; i <= slotTable.length; i++) {


        var img = new Image();
        img.src = "assets/" + slotTable[i - 1] + ".png";
        contextSlot.drawImage(img, 25 + 15 * m + (m * OBSTACLE_WIDTH), n + y, OBSTACLE_WIDTH, OBSTACLE_HEIGHT);
        m++;

        if (i % 5 == 0) {
            n += OBSTACLE_HEIGHT;
            m = 0;
            y += 15;
        }
    }
}

function drawImage() {

    obstacleMap.forEach(function (item) {


        if (item.show) {
            var imageObj = new Image();
            imageObj.src = "assets/" + item.card + ".png";

            context.drawImage(imageObj, item.ox, item.oy, OBSTACLE_WIDTH, OBSTACLE_HEIGHT);
        }
        else {
            var imageObj1 = new Image();
            imageObj1.src = "assets/0.png";

            context.drawImage(imageObj1, item.ox, item.oy, OBSTACLE_WIDTH, OBSTACLE_HEIGHT);
        }




    });




}


function checkForPayline() {
    var PayLine = [];
    var itemObj = {};
    var maxCount=0;
    var count = 0;
    var n=5;
    itemObj = { item: slotTable[0], itemCount: 1 };
    for (var i = 0; i < 25; i++) {
 count++;
       if((i+1)%5==0)
       {
           n+=5;
           PayLine.push(itemObj);
           i++;
           itemObj = { item: slotTable[i], itemCount: 1 };
       }
        maxCount=1;
        for(var j=i+1;j<n;j++)
        {
            if(slotTable[i]==slotTable[j])
            {
                maxCount++;
            }
            if(maxCount>itemObj.itemCount)
            {
                itemObj.itemCount=maxCount;
                itemObj.item=slotTable[j];
    
            }

        }
       
        
      
    }

    console.log(PayLine);
    paintPayLine(PayLine);
}



function paintPayLine(PayLine)
{
    var winAmout=0;
    var n=15;var y=0;
    for(var i=0;i<PayLine.length;i++)
    { y+=n+OBSTACLE_HEIGHT/2;
        
        if(PayLine[i].itemCount>=3)
        {
            winAmout+=PayLine[i].item*PayLine[i].itemCount;
            contextSlot.beginPath();
            contextSlot.moveTo(35,y);
            contextSlot.lineTo(325, y);
            contextSlot.strokeStyle="#b90202";
            contextSlot.lineWidth = 4;
            contextSlot.stroke();

        }
        y+=OBSTACLE_HEIGHT/2;
    }

    calculateWin(winAmout);
}


function initConsole()
{
    credit-=bet;
    document.getElementById('spanCredit').innerHTML='CREDIT: '+credit;
    document.getElementById('spanWin').innerHTML='WIN: ' + win;
    document.getElementById('spanBet').innerHTML='BET: ' + bet;
   

}

function calculateWin(winAmout)
{
    if(winAmout>0)
    {
        illuminateGame();
    }
    credit +=winAmout;
    document.getElementById('spanCredit').innerHTML='CREDIT: '+credit;
    document.getElementById('spanWin').innerHTML='WIN: ' + winAmout;
    document.getElementById('spanBet').innerHTML='BET: ' + bet;
} 

function illuminateGame()
{
    var element = document.body.classList.add("illumination");
}