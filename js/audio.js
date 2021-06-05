let jumpSound;
let coinSound;
let hitSound;
let backSound;
let clickSound;
let magnetSound;

function sound(src, loopV, vol) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    if (isNaN(vol)) { 
      vol = .1; 
    } 
    this.sound.volume = parseFloat(vol)
    this.sound.loop = loopV;
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
      }
    }
    

jumpSound = new sound("audio/jump.mp3", false, 1)
coinSound = new sound("audio/coin.mp3", false, 1)
hitSound = new sound("audio/hit.ogg", false)
clickSound = new sound("audio/btnClick.ogg", false, 1)
backSound = new sound("audio/backLoop.mp3", true, 0.28)
magnetSound = new sound("audio/magnet.ogg", false, 1)
