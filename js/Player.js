/**
 * @author Troy Ferrell & Yang Su
 */

function Player(scene) {
    this.scene = scene;
    this.material = new THREE.MeshBasicMaterial({
        color: 0x0000FF,
        wireframe:false
    });
    this.playerMesh = new THREE.Mesh(
        new THREE.CubeGeometry(10, 10, 20),
        this.material
    );

    this.position = CONSTANTS.playerPos;
    this.velocity = CONSTANTS.playerVel;
    this.updatePosition();

    this.scene.add(this.playerMesh);
}


Player.prototype.moveLeft = function () {
    this.position.theta -= this.velocity.theta;
    this.updatePosition();
};

Player.prototype.moveRight = function () {
    this.position.theta += this.velocity.theta;
    this.updatePosition();
};

Player.prototype.updatePosition = function () {
    this.playerMesh.position = this.position.convertToCartesian();
};

Player.prototype.move = function (vel) {
    this.position.z += this.velocity.z;
    this.playerMesh.position.z = this.position.z;
};

Player.prototype.update = function () {
    this.move();
};