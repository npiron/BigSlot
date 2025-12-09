import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.symbols = ['🍒', '🍋', '🍊', '🍉', '⭐', '💎', '7️⃣'];
    this.reels = [];
    this.isSpinning = false;
    this.credits = 1000;
    this.bet = 10;
    this.winAmount = 0;
  }

  preload() {
    // Les symboles seront créés avec du texte
  }

  create() {
    // Titre du jeu
    this.add.text(400, 40, 'BIGSLOT CASINO', {
      fontSize: '48px',
      fontStyle: 'bold',
      color: '#ffd700',
      stroke: '#000',
      strokeThickness: 6
    }).setOrigin(0.5);

    // Créer la machine à sous
    this.createSlotMachine();
    
    // Créer l'interface utilisateur
    this.createUI();
    
    // Créer les contrôles
    this.createControls();
  }

  createSlotMachine() {
    const reelWidth = 120;
    const reelHeight = 360;
    const startX = 220;
    const startY = 150;
    
    // Fond de la machine à sous
    const slotBg = this.add.rectangle(400, 310, 400, 420, 0x2c3e50);
    slotBg.setStrokeStyle(4, 0xffd700);
    
    // Créer 3 rouleaux
    for (let i = 0; i < 3; i++) {
      const x = startX + i * (reelWidth + 20);
      
      // Fond du rouleau
      const reelBg = this.add.rectangle(x, startY + reelHeight / 2, reelWidth, reelHeight, 0x34495e);
      reelBg.setStrokeStyle(2, 0x95a5a6);
      
      // Conteneur pour les symboles du rouleau
      const reel = {
        container: this.add.container(x, startY),
        symbols: [],
        targetIndex: 0,
        spinSpeed: 0
      };
      
      // Créer les symboles pour ce rouleau (7 symboles visibles)
      for (let j = 0; j < 7; j++) {
        const symbol = this.add.text(0, j * 120, this.getRandomSymbol(), {
          fontSize: '64px',
          align: 'center'
        }).setOrigin(0.5);
        
        reel.symbols.push(symbol);
        reel.container.add(symbol);
      }
      
      this.reels.push(reel);
    }
    
    // Masque pour ne montrer que 3 symboles
    const maskShape = this.make.graphics();
    maskShape.fillStyle(0xffffff);
    maskShape.fillRect(startX - reelWidth / 2, startY - 60, (reelWidth + 20) * 3 - 20, 360);
    
    this.reels.forEach(reel => {
      const mask = maskShape.createGeometryMask();
      reel.container.setMask(mask);
    });
    
    // Lignes de paiement
    this.add.line(400, startY + 180, -180, 0, 180, 0, 0xff0000, 0.5).setLineWidth(3);
    this.add.line(400, startY + 60, -180, 0, 180, 0, 0xff0000, 0.3).setLineWidth(2);
    this.add.line(400, startY + 300, -180, 0, 180, 0, 0xff0000, 0.3).setLineWidth(2);
  }

  createUI() {
    // Panneau des crédits
    const uiY = 540;
    
    // Crédits
    this.creditsText = this.add.text(150, uiY, `Crédits: ${this.credits}`, {
      fontSize: '24px',
      fontStyle: 'bold',
      color: '#ffffff',
      backgroundColor: '#2c3e50',
      padding: { x: 15, y: 10 }
    });
    
    // Mise
    this.betText = this.add.text(400, uiY, `Mise: ${this.bet}`, {
      fontSize: '24px',
      fontStyle: 'bold',
      color: '#ffffff',
      backgroundColor: '#2c3e50',
      padding: { x: 15, y: 10 }
    }).setOrigin(0.5, 0);
    
    // Gain
    this.winText = this.add.text(650, uiY, `Gain: ${this.winAmount}`, {
      fontSize: '24px',
      fontStyle: 'bold',
      color: '#ffd700',
      backgroundColor: '#2c3e50',
      padding: { x: 15, y: 10 }
    }).setOrigin(1, 0);
  }

  createControls() {
    // Bouton SPIN
    const spinButton = this.add.rectangle(400, 480, 200, 60, 0x27ae60);
    spinButton.setStrokeStyle(3, 0xffd700);
    spinButton.setInteractive({ useHandCursor: true });
    
    const spinText = this.add.text(400, 480, 'SPIN', {
      fontSize: '32px',
      fontStyle: 'bold',
      color: '#ffffff'
    }).setOrigin(0.5);
    
    spinButton.on('pointerdown', () => {
      if (!this.isSpinning && this.credits >= this.bet) {
        this.spin();
      }
    });
    
    spinButton.on('pointerover', () => {
      spinButton.setFillStyle(0x2ecc71);
    });
    
    spinButton.on('pointerout', () => {
      spinButton.setFillStyle(0x27ae60);
    });
    
    // Boutons de mise
    const betMinusButton = this.add.rectangle(300, 540, 40, 40, 0xe74c3c);
    betMinusButton.setStrokeStyle(2, 0xffffff);
    betMinusButton.setInteractive({ useHandCursor: true });
    this.add.text(300, 540, '-', {
      fontSize: '32px',
      fontStyle: 'bold',
      color: '#ffffff'
    }).setOrigin(0.5);
    
    betMinusButton.on('pointerdown', () => {
      if (!this.isSpinning && this.bet > 10) {
        this.bet -= 10;
        this.updateUI();
      }
    });
    
    const betPlusButton = this.add.rectangle(500, 540, 40, 40, 0x27ae60);
    betPlusButton.setStrokeStyle(2, 0xffffff);
    betPlusButton.setInteractive({ useHandCursor: true });
    this.add.text(500, 540, '+', {
      fontSize: '32px',
      fontStyle: 'bold',
      color: '#ffffff'
    }).setOrigin(0.5);
    
    betPlusButton.on('pointerdown', () => {
      if (!this.isSpinning && this.bet < 100) {
        this.bet += 10;
        this.updateUI();
      }
    });
  }

  getRandomSymbol() {
    return this.symbols[Math.floor(Math.random() * this.symbols.length)];
  }

  spin() {
    if (this.isSpinning) return;
    
    this.isSpinning = true;
    this.credits -= this.bet;
    this.winAmount = 0;
    this.updateUI();
    
    // Démarrer la rotation de chaque rouleau
    this.reels.forEach((reel, index) => {
      reel.spinSpeed = 30 + Math.random() * 10;
      reel.targetIndex = Math.floor(Math.random() * this.symbols.length);
      reel.stopTime = 1000 + index * 500; // Arrêt échelonné
      reel.elapsed = 0;
    });
    
    // Animation de rotation
    this.time.addEvent({
      delay: 50,
      callback: this.updateReels,
      callbackScope: this,
      loop: true
    });
  }

  updateReels() {
    let allStopped = true;
    
    this.reels.forEach(reel => {
      if (reel.spinSpeed > 0) {
        allStopped = false;
        reel.elapsed += 50;
        
        // Déplacer les symboles vers le bas
        reel.symbols.forEach(symbol => {
          symbol.y += reel.spinSpeed;
          
          // Recycler les symboles qui sortent
          if (symbol.y > 360) {
            symbol.y -= 840; // 7 symboles * 120
            symbol.setText(this.getRandomSymbol());
          }
        });
        
        // Ralentir progressivement
        if (reel.elapsed > reel.stopTime) {
          reel.spinSpeed *= 0.9;
          
          if (reel.spinSpeed < 1) {
            reel.spinSpeed = 0;
            this.alignReel(reel);
          }
        }
      }
    });
    
    if (allStopped) {
      this.isSpinning = false;
      this.checkWin();
    }
  }

  alignReel(reel) {
    // Aligner les symboles sur la grille
    const snapPositions = [0, 120, 240];
    
    reel.symbols.forEach((symbol, index) => {
      const targetY = index * 120;
      symbol.y = targetY;
    });
  }

  checkWin() {
    // Obtenir les symboles visibles (indices 1, 2, 3 = ligne du milieu)
    const visibleSymbols = this.reels.map(reel => {
      const middleSymbol = reel.symbols.find(s => Math.abs(s.y - 120) < 10);
      return middleSymbol ? middleSymbol.text : '';
    });
    
    // Vérifier la ligne du milieu
    if (visibleSymbols[0] === visibleSymbols[1] && visibleSymbols[1] === visibleSymbols[2]) {
      // Gagné!
      const symbol = visibleSymbols[0];
      const multiplier = this.getMultiplier(symbol);
      this.winAmount = this.bet * multiplier;
      this.credits += this.winAmount;
      
      // Animation de victoire
      this.showWinAnimation();
    }
    
    this.updateUI();
  }

  getMultiplier(symbol) {
    const multipliers = {
      '🍒': 5,
      '🍋': 5,
      '🍊': 10,
      '🍉': 10,
      '⭐': 20,
      '💎': 50,
      '7️⃣': 100
    };
    
    return multipliers[symbol] || 2;
  }

  showWinAnimation() {
    const winText = this.add.text(400, 300, `GAGNÉ!\n+${this.winAmount} crédits!`, {
      fontSize: '48px',
      fontStyle: 'bold',
      color: '#ffd700',
      stroke: '#000',
      strokeThickness: 6,
      align: 'center'
    }).setOrigin(0.5).setAlpha(0);
    
    this.tweens.add({
      targets: winText,
      alpha: 1,
      scale: { from: 0.5, to: 1.2 },
      duration: 500,
      yoyo: true,
      onComplete: () => {
        winText.destroy();
      }
    });
  }

  updateUI() {
    this.creditsText.setText(`Crédits: ${this.credits}`);
    this.betText.setText(`Mise: ${this.bet}`);
    this.winText.setText(`Gain: ${this.winAmount}`);
  }

  update() {
    // Mise à jour continue si nécessaire
  }
}
