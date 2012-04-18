/**
 * @author Troy Ferrell & Yang Su
 */

function Player() {
    var __self,
        loader;

    this.trail = new Trail();

    this.position = CONFIG.playerPos;
    this.velocity = CONFIG.playerDefaulVel;
    this.targetVelocity = CONFIG.playerDefaulTargetVel;

    this.bikeParticleSystem = null;
    this.particles = null;
    this.vertexCount = 0;
    this.isAlive = true;

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

Player.prototype.Derezz = function(){

    // remove mesh & glow mesh from respective scenes
    window.scene.remove(this.mesh);
    window.glowscene.remove(this.glowMesh);

    this.isAlive = false;

    // Copy geometry vertices into particle system
    this.particles = new THREE.Geometry();
    var vertex, positionVector = this.position.convertToCartesian();
    for(var i = 0; i < this.mesh.geometry.vertices.length; i++)
    {
        vertex = this.mesh.geometry.vertices[i].clone();
        vertex.position.multiplyScalar(3);
        vertex.position.addSelf(this.position.convertToCartesian());
        this.particles.vertices.push(vertex);
    }

    // Set Shader Material Parameters
    this.attributes = {
        size: { type: 'f', value: [] },
        ca:   { type: 'c', value: [] }
    };

    this.uniforms = {
        amplitude: { type: 'f', value: 1.0 },
        color:     { type: 'c', value: new THREE.Color( 0xffffff ) },
        texture:   { type: 't', value: 0, texture: THREE.ImageUtils.loadTexture( 'img/LightCycle_TextureTest1.png' ) }
    };

    //this.uniforms.texture.texture.wrapS = this.uniforms.texture.texture.wrapT = THREE.RepeatWrapping;

    this.shaderMaterial = new THREE.ShaderMaterial( {
        uniforms:       this.uniforms,
        attributes:     this.attributes,
        vertexShader:   document.getElementById( 'vertexshader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
        blending: THREE.AdditiveBlending,
        transparent: true
    });

    // Modify attributes of shader on per-particle basis
    var sizes = this.attributes.size.value;
    var colors = this.attributes.ca.value;

    for(var v = 0; v < this.mesh.geometry.vertices.length; v++) {
        sizes.push(10);
        //sizes.push(Math.random() * 10 + 5);
        colors[v] = new THREE.Color( 0xffffff );
    }

    this.bikeParticleSystem = new THREE.ParticleSystem(this.particles, this.shaderMaterial);
    this.bikeParticleSystem.sortParticles = true;
    this.bikeParticleSystem.dynamic = true;
    this.bikeParticleSystem.geometry.__dirtyVertices = true;

    window.scene.add(this.bikeParticleSystem);
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

    // Update Rotation
    this.mesh.rotation.z += this.velocity.theta * dt;

    this.updatePosition();
};

Player.prototype.updatePosition = function () {
    if (this.mesh !== null) {
        this.mesh.position = this.position.convertToCartesian();
        // Offset mesh so the back of the mesh at the current position
        this.mesh.position.z += CONFIG.playerMeshOffest;

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

Player.prototype.resetForwardAcceleration = function () {
    this.targetVelocity.z = CONFIG.playerDefaultForwardVel;
};

Player.prototype.resetLateralAcceleration = function () {
    this.targetVelocity.theta = 0;
};

Player.prototype.update = function (dt) {

    if(this.isAlive){
        this.move(dt);
        this.trail.update(this.position);
    }
    else{

        for(var i = 0; i < this.particles.vertices.length; i++)
        {
            particle = this.particles.vertices[i];

            particle.position.z += Math.random() * 15;
        }

        this.bikeParticleSystem.geometry.__dirtyVertices = true;
    }
};