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

/*
    var trailTexture = THREE.ImageUtils.loadTexture('img/TrailTexture_2.png');
    this.trailMaterial = new THREE.MeshLambertMaterial({
        map: trailTexture,
        transparent: true,
        reflectivity: 0.15,
        refractionRatio: 0.75,
    })
    this.playerTrail = new THREE.Mesh(
        new THREE.CubeGeometry(CONFIG.playerTrail.x, CONFIG.playerTrail.y, CONFIG.playerTrail.z), 
        this.trailMaterial
    );*/
   
   this.cycleTrail = new Trail(this.scene);
    
    this.playerMesh = new THREE.Mesh(
        new THREE.CubeGeometry(10, 5, 25),
        this.material);

    var loader = new THREE.JSONLoader();
    //loader.load( "obj/LightCycle.js", this.loadObj);

    this.position = CONFIG.playerPos;
    this.velocity = CONFIG.playerVel;
    this.updatePosition();

    //this.scene.add(this.playerTrail);
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
    this.playerTrail.rotation.z -= this.velocity.theta;
    this.updatePosition();
};

Player.prototype.moveRight = function () {
    this.position.theta += this.velocity.theta;
    this.playerMesh.rotation.z += this.velocity.theta;
    this.playerTrail.rotation.z += this.velocity.theta;
    this.updatePosition();
};

Player.prototype.updatePosition = function () {
    this.playerMesh.position = this.position.convertToCartesian();
    
    this.playerTrail.position = this.position.convertToCartesian();
    this.playerTrail.position.z += CONFIG.playerTrailOffset_Z;
};

Player.prototype.moveForward = function (dt) {
    this.position.z += this.velocity.z * dt;
    
    this.updatePosition();
};

Player.prototype.update = function (dt) {
    this.moveForward(dt);
    
    this.cycleTrail.update(this.position);
};
