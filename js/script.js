/**
 * @author Troy Ferrell & Yang Su
 */

var scene, glowscene, levelProgress, isMobileDevice;

// CONSTANTS
TWOPI = 2 * Math.PI;

$(document).ready(function () {
    var camera, renderer,
        finalComposer, glowcomposer, renderTarget,
        tunnel, player,
        lastUpdate,
        itemManager,
        collisionManager,
        particleManager,
        mouseX = window.innerWidth/2,
        mouseY = window.innerHeight/2,
        started = false,
        paused = false,
        tunnelInitialized = false,
        startmenu = $('#startmenu'),
        ingamemenu = $('#ingamemenu');

    function init() {

        if ( !Detector.webgl ) {
            Detector.addGetWebGLMessage();
            return;
        }
        
        if ((navigator.userAgent.indexOf('iPhone') != -1) 
            || (navigator.userAgent.indexOf('iPod') != -1) 
            || (navigator.userAgent.indexOf('iPad') != -1)){
            window.isMobileDevice = true;    
        }
        else{
            window.isMobileDevice = false;
        }
          
        
        lastUpdate = UTIL.now();

        // Scene Initialization
        var OFFSET = 6,
            WIDTH = window.innerWidth - OFFSET,
            HEIGHT = window.innerHeight - OFFSET,
            ASPECT = WIDTH / HEIGHT;

        // Camera Setup
        camera = new THREE.PerspectiveCamera(
            CONFIG.cameraAngle,
            ASPECT,
            CONFIG.cameraNear,
            CONFIG.cameraFar
        );
        camera.position = CONFIG.cameraPos;

        // Scene setup
        scene = new THREE.Scene();
        scene.add(camera);
        scene.add(new THREE.AmbientLight(0xAAAAAA));

       // Glow Scene setup
        glowscene = new THREE.Scene();
        glowscene.add(new THREE.AmbientLight(0xFFFFFF));

        // Objects
        tunnel = new Tunnel(function () {
            tunnelInitialized = true;
        });

        player = new Player();

        itemManager = new ItemManager();
        collisionManager = new CollisionManager(tunnel, player, itemManager);
        particleManager = new ParticleEngine();
        skybox = new SkyBox();
        
        // Renderer Initialization
        renderer = new THREE.WebGLRenderer(CONFIG.renderer);
        renderer.autoClear = false;
        if ((navigator.userAgent.indexOf('iPhone') != -1) || (navigator.userAgent.indexOf('iPod') != -1) || (navigator.userAgent.indexOf('iPad') != -1))
        {
            renderer.autoClear = true;
        }
        
        renderer.setSize(WIDTH, HEIGHT);
        renderer.setClearColorHex(CONFIG.background, 1.0);
        renderer.clear();

        document.body.appendChild(renderer.domElement);

        // GLOW COMPOSER
        var renderTargetParameters = {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBFormat,
                stencilBufer: false
            },
            renderTargetGlow = new THREE.WebGLRenderTarget(
                WIDTH,
                HEIGHT,
                renderTargetParameters
            );

        var effectFXAA = new THREE.ShaderPass(THREE.ShaderExtras['fxaa']);
        effectFXAA.uniforms['resolution'].value.set(1 / WIDTH, 1 / HEIGHT);

        var hblur = new THREE.ShaderPass(THREE.ShaderExtras['horizontalBlur']);
        var vblur = new THREE.ShaderPass(THREE.ShaderExtras['verticalBlur']);

        var bluriness = 3;

        hblur.uniforms['h'].value = bluriness / WIDTH;
        vblur.uniforms['v'].value = bluriness / HEIGHT;

        var renderModelGlow = new THREE.RenderPass(glowscene, camera);

        glowcomposer = new THREE.EffectComposer(renderer, renderTargetGlow);

        glowcomposer.addPass(renderModelGlow);
        glowcomposer.addPass(hblur);
        glowcomposer.addPass(vblur);
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
        finalshader.uniforms['tGlow'].texture = glowcomposer.renderTarget2;

        var renderModel = new THREE.RenderPass(scene, camera);
        var finalPass = new THREE.ShaderPass(finalshader);
        finalPass.needsSwap = true;
        finalPass.renderToScreen = true;

        finalcomposer = new THREE.EffectComposer(
            renderer,
            new THREE.WebGLRenderTarget(WIDTH, HEIGHT, renderTargetParameters)
        );
        finalcomposer.addPass(renderModel);
        finalcomposer.addPass(effectFXAA);
        finalcomposer.addPass(finalPass);

        // Stats Initialization
        var stats = new Stats(),
            statsdom = stats.getDomElement();
        // Align top-left
        statsdom.style.position = 'absolute';
        statsdom.style.left = '0px';
        statsdom.style.top = '0px';
        document.body.appendChild(statsdom);

        setInterval(function () {
            stats.update();
        }, 1000 / 60);

    }

    function animate() {
        if (started && !paused && tunnelInitialized) {
            update();

            if(window.isMobileDevice){
                renderer.render(scene, camera);
            }
            else{
                glowcomposer.render(0.1);
                finalcomposer.render(0.1);
            }
        }
        // note: three.js includes requestAnimationFrame shim
        requestAnimationFrame(animate);
    }

    function update() {
        var now = UTIL.now(),
            dt = (now - lastUpdate) / 1000;

        levelProgress = player.getPosition().z;

        // Call update methods to produce animation
        tunnel.update();
        player.update(dt);
        itemManager.update();
        //collisionManager.update();
        particleManager.update();

        checkCollisions();
        
        // camera.position.z += CONFIG.cameraVel.z * dt;
        // TODO: Temp solution by placing camera with an offset from player

        camera.rotation.x = (window.innerHeight/2 - mouseY)/1000;
        camera.rotation.y = (window.innerWidth/2 - mouseX)/1000;

        camera.position.z = player.position.z + 200;

        lastUpdate = now;
    }
    
    function checkCollisions(){
        
        // Check collisions for all items
        
        _.each(itemManager.gameItems, function (item) {
            if(collisionManager.checkPlayerItemCollision(player, item)){
                // Remove Item from view
                itemManager.remove(item.id);
                
                // Update player score
                player.score += 200;
                $('#score').html(player.score);                
            }
        });
        
        // Check that player is still on track
        if(!collisionManager.checkPlayerTunnelCollision(player, tunnel))
        {
            // Possible error: need to make sure tunnel is intialized before checking collisions
            // KILL PLAYER AMAHAHAAHAH!!!
            // player.Derezz();
        }
        
        // check collisions for all obstacles
        // TODO: write code here
    }

    // Initialization
    init();
    animate();

    // Event handlers
    window.ondevicemotion = function (event) {

        //$('#score').html(event.accelerationIncludingGravity.x);

        if (event.accelerationIncludingGravity.x > 2.75) {
            player.accelerateRight();
        } else if (event.accelerationIncludingGravity.x < -2.75) {
            player.accelerateLeft();
        }

        // event.accelerationIncludingGravity.x
        // event.accelerationIncludingGravity.y
        // event.accelerationIncludingGravity.z
    };

    $('#play').click(function () {
        startmenu.fadeOut('fast', function () {
            started = true;
        });
    });
    $('#resume').click(function () {
        paused = false;
        ingamemenu.fadeOut();
    });

    $(document).mousemove(function (e) {
        // store the mouseX and mouseY position
        mouseX = event.clientX;
        mouseY = event.clientY;
    });

    // Only keyup can capture the key event for the 'esc' key
    $(document).keyup(function (event) {
        log(event.which);
        switch (event.which) {
        case 27: /* esc */
            paused = !paused;
            if (paused) {
                ingamemenu.fadeIn();
            } else {
                ingamemenu.fadeOut();
            }
            // Update lastUpdate timestamp to so dt will be 0 during the pause
            lastUpdate = UTIL.now();
            break;
        case 82: /* R */ // testing
            log("DEREZZING!");
            player.Derezz();
            break;
        case 32: /* SPACE */
            player.jump();
            break;
        case 65: /* 'A' */
        case 97: /* 'a' */
        case 37: /* LEFT */
            player.resetLateralAcceleration();
            break;
        case 38: /* UP */
            player.resetForwardAcceleration();
            break;
        case 68: /* 'D' */
        case 100:/* 'd' */
        case 39: /* RIGHT */
            player.resetLateralAcceleration();
            break;
        case 40: /* DOWN */
            player.resetForwardAcceleration();
            break;
        }
    });
    $(document).keydown(function (event) {
        switch (event.which) {
        case 65: /* 'A' */
        case 97: /* 'a' */
        case 37: /* LEFT */
            player.accelerateLeft();
            break;
        case 38: /* UP */
            player.accelerate();
            break;
        case 68: /* 'D' */
        case 100:/* 'd' */
        case 39: /* RIGHT */
            player.accelerateRight();
            break;
        case 40: /* DOWN */
            player.decelerate();
            break;
        case 73:
            itemManager.genRandom();
            break;
        }
    });
    $(document).keypress(function (event) {
        // switch (event.which) {
        // }
    });
    window.onerror= function(err) {
        console.log(err);
        $('#score').html(err);
    };
});