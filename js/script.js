window.onload = function(){
			
//setup_________________________________________________\\

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const sdis = document.getElementById('sdis')
const start = document.getElementById('start')
const play = document.getElementById('play')
const menu = document.getElementById('menu')
const home = document.getElementById('home')
const submit = document.getElementById('submitS')
const name = document.getElementById('name')
const showS = document.getElementById("showScore")
const boardCon = document.getElementById("boardCon")
const scoreList = document.getElementById("scoreList")
const backMenu = document.getElementById("backMenu")

canvas.width = 380;
canvas.height = 591;

var screenW = window.innerWidth/canvas.width
var screenH = window.innerHeight/canvas.height


canvas.style.width = canvas.width * screenW + "px"
canvas.style.height = canvas.height * screenH +"px"

//FIREBASE___________________\\

var config = {

apiKey: "AIzaSyA1Scfgx_oPUX-sBZF_OUsAxOCJN2XVX4M",
authDomain: "floppy-ball-c1e9d.firebaseapp.com",
projectId: "floppy-ball-c1e9d",
storageBucket: "floppy-ball-c1e9d.appspot.com",
databaseURL: "https://floppy-ball-c1e9d-default-rtdb.firebaseio.com/",
messagingSenderId: "748130609531",
appId: "1:748130609531:web:82fb9652ec13f92a7ff5de",
measurementId: "G-LHWJMGXXRN"

};

firebase.initializeApp(config)
var database = firebase.database();
var ref = database.ref("scores");
var totalG = 0;
var maxData = 50;
var dataArr = []

showS.onclick = function(){
boardCon.style.display = "flex"
}


	ref.on('value', 
	function(snap){
	
	  document.querySelectorAll('.scoreListing').forEach(e => e.remove());
   
   dataArr = []
   var scores = snap.val()
   var keys = Object.keys(scores)
   totalG = keys.length
   
    	for(let i = 0; i < keys.length; i++){
    			var k = keys[i];
     		var name = scores[k].name
    			var score = scores[k].score
    			
    			var finalData = {
    				 person: name,
    			  	point: score,
    			  	key: k
    			}
    			
    			dataArr.push(finalData)
    			
    	  }
    	  
    	  dataArr.sort((a, b) => {
        return b.point - a.point;
       });
    	  
    	  
    	for( let j =0; j<dataArr.length; j++){
    	
    	  	var li = document.createElement("li")
    			li.innerHTML = dataArr[j].person + " : " + dataArr[j].point
    			li.classList.add("scoreListing")
    			scoreList.appendChild(li);
    		
    		}
    	
    
})


function sortScore(points) {
  points.sort(function(a, b){return b-a});
}
			

//variables_ UTILITES_________________________________\\

 function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function circleLine(xc, yc, rc, x1, y1, x2, y2){ 
var ac = [xc - x1, yc - y1] 
var ab = [x2 - x1, y2 - y1] 
var ab2 = dot(ab, ab) 
var acab = dot(ac, ab) 
var t = acab / ab2 
t = (t < 0) ? 0 : t 
t = (t > 1) ? 1 : t 
var h = [(ab[0] * t + x1) - xc, (ab[1] * t + y1) - yc] 
var h2 = dot(h, h) 
return h2 <= rc * rc
} 
function dot(v1, v2){ 
return (v1[0] * v2[0]) + (v1[1] * v2[1])
}

function distance(x1, y1, x2, y2) {
  const xDist = x2 - x1
  const yDist = y2 - y1

  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
}


var camVelocity = 2;
var gameEnd = false;
var add = 0
 
// OBJECTS_________________________________\\

class Player {
  constructor(x, y, radius) {
    this.x = x
    this.y = y
    this.radius = radius
    this.boost = 1;
    this.velY = this.boost;
    this.gravity = 0.3;
    this.jumping = false;
    this.shadowV = 0;
    this.hasmagnet = false;
    this.shadCol = "#F92782"
    this.stop = false;
    this.score = 0;
  }
  
 update() {
 
 this.start = false;
 
  if (this.shadowV > 0) {
  		this.shadowV--
  }
  
 if(this.y > canvas.height- this.radius ||  this.y < 0+ this.radius){
 			gameEnd = true;
 }
 
if(gameEnd == false){
 if (this.jumping){
   this.y -= this.velY;
   this.velY -= this.gravity;
   this.boost -= this.gravity;
 }
}
 
 for(let i = 0; i < obstacles.length-1; i++){
 
  let check1 = circleLine(this.x, this.y, this.radius, obstacles[i].x, obstacles[i].y, obstacles[i].x2, obstacles[i].y2)
  
  let check2 = circleLine(this.x, this.y, this.radius, obstacles[i].x2, obstacles[i].y2, obstacles[i].x3, obstacles[i].y3)
  
  if(check1 || check2 == true){
  			gameEnd = true
  }
  
 }
 
 
 for(let i = 0; i < coins.length-1; i++){
 
  let check = circleLine(this.x, this.y, this.radius, coins[i].x, coins[i].y, coins[i].x + 12, coins[i].y)
   
   if (check == true && gameEnd == false) {
   		coins.splice(coins[i], 1)
   		this.score += 30
   		this.shadowV = 50
   		this.shadCol = "#28DF28"
   }
   
 }
 
 let magDis = distance(this.x, this.y, magnet.x, magnet.y);
 
 if (magDis <= this.radius+ magnet.radius) {
 		 magnet.x = -50
 		 this.hasmagnet = true;
 		 this.shadowV = 50
 		 this.shadCol = "#F9ED69"
 		 magDur()
 }
 

if (gameEnd == true) {
	this.stop = true;
}


if (this.stop == true) {
		menu.style.display = "flex"
//  sdis.style.display = "none"
  
		
  this.stop = false;
}
 
  this.draw()
 }//update

 draw() {
    
    if (this.hasmagnet == true) {
    			ctx.beginPath()
    			ctx.fillStyle = "rgba(255, 255, 255, .35)"
       ctx.arc(this.x, this.y, this.radius+5, 0, Math.PI*2)
       ctx.fill()
       ctx.closePath()
    }
    
    ctx.beginPath()
    ctx.shadowColor = this.shadCol
    ctx.shadowBlur = this.shadowV
    ctx.fillStyle = "white"
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2)
    ctx.fill()
    ctx.closePath()
    ctx.shadowBlur = 0
    
  }//draw    
   
}//player



