/*!
 * Sound.js
 *
 * A Web Audio library with no dependencies
 *
 * Copyright 2011 Kevin Ennis
 * kevincennis.com
 * MIT licensed
 */

;(function(window, undefined){

    //~~~~~~~~~~~~~~~~~~~~~~~~~
    // Private method for assigning unique identifiers to each instance of Sound
    var guid = function(){
        return Date.now();
    },

    //~~~~~~~~~~~~~~~~~~~~~~~~~
    // Private lookup for instances of Sound by guid
    cache = {},

    //~~~~~~~~~~~~~~~~~~~~~~~~~
    // The Sound constructor
    Sound = function(url){
        if ( !(this instanceof Sound) ) return new Sound(url);
        this.url = url;
        if ( typeof AudioContext === 'function' )
            this.context = new AudioContext();
        else if ( typeof webkitAudioContext === 'function' )
            this.context = new webkitAudioContext();
        else return;
        this.callbacks = {};
        this.guid = guid();
        this.ready = false;
        this.fxReady;
        this.gain = this.context.createGainNode();
        this.analyser = this.context.createAnalyser();
        this.analyser.smoothingTimeConstant = 0.4;
        // this.analyser.fftSize = 64;
        this.processor = this.context.createJavaScriptNode(2048, 1, 1);
        cache[this.guid] = this;
        this.load();
    };

    //~~~~~~~~~~~~~~~~~~~~~~~~~
    // Load the sound file
    Sound.prototype.load = function(){
        var self = this, request = new XMLHttpRequest();
        request.open('GET', this.url, true);
        request.responseType = 'arraybuffer';
        request.addEventListener('load', function(){
            self.context.decodeAudioData(request.response, function(buffer){
                self.source = self.context.createBufferSource();
                self.source.buffer = buffer;
                self.loop = false;
                self.ready = true;
                self.processor.onaudioprocess = function(){
                    self.FFT();
                };
                self.trigger('load');
            });
        }, false);
        request.addEventListener('progress', function(evt){
            if ( evt.lengthComputable ){
                self.trigger('progress', evt.loaded, evt.total);
            }
        }, false);
        request.send();
    };

    //~~~~~~~~~~~~~~~~~~~~~~~~~
    // Handle events
    Sound.prototype.on = function(type, callback){
        this.callbacks[type] = this.callbacks[type] || [];
        this.callbacks[type].push( callback );
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~
    // Fire events
    Sound.prototype.trigger = function(type){
        if ( !this.callbacks[type] ) return;
        var args = Array.prototype.slice.call(arguments, 1);
        for (var i = 0, l = this.callbacks[type].length; i < l;  i++){
            if ( typeof this.callbacks[type][i] == 'function' ) this.callbacks[type][i].apply(this, args);
        }
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~
    // Play the sound file
    Sound.prototype.play = function(){
        if ( !this.ready ){
            this.on('load', function(){
                this.play();
            });
            return;
        }
        if ( this.fxReady ){
            this.source.connect(this.effect);
        }
        this.source.connect(this.gain);
        this.gain.connect(this.context.destination);
        this.source.connect(this.analyser);
        this.analyser.connect(this.processor);
        this.processor.connect(this.context.destination);
        this.source.noteOn(0);
        this.trigger('play');
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~
    // Pause the sound file
    Sound.prototype.pause = function(){
        this.source.disconnect(0);
        this.trigger('pause');
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~
    // Getter/setter for the loop property
    Sound.prototype.loop = function(arg){
        if ( !this.ready ){
            this.on('load', function(){
                this.source.loop = arg;
            });
            return null;
        }
        if ( typeof arg !== 'undefined' && typeof arg == 'boolean' ) this.source.loop = arg;
        return this.source.loop;
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~
    // FFT Analyser
    Sound.prototype.FFT = function(){
        this.freqByteData = new Uint8Array(64);
        this.analyser.getByteFrequencyData(this.freqByteData);
        this.trigger('audioprocess', this.freqByteData);
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~
    // Getter/setter for volume (0 - 1)
    Sound.prototype.volume = function(arg){
        if ( (arg && typeof arg != 'number') || arg < 0 || arg > 1 ) return;
        if ( !this.ready ){
            this.on('load', function(){
                this.gain.gain.value = arg;
            });
            return null;
        }
        if (arg) this.gain.gain.value = arg;
        return this.gain.gain.value;
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~
    // Getter/setter for convolution volume (0 - 1)
    Sound.prototype.fxVolume = function(arg){
        if ( (arg && typeof arg != 'number') || arg < 0 || arg > 1 ) return;
        if ( !this.fxReady ){
            this.on('fxLoaded', function(){
                this.fxGain.gain.value = arg;
            });
            return null;
        }
        if (arg) this.fxGain.gain.value = arg;
        return this.fxGain.gain.value;
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~
    // Load a convolution object
    Sound.prototype.convolution = function(url){
        var self = this, request = new XMLHttpRequest();
        this.fxGain = this.context.createGainNode();
        this.fxGain.connect(this.context.destination);
        this.effect = this.context.createConvolver();
        this.effect.connect(this.fxGain);
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';
        request.addEventListener('load', function(){
            self.context.decodeAudioData(request.response, function(buffer){
                self.effect.buffer = buffer;
                self.fxReady = true;
                self.trigger('fxLoaded');
            })
        }, false);
        request.send();
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~
    // Expose the Sound constructor
    window.Sound = Sound;

}(window));