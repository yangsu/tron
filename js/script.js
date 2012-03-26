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
        camera.position.z = CONFIG.cameraInitZ;

        scene = new THREE.Scene();
        scene.add(camera);

        //var ambient = new THREE.AmbientLight( 0x505050 );
        //scene.add( ambient );
        
        var directionalLight = new THREE.DirectionalLight( 0xFFFFFF );
        directionalLight.position.set( 0, 0, 100 ).normalize();
        scene.add( directionalLight );
  
        tunnel = new Tunnel(scene);
        myPlayer = new Player(scene);

        var loader = new THREE.JSONLoader();
        loader.load( "obj/LightCycle.js", createScene );

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
    function createScene(geometry){
        //var material = new THREE.MeshLambertMaterial({wireframe:false});
        var texture = THREE.ImageUtils.loadTexture('obj/LightCycle_TextureTest1.png');
        //texture.wrapT = THREE.RepeatWrapping;
        var material = new THREE.MeshLambertMaterial({
            map: texture,
            transparent : false});

        mesh = new THREE.Mesh(geometry, material);
        mesh.position = CONFIG.playerPos.convertToCartesian();
        mesh.scale.set(2, 2, 2);
        mesh.rotation.y = Math.PI;
        scene.add(mesh);
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
        
        mesh.position = myPlayer.getPosition();
        mesh.rotation = myPlayer.getRotation();
        mesh.rotation.y += 0.005;
        
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
   
    $(document).keyup(function(event) {
        switch (event.which) {
            case 65 /* 'a' */://97
                myPlayer.moveLeft();
                break;
            case 68 /* 'd' */: //100
                myPlayer.moveRight();
                break;
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
});