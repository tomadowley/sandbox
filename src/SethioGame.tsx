import React, { useEffect, useRef } from "react";
import Phaser from "phaser";

const GAME_WIDTH = 480;
const GAME_HEIGHT = 800;

class SethioScene extends Phaser.Scene {
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | undefined;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
  payingStrippers: Phaser.Physics.Arcade.Group | undefined;
  cats: Phaser.Physics.Arcade.Group | undefined;
  hotChocolates: Phaser.Physics.Arcade.Group | undefined;
  score = 0;
  scoreText: Phaser.GameObjects.Text | undefined;

  constructor() {
    super("SethioScene");
  }

  preload() {
    // For now, just use graphics—not images
  }

  create() {
    this.score = 0;

    // Add simple platforms
    const platforms = this.physics.add.staticGroup();
    platforms.create(GAME_WIDTH / 2, GAME_HEIGHT - 32, "ground")
      .setScale(2)
      .refreshBody();

    // Player: blue square
    this.player = this.physics.add.sprite(100, GAME_HEIGHT - 100, "")
      .setDisplaySize(32, 32)
      .setTint(0x3399ff)
      .setBounce(0.2)
      .setCollideWorldBounds(true);

    // Strippers: red rectangles ("avoid paying")
    this.payingStrippers = this.physics.add.group();
    for (let i = 0; i < 3; i++) {
      const y = 500 - i * 100;
      const stripper = this.payingStrippers.create(200 + 50 * i, y, "")
        .setDisplaySize(30, 50)
        .setTint(0xff3366)
        .setImmovable(true);
    }

    // Cats: orange squares ("kickable")
    this.cats = this.physics.add.group();
    for (let i = 0; i < 2; i++) {
      const cat = this.cats.create(330 + i * 50, 700 - i * 70, "")
        .setDisplaySize(36, 36)
        .setTint(0xff9900);
    }

    // Hot chocolate powder: brown circles (collectibles)
    this.hotChocolates = this.physics.add.group();
    for (let i = 0; i < 5; i++) {
      const hc = this.hotChocolates.create(60 + i * 80, 350 - i * 30, "")
        .setCircle(16)
        .setDisplaySize(32, 32)
        .setTint(0x8b5c2a);
    }

    // Enable collisions
    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(this.cats, platforms);
    this.physics.add.collider(this.payingStrippers, platforms);

    // Overlap checks for collisions with strippers (reset game)
    this.physics.add.overlap(
      this.player,
      this.payingStrippers,
      this.handleHitStripper,
      undefined,
      this
    );

    // Overlap with hot chocolate (collect)
    this.physics.add.overlap(
      this.player,
      this.hotChocolates,
      this.collectHotChocolate,
      undefined,
      this
    );

    // Overlap with cats (kick)
    this.physics.add.overlap(
      this.player,
      this.cats,
      this.kickCat,
      undefined,
      this
    );

    // Inputs
    this.cursors = this.input.keyboard?.createCursorKeys();

    // Score
    this.scoreText = this.add.text(16, 16, "Score: 0", {
      fontSize: "24px",
      color: "#fff"
    })
    .setScrollFactor(0);
  }

  handleHitStripper(
    player: Phaser.GameObjects.GameObject,
    stripper: Phaser.GameObjects.GameObject
  ) {
    // "Paying a stripper" = game over!
    this.scene.restart();
  }

  collectHotChocolate(
    playerObj: Phaser.GameObjects.GameObject,
    hc: Phaser.GameObjects.GameObject
  ) {
    // Remove hot chocolate and increment score
    hc.destroy();
    this.score += 10;
    this.scoreText?.setText("Score: " + this.score);
  }

  kickCat(
    playerObj: Phaser.GameObjects.GameObject,
    catObj: Phaser.GameObjects.GameObject
  ) {
    // "Kick" the cat = make it fly off
    this.tweens.add({
      targets: catObj,
      y: "-=100",
      alpha: 0,
      duration: 400,
      onComplete: () => catObj.destroy(),
    });
    this.score += 5;
    this.scoreText?.setText("Score: " + this.score);
  }

  update() {
    if (!this.player || !this.cursors) return;

    if (this.cursors.left?.isDown) {
      this.player.setVelocityX(-160);
    } else if (this.cursors.right?.isDown) {
      this.player.setVelocityX(160);
    } else {
      this.player.setVelocityX(0);
    }

    if (
      (this.cursors.up?.isDown || this.cursors.space?.isDown) &&
      this.player.body.touching.down
    ) {
      this.player.setVelocityY(-420);
    }
  }
}

export default function SethioGame() {
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let game: Phaser.Game | null = null;
    if (gameRef.current) {
      game = new Phaser.Game({
        type: Phaser.AUTO,
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        parent: gameRef.current,
        physics: {
          default: "arcade",
          arcade: {
            gravity: { y: 900 },
            debug: false,
          },
        },
        backgroundColor: "#394546",
        scene: SethioScene,
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
      });
    }
    return () => {
      game?.destroy(true);
    };
  }, []);

  return (
    <div
      ref={gameRef}
      style={{
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        margin: "0 auto",
        touchAction: "none",
      }}
    />
  );
}