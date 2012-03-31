/**
 * @author Troy Ferrell & Yang Su
 */

function Player(scene) {
    this.scene = scene;
    var texture = THREE.ImageUtils.loadTexture('img/t.jpg'),
        loader = new THREE.JSONLoader();
    // texture.needsUpdate = true;
    this.material = new THREE.MeshLambertMaterial({
        map: texture
    });

    this.cycleTrail = new Trail(this.scene);


    this.playerMesh = new THREE.Mesh(
        new THREE.CubeGeometry(10, 5, 25),
        this.material
    );

    //loader.load( "obj/LightCycle.js", loadObj);

    this.position = CONFIG.playerPos;
    this.velocity = CONFIG.playerVel;
    this.updatePosition();

    //this.scene.add(this.playerMesh);
}

Player.prototype.loadObj = function (geometry) {
    //var material = new THREE.MeshLambertMaterial({wireframe:false});
    var texture = THREE.ImageUtils.loadTexture('obj/LightCycle_TextureTest1.png'),
    //texture.wrapT = THREE.RepeatWrapping;
        material = new THREE.MeshLambertMaterial({
            map: texture,
            transparent : false
        });

    Player.playerMesh = new THREE.Mesh(geometry, material);
    Player.playerMesh.position = CONFIG.playerPos.convertToCartesian();
    Player.playerMesh.scale.set(2, 2, 2);
    Player.playerMesh.rotation.y = Math.PI;
    Player.scene.add(Player.playerMesh);
};

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