class Obstacle{
    constructor(bcx, y, width, height){
     	this.bcx = bcx
      this.y = y
      this.width = width
      this.height = height
    }
    
 update(){
 
   this.x = this.bcx - this.width/2
   this.x2 = this.bcx
   this.y2 = this.height
   this.x3 = this.x + this.width
   this.y3 = this.y
 
  if(gameEnd == false){
    this.bcx -= camVelocity
   }
   
   if (gameEnd == false) {
   if (this.x < -(this.width*2)) {
    obstacles.splice(this.obstacle, 1)
    player.score++;
   }
   }
   
   this.draw()
 }//update
    
  draw(){
   
   ctx.beginPath()
   ctx.fillStyle = "#F92782"
   ctx.moveTo(this.x, this.y)
   ctx.lineTo(this.x2, this.y2)
   ctx.lineTo(this.x3, this.y3)
   ctx.closePath()
   ctx.fill()
   
  }//draw
    
}//obstacle


class Coin{
 	constructor(x, y, radius){
			this.x = x
			this.y = y 
			this.radius = radius
	}
	
	update(){
		
		this.x -= camVelocity+.7
		
		if (player.hasmagnet == true) {
				this.y = player.y
				
		}
	
		if (this.x + this.radius < 0) {
				coins.splice(this.coin, 1)
		}
			
		this.draw()
	}
	draw(){
			
			ctx.beginPath()
			ctx.strokeStyle = "#28DF28"
			ctx.lineWidth = 3
		ctx.moveTo(this.x, this.y)
		ctx.lineTo(this.x+7, this.y)
			ctx.stroke()
			ctx.closePath()
	}
}

class Magnet{
 	constructor(x, y, radius){
			this.x = x
			this.y = y 
			this.radius = radius
	}
	
