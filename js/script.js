/**
 * @author Troy Ferrell & Yang Su
 */
$(document).ready(function () {
    var camera, scene, renderer,
        tunnel, myPlayer,
        lastUpdate,
        initialized = false,
        paused = false,
        startmenu = $('#startmenu'),
        ingamemenu = $('#ingamemenu');

    function init() {
        // Scene Initialization
        var OFFSET = 6,
            WIDTH = window.innerWidth - OFFSET,
            HEIGHT = window.innerHeight - OFFSET,
            ASPECT = WIDTH / HEIGHT;
        lastUpdate = UTIL.now();
        camera = new THREE.PerspectiveCamera(CONFIG.cameraAngle,
                                             ASPECT,
                                             CONFIG.cameraNear,
                                             CONFIG.cameraFar);
        camera.position.z = CONFIG.cameraInitZ;

        scene = new THREE.Scene();
        scene.add(camera);

        tunnel = new Tunnel(scene);
        myPlayer = new Player(scene);

        renderer = new THREE.WebGLRenderer(CONFIG.renderer);
        renderer.setSize(WIDTH, HEIGHT);
        renderer.setClearColorHex(CONFIG.background, 1.0);
        renderer.clear();

        document.body.appendChild(renderer.domElement);

        // Stats Initialization
        var stats = new Stats(),
            statsdom = stats.getDomElement();
        // Align top-left
        statsdom.style.position = 'absolute';
        statsdom.style.left = '0px';
        statsdom.style.top = '0px';
        document.body.appendChild(statsdom);
        setInterval( function () {
            stats.update();
        }, 1000 / 60 );
    }

    function animate() {
        if (initialized && !paused) {
            update();
        }
        renderer.render(scene, camera);
        // note: three.js includes requestAnimationFrame shim
        requestAnimationFrame(animate);
    }

    function update() {
        var now = UTIL.now(),
            dt = (now - lastUpdate)/1000;

        // Call update methods to produce animation
        tunnel.update(myPlayer.getZ());
        myPlayer.update(dt);
        camera.position.z += CONFIG.cameraVel.z * dt;

        lastUpdate = now;
    }

    // Initialization
    init();

    // Event handlers
    window.ondevicemotion = function(event) {

        if(event.accelerationIncludingGravity.x > 0.75) {
            myPlayer.moveRight();
        }
        else if(event.accelerationIncludingGravity.x < -0.75) {
            myPlayer.moveLeft();
        }

        // event.accelerationIncludingGravity.x
        // event.accelerationIncludingGravity.y
        // event.accelerationIncludingGravity.z
    };
    $('#play').click(function () {
        startmenu.fadeOut('fast', function () {
            animate();
            initialized = true;
        });
    });
    $('#resume').click(function () {
        paused = false;
        ingamemenu.fadeOut();
    });
    $(document).keyup(function(event) {
        switch (event.which) {
            case 97 /* 'a' */:
                myPlayer.moveLeft();
            break;
            case 100 /* 'd' */:
                myPlayer.moveRight();
            break;
            case 27 /* esc */:
            console.log('esc');
                paused = !paused;
                if (paused) {
                    ingamemenu.fadeIn();
                }
                else {
                    ingamemenu.fadeOut();
                }
            break;
        }
    });
});