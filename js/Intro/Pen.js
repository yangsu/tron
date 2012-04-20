/**
 * @author Troy Ferrell
 */


function Pen(scene, path, rotations){
    
    if(path.length == 0 || rotations.length == 0) {
        log("ERROR IN PATH SIZE FOR PEN IN INTRO");
        return;
    }
    
    // Pen Parameter Intialization
    this.timer = 0;
    this.isDone = false;
    
    this.penPath = path;
    this.penRotations = rotations;
    
    this.pathIndex = 1;
    this.curve = new THREE.LineCurve(this.penPath[0], this.penPath[pathIndex]);
    
    this.trailSegments = [];
    
    // Object Initialization
    this.material = new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('img/LightCycle_TextureTest1.png'),
        transparent : false
    });
    
    this.penMesh = new THREE.Mesh(CONFIG.playerGeometry, this.material);
    this.penMesh.position = new THREE.Vector3(this.penPath[0].x, this.penPath[0].y, 0);
    
    // may adjust rotations array to be array of vec3 like penpath for rotation.x,.y,.z
    this.penMesh.rotation.z = this.rotations[0];
    
    var lineGeo = new THREE.Geometry();
    lineGeo.vertices.push(new THREE.Vertex(this.penPath[0]));
    var lineMaterial = new THREE.LineBasicMaterial({
        color: 0x0000ff,
        //linewidth:
        //vertexColors: array
    });
    this.line = new THREE.Line(lineGeo, lineMaterial);
    
    // use window scene???
    scene.add(this.penMesh);
}

// TODO: need to include trail drawing

Pen.prototype.update = function(dt){
    if(!this.isDone){ 
        var pos;
        if(timer + dt > 1){
            pos = this.curve.getPoint(1);
            
            if(this.pathIndex == this.penPath.length - 1){
                isDone = true;
                return;
            }
            
            this.curve = new THREE.LineCurve(this.penPath[this.pathIndex], this.penPath[this.pathIndex + 1]);
            
            this.penMesh.rotation.z = this.rotations[this.pathIndex];
            
            this.pathIndex += 1;
        }else{
            timer += dt;
            pos = this.curve.getPoint(timer);
        }
       
        this.penMesh.geometry.vertices.push(new THREE.Vertex(new THREE.Vector3(pos.x, pos.y, 0)));
        this.penMesh.geometry.__dirtyVertices = true;
        
        this.penMesh.position = new THREE.Vector3(pos.x, pos.y, 0);
    }
}
