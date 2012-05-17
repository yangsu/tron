function Obstacles(scene) {
    this.scene = scene;
    this.obstacles = [];
}

Obstacles.prototype.add = function (pos, length, width, height) {
    this.obstacles.push(new Block(pos, length, width, height, this.scene));
};

function Block(pos, length, width, height, scene) {
    this.position = pos.convertToCartesian();

    var geometry = new THREE.CubeGeometry(length, width, height);

    this.mesh = new THREE.Mesh(geometry, CONFIG.obstacleMaterial);

    this.mesh.position = this.position;
    this.mesh.rotation.z = pos.theta;

    this.mesh.geometry.computeBoundingBox();
    this.boundingBox = this.mesh.geometry.boundingBox;
    this.mesh.geometry.computeBoundingSphere();
    this.boundingSphere = this.mesh.geometry.boundingSphere;

    scene.add(this.mesh);
}

