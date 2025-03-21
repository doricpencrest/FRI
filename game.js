class PongGame extends Phaser.Scene {
    constructor() {
        super();
        this.playerScore = 0;
        this.aiScore = 0;
        this.gameStarted = false;
    }


preload() {
    // Load background loop
    this.load.audio('backgroundLoop', 'assets/sounds/PONG_LOOP.wav');
    // Load PONG random 1 sounds (for 0-4s and 10-15s)
    this.load.audio('pong1_1', 'assets/sounds/PONG_random_1-001.wav');
    this.load.audio('pong1_2', 'assets/sounds/PONG_random_1-002.wav');
    this.load.audio('pong1_3', 'assets/sounds/PONG_random_1-003.wav');
    this.load.audio('pong1_4', 'assets/sounds/PONG_random_1-004.wav');
    this.load.audio('pong1_5', 'assets/sounds/PONG_random_1-005.wav');
    this.load.audio('pong1_6', 'assets/sounds/PONG_random_1-006.wav');
    // Load PONG random 2 sounds (for other times)
    this.load.audio('pong2_1', 'assets/sounds/PONG_random_2-001.wav');
    this.load.audio('pong2_2', 'assets/sounds/PONG_random_2-002.wav');
    this.load.audio('pong2_3', 'assets/sounds/PONG_random_2-003.wav');
    this.load.audio('pong2_4', 'assets/sounds/PONG_random_2-004.wav');
    this.load.audio('pong2_5', 'assets/sounds/PONG_random_2-005.wav');
    this.load.audio('pong2_6', 'assets/sounds/PONG_random_2-006.wav');
    this.load.audio('pong2_7', 'assets/sounds/PONG_random_2-007.wav');
}

    create() {
        // Create quit button
        this.quitButton = this.add.text(750, 30, 'QUIT', {
            fontFamily: 'Arial',
            fontSize: '24px',
            fontWeight: '300',
            color: '#FF6B8D',
            padding: {
                x: 10,
                y: 5
            }
        }).setOrigin(1, 0.5);
        this.quitButton.setInteractive({
            useHandCursor: true
        });
        this.quitButton.on('pointerdown', () => this.quitGame());
        // Set warm beige background
        this.cameras.main.setBackgroundColor('#F5E6D3');

        // Create custom paddles
        const paddleWidth = 15;
        const paddleHeight = 80;

        // Create player paddle
        this.playerPaddle = this.add.rectangle(50, 300, paddleWidth, paddleHeight, 0xFF6B8D);
        this.playerPaddle.setStrokeStyle(2, 0xFF6B8D);
        // Create AI paddle
        this.aiPaddle = this.add.rectangle(750, 300, paddleWidth, paddleHeight, 0xFF8B53);
        this.aiPaddle.setStrokeStyle(2, 0xFF8B53);

        // Add physics to paddles
        this.physics.add.existing(this.playerPaddle, true);
        this.physics.add.existing(this.aiPaddle, true);

        // Create custom ball
        const ballSize = 15;
        this.ball = this.add.circle(400, 300, ballSize / 2, 0xFF4D6B);
        this.ball.setStrokeStyle(2, 0xFF4D6B);
        this.physics.add.existing(this.ball);
        this.ball.body.setBounce(1, 1);
        this.ball.body.setCollideWorldBounds(true);
        this.ball.body.onWorldBounds = true;

        // Adjust ball's physics body size
        this.ball.body.setCircle(ballSize / 2);

        // Set up collision detection with sound effects
        this.physics.add.collider(this.ball, this.playerPaddle, this.handlePaddleHit, null, this);
        this.physics.add.collider(this.ball, this.aiPaddle);
        // Setup background loop
        this.backgroundMusic = this.sound.add('backgroundLoop', {
            loop: true
        });

        // Initialize sound arrays
        this.pong1Sounds = ['pong1_1', 'pong1_2', 'pong1_3', 'pong1_4', 'pong1_5', 'pong1_6'];
        this.pong2Sounds = ['pong2_1', 'pong2_2', 'pong2_3', 'pong2_4', 'pong2_5', 'pong2_6', 'pong2_7'];

        // Create minimal style start text
        this.startText = this.add.text(400, 280, 'press space', {
            fontFamily: 'Arial',
            fontSize: '32px',
            fontWeight: '300',
            color: '#FF6B8D',
            padding: {
                x: 20,
                y: 10
            }
        });
        this.startText.setOrigin(0.5);

        // Handle ball going out of bounds
        this.physics.world.on('worldbounds', this.handleBallOut, this);

        // Input
        this.cursors = this.input.keyboard.createCursorKeys();

        // Start game on space press
        this.input.keyboard.on('keydown-SPACE', function () {
    if (!this.gameStarted) {
        this.startGame();
    }
}, this);

        // Add soft glow effect to paddles and ball
        this.addSoftGlowEffect(this.playerPaddle, 0xFF6B8D);
        this.addSoftGlowEffect(this.aiPaddle, 0xFF8B53);
        this.addSoftGlowEffect(this.ball, 0xFF4D6B);
    }

    addSoftGlowEffect(object, color) {
        const intensity = 0.3;
        this.tweens.add({
            targets: object,
            alpha: {
                from: 1,
                to: 0.85
            },
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            duration: 1500
        });
    }

    startGame() {
        this.gameStarted = true;
        this.startText.setVisible(false);

        // Start the background music with fade-in effect
        if (!this.backgroundMusic.isPlaying) {
            this.backgroundMusic.setVolume(0);
            this.backgroundMusic.play();
            this.tweens.add({
                targets: this.backgroundMusic,
                volume: 1,
                duration: 3000,
                ease: 'Linear'
            });
        }

        const velocityX = (Math.random() < 0.5 ? -1 : 1) * 300;
        const velocityY = (Math.random() * 200) - 100;
        this.ball.body.setVelocity(velocityX, velocityY);
    }

    handleBallOut(body, up, down, left, right) {
        if (left || right) {
            if (left) {
                this.aiScore += 1;
                // Update AI score display
            } else if (right) {
                this.playerScore += 1;
                // Update player score display
            }

            this.ball.setPosition(400, 300);
            this.ball.body.setVelocity(0, 0);

            this.time.delayedCall(1000, () => {
                if (this.gameStarted) {
                    const velocityX = (Math.random() < 0.5 ? -1 : 1) * 300;
                    const velocityY = (Math.random() * 200) - 100;
                    this.ball.body.setVelocity(velocityX, velocityY);
                }
            });
        }
    }

    update() {
        // Player paddle movement
        if (this.cursors.up.isDown && this.playerPaddle.y > 50) {
            this.playerPaddle.y -= 5;
            this.playerPaddle.body.y = this.playerPaddle.y - this.playerPaddle.height / 2;
        } else if (this.cursors.down.isDown && this.playerPaddle.y < 550) {
            this.playerPaddle.y += 5;
            this.playerPaddle.body.y = this.playerPaddle.y - this.playerPaddle.height / 2;
        }
        // Simple AI for opponent paddle
        const aiSpeed = 4;
        if (this.ball.y < this.aiPaddle.y && this.aiPaddle.y > 50) {
            this.aiPaddle.y -= aiSpeed;
            this.aiPaddle.body.y = this.aiPaddle.y - this.aiPaddle.height / 2;
        } else if (this.ball.y > this.aiPaddle.y && this.aiPaddle.y < 550) {
            this.aiPaddle.y += aiSpeed;
            this.aiPaddle.body.y = this.aiPaddle.y - this.aiPaddle.height / 2;
        }
    }
    handlePaddleHit(ball, paddle) {
        // Only play sounds for the pink (player) paddle
        if (paddle === this.playerPaddle) {
            const currentTime = this.backgroundMusic.seek;

            // Choose appropriate sound set based on timing
            let soundToPlay;
            if ((currentTime >= 0 && currentTime <= 4) || (currentTime >= 10 && currentTime <= 15)) {
                // Play random PONG random 1 sound
                const randomIndex = Math.floor(Math.random() * this.pong1Sounds.length);
                soundToPlay = this.pong1Sounds[randomIndex];
            } else {
                // Play random PONG random 2 sound
                const randomIndex = Math.floor(Math.random() * this.pong2Sounds.length);
                soundToPlay = this.pong2Sounds[randomIndex];
            }

            // Play the selected sound
            this.sound.play(soundToPlay);
        }
    }
    quitGame() {
        // Fade out music
        if (this.backgroundMusic && this.backgroundMusic.isPlaying) {
            this.tweens.add({
                targets: this.backgroundMusic,
                volume: 0,
                duration: 3000,
                onComplete: () => {
                    this.backgroundMusic.stop();
                }
            });
        }
        // Reset game state
        this.gameStarted = false;
        this.playerScore = 0;
        this.aiScore = 0;
        // Reset ball position and velocity
        this.ball.setPosition(400, 300);
        this.ball.body.setVelocity(0, 0);
        // Reset paddle positions
        this.playerPaddle.y = 300;
        this.aiPaddle.y = 300;
        this.playerPaddle.body.y = this.playerPaddle.y - this.playerPaddle.height / 2;
        this.aiPaddle.body.y = this.aiPaddle.y - this.aiPaddle.height / 2;
        // Show start text again
        this.startText.setVisible(true);
    }
}

const container = document.getElementById('renderDiv');
const config = {
    type: Phaser.AUTO,
    parent: container,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: PongGame
};

window.phaserGame = new Phaser.Game(config);
