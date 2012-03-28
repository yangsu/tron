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

    var loader = new THREE.JSONLoader();
    loader.load( "obj/LightCycle.js", this.loadObj);

    this.position = CONFIG.playerPos;
    this.velocity = CONFIG.playerVel;
    this.updatePosition();

    //this.scene.add(this.playerMesh);
}

Player.prototype.loadObj = function(geometry){
    var material = new THREE.MeshLambertMaterial({
        wireframe:true
     });
    this.playerMesh = new THREE.Mesh(geometry, material);
    this.playerMesh.position = CONFIG.playerPos.convertToCartesian();
    this.playerMesh.scale.set(1, 1, 1);
    //scene.add(playerMesh);
};

Player.prototype.getPosition = function(){
    return this.playerMesh.position;
};

Player.prototype.getRotation = function(){
    return this.playerMesh.rotation;
};

Player.prototype.moveLeft = function () {
    this.position.theta -= this.velocity.theta;
    this.playerMesh.rotation.z -= this.velocity.theta;
    this.updatePosition();
};

Player.prototype.moveRight = function () {
    this.position.theta += this.velocity.theta;
    this.playerMesh.rotation.z += this.velocity.theta;
    this.updatePosition();
};

Player.prototype.updatePosition = function () {
    this.playerMesh.position = this.position.convertToCartesian();
};

Player.prototype.moveForward = function (dt) {
    this.position.z += this.velocity.z * dt;
    this.playerMesh.position.z = this.position.z;
};

Player.prototype.update = function (dt) {
    this.moveForward(dt);
};