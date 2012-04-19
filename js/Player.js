/**
 * @author Troy Ferrell & Yang Su
 */

function Player() {
    this.trail = new Trail();

    this.position = CONFIG.playerPos.clone();
    this.velocity = CONFIG.playerDefaulVel.clone();
    this.targetVelocity = CONFIG.playerDefaulTargetVel;

    this.isAlive = true;
    this.score = 0;
    this.DerezzEffect = null;

    this.material = new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('img/LightCycle_TextureTest1.png'),
        transparent : false
    });
    this.glowMaterial = CONFIG.playerGlowMaterial;

    var scale = CONFIG.playerScale;
    this.mesh = new THREE.Mesh(CONFIG.playerGeometry, this.material);
    this.mesh.scale.set(scale, scale, scale);
    this.mesh.geometry.computeBoundingBox();
    this.boundingBox = this.mesh.geometry.boundingBox;
    // this.mesh.geometry.computeBoundingSphere();
    // this.boundingSphere = this.mesh.geometry.boundingSphere;
    var box = this.boundingBox,
        temp = box.max.clone().subSelf(box.min);
    this.boundingSphere = {
        radius: Math.max(temp.x, temp.y)/2,
        offset: temp.z * scale - Math.max(temp.x, temp.y)/2
    };

    this.boundingCylinder = {
        minz : box.min.z * scale,
        maxz : box.max.z * scale,
        radius : Math.max(temp.x, temp.y)/2
    };

    window.scene.add(this.mesh);

    this.glowMesh = new THREE.Mesh(CONFIG.playerGeometry, this.glowMaterial);
    this.glowMesh.scale = this.mesh.scale;
    this.glowMesh.overdraw = true;
    window.glowscene.add(this.glowMesh);

    this.updatePosition();
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