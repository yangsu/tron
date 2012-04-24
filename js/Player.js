/**
 * @author Troy Ferrell & Yang Su
 */

function Player(scene, glowscene) {
    
    this.scene = scene;
    this.glowScene = glowscene;
    
    this.trail = new Trail(scene, glowscene);

    this.position = CONFIG.playerPos.clone();
    this.velocity = CONFIG.playerDefaulVel.clone();
    this.targetVelocity = CONFIG.playerDefaulVel.clone();
    this.targetRotation = 0;

    this.isAlive = true;
    this.score = 0;
    this.DerezzEffect = null;

    this.material = new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('img/LightCycle_TextureTest1.png'),
        transparent : false
    });
    this.glowMaterial = CONFIG.playerGlowMaterial;

    this.mesh = new THREE.Mesh(CONFIG.playerGeometry, this.material);
    this.mesh.scale.set(CONFIG.playerScale, CONFIG.playerScale, CONFIG.playerScale);
    this.mesh.geometry.computeBoundingBox();
    this.boundingBox = this.mesh.geometry.boundingBox;
    // this.mesh.geometry.computeBoundingSphere();
    // this.boundingSphere = this.mesh.geometry.boundingSphere;
    var box = this.boundingBox,
        temp = box.max.clone().subSelf(box.min),
        radius = Math.max(temp.x, temp.y) / 2;
    this.boundingSphere = {
        radius: radius,
        offset: temp.z * CONFIG.playerScale - radius
    };

    this.boundingCylinder = {
        minz : box.min.z * CONFIG.playerScale,
        maxz : box.max.z * CONFIG.playerScale,
        radius : radius
    };

    this.scene.add(this.mesh);

    this.glowMesh = new THREE.Mesh(CONFIG.playerGeometry, this.glowMaterial);
    this.glowMesh.scale = this.mesh.scale;
    this.glowMesh.overdraw = true;
    this.glowScene.add(this.glowMesh);

    this.updatePosition();
}

Player.prototype.Derezz = function () {

    // remove mesh & glow mesh from respective scenes
    this.scene.remove(this.mesh);
    this.glowScene.remove(this.glowMesh);

    // Kill player
    this.isAlive = false;

     // Transform vertices into current position points;
    var particles = new THREE.Geometry(),
        positionVector = this.position.convertToCartesian();
    _.each(this.mesh.geometry.vertices, function (vertex) {
        var newVertex = vertex.clone();
        newVertex.position.multiplyScalar(3);
        newVertex.position.addSelf(positionVector);
        particles.vertices.push(newVertex);
    });

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
    if (!(this.position.radius >= CONFIG.playerPos.radius && this.velocity.radius > 0)) {
        this.velocity.radius += CONFIG.playerGravityAcceleration * dt;
        this.position.radius += this.velocity.radius * dt;
        if (this.position.radius > CONFIG.playerPos.radius) {
            this.position.radius = CONFIG.playerPos.radius;
        }
    }

    // Update Rotation
    this.targetRotation += this.velocity.theta * dt;
    this.mesh.rotation.z += (this.targetRotation - this.mesh.rotation.z) * CONFIG.playerRotationMultiplier;

	// use x rotation for jump??
	// use y for laterial motion???
	//this.mesh.rotation.y += (this.targetRotation - this.mesh.rotation.y) * CONFIG.playerRotationalMultiplier;


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

    //this.mesh.rotation.y = Math.PI/12;
};

Player.prototype.accelerateRight = function () {
    this.targetVelocity.theta = CONFIG.playerMaxLateralVel;

    //this.mesh.rotation.y = -Math.PI/12;
};

Player.prototype.accelerate = function () {
    this.targetVelocity.z = CONFIG.playerMaxForwardVel;
};

Player.prototype.decelerate = function () {
    this.targetVelocity.z = CONFIG.playerMinForwardVel;
};

Player.prototype.jump = function () {
    this.velocity.radius = CONFIG.defaultPlayerJumpVel;
};

Player.prototype.resetForwardAcceleration = function () {
    this.targetVelocity.z = CONFIG.playerDefaultForwardVel;
};

Player.prototype.resetLateralAcceleration = function () {
    this.targetVelocity.theta = 0;
};

Player.prototype.update = function (dt) {
    if (this.isAlive) {
        this.move(dt);
        this.trail.update(this.position.clone());
    } else {
        this.DerezzEffect.update(dt);
    }
};