/**
 * @author Troy
 */

function SkyBox(scene) {
    this.scene = scene;

    // http://learningthreejs.com/data/lets_do_a_sky/docs/lets_do_a_sky.html
    var shader  = THREE.ShaderUtils.lib.cube,
        material = new THREE.ShaderMaterial({
            fragmentShader  : shader.fragmentShader,
            vertexShader    : shader.vertexShader,
            uniforms        : shader.uniforms
        });

    shader.uniforms.tCube.texture = CONFIG.skyboxTextureCube;

    this.skyboxMesh  = new THREE.Mesh(new THREE.CubeGeometry(100000, 100000, 100000, 1, 1, 1, null, true), material);
    this.skyboxMesh.flipSided = true;

    this.scene.add(this.skyboxMesh);
}

SkyBox.prototype.reset = function () {
    this.skyboxMesh.position.z = 0;
};

SkyBox.prototype.update = function () {
    this.skyboxMesh.position.z = window.levelProgress;
};