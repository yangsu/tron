var UTIL = {
	v3 : function (x,y,z) {
		return new THREE.Vertex(new THREE.Vector3(x,y,z));
	},
      
	v3c : function(radius, theta, z){
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

};