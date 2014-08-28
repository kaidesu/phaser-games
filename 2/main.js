// We create our only state
var mainState = {
	// We define the 3 default Phaser functions
	preload: function() {
		// Load player sprite
		game.load.image('player', 'assets/player.png');

		// Load wall sprites
		game.load.image('wallV', 'assets/wallVertical.png');
		game.load.image('wallH', 'assets/wallHorizontal.png');

		// Load coin sprite
		game.load.image('coin', 'assets/coin.png');
	},

	create: function() {
		game.stage.backgroundColor = '#3498db';
		game.physics.startSystem(Phaser.Physics.ARCADE);

		this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
		this.player.anchor.setTo(0.5, 0.5);

		// Tell Phaser that the player will use the Arcade physics engine
		game.physics.arcade.enable(this.player);

		// Add vertical gravity to the player
		this.player.body.gravity.y = 500;

		this.cursor = game.input.keyboard.createCursorKeys();

		// Display the coin
		this.coin = game.add.sprite(60, 140, 'coin');

		// Add arcade physics to the coin
		game.physics.arcade.enable(this.coin);

		// Set the anchor point of the coin to its center
		this.coin.anchor.setTo(0.5, 0.5);

		// Display the score
		this.scoreLabel = game.add.text(30, 30, 'score: 0',
			{ font: '16px Ubuntu Mono', fill: '#ffffff' });

		// Initialize the score variable
		this.score = 0;

		this.createWorld();
	},

	update: function() {
		// Tell Phaser that the player and the walls should collide
		game.physics.arcade.collide(this.player, this.walls);

		this.movePlayer();

		if (!this.player.inWorld) {
			this.playerDie();
		}

		game.physics.arcade.overlap(this.player, this.coin, this.takeCoin, null, this);
	},

	movePlayer: function() {
		// If the left arrow key is pressed
		if (this.cursor.left.isDown) {
			// Move the player to the left
			this.player.body.velocity.x = -200;
		}

		// If the right arrow key is pressed
		else if (this.cursor.right.isDown) {
			// Move the player to the right
			this.player.body.velocity.x = 200;
		}

		// If neither the right or left arrow key is pressed
		else {
			// Stop the player
			this.player.body.velocity.x = 0;
		}

		// If the up arrow key is pressed and the player is touching the ground
		if (this.cursor.up.isDown && this.player.body.touching.down) {
			// Move the player upward (jump)
			this.player.body.velocity.y = -320;
		}
	},

	createWorld: function() {
		// Create a new group for our walls with Arcade physics
		this.walls = game.add.group();
		this.walls.enableBody = true;

		// Create 10 walls in the group
		game.add.sprite(0, 0, 'wallV', 0, this.walls);      // Left
		game.add.sprite(480, 0, 'wallV', 0, this.walls);    // Right

		game.add.sprite(0, 0, 'wallH', 0, this.walls);      // Top left
		game.add.sprite(300, 0, 'wallH', 0, this.walls);    // Top right
		game.add.sprite(0, 320, 'wallH', 0, this.walls);    // Bottm left
		game.add.sprite(300, 320, 'wallH', 0, this.walls);  // Bottom right

		game.add.sprite(-100, 160, 'wallH', 0, this.walls); // Middle left
		game.add.sprite(400, 160, 'wallH', 0, this.walls);  // Middle right

		var middleTop = game.add.sprite(100, 80, 'wallH', 0, this.walls);
		var middleBottom = game.add.sprite(100, 240, 'wallH', 0, this.walls);
		middleTop.scale.setTo(1.5, 1);
		middleBottom.scale.setTo(1.5, 1);

		// Set all the walls to be immovable
		this.walls.setAll('body.immovable', true);
	},

	playerDie: function() {
		game.state.start('main');
	},

	takeCoin: function() {
		// Update the score
		this.score += 5;
		this.scoreLabel.text = 'score: ' + this.score;

		// Change the coin position
		this.updateCoinPosition();
	},

	updateCoinPosition: function() {
		// Store all the possible coin positions in an array
		var coinPositions = [
			{x: 140, y: 60}, {x: 360, y: 60},   // Top row
			{x: 60, y: 140}, {x: 440, y: 140},  // Middle row
			{x: 130, y: 300}, {x: 370, y: 300}  // Bottom row
		];

		// Remove the current coin position from the array
		// Otherwise, the coin could appear at the same spot twice (or more)
		// in a row
		for (var i = 0; i < coinPositions.length; i++) {
			if (coinPositions[i].x === this.coin.x) {
				coinPositions.splice(i, 1);
			}
		}

		// Randomly select a position from the array
		var newPosition = coinPositions[
			game.rnd.integerInRange(0, coinPositions.length-1)
		];

		// Set the new position of the coin
		this.coin.reset(newPosition.x, newPosition.y);
	}
};

// Create a 500px by 340px game in the 'gameDiv' element of the index.html
var game = new Phaser.Game(500, 340, Phaser.AUTO, 'gameDiv');

// Add the 'mainState' to Phaser, and call it 'main'
game.state.add('main', mainState);
game.state.start('main');