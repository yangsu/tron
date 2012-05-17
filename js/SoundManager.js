/**
 * @author Troy Ferrell & Yang Su
 */

function SoundManager() {
    this.bgMusic = null;

    this.bgMusicGain = 1;

    this.loadMusic();
}

SoundManager.prototype.loadMusic = function () {
    if (!window.isMobileDevice) {
        // Initialize BgMusic
        this.bgMusic = new Sound(CONFIG.bgSound);
        this.bgMusic.volume(CONFIG.soundVolume);
        this.bgMusic.on('load', function () {
            // set intialized sound
        });

        var __self = this;
        this.bgMusic.on('audioprocess', function (input) {
            var bars = input.length,
                sum = 0,
                i;
            for (i = 0; i < bars; i += 1) {
                sum += input[i];
            }

            __self.bgMusicGain = (sum / bars);
        });

        this.bgMusic.on('progress', function (loaded, total) {
            var progress = loaded / total;
        });
    }
};

SoundManager.prototype.playMusic = function () {
   this.bgMusic.play();
};

SoundManager.prototype.pauseMusic = function () {
    this.bgMusic.pause();
};