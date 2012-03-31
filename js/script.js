/**
 * @author Troy Ferrell & Yang Su
 */

var scene;
$(document).ready(function () {
    var camera, renderer,
        tunnel, myPlayer,
        lastUpdate,
        initialized = false,
        paused = false,
        startmenu = $('#startmenu'),
        ingamemenu = $('#ingamemenu');

    var mesh;

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
        camera.position = CONFIG.cameraPos;        

        scene = new THREE.Scene();
        scene.add(camera);


        var directionalLight = new THREE.DirectionalLight( 0xFFFFFF );
        directionalLight.position.set( 0, 0, 100 ).normalize();
        scene.add( directionalLight );

        //var ambientLight = new THREE.AmbientLight(0xFFFFFF);
       // scene.add(ambientLight);
        
        tunnel = new Tunnel();
        myPlayer = new Player();

        itemManager = new ItemManager();
        
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
        tunnel.update(myPlayer.getPosition().z);
        myPlayer.update(dt);
        itemManager.update();
        
        camera.position.z += CONFIG.cameraVel.z * dt;

        lastUpdate = now;
    }

    // Initialization
    init();

    // Event handlers
    window.ondevicemotion = function(event) {

        $('#score').html(event.accelerationIncludingGravity.x);

        if(event.accelerationIncludingGravity.x > 1.75) {
            myPlayer.moveRight();
        }
        else if(event.accelerationIncludingGravity.x < -1.75) {
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

    $(document).mousemove(function(e){
       //$('#score').html(e.pageX);
   });

    // Only keyup can capture the key event for the 'esc' key
    $(document).keyup(function(event) {
        switch (event.which) {
            case 27 /* esc */:
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
    $(document).keypress(function(event) {
        switch (event.which) {
            case 65 /* 'A' */:
            case 97 /* 'a' */:
                myPlayer.moveLeft();
                break;
            case 68 /* 'D' */:
            case 100 /* 'd' */:
                myPlayer.moveRight();
                break;
        }
    });
});