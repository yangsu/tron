/**
 * @author Troy Ferrell & Yang Su
 */

function Player() {
    var texture = THREE.ImageUtils.loadTexture('img/t.jpg'),
        __self,
        loader;
    // texture.needsUpdate = true;
    this.material = new THREE.MeshLambertMaterial({
        map: texture
    });

    this.cycleTrail = new Trail(this.scene);

    this.playerMesh = null;
    this.position = null;
    this.velocity = null;

    __self = this;
    loader = new THREE.JSONLoader();
    loader.load('obj/LightCycle.js', loadObj);

    function loadObj(geometry) {
        //var material = new THREE.MeshLambertMaterial({wireframe:false});
        var texture = THREE.ImageUtils.loadTexture('obj/LightCycle_TextureTest1.png'),
            material = new THREE.MeshLambertMaterial({
                map: texture,
                transparent : false
            });
        //texture.wrapT = THREE.RepeatWrapping;

        __self.playerMesh = new THREE.Mesh(geometry, material);
        __self.playerMesh.position = CONFIG.playerPos.convertToCartesian();
        __self.playerMesh.scale.set(2, 2, 2);

        __self.position = CONFIG.playerPos;
        __self.velocity = CONFIG.playerVel;
        __self.updatePosition();

        window.scene.add(__self.playerMesh);
    }
}

Player.prototype.getPosition = function () {
    return this.playerMesh.position;
};

Player.prototype.getRotation = function () {
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

    this.updatePosition();
};

Player.prototype.update = function (dt) {
    this.moveForward(dt);

    this.cycleTrail.update(this.position);
};