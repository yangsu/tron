/**
 * @author Troy Ferrell & Yang Su
 */

function Game() {

    // Game Initalization
    this.playing = false;
    this.paused = false;
    this.resourceLoaded = false;
    this.viewLoaded = false;

    // Init
    this.lastUpdate = UTIL.now();

    // Scene Initialization
    this.OFFSET = 6;
    this.WIDTH = window.innerWidth - this.OFFSET;
    this.HEIGHT = window.innerHeight - this.OFFSET;
    this.ASPECT = this.WIDTH / this.HEIGHT;

    // Camera Setup
    this.camera = new THREE.PerspectiveCamera(
        CONFIG.cameraAngle,
        this.ASPECT,
        CONFIG.cameraNear,
        CONFIG.cameraFar
    );
    this.camera.position = CONFIG.cameraPos.clone();

    // Scene setup
    this.gameScene = new THREE.Scene();
    this.gameScene.add(this.camera);
    this.gameScene.add(new THREE.AmbientLight(0xAAAAAA));

    // Glow Scene setup
    this.glowScene = new THREE.Scene();
    this.glowScene.add(new THREE.AmbientLight(0xFFFFFF));

    // Wrap the function to be called while preserving the context
    CONFIG.init(UTIL.wrap(this, function () {
        // Objects
        this.player = new Player(this.gameScene, this.glowScene);
        this.tunnel = new Tunnel(this.gameScene);
        this.itemManager = new ItemManager(this.gameScene);
        this.particleManager = new ParticleEngine(this.gameScene);
        this.skybox = new SkyBox(this.gameScene);
        this.collisionManager = new CollisionManager();

        this.resourcesLoaded = true;
    }));

    this.initPostProcessing();
}

Game.prototype.newGame = function(){
    // Reset Game Parameters
    this.playing = true;
    this.lastUpdate = UTIL.now();
    
    // Reset Game Components
    this.player.reset();
    this.tunnel.reset();
    this.itemManager.reset();
    this.particleManager.reset();
    this.skybox.reset();
    
    this.camera.position = CONFIG.cameraPos.clone();
};

Game.prototype.gameOver = function(){
    $('#gameovermenu').fadeIn();
}

Game.prototype.loadView = function(){
    this.viewLoaded = true;
    // Start animation
    this.animate();
};

Game.prototype.unloadView = function(){
    this.viewLoaded = false;
};

Game.prototype.animate = function () {
    if(this.viewLoaded){
        if (!this.paused && this.resourcesLoaded) {
            this.update();

            if (window.isMobileDevice) {
                window.renderer.render(this.gameScene, this.camera);
            } else {
                this.glowcomposer.render(0.1);
                this.finalcomposer.render(0.1);
            }
        }

        // Preserve context
        var callback = (function (ctx) {
                return function () {
                    ctx.animate();
                };
            }(this));
        // note: three.js includes requestAnimationFrame shim
        requestAnimationFrame(callback);
    }
};

Game.prototype.update = function () {
    var now = UTIL.now(),
        dt = (now - this.lastUpdate) / 1000;

    window.levelProgress = this.player.getPosition().z;

    // Call update methods to produce animation
    this.player.update(dt);
    
    if(!this.player.isAlive){
        if(this.playing){
            this.gameOver();
            this.playing = false;
        }
    }
    else{
        this.tunnel.update();
        this.itemManager.update();
        this.skybox.update();
        this.checkCollisions();
    }
    
    this.particleManager.update();

    // camera.position.z += CONFIG.cameraVel.z * dt;
    // TODO: Temp solution by placing camera with an offset from player

    // Use mouse to rotate camera around
    //this.camera.rotation.x = (window.innerHeight / 2 - this.mouseY) / 1000;
    //this.camera.rotation.y = (window.innerWidth / 2 - this.mouseX) / 1000;

    this.camera.position.z = this.player.position.z + 200;

    this.lastUpdate = now;
};


Game.prototype.checkCollisions = function () {
    // Check collisions for all items
    _.each(this.itemManager.gameItems, function (item) {
        if (this.collisionManager.checkPlayerItemCollision(this.player, item)) {
            // Remove Item from view
            this.itemManager.remove(item.id);

            // Update player score
            this.player.score += 200;
            $('#score').html(this.player.score);
        }
    }, this);

    // Check that player is still on track
    if (!this.collisionManager.checkPlayerTunnelCollision(this.player, this.tunnel)) {
        // Possible error: need to make sure tunnel is intialized before checking collisions
        // KILL PLAYER AMAHAHAAHAH!!!
        this.player.Derezz();
    }

    // check collisions for all obstacles
    // TODO: write code here
};


