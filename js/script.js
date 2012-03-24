/**
 * @author Troy Ferrell & Yang Su
 */
$(document).ready(function () {
    var OFFSET = 6,
        WIDTH = window.innerWidth - OFFSET,
        HEIGHT = window.innerHeight - OFFSET,
        VIEW_ANGLE = CONFIG.cameraAngle,
        ASPECT = WIDTH / HEIGHT,
        NEAR = CONFIG.cameraNear,
        FAR = CONFIG.cameraFar,
        INITIAL_Z_POS = CONFIG.cameraInitZ,
        camera, scene, renderer,
        tunnel, myPlayer,
        lastUpdate;

    function init() {
        camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        camera.position.z = INITIAL_Z_POS;

        scene = new THREE.Scene();
        scene.add(camera);

        tunnel = new Tunnel(scene);
        myPlayer = new Player(scene);

        renderer = new THREE.WebGLRenderer(CONFIG.renderer);
        renderer.setSize(WIDTH, HEIGHT);
        renderer.setClearColorHex(CONFIG.background, 1.0);
        renderer.clear();

        lastUpdate = UTIL.now();

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

        document.body.appendChild(renderer.domElement);

        // bind key events
        document.onkeypress = keyPressed;
    }

    function animate() {
        update();
        // Render scene
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

    function keyPressed(e) {
        var code = e.charCode;
        if(code == 100 /* 'a' */) {
            myPlayer.moveRight();
        }
        if(code == 97 /* 'a' */) {
            myPlayer.moveLeft();
        }
    }

    // Initialization
    init();
    animate();

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
});