	update(){
		
		this.x -= camVelocity+.6
		
		if (this.x + this.radius < 0) {
				this.x = randomIntFromRange(canvas.width*4, canvas.width*8)
				this.y = randomIntFromRange(100, canvas.height - 100)
		}
			
		this.draw()
	}
	draw(){
			
			ctx.beginPath()
			ctx.fillStyle = "#F9ED69"
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2)
			ctx.fill()
			ctx.closePath()
	}
}

//__FUNCTIONS______________________________\\

canvas.onclick = function(){
//if(gameEnd == false){
  		player.jumping = true;
    player.velY = 6;
    player.shadCol = "#F92782"
    player.shadowV = 18
  //  }
  }
  
  
submit.onclick = function(){
  
 
 	var data = {
  	   name: name.value,
  	   score: player.score
    }
    
       
 if (checkName(name.value) == true) {
 
  console.log(data.score)
  
   if (totalG < maxData) {
  	   ref.push(data)
    }
   else if(dataArr[dataArr.length - 1].point < data.score){
   console.log("hlo")
   
   	ref.push(data)
   	
   	ref = database.ref("scores");
   	
   	let docid = dataArr[dataArr.length - 1].key
   	
   	database.ref("scores").child(docid).remove();
   	
   	submit.style.display = "none"
   	
   }
   
  else{
  		alert("YOUR SCORE IS NOT SUFFICIENT")
  }
  
  
 }

  else{
  		alert("YOUR NAME IS NOT VALID")
  }
       
   
}//click

backMenu.onclick = function(){
		boardCon.style.display = "none";
}


  start.onclick = function(){
     gameEnd = false;
     player.y = canvas.height/2
     submit.style.display = "block"
     player.score = 0
     	coins = []
     obstacles = []
     magnet.x = canvas.width*5
     player.hasmagnet = false;
      player.boost = 1;
     player.velY = 1;
  			menu.style.display = "none";
  			sdis.style.display = "flex"
  }
  play.onclick = function(){
     gameEnd = false;
     player.y = canvas.height/2
     player.score = 0
     	coins = []
     obstacles = []
     magnet.x = canvas.width*5
     player.hasmagnet = false;
      player.boost = 1;
     player.velY = 1;
  			home.style.display = "none";
  			sdis.style.display = "flex"
  }
  
 function magHan(){
 		player.hasmagnet = false
 }
 
 function magDur(){
   setTimeout(magHan, 3200)
 }

function checkName(string){

let hasNum = /\d/.test(string);

	if (string.length > 2 && name.value.length < 9 && hasNum == false) {
  	 name.style.color = "#4AFF84"
  	 return true;
  }
 else{
  	name.style.color = 	"#F83800"
  	return false;
  }
 }
  
function spawnOb() {

let oS = randomIntFromRange(70, 120);
let oX = canvas.width + canvas.width/2

let oW = randomIntFromRange(150, 380);
let oH = randomIntFromRange(80, canvas.height - (oS + 80))
let oY = 0

let oW2 = randomIntFromRange(150, 380)
let oH2 = oY + oH + oS
let oY2 = canvas.height

let cox = oX + oW
let coy = randomIntFromRange(oH - 50, oH + 50)
let cor = 4

obstacles.push(new Obstacle(oX, oY, oW, oH));
obstacles.push(new Obstacle(oX, oY2, oW2, oH2));
coins.push(new Coin(cox, coy, cor))
}

	
if(gameEnd == false) {
 setInterval(spawnOb, 1500);	
}


// Implementation________________________\\
let player;
let obstacles;
let coins;
let magnet;
function init() {
obstacles = [];
coins = [];
let pR = 8;
let pX = canvas.width/4;
let pY = canvas.height/2;

let mX = canvas.width*5
let mY = randomIntFromRange(200, canvas.height - 200)
let mR = 5
player = new Player(pX, pY, pR);
magnet = new Magnet(mX, mY, mR)
}


// Animation Loop__________________\\

function animate() {
requestAnimationFrame(animate)
 

 ctx.fillStyle = "rgba(0, 0, 0, .18)";
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  magnet.update()
  
  coins.forEach(coin => {
   coin.update()
   })
  
  obstacles.forEach(obstacle => {
   obstacle.update()
   })
   
   player.update();
   
   sdis.innerHTML= player.score
   checkName(name.value)
   
}

init()

animate()

}
