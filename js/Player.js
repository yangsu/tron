/**
 * @author Troy Ferrell & Yang Su
 */
    
function Player(){

	var geometry;
	var material;
	var mesh;
	
	//this.geometry = new THREE.
 	var pos, vel; // in cylindrical coord
 	
 	function move(time){
 		pos.radius += vel.radius * time;
 		pos.theta += vel.theta * time;
 		pos.z += vel.z * time;
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
