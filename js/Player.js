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

    this.glowScene = new THREE.Scene();
    this.glowScene.add(new THREE.AmbientLight(0xFFFFFF));
    this.glowMesh = null;
    
    __self = this;
    loader = new THREE.JSONLoader();
    loader.load('obj/LightDisk.js', loadObj);

    function loadObj(geometry) {
        //var material = new THREE.MeshLambertMaterial({wireframe:false});
        var texture = THREE.ImageUtils.loadTexture('img/LightDisk.png'),
        //var texture = THREE.ImageUtils.loadTexture('obj/LightCycle_TextureTest1.png'),
            material = new THREE.MeshLambertMaterial({
                map: texture,
                transparent : false
            });
        //texture.wrapT = THREE.RepeatWrapping;

        __self.playerMesh = new THREE.Mesh(geometry, material);
        __self.playerMesh.position = CONFIG.playerPos.convertToCartesian();
        __self.playerMesh.scale.set(3, 3, 3);

        __self.position = CONFIG.playerPos;
        __self.velocity = CONFIG.playerVel;

        window.scene.add(__self.playerMesh);
        
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
    
    this.glowMesh.position = this.playerMesh.position;
};

Player.prototype.moveForward = function (dt) {
    this.position.z += this.velocity.z * dt;

    this.updatePosition();
};

Player.prototype.update = function (dt) {
    this.moveForward(dt);

    //this.playerMesh.rotation.x += 0.05;
    //this.glowMesh.rotation.x += 0.05;

    this.cycleTrail.update(this.position);
};