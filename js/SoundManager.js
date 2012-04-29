/**
 * @author Troy
 */

function SoundManager(){
	this.bgMusic = null;
	
	this.bgMusicGain = 1;
	
	this.loadMusic();
}

SoundManager.prototype.loadMusic = function(){
    if(!window.isMobileDevice){
        // Initialize BgMusic
        var __self = this;

        this.bgMusic = new Sound(CONFIG.bgSound);
        this.bgMusic.volume(CONFIG.soundVolume);
        this.bgMusic.on('load', function(){
            // set intialized sound
        });

		var __self = this;
        this.bgMusic.on('audioprocess', function(input){
            var bars = input.length,
            		i = 0,
            		sum = 0;
                
                for(; i < bars; i += 1){
					sum += input[i];         	
                }
                
                __self.bgMusicGain = (sum / bars);
                /*
           _.each(__self.particles.vertices, function (vertex, i) {
               percentage = (Math.abs(vertex.position.z) - Math.abs(window.levelProgress))/Math.abs(CONFIG.viewDistance*20);
               //(Math.abs(window.levelProgress - CONFIG.viewDistance*20) - Math.abs(window.levelProgress));
               index = bars - 1 - Math.floor(percentage * bars);

               __self.attributes.size.value[i] = input[index]/100 + 3;
           });
           __self.attributes.size.needsUpdate = true;
           */
        });

        this.bgMusic.on('progress', function(loaded, total){
            var progress = loaded / total;
        });
    }
};

SoundManager.prototype.playMusic = function(){
	this.bgMusic.play();
}

SoundManager.prototype.pauseMusic = function(){
	this.bgMusic.pause();
}
