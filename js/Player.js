/**
 * @author Troy Ferrell & Yang Su
 */
    
function Player(scene){

	var geometry = new THREE.CubeGeometry(200, 200, 100);
    var material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe:true
    });
    var playerMesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    
 	var velocity = new v3c(); // in cylindrical coord
 	
 	function move(time){
 		playerMesh.x += velocity.radius * Math.cos(velocity.theta) * time;
 		playerMesh.y += velocity.radius * Math.sin(velocity.theta) * time;
 		playerMesh.z += velocity.z * time;
 	}
 	
 	function render(){
 		// update pos????
 	}
}

function v3 (x,y,z) {
  return new THREE.Vertex(new THREE.Vector3(x,y,z));
};
    
function v3c(_r, _th, _z){
	this.radius = _r;
	this.theta = _th;
	this.z = _z;
	
	function ConvertToCartesian()
	{
		return new v3( radius*Math.cos(theta),
					radius*Math.sin(theta),
					z );
	}
}
