/**
 * @author Troy Ferrell & Yang Su
 */

var scene;

var finalshader = {
    uniforms: {
        tDiffuse: { type: "t", value: 0, texture: null }, // The base scene buffer
        tGlow: { type: "t", value: 1, texture: null } // The glow scene buffer
    },
 
    vertexShader: [
        "varying vec2 vUv;",
 
        "void main() {",
 
            "vUv = vec2( uv.x, 1.0 - uv.y );",
            "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
 
        "}"
    ].join("n"),
 
    fragmentShader: [
        "uniform sampler2D tDiffuse;",
        "uniform sampler2D tGlow;",
 
        "varying vec2 vUv;",
 
        "void main() {",
 
            "vec4 texel = texture2D( tDiffuse, vUv );",
            "vec4 glow = texture2D( tGlow, vUv );",
            "gl_FragColor = texel + vec4(0.5, 0.75, 1.0, 1.0) * glow * 2.0;", // Blend the two buffers together (I colorized and intensified the glow at the same time)
 
        "}"
    ].join("n")
};

$(document).ready(function () {
    var camera, renderer,
        tunnel, myPlayer,
        mesh,
        lastUpdate,
        started = false,
        paused = false,
        tunnelInitialized = false,
        startmenu = $('#startmenu'),
        ingamemenu = $('#ingamemenu');

    var finalComposer, glowComposer, renderTarget;

    function init() {
        // Scene Initialization
        var OFFSET = 6,
            WIDTH = window.innerWidth - OFFSET,
            HEIGHT = window.innerHeight - OFFSET,
            ASPECT = WIDTH / HEIGHT;

        lastUpdate = UTIL.now();
        camera = new THREE.PerspectiveCamera(
            CONFIG.cameraAngle,
            ASPECT,
            CONFIG.cameraNear,
            CONFIG.cameraFar
        );
        camera.position = CONFIG.cameraPos;

        scene = new THREE.Scene();
        scene.add(camera);

        //var directionalLight = new THREE.DirectionalLight(0xFFFFFF);
        //directionalLight.position.set(0, 0, 100).normalize();
        //scene.add(directionalLight);

        var ambientLight = new THREE.AmbientLight(0xFFFFFF);
        scene.add(ambientLight);

        tunnel = new Tunnel(function () {
            tunnelInitialized = true;
        });
        
        myPlayer = new Player();
        
        itemManager = new ItemManager();

        renderer = new THREE.WebGLRenderer(CONFIG.renderer);
        renderer.autoClear = false;
        renderer.setSize(WIDTH, HEIGHT);
        renderer.setClearColorHex(CONFIG.background, 1.0);
        renderer.clear();

        // TESTING GLOW=====================================================
        // DOESNT FUCKING WORK!?!?!? 
        // Give it a go
        //http://bkcore.com/blog/3d/webgl-three-js-animated-selective-glow.html
        
        // GLOW COMPOSER
        var renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBufer: false };
        renderTargetGlow = new THREE.WebGLRenderTarget( WIDTH, HEIGHT, renderTargetParameters );
        
        var effectFXAA = new THREE.ShaderPass( THREE.ShaderExtras[ "fxaa" ] );
        effectFXAA.uniforms[ 'resolution' ].value.set( 1 / WIDTH, 1 / HEIGHT );
        
        hblur = new THREE.ShaderPass( THREE.ShaderExtras[ "horizontalBlur" ] );
        vblur = new THREE.ShaderPass( THREE.ShaderExtras[ "verticalBlur" ] );
        
        var bluriness = 3;
        
        hblur.uniforms[ 'h' ].value = bluriness / WIDTH;
        vblur.uniforms[ 'v' ].value = bluriness / HEIGHT;
        
        var renderModelGlow = new THREE.RenderPass( myPlayer.glowScene, camera );
        
        glowcomposer = new THREE.EffectComposer( renderer, renderTargetGlow );
        
        glowcomposer.addPass( renderModelGlow );
        glowcomposer.addPass( hblur );
        glowcomposer.addPass( vblur );
        
        // FINAL COMPOSER
        finalshader.uniforms[ "tGlow" ].texture = glowcomposer.renderTarget2;
        var renderModel = new THREE.RenderPass( window.scene, camera );
        var finalPass = new THREE.ShaderPass( finalshader );
        finalPass.needsSwap = true;
        finalPass.renderToScreen = true;
        
        renderTarget = new THREE.WebGLRenderTarget( WIDTH, HEIGHT, renderTargetParameters );
        finalcomposer = new THREE.EffectComposer( renderer, renderTarget );
        finalcomposer.addPass( renderModel );
        finalcomposer.addPass( effectFXAA );
        finalcomposer.addPass( finalPass )

        document.body.appendChild(renderer.domElement);

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

        camera.position.z += CONFIG.cameraVel.z * dt;

        lastUpdate = now;
    }

    // Initialization
    init();
    animate();

    // Event handlers
    window.ondevicemotion = function (event) {

        $('#score').html(event.accelerationIncludingGravity.x);

        if (event.accelerationIncludingGravity.x > 1.75) {
            myPlayer.moveRight();
        } else if (event.accelerationIncludingGravity.x < -1.75) {
            myPlayer.moveLeft();
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
        }
    });
    $(document).keypress(function (event) {
        switch (event.which) {
        case 65: /* 'A' */
        case 97: /* 'a' */
            myPlayer.moveLeft();
            break;
        case 68: /* 'D' */
        case 100:/* 'd' */
            myPlayer.moveRight();
            break;
        }
    });
});