/**
 * @author Troy Ferrell
 */
function Trail(scene){
    
    this.scene = scene;
    this.trailSegments = [];
    this.lastSegment;
    
    var trailTexture = THREE.ImageUtils.loadTexture('img/TrailTexture_2.png');
    /*this.trailMaterial = new THREE.MeshLambertMaterial({
        map: trailTexture,
        transparent: true,
        reflectivity: 0.15,
        refractionRatio: 0.75,
    });*/
    
   this.trailMaterial = new THREE.MeshLambertMaterial({wireframe: true, color: 0x0000ff});
    
    var theta = CONFIG.playerPos.theta;
    var z = CONFIG.playerPos.z;
    var start_bottom_vertex =  UTIL.vtx3(CONFIG.trailRadius_Lower*Math.cos(theta), 
                                         CONFIG.trailRadius_Lower*Math.sin(theta), 
                                         z);
    var start_top_vertex = UTIL.vtx3(CONFIG.trailRadius_Upper*Math.cos(theta), 
                                     CONFIG.trailRadius_Upper*Math.sin(theta), 
                                     z);
    var startTunnelSegment = new TrailSegment(start_top_vertex, start_bottom_vertex, CONFIG.playerPos);
    
    this.trailSegments.push(startTunnelSegment); 
    this.lastSegment = startTunnelSegment;
    
    /*
    this.playerTrail = new THREE.Mesh(
        new THREE.CubeGeometry(CONFIG.playerTrail.x, CONFIG.playerTrail.y, CONFIG.playerTrail.z), 
        this.trailMaterial
    );*/
}

Trail.prototype.update = function(playerPosition){
    
    // generate new trail segment to fill gap created by player movement
    this.generateTrailSegment(playerPosition);
    
    // delete any stale trail segments
    // TODO: HERE!!!!!
}

Trail.prototype.generateTrailSegment = function(playerPosition) {
    
    var newTrailSegment = new TrailSegment(this.lastSegment.front_top_vertex, 
                                           this.lastSegment.front_bottom_vertex,
                                           playerPosition );
                                           
    this.trailSegments.push(newTrailSegment);
    this.lastSegment = newTrailSegment;
    
    var newTrailMesh = new THREE.Mesh(newTrailSegment.geometry, this.trailMaterial);
    this.scene.add(newTrailMesh);
};


function TrailSegment(lastVertex_Top, lastVertex_Bottom, playerPos){
    
    this.geometry = new THREE.Geometry();
    this.geometry.dynamic = true;
//  this.geometry.materials = materials;

    var theta = playerPos.theta;
    var z = playerPos.z;
    
    // need to create config parameters or pass basedon value
    var r1 = 45, r2 = 35; // need to create config parameters or pass based on value
    
    // Define forward two vertices
    this.front_bottom_vertex =  UTIL.vtx3(CONFIG.trailRadius_Lower*Math.cos(theta), 
                                          CONFIG.trailRadius_Lower*Math.sin(theta), 
                                          z);
    this.front_top_vertex = UTIL.vtx3(CONFIG.trailRadius_Upper*Math.cos(theta), 
                                      CONFIG.trailRadius_Upper*Math.sin(theta), 
                                      z);
   
    // push vertices to three.js geoemetry
    this.geometry.vertices.push(this.front_bottom_vertex,
                                this.front_top_vertex,
                                lastVertex_Top,
                                lastVertex_Bottom);
            
    // Create face out of vertices & push                    
    var face = new THREE.Face4(3,2,1,0);//0, 1, 2, 3);
    this.geometry.faces.push(face);

    // Configure UV Texturing coord data
    var faceuv = [new THREE.UV(0,1),
                new THREE.UV(1,1),
                new THREE.UV(1,0),
                new THREE.UV(0,0)];

    this.geometry.faceUvs[0].push(new THREE.UV(0,1));
    this.geometry.faceVertexUvs[0].push(faceuv);
}

