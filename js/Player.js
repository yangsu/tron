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

    this.trail = new Trail();

    this.position = CONFIG.playerPos;
    this.velocity = CONFIG.playerDefaulVel;
    this.targetVelocity = CONFIG.playerDefaulTargetVel;

    __self = this;
    loader = new THREE.JSONLoader();
    loader.load('obj/LightCycle.js', function (geometry) {
        var material = new THREE.MeshLambertMaterial({
                map: THREE.ImageUtils.loadTexture('img/LightCycle_TextureTest1.png'),
                transparent : false
            }),
            glowMaterial = new THREE.MeshPhongMaterial({
                map: THREE.ImageUtils.loadTexture('img/LightCycle_Glow.png'),
                ambient: 0xFFFFFF,
                color: 0x000000
            });
        //texture.wrapT = THREE.RepeatWrapping;

        __self.mesh = new THREE.Mesh(geometry, material);
        __self.mesh.scale.set(3, 3, 3);
        window.scene.add(__self.mesh);

        __self.glowMesh = new THREE.Mesh(geometry, glowMaterial);
        __self.glowMesh.scale = __self.mesh.scale;
        __self.glowMesh.overdraw = true;
        window.glowscene.add(__self.glowMesh);

        __self.updatePosition();
    });
}

Player.prototype.getPosition = function () {
    return this.position;
};

Player.prototype.getRotation = function () {
    return this.mesh.rotation;
};

Player.prototype.move = function (dt) {
    // Forward movement
    this.velocity.z += (this.targetVelocity.z - this.velocity.z) * CONFIG.playerForwardVelMultiplier;
    this.position.z += this.velocity.z  * dt;

    // Lateral movement
    this.velocity.theta += (this.targetVelocity.theta - this.velocity.theta) * CONFIG.playerLateralVelMultiplier;
    this.position.theta += this.velocity.theta * dt;

    // Update Rotation
    this.mesh.rotation.z += this.velocity.theta * dt;

    this.updatePosition();
};

Player.prototype.updatePosition = function () {
    if(this.mesh != null)
    {
        this.mesh.position = this.position.convertToCartesian();
        // Offset mesh so the back of the mesh at the current position
        this.mesh.position.z += CONFIG.playerMeshOffest;
    
        // Update Glow Mesh
        this.glowMesh.rotation = this.mesh.rotation;
        this.glowMesh.position = this.mesh.position;
    }
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

    this.trail.update(this.position);
};