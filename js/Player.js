/**
 * @author Troy Ferrell & Yang Su
 */

function Player(scene) {
    this.scene = scene;
    var texture = THREE.ImageUtils.loadTexture('img/t.jpg');
    // texture.needsUpdate = true;
    this.material = new THREE.MeshLambertMaterial({
        map: texture
    });

    this.playerMesh = new THREE.Mesh(
        new THREE.CubeGeometry(10, 10, 20),
        this.material);

    this.position = CONFIG.playerPos;
    this.velocity = CONFIG.playerVel;
    this.updatePosition();

    this.scene.add(this.playerMesh);
}

// temp method for testing lights
Player.prototype.getZ = function(){
    return this.playerMesh.position.z;
};

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
    this.playerMesh.rotation.z = this.position.theta;
};

Player.prototype.moveForward = function (dt) {
    this.position.z += this.velocity.z * dt;
    this.playerMesh.position.z = this.position.z;
};

Player.prototype.update = function (dt) {
    this.moveForward(dt);
};