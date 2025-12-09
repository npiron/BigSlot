import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload(): void {
        const { width, height } = this.cameras.main;

        // Loading bar
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

        const loadingText = this.add.text(width / 2, height / 2 - 50, 'LOADING...', {
            fontFamily: '"Courier New", monospace',
            fontSize: '32px',
            color: '#00FF41',
        });
        loadingText.setOrigin(0.5);

        const percentText = this.add.text(width / 2, height / 2, '0%', {
            fontFamily: '"Courier New", monospace',
            fontSize: '24px',
            color: '#FFFFFF',
        });
        percentText.setOrigin(0.5);

        // Update progress bar
        this.load.on('progress', (value: number) => {
            percentText.setText(`${Math.floor(value * 100)}%`);
            progressBar.clear();
            progressBar.fillStyle(0x00FF41, 1);
            progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
        });

        // === BACKGROUNDS ===
        this.load.image('casinoBackground', 'assets/main-back.jpg');
        this.load.image('customBackground', 'assets/backgrounds/casino_bg.png');

        // === NEW MODERN 3D SYMBOLS ===
        this.load.image('symbol_lucky7', 'assets/new-symbols/lucky7.png');
        this.load.image('symbol_diamond', 'assets/new-symbols/diamond.png');
        this.load.image('symbol_coins', 'assets/new-symbols/coins.png');
        this.load.image('symbol_bell', 'assets/new-symbols/bell.png');
        this.load.image('symbol_cherries', 'assets/new-symbols/cherries.png');
        this.load.image('symbol_clover', 'assets/new-symbols/clover.png');
        this.load.image('symbol_heart', 'assets/new-symbols/heart.png');



        // === MACHINE FRAME & UI ===
        this.load.image('slotFrame', 'assets/ui/frame.png');
        this.load.image('paylineFrame', 'assets/Slot Machine/Bare Bones Slot Machine Frame/paylineframe.png');

        // === PARTICLES ===
        this.load.image('particle_sparkle', 'assets/particles/sparkle.png');

        // === BUTTONS ===
        this.load.image('btnSpin', 'assets/Slot Machine/Bare Bones Slot Machine Frame/spin.png');
        this.load.image('btnSpinPressed', 'assets/Slot Machine/Bare Bones Slot Machine Frame/spin_pressed.png');
        this.load.image('btnBet', 'assets/Slot Machine/Bare Bones Slot Machine Frame/bet.png');
        this.load.image('btnBetPressed', 'assets/Slot Machine/Bare Bones Slot Machine Frame/bet_pressed.png');

        // === AUDIO - CASINO SOUNDS ===
        this.load.audio('spinStart', 'assets/kenney_casino-audio/Audio/card-slide-5.ogg');
        this.load.audio('spinStop', 'assets/kenney_casino-audio/Audio/chip-lay-1.ogg');
        this.load.audio('betClick', 'assets/kenney_casino-audio/Audio/chip-lay-2.ogg');
        this.load.audio('buttonClick', 'assets/kenney_casino-audio/Audio/card-place-1.ogg');

        // === AUDIO - COIN SOUNDS ===
        this.load.audio('winSmall', 'assets/Coins Sound Library/Wav/Coins_Few/Coins_Few_10.wav');
        this.load.audio('winMedium', 'assets/Coins Sound Library/Wav/Coins_Few/Coins_Few_25.wav');
        this.load.audio('winBig', 'assets/Coins Sound Library/Wav/Coins_Pouring/Coins_Pouring_05.wav');
        this.load.audio('winJackpot', 'assets/Coins Sound Library/Wav/Coins_Pouring/Coins_Pouring_20.wav');
        this.load.audio('coinDrop', 'assets/Coins Sound Library/Wav/Coins_Few/Coins_Few_00.wav');
    }

    create(): void {
        this.cameras.main.setBackgroundColor('#000814');

        // Fade transition to menu
        this.cameras.main.fadeIn(500, 0, 8, 20);

        this.time.delayedCall(500, () => {
            this.scene.start('MenuScene');
        });
    }
}