Game.prototype.mouseMoved = function (mx, my) {
    this.mouseX = mx;
    this.mouseY = my;
};

Game.prototype.keyDown = function (key) {
    switch (key) {
    case 65: /* 'A' */
    case 97: /* 'a' */
    case 37: /* LEFT */
        this.player.accelerateLeft();
        break;
    case 38: /* UP */
        this.player.accelerate();
        break;
    case 68: /* 'D' */
    case 100:/* 'd' */
    case 39: /* RIGHT */
        this.player.accelerateRight();
        break;
    case 40: /* DOWN */
        this.player.decelerate();
        break;
    case 73:
        this.itemManager.genRandom();
        break;
    }
};

Game.prototype.keyUp = function (key) {
    switch (key) {
    case 27: /* esc */
        this.paused = !this.paused;
        if (this.paused) {
            $('#ingamemenu').fadeIn();
        } else {
            $('#ingamemenu').fadeOut();
        }
        // Update lastUpdate timestamp to so dt will be 0 during the pause
        this.lastUpdate = UTIL.now();
        
        break;
    case 32: /* SPACE */
        this.player.jump();
        break;
    case 65: /* 'A' */
    case 97: /* 'a' */
    case 37: /* LEFT */
        this.player.resetLateralAcceleration();
        break;
    case 38: /* UP */
        this.player.resetForwardAcceleration();
        break;
    case 68: /* 'D' */
    case 100:/* 'd' */
    case 39: /* RIGHT */
        this.player.resetLateralAcceleration();
        break;
    case 40: /* DOWN */
        this.player.resetForwardAcceleration();
        break;
    }
};

Game.prototype.initPostProcessing = function () {
    // GLOW COMPOSER
    var renderTargetParameters = {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBFormat,
            stencilBufer: false
        },
        renderTargetGlow = new THREE.WebGLRenderTarget(
            this.WIDTH,
            this.HEIGHT,
            renderTargetParameters
        );

    var effectFXAA = new THREE.ShaderPass(THREE.ShaderExtras.fxaa);
    effectFXAA.uniforms.resolution.value.set(1 / this.WIDTH, 1 / this.HEIGHT);

    var hblur = new THREE.ShaderPass(THREE.ShaderExtras.horizontalBlur);
    var vblur = new THREE.ShaderPass(THREE.ShaderExtras.verticalBlur);

    var bluriness = 3;

    hblur.uniforms.h.value = bluriness / this.WIDTH;
    vblur.uniforms.v.value = bluriness / this.HEIGHT;

    var renderModelGlow = new THREE.RenderPass(this.glowScene, this.camera);

    this.glowcomposer = new THREE.EffectComposer(window.renderer, renderTargetGlow);

    this.glowcomposer.addPass(renderModelGlow);
    this.glowcomposer.addPass(hblur);
    this.glowcomposer.addPass(vblur);
    //glowcomposer.addPass(hblur);
    //glowcomposer.addPass(vblur);

    // FINAL COMPOSER
    var finalshader = {
        uniforms: {
            tDiffuse: { type: 't', value: 0, texture: null },
            tGlow: { type: 't', value: 1, texture: null }
        },

        vertexShader: [
            'varying vec2 vUv;',
            'void main() {',
                'vUv = vec2(uv.x, 1.0 - uv.y);',
                'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
            '}'
        ].join('\n'),

            fragmentShader: [
                'uniform sampler2D tDiffuse;',
                'uniform sampler2D tGlow;',
                'varying vec2 vUv;',
                'void main() {',
                    'vec4 texel = texture2D(tDiffuse, vUv);',
                    'vec4 glow = texture2D(tGlow, vUv);',
                    'gl_FragColor = texel + vec4(0.5, 0.75, 1.0, 1.0) * glow * 2.0;',
                '}'
        ].join('\n')
    };
    finalshader.uniforms['tGlow'].texture = this.glowcomposer.renderTarget2;

    var renderModel = new THREE.RenderPass(this.gameScene, this.camera);
    var finalPass = new THREE.ShaderPass(finalshader);
    finalPass.needsSwap = true;
    finalPass.renderToScreen = true;

    this.finalcomposer = new THREE.EffectComposer(
        window.renderer,
        new THREE.WebGLRenderTarget(this.WIDTH, this.HEIGHT, renderTargetParameters)
    );

    this.finalcomposer.addPass(renderModel);
    this.finalcomposer.addPass(effectFXAA);
    this.finalcomposer.addPass(finalPass);
};
