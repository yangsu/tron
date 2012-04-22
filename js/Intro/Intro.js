/**
 * @author Troy Ferrell
 */

function Intro(){
    
    // Init
    this.lastUpdate = UTIL.now();
    this.scene, this.camera, this.renderer;
     
    // Scene Initialization
    var OFFSET = 6,
        WIDTH = window.innerWidth - OFFSET,
        HEIGHT = window.innerHeight - OFFSET,
        ASPECT = WIDTH / HEIGHT;

    // Camera Setup
    this.camera = new THREE.PerspectiveCamera(
        CONFIG.cameraAngle,
        ASPECT,
        CONFIG.cameraNear,
        CONFIG.cameraFar
    );
    this.camera.position.z = 300;
    //this.camera.position = CONFIG.cameraPos;

    // Scene setup
    this.scene = new THREE.Scene();
    this.scene.add(this.camera);
    //this.scene.add(new THREE.AmbientLight(0xAAAAAA));
    
    // create a point light
	var pointLight = new THREE.PointLight( 0xFFFFFF );
	
	// set its position
	pointLight.position.x = 10;
	pointLight.position.y = 50;
	pointLight.position.z = 130;
	
	// add to the scene
	this.scene.add(pointLight);
	    
    // Intro Parameters
    // draw bottom pen and top pen
    
    var myPath = [new THREE.Vector2(-100, 0), new THREE.Vector2(0, 100), new THREE.Vector2(100, 0)];
    var rotations = [0, 0, 0];
    
    this.topPen = new Pen(this.scene, myPath, rotations);
    
    /* TESTING****
	// set up the sphere vars
	var radius = 50, segments = 16, rings = 16;
	// create the sphere's material
	var sphereMaterial = new THREE.MeshLambertMaterial(
	{
	  // a gorgeous red.
	  color: 0xCC0000
	});
    
	// create a new mesh with sphere geometry -
	// we will cover the sphereMaterial next!
	var sphere = new THREE.Mesh(new THREE.SphereGeometry(radius, segments,rings),
	   							sphereMaterial);

	// add the sphere to the scene
	this.scene.add(sphere);
	*/

    // Renderer Initialization
    this.renderer = new THREE.WebGLRenderer(CONFIG.renderer);

    this.renderer.setSize(WIDTH, HEIGHT);
    this.renderer.setClearColorHex(CONFIG.background, 1.0);
    this.renderer.clear();

    document.body.appendChild(this.renderer.domElement);
    
    this.animate();
}


Intro.prototype.animate = function() {

	this.update();

    this.renderer.render(this.scene, this.camera);
    
    // Preserve context
    var callback = (function (ctx) {
            return function () {
                ctx.animate();
            };
        }(this));
        
    // note: three.js includes requestAnimationFrame shim
    requestAnimationFrame(callback);
}

Intro.prototype.update = function() {
	var now = UTIL.now(),
        dt = (now - this.lastUpdate) / 1000;

	this.topPen.update(dt);
	
	this.lastUpdate = now;
}
