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
    this.updatePosition();
    this.velocity = CONSTANTS.playerVel;

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
    var temp = this.position.convertToCartesian();
    this.playerMesh.position.x = temp.position.x;
    this.playerMesh.position.y = temp.position.y;
};

Player.prototype.move = function (vel) {
    this.playerMesh.position.z += this.velocity.z;
};

Player.prototype.update = function () {
    this.move();
};