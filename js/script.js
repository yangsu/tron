/**
 * @author Troy Ferrell & Yang Su
 */
$(document).ready(function () {
    var OFFSET = 6,
        WIDTH = window.innerWidth - OFFSET,
        HEIGHT = window.innerHeight - OFFSET,
        VIEW_ANGLE = 75,
        ASPECT = WIDTH / HEIGHT,
        NEAR = 0.1,
        FAR = 10000,
        INITIAL_Z_POS = 100,
        camera, scene, renderer,
        tunnel, myPlayer;

    function init() {
        camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        camera.position.z = INITIAL_Z_POS;

        scene = new THREE.Scene();
        scene.add(camera);

        tunnel = new Tunnel(scene);
        myPlayer = new Player(scene);

        renderer = new THREE.CanvasRenderer();
        renderer.setSize(WIDTH, HEIGHT);

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
        // Call update methods to produce animation
        tunnel.update();
        myPlayer.update();
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