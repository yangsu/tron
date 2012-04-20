/**
 * @author Troy
 */

function Game(){
	
	// GAME INITALIZATION
	this.camera, this.renderer,
	this.finalComposer, this.glowcomposer, this.renderTarget,
	this.tunnel, 
	this.player,
	this.skybox, 
	this.itemManager, this.collisionManager, this.particleManager,
	this.started = false, this.paused = false, this.resourceLoaded = false,
	this.mouseX, this.mouseY,
	this.lastUpdate = UTIL.now();
	
	// INIT
    this.lastUpdate = UTIL.now();
    
    // Scene Initialization
    this.OFFSET = 6,
        this.WIDTH = window.innerWidth - this.OFFSET,
        this.HEIGHT = window.innerHeight - this.OFFSET,
        this.ASPECT = this.WIDTH / this.HEIGHT;

    // Camera Setup
    this.camera = new THREE.PerspectiveCamera(
        CONFIG.cameraAngle,
        this.ASPECT,
        CONFIG.cameraNear,
        CONFIG.cameraFar
    );
    this.camera.position = CONFIG.cameraPos;

    // Scene setup
    window.scene = new THREE.Scene();
    window.scene.add(this.camera);
    window.scene.add(new THREE.AmbientLight(0xAAAAAA));

    // Glow Scene setup
    window.glowscene = new THREE.Scene();
    window.glowscene.add(new THREE.AmbientLight(0xFFFFFF));

	var __self = this;
    // Objects
    CONFIG.init(function () {
        // Player depends on the resources to be loaded
        __self.player = new Player();
        __self.tunnel = new Tunnel();
        __self.itemManager = new ItemManager();
        __self.particleManager = new ParticleEngine();
        __self.skybox = new SkyBox();
        __self.collisionManager = new CollisionManager();

        __self.resourcesLoaded = true;
    });

    // Renderer Initialization
    this.renderer = new THREE.WebGLRenderer(CONFIG.renderer);
    this.renderer.autoClear = window.isMobileDevice;

    this.renderer.setSize(this.WIDTH, this.HEIGHT);
    this.renderer.setClearColorHex(CONFIG.background, 1.0);
    this.renderer.clear();
    
    this.initPostProcessing();

    document.body.appendChild(this.renderer.domElement);
    
    this.animateCallback = function(){
    	__self.animate();
    }
    this.animate();
}

Game.prototype.animate = function(){
    if (this.started && !this.paused && this.resourcesLoaded) {
        this.update();

        if (window.isMobileDevice) {
            this.renderer.render(this.scene, this.camera);
        } else {
            this.glowcomposer.render(0.1);
            this.finalcomposer.render(0.1);
        }
    }
    
    //var callback = this.animate;
    // note: three.js includes requestAnimationFrame shim
    requestAnimationFrame(this.animateCallback);
}

Game.prototype.update = function() {
    var now = UTIL.now(),
        dt = (now - this.lastUpdate) / 1000;

    window.levelProgress = this.player.getPosition().z;

    // Call update methods to produce animation
    this.tunnel.update();
    this.player.update(dt);
    this.itemManager.update();
    this.particleManager.update();

    this.checkCollisions();

    // camera.position.z += CONFIG.cameraVel.z * dt;
    // TODO: Temp solution by placing camera with an offset from player

    this.camera.rotation.x = (window.innerHeight / 2 - this.mouseY) / 1000;
    this.camera.rotation.y = (window.innerWidth / 2 - this.mouseX) / 1000;

    this.camera.position.z = this.player.position.z + 200;

    this.lastUpdate = now;
}
    

Game.prototype.checkCollisions = function() {
    
    __self = this;
    // Check collisions for all items
    _.each(this.itemManager.gameItems, function (item) {
        if (__self.collisionManager.checkPlayerItemCollision(__self.player, item)) {
            // Remove Item from view
            __self.itemManager.remove(item.id);

            // Update player score
            __self.player.score += 200;
            $('#score').html(__self.player.score);
        }
    });

    // Check that player is still on track
    if (!this.collisionManager.checkPlayerTunnelCollision(this.player, this.tunnel)) {
        // Possible error: need to make sure tunnel is intialized before checking collisions
        // KILL PLAYER AMAHAHAAHAH!!!
        // this.player.Derezz();
    }

    // check collisions for all obstacles
    // TODO: write code here
}


Game.prototype.mouseMoved = function(mx, my){
	  this.mouseX = mx;
      this.mouseY = my;
}

Game.prototype.keyDown = function(key){
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
}

Game.prototype.keyUp = function(key){
	switch (key) {
        case 27: /* esc */
       		// TODO: figure out how to handle pausing???
   			/*    
            paused = !paused;
            if (paused) {
                ingamemenu.fadeIn();
            } else {
                ingamemenu.fadeOut();
            }
            // Update lastUpdate timestamp to so dt will be 0 during the pause
            lastUpdate = UTIL.now();
            */
            break;
        case 82: /* R */ // testing
            this.player.Derezz();
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
}

Game.prototype.initPostProcessing = function(){
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

    var renderModelGlow = new THREE.RenderPass(window.glowscene, this.camera);

    this.glowcomposer = new THREE.EffectComposer(this.renderer, renderTargetGlow);

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

    var renderModel = new THREE.RenderPass(window.scene, this.camera);
    var finalPass = new THREE.ShaderPass(finalshader);
    finalPass.needsSwap = true;
    finalPass.renderToScreen = true;

    this.finalcomposer = new THREE.EffectComposer(
        this.renderer,
        new THREE.WebGLRenderTarget(this.WIDTH, this.HEIGHT, renderTargetParameters)
    );
    
    this.finalcomposer.addPass(renderModel);
    this.finalcomposer.addPass(effectFXAA);
    this.finalcomposer.addPass(finalPass);
}
