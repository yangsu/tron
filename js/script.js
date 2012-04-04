/**
 * @author Troy Ferrell & Yang Su
 */

var scene, glowscene;

$(document).ready(function () {
    var camera, renderer,
        finalComposer, glowcomposer, renderTarget,
        tunnel, myPlayer,
        lastUpdate,
        itemManager,
        started = false,
        paused = false,
        tunnelInitialized = false,
        startmenu = $('#startmenu'),
        ingamemenu = $('#ingamemenu');


    function init() {
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
            CONFIG.cameraar
        );
        camera.position = CONFIG.cameraPos;

        // Scene setup
        scene = new THREE.Scene();
        scene.add(camera);
        scene.add(new THREE.AmbientLight(0xAAAAAA));

        // Objects
        tunnel = new Tunnel(function () {
            tunnelInitialized = true;
        });

        myPlayer = new Player();

        itemManager = new ItemManager();

        // Renderer Initialization
        renderer = new THREE.WebGLRenderer(CONFIG.renderer);
        renderer.autoClear = false;
        renderer.setSize(WIDTH, HEIGHT);
        renderer.setClearColorHex(CONFIG.background, 1.0);
        renderer.clear();

        document.body.appendChild(renderer.domElement);

        // GLOW Initialization
        glowscene = new THREE.Scene();
        glowscene.add(new THREE.AmbientLight(0xFFFFFF));

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

        var bluriness = 2;

        hblur.uniforms['h'].value = bluriness / WIDTH;
        vblur.uniforms['v'].value = bluriness / HEIGHT;

        var renderModelGlow = new THREE.RenderPass(glowscene, camera);

        glowcomposer = new THREE.EffectComposer(renderer, renderTargetGlow);

        glowcomposer.addPass(renderModelGlow);
        glowcomposer.addPass(hblur);
        glowcomposer.addPass(vblur);
        glowcomposer.addPass(hblur);
        glowcomposer.addPass(vblur);

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

            //renderer.render(scene, camera);
            glowcomposer.render(0.1);
            finalcomposer.render(0.1);
        }
        // note: three.js includes requestAnimationFrame shim
        requestAnimationFrame(animate);
    }

    function update() {
        var now = UTIL.now(),
            dt = (now - lastUpdate) / 1000;

        // Call update methods to produce animation
        tunnel.update(myPlayer.getPosition().z);
        myPlayer.update(dt);
        itemManager.update();

        // camera.position.z += CONFIG.cameraVel.z * dt;
        // TODO: Temp solution by placing camera with an offset from player
        camera.position.z = myPlayer.position.z + 200;

        lastUpdate = now;
    }

    // Initialization
    init();
    animate();

    // Event handlers
    window.ondevicemotion = function (event) {

        $('#score').html(event.accelerationIncludingGravity.x);

        if (event.accelerationIncludingGravity.x > 1.75) {
            myPlayer.accelerateRight();
        } else if (event.accelerationIncludingGravity.x < -1.75) {
            myPlayer.accelerateLeft();
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
       //$('#score').html(e.pageX);
    });

    // Only keyup can capture the key event for the 'esc' key
    $(document).keyup(function (event) {
        switch (event.which) {
        case 27: /* esc */
            paused = !paused;
            if (paused) {
                ingamemenu.fadeIn();
            } else {
                ingamemenu.fadeOut();
            }
            break;
        default:
            myPlayer.resetAcceleration();
        }
    });
    $(document).keydown(function (event) {
        switch (event.which) {
        case 65: /* 'A' */
        case 97: /* 'a' */
        case 37: /* LEFT */
            myPlayer.accelerateLeft();
            break;
        case 38: /* UP */
            myPlayer.accelerate();
            break;
        case 68: /* 'D' */
        case 100:/* 'd' */
        case 39: /* RIGHT */
            myPlayer.accelerateRight();
            break;
        case 40: /* DOWN */
            myPlayer.decelerate();
            break;
        }
    });
    $(document).keypress(function (event) {
        switch (event.which) {
        }
    });
});