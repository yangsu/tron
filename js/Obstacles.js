function Obstacles(scene) {
    this.scene = scene;
    this.obstacles = [];
}

Obstacles.prototype.add = function (pos, length, width, height) {
    this.obstacles.push(new Block(pos, length, width, height, this.scene));
};

function Block(pos, length, width, height, scene) {
    this.position = pos.convertToCartesian();

    var geometry = new THREE.CubeGeometry(length, width, height),
        material = new THREE.MeshBasicMaterial({ color: 0xAA0000, wireframe: true });

    this.mesh = new THREE.Mesh(geometry, material);

    this.mesh.position = this.position;
    this.mesh.rotation.y = pos.theta;

    this.mesh.geometry.computeBoundingBox();
    this.boundingBox = this.mesh.geometry.boundingBox;
    this.mesh.geometry.computeBoundingSphere();
    this.boundingSphere = this.mesh.geometry.boundingSphere;

    scene.add(this.mesh);
}

