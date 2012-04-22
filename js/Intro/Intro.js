/**
 * @author Troy Ferrell
 */

function Intro(){
    
    // need drawing capability
    // need rendering & update capability
    // need pens
    
    
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
    
    
    // Intro Parameters
    // draw bottom pen and top pen
    
    
    // Renderer Initialization
    renderer = new THREE.WebGLRenderer(CONFIG.renderer);

    renderer.setSize(WIDTH, HEIGHT);
    renderer.setClearColorHex(CONFIG.background, 1.0);
    renderer.clear();

    document.body.appendChild(renderer.domElement);
}


Intro.prototype.animate = function() {

	update();

    renderer.render(scene, camera);

    // note: three.js includes requestAnimationFrame shim
    requestAnimationFrame(animate);
}

Intro.prototype.update = function() {
        //var now = UTIL.now(),
          //  dt = (now - lastUpdate) / 1000;

//        lastUpdate = now;
}
