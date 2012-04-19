/**
 * @author Troy Ferrell & Yang Su
 */

function Player() {
    var __self,
        loader;

    this.trail = new Trail();

    this.position = CONFIG.playerPos.clone();
    this.velocity = CONFIG.playerDefaulVel.clone();
    this.targetVelocity = CONFIG.playerDefaulTargetVel;

    this.isAlive = true;
    this.DerezzEffect = null;

    this.material = new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('img/LightCycle_TextureTest1.png'),
        transparent : false
    });
    this.glowMaterial = new THREE.MeshPhongMaterial({
        map: THREE.ImageUtils.loadTexture('img/LightCycle_Glow.png'),
        ambient: 0xFFFFFF,
        color: 0x000000
    });
    __self = this;
    loader = new THREE.JSONLoader();
    loader.load('obj/LightCycle.js', function (geometry) {
        var scale = CONFIG.playerScale;
        __self.mesh = new THREE.Mesh(geometry, __self.material);
        __self.mesh.scale.set(scale, scale, scale);
        __self.mesh.geometry.computeBoundingBox();
        __self.boundingBox = __self.mesh.geometry.boundingBox;
        // __self.mesh.geometry.computeBoundingSphere();
        // __self.boundingSphere = __self.mesh.geometry.boundingSphere;
        var box = __self.boundingBox,
            temp = box.max.clone().subSelf(box.min);
        __self.boundingSphere = {
            radius: Math.max(temp.x, temp.y)/2,
            offset: temp.z * scale - Math.max(temp.x, temp.y)/2
        };
        
        __self.boundingCylinder = {
            minz : box.min.z * scale,
            maxz : box.max.z * scale,
            radius : Math.max(temp.x, temp.y)/2
        };

        window.scene.add(__self.mesh);

        __self.glowMesh = new THREE.Mesh(geometry, __self.glowMaterial);
        __self.glowMesh.scale = __self.mesh.scale;
        __self.glowMesh.overdraw = true;
        window.glowscene.add(__self.glowMesh);

        __self.updatePosition();
    });
}

Player.prototype.Derezz = function () {

    // remove mesh & glow mesh from respective scenes
    window.scene.remove(this.mesh);
    window.glowscene.remove(this.glowMesh);

    // Kill player
    this.isAlive = false;

     // Transform vertices into current position points;
    var particles = new THREE.Geometry();
    var vertex, positionVector = this.position.convertToCartesian();
    for(var i = 0; i < this.mesh.geometry.vertices.length; i += 1)
    {
        vertex = this.mesh.geometry.vertices[i].clone();
        vertex.position.multiplyScalar(3);
        vertex.position.addSelf(positionVector);
        particles.vertices.push(vertex);
    }
    // Create effect
    this.DerezzEffect = new Derezz(particles);
};

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

    // Jumping movement
    if(!(this.position.radius >= CONFIG.playerPos.radius && this.velocity.radius > 0))
    {
        this.velocity.radius += CONFIG.playerGravityAcceleration * dt;
        this.position.radius += this.velocity.radius * dt;
        if(this.position.radius > CONFIG.playerPos.radius){
            this.position.radius = CONFIG.playerPos.radius;
        }
    }

    // Update Rotation
    this.mesh.rotation.z += this.velocity.theta * dt;

    this.updatePosition();
};

Player.prototype.updatePosition = function () {
    if (this.mesh !== null) {
        this.mesh.position = this.position.convertToCartesian();
        // Update Glow Mesh
        this.glowMesh.rotation = this.mesh.rotation;
        this.glowMesh.position = this.mesh.position;
    }
};

Player.prototype.accelerateLeft = function () {
    this.targetVelocity.theta = -CONFIG.playerMaxLateralVel;
};

Player.prototype.accelerateRight = function () {
    this.targetVelocity.theta = CONFIG.playerMaxLateralVel;
};

Player.prototype.accelerate = function () {
    this.targetVelocity.z = CONFIG.playerMaxForwardVel;
};

Player.prototype.decelerate = function () {
    this.targetVelocity.z = CONFIG.playerMinForwardVel;
};

Player.prototype.jump = function(){
    this.velocity.radius = CONFIG.defaultPlayerJumpVel;
};

Player.prototype.resetForwardAcceleration = function () {
    this.targetVelocity.z = CONFIG.playerDefaultForwardVel;
};

Player.prototype.resetLateralAcceleration = function () {
    this.targetVelocity.theta = 0;
};

Player.prototype.update = function (dt) {

    if(this.isAlive) {
        this.move(dt);
        this.trail.update(this.position.clone());
    }
    else{
        this.DerezzEffect.update(dt);
    }
};