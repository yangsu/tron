/**
 * @author Troy Ferrell
 */


function Pen(scene, path, rotations){
    
    if(path.length == 0 || rotations.length == 0) {
        log("ERROR IN PATH SIZE FOR PEN IN INTRO");
        return;
    }
    
    this.scene = scene;
    
    // Pen Parameter Intialization
    this.timer = 0;
    this.isDone = false;
    
    this.penPath = path;
    this.penRotations = rotations;
    
    this.pathIndex = 1;
    this.curve = new THREE.LineCurve(this.penPath[0], this.penPath[this.pathIndex]);
    
    this.trailSegments = [];
    
    // Object Initialization
    this.material = new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('img/LightCycle_TextureTest1.png'),
        transparent : false
    });
    
	// set up the sphere vars
	var radius = 25, segments = 16, rings = 16;
	var sphereMaterial = new THREE.MeshLambertMaterial(
	{
	  // a gorgeous red.
	  color: 0xCC0000
	});
	//this.penMesh= new THREE.Mesh(new THREE.SphereGeometry(radius, segments,rings),
	//   								sphereMaterial);
	   								
	var startVec3 = new THREE.Vector3(this.penPath[0].x, this.penPath[0].y, 0);
	// error using playerGeometry - need to call config.init
    this.penMesh = new THREE.Mesh(CONFIG.playerGeometry, this.material);
    this.penMesh.position = startVec3;
    this.penMesh.scale.set(1.25,1.25,1.25);
    this.penMesh.rotation.x = Math.PI/2;
    this.penMesh.rotation.y = Math.PI/2;
    
    // may adjust rotations array to be array of vec3 like penpath for rotation.x,.y,.z
    //this.penMesh.rotation.y = this.penRotations[0];
    
    this.lastVec3 = startVec3;
    this.lineMaterial = new THREE.LineBasicMaterial({
        color: 0x0000FF,
        //linewidth:
        //vertexColors: array
    });
    //this.lineGeo = new THREE.Geometry();
    //this.lineGeo.vertices.push(new THREE.Vertex(startVec3));
    //this.line = new THREE.Line(this.lineGeo, this.lineMaterial);
    //this.line.dynamic = true;
    //scene.add(this.line);
   
    this.scene.add(this.penMesh);
    
}

// TODO: need to include trail drawing

Pen.prototype.update = function(dt){
	
    if(!this.isDone){ 
        var pos;
        if(this.timer + dt > 1){
            pos = this.curve.getPoint(1);
            
            if(this.pathIndex == this.penPath.length - 1){
                isDone = true;
                return;
            }
            
            this.curve = new THREE.LineCurve(this.penPath[this.pathIndex], this.penPath[this.pathIndex + 1]);
            
            this.penMesh.rotation.y += this.penRotations[this.pathIndex];
            
            this.pathIndex += 1;
            this.timer = 0;
        }else{
            this.timer += dt;
            pos = this.curve.getPoint(this.timer);
        }
       
        this.penMesh.position = new THREE.Vector3(pos.x, pos.y, 0);
        
        var newVec3 = new THREE.Vector3(pos.x, pos.y, 0);
        
        //this.line.geometry.vertices.push(new THREE.Vertex(new THREE.Vector3(pos.x, pos.y, 0)));
        //this.line.geometry.__dirtyVertices = true;
        //this.line.geometry.dynamic = true;
        
        
        // Create & add new line segment
        var lineGeo = new THREE.Geometry();
        lineGeo.vertices.push(new THREE.Vertex(this.lastVec3));
        lineGeo.vertices.push(new THREE.Vertex(newVec3));
        var line = new THREE.Line(lineGeo, this.lineMaterial);
        this.scene.add(line);
        
        this.lastVec3 = newVec3;
    }
}
