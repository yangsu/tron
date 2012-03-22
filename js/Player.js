/**
 * @author Troy Ferrell & Yang Su
 */

function Player(scene) {
    this.scene = scene;
    
    this.materials = [
                new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture("img/t.jpg")}), // right
                new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture("img/t.jpg")}), // left
                new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture("img/t.jpg")}), //top
                new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture("img/t.jpg")}), // bottom
                new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture("img/t.jpg")}), // back
                new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture("img/t.jpg")}) // front
        ];
	//this.material  = new THREE.MeshBasicMaterial( { map: texture } );
	
    this.material = new THREE.MeshBasicMaterial({
        color: 0x0000FF,
        wireframe:false
    });
	
    this.playerMesh = new THREE.Mesh(
        new THREE.CubeGeometry(10, 10, 20),
        this.material);

    this.theta = 1.5 * Math.PI;
    this.playerMesh.position.x = 50.0 * Math.cos(this.theta);
    this.playerMesh.position.y = 50.0 * Math.sin(this.theta);

    this.scene.add(this.playerMesh);

    this.velocity = CONSTANTS.playerVel; // in cylindrical coord
}

// temp method for testing lights
Player.prototype.getZ = function(){
	return this.playerMesh.position.z;
}


Player.prototype.moveLeft = function () {
    this.theta -= this.velocity.theta;

    this.playerMesh.position.x = 50 * Math.cos(this.theta);
    this.playerMesh.position.y = 50 * Math.sin(this.theta);
};

Player.prototype.moveRight = function () {
    this.theta += this.velocity.theta;

    this.playerMesh.position.x = 50 * Math.cos(this.theta);
    this.playerMesh.position.y = 50 * Math.sin(this.theta);
};

Player.prototype.move = function (time) {
    this.playerMesh.x += this.velocity.radius * Math.cos(this.velocity.theta) * time;
    this.playerMesh.y += this.velocity.radius * Math.sin(this.velocity.theta) * time;
    this.playerMesh.z += this.velocity.z * this.time;
};

Player.prototype.update = function () {
    this.playerMesh.position.z -= this.velocity.z;
};