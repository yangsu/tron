/**
 * @author Troy Ferrell
 */

function Intro(){
    
    // Init
    this.lastUpdate = UTIL.now();
    this.resourceLoaded = false;
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
	    
    // Wrap the function to be called while preserving the context
    CONFIG.init(UTIL.wrap(this, function () {
        // Objects
        // YES! Hard-coded code!
        var tronPath = [UTIL.v2(-500, 0),
                        UTIL.v2(-250, 0), UTIL.v2(-250, 75), // ***** T *****
                        UTIL.v2(-300, 75), UTIL.v2(-300, 100), UTIL.v2(-175, 100),
                        UTIL.v2(-175, 75), UTIL.v2(-225, 75), UTIL.v2(-225, 0),
                        
                        //space = -75
                        UTIL.v2(-100,0), UTIL.v2(-100, 100), UTIL.v2(-25, 100), UTIL.v2(-25, 50), // ***** R *****
                        UTIL.v2(-60, 50), UTIL.v2(-25, 0),
                         
                        UTIL.v2(50, 0), UTIL.v2(50, 100), UTIL.v2(125, 100), UTIL.v2(125, 0), // **** O *****
                        
                        UTIL.v2(200,0), UTIL.v2(200, 100), UTIL.v2(225, 100), UTIL.v2(275, 0),// **** N *****
                        UTIL.v2(275, 100), UTIL.v2(300, 100), UTIL.v2(300, 0), 
                        
                        UTIL.v2(500, 0)];
        
        var tronRotations = [0, Math.PI/2, Math.PI/2, -Math.PI/2, -Math.PI/2, -Math.PI/2, -Math.PI/2, Math.PI/2, Math.PI/2, // *** T Turns ***
                            Math.PI/2, -Math.PI/2, -Math.PI/2, -Math.PI/2,     Math.PI/2, Math.PI/2, // ***** R Turns
                            Math.PI/2, -Math.PI/2, -Math.PI/2, Math.PI/2, // **** O Turns
                            Math.PI/2, -Math.PI/2,     -Math.PI/2, Math.PI, -Math.PI/2, Math.PI/2];
                            //0, 0, 0, 0, 0, 0, 0, 0];
        
        this.tronPen = new Pen(this.scene, tronPath, tronRotations);
        this.resourcesLoaded = true;
        /*
        //TESTING**
        var myPath = [new UTIL.v2(-500, 0), new UTIL.v2(-25, 0), new UTIL.v2(-25, 100), new UTIL.v2(0, 100), new UTIL.v2(0, 0), new UTIL.v2(10, 0),
        new UTIL.v2(30,0), new UTIL.v2(50,0)];
        
        var rotations = [0, Math.PI/2, -Math.PI/2, -Math.PI/2, Math.PI/2, 0, 0, 0];
        
        this.topPen = new Pen(this.scene, myPath, rotations);
        this.resourcesLoaded = true;
        */
    }));

    // Renderer Initialization
    this.renderer = new THREE.WebGLRenderer(CONFIG.renderer);

    this.renderer.setSize(WIDTH, HEIGHT);
    this.renderer.setClearColorHex(CONFIG.background, 1.0);
    this.renderer.clear();

    //document.body.appendChild(this.renderer.domElement);
    
    this.lastMouseTouch = null;
     this.lineMaterial = new THREE.LineBasicMaterial({
        color: 0x0000FF,
        //linewidth:
        //vertexColors: array
    });
    
    this.animate();
}


Intro.prototype.loadView = function(){
   // TODO: keep one dom element renderer???
   // document.body.appendChild(this.renderer.domElement);    
}

Intro.prototype.unloadView = function(){
    document.body.removeChild(this.renderer.domElement);
}

Intro.prototype.drawMouse = function(mx, my){
    if(this.lastMouseTouch == null){
        this.lastMouseTouch = UTIL.v2(mx - window.innerWidth/2, my - window.innerHeight/2);
    }else{
        var lineGeo = new THREE.Geometry();
        lineGeo.vertices.push(new THREE.Vertex(this.lastMouseTouch));
        lineGeo.vertices.push(new THREE.Vertex(UTIL.v2(mx - window.innerWidth/2, my - window.innerHeight/2)));
        var line = new THREE.Line(lineGeo, this.lineMaterial);
        this.scene.add(line);
        
        this.lastMouseTouch = null;
    }
    
    log(mx,window.innerHeight - my);
}


Intro.prototype.animate = function() {
    if (this.resourcesLoaded){
    	this.update();
    
        this.renderer.render(this.scene, this.camera);
    }    
    
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

    this.tronPen.update(dt);
	//this.topPen.update(dt);
	
	this.lastUpdate = now;
}
