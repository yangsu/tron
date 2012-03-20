/**
 * @author Troy Ferrell & Yang Su
 */
$(document).ready(function () {
    var WIDTH = window.innerWidth,
        HEIGHT = window.innerHeight,
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
        // note: three.js includes requestAnimationFrame shim
        requestAnimationFrame(animate);
        // Render scene
        renderer.render(scene, camera);
        update();
    }

    function update() {
        // Call update methods to produce animation
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
});