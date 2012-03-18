/**
 * @author Troy Ferrell & Yang Su
 */

function Player(scene){
	this.geometry = new THREE.CubeGeometry(200, 200, 100);
	this.material = new THREE.MeshBasicMaterial({
		color: 0xff0000,
		wireframe:true
	});
	this.playerMesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);

	this.velocity = UTIL.v3c(0 ,0, 0); // in cylindrical coord
}

Player.prototype.move = function (time){
	this.playerMesh.x += this.velocity.radius * Math.cos(this.velocity.theta) * time;
	this.playerMesh.y += this.velocity.radius * Math.sin(this.velocity.theta) * time;
	this.playerMesh.z += this.velocity.z * this.time;
};

Player.prototype.render = function () {
	// update pos????
};