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

    this.position = CONFIG.playerPos;
    this.velocity = CONFIG.playerDefaulVel;
    this.targetVelocity = CONFIG.playerDefaulTargetVel;

    this.glowScene = new THREE.Scene();
    this.glowScene.add(new THREE.AmbientLight(0xFFFFFF));
    this.glowMesh = null;

    __self = this;
    loader = new THREE.JSONLoader();
    loader.load('obj/LightCycle.js', function (geometry) {
        //var material = new THREE.MeshLambertMaterial({wireframe:false});
        var texture = THREE.ImageUtils.loadTexture('img/LightDisk.png'),
        //var texture = THREE.ImageUtils.loadTexture('obj/LightCycle_TextureTest1.png'),
            material = new THREE.MeshLambertMaterial({
                map: texture,
                transparent : false
            });
        //texture.wrapT = THREE.RepeatWrapping;

        __self.playerMesh = new THREE.Mesh(geometry, material);
        __self.playerMesh.scale.set(3, 3, 3);


        // draw glow info
        var gmap = THREE.ImageUtils.loadTexture('img/LightDisk_Glow.png');
        var gmat = new THREE.MeshPhongMaterial({
            map: gmap,
            ambient: 0xffffff,
            color: 0x000000
        });

         __self.glowMesh = new THREE.Mesh(geometry, gmat);
         __self.glowMesh.position = CONFIG.playerPos.convertToCartesian();
         __self.glowMesh.scale.set(3, 3, 3);
         __self.glowMesh.overdraw = true;
        __self.glowScene.add( __self.glowMesh);

        __self.updatePosition();
        window.scene.add(__self.playerMesh);
    });
}

Player.prototype.getPosition = function () {
    return this.position;
};

Player.prototype.getRotation = function () {
    return this.playerMesh.rotation;
};

Player.prototype.move = function (dt) {
    // Forward movement
    this.velocity.z += (this.targetVelocity.z - this.velocity.z) * CONFIG.playerForwardVelMultiplier;
    this.position.z += this.velocity.z  * dt;

    // Lateral movement
    this.velocity.theta += (this.targetVelocity.theta - this.velocity.theta) * CONFIG.playerLateralVelMultiplier;
    this.position.theta += this.velocity.theta * dt;

    // Update Rotation
    this.playerMesh.rotation.z += this.velocity.theta * dt;

    this.updatePosition();
};

Player.prototype.updatePosition = function () {
    this.playerMesh.position = this.position.convertToCartesian();
    // Offset mesh so the back of the mesh at the current position
    this.playerMesh.position.z += CONFIG.playerMeshOffest;

    this.glowMesh.position = this.playerMesh.position;
};

Player.prototype.accelerateLeft = function (dt) {
    this.targetVelocity.theta = -CONFIG.playerMaxLateralVel;
};

Player.prototype.accelerateRight = function (dt) {
    this.targetVelocity.theta = CONFIG.playerMaxLateralVel;
};

Player.prototype.accelerate = function (dt) {
    this.targetVelocity.z = CONFIG.playerMaxForwardVel;
};

Player.prototype.decelerate = function (dt) {
    this.targetVelocity.z = CONFIG.playerMinForwardVel;
};

Player.prototype.resetAcceleration = function (dt) {
    this.targetVelocity.z = CONFIG.playerDefaultForwardVel;
    this.targetVelocity.theta = 0;
};

Player.prototype.update = function (dt) {
    this.move(dt);

    this.cycleTrail.update(this.position);
};