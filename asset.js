/*	
 *	Generic base Asset
 *	Contains properties relative to all in-game assets
 */
 
var Asset = Base.extend({
	collidable: true,
	health: 100,
	type: "generic",
	alive: true
});

/*	
 *	Player
 *	Inherits from Asset
 */

var Player = Asset.extend({
	
	init: function(){
		
		this.width = 32;	// width in px
		this.height = 32;	// height in px
		this.x = 32;
		this.y = 32;
		this.movement = 32;
		this.image = "http://www.mikedoesweb.com/sandbox/game/images/player.png";
		this.collidable = true;
		this.health = 100;
		this.type = "player";
		this.degrees = 90;
	},
	
	update: function(key, collisionType){
		//Save the current coords, in case of meeting a barrier
		this.oldx = this.x;
		this.oldy = this.y;
		//For even movement, move the player in fractions of the height dimention
		
		if(collisionType == "enemy"){
			this.health -= 1;
			if(this.health < 50){
				this.image = "http://www.mikedoesweb.com/sandbox/game/images/frowney.png"
			}
			if(this.health < 1){
				this.alive = false;
			}
			game.events.publishEvent('player health', this.health);
		}
		
		switch(key){
			case "Left":
				//console.log("Pressed left!");
				this.x -= this.movement;
				return true;
				break;
			case "Right":
				//console.log("Pressed Right!");
				this.x += this.movement;
				return true;
				break;
			case "Up":
				//console.log("Pressed Up!");
				this.y -= this.movement;
				return true;
				break;
			case "Down":
				//console.log("Pressed Down!");
				this.y += this.movement;
				return true;
				break;
		    case "m":
		        //console.log("Pressed Down!");
		        game.sound.volume(0.0);
		        break;
			case "Space":
			    game.addAsset(new Bullet(this.x + 32, this.y + 16));
			    game.sound.play("audio/shot.mp3");
				break;
		}
	}	
});

/*	
 *	Enemy
 *	Inherits from Asset
 */

var Enemy = Asset.extend({
	//fowney guy
	init: function(){
	
		this.width = 32;	// width in px
		this.height = 32;	// height in px
		this.x = 160;
		this.y = 160;
		this.image = "http://www.mikedoesweb.com/sandbox/game/images/mario.png";
		this.collidable = true;
		this.orig_x = this.x;
		this.orig_y = this.y;
		this.limit = 32;
		this.direction = "left";
		this.type = "enemy";
		this.alive =  true;
	},
	
	update: function(key, collisionType){
		
		if(this.direction == "left"){
			this.x -= 4;
		}
		else if(this.direction == "right"){
			this.x += 4;
		}
		
		if(this.direction == "left"){
			if (this.orig_x >= this.x + this.limit){
				this.direction = "right";
			}
		}else{
			if (this.x >= this.orig_x + this.limit){
				this.direction = "left";
			}
		}

		if (collisionType == "bullet") {
			console.log("Collided with bullet");
		    this.alive = false;
		}
			
		return true;
	}
});

/*	
 *	Boat
 *	Inherits from Asset
 */

var Boat = Asset.extend({
	//boat in water
	init: function(){	
	
		this.width = 64;	// width in px
		this.height = 32;	// height in px
		this.x = 158;
		this.y = 280;
		this.image = "http://www.mikedoesweb.com/sandbox/game/images/boat.png";
		this.collidable = false,
		this.orig_x = this.x;
		this.orig_y = this.y;
		this.limit = 64;
		this.direction = "right";
		this.type = "enemy";
		this.alive =  true;
	},
	
	update: function(key){
		
		if(this.direction == "left"){
			this.x -= 1;
		}
		else if(this.direction == "right"){
			this.x += 1;
		}
		
		if(this.direction == "left"){
			if (this.orig_x >= this.x + this.limit){
				this.direction = "right";
			}
		}else{
			if (this.x >= this.orig_x + this.limit){
				this.direction = "left";
			}
		}
			
		return true;
	}
});

/*	
 *	Bullet
 *	Inherits from Asset
 */
 
var Bullet = Asset.extend({
	constructor: function(x,y){
		this.x = x;
		this.y = y;
	},
	
	init: function(){	
	    this.type = "bullet";
		this.offMapDestroy = true;
		this.width = 8;
		this.height = 8;
		this.image = "http://www.mikedoesweb.com/sandbox/game/images/bullet.png";
		this.collidable = true;
		this.alive =  true;
	},
	
	update: function(){
		this.x += 8;
		return true;
	} 
 });
 
 var PlayerHealth = Asset.extend({
     constructor: function(){
         this.type = "GUI";
     },
     init: function () {
        this.alive = true;
        this.font = "14px Arial"; 
        this.x = 10;
        this.y = 345;
        this.color = "#ffffff";
        this.value = "Health: 100%";
		me = this;
		game.events.listenFor('player health', function(data){
			me.value = "Health: " + data + "%";
		});
     },
     update: function(){
        this.value = this.value;
     }
 });
 
 
 var VolumeControl = Asset.extend({
	constructor: function(){
         this.type = "GUI";
    },
	init: function(){
		this.alive = true;
        this.font = "14px Arial";
        this.x = 300;
        this.y = 345;
        this.color = "#ffffff";
        this.value = "Sound: ON";
		this.volume = 100;
	},
	update: function(key){
	
		if(key){
			switch(key){
				case "1":
					this.volume = 0;
					this.value = "Sound: OFF"
					break;
				case "2":
					this.volume -= 10;
					if(this.volume <= 0){
						this.volume = 0;
						this.value = "Sound: OFF";
					}else{
						this.value = "Sound: " + this.volume + "%";
					}
					break;
				case "3":
					this.volume += 10;
					if(this.volume >= 100){
						this.volume = 100;
						this.value = "Sound: ON";
					}else{
						this.value = "Sound: " + this.volume  + "%";
					}
					
					break;
				case "4":
					this.volume = 100;
					this.value = "Sound: ON";
					break;
			}			
			
			game.sound.volume(this.volume / 100);
		}
	},
 });
