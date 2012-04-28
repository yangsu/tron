/**
 * @author Troy
 */

function SkyBox(scene) {
    
    this.scene = scene;
    
    // http://learningthreejs.com/data/lets_do_a_sky/docs/lets_do_a_sky.html
    var urlPrefix   = 'img/SpaceSkybox/',
        urls = [
            urlPrefix + 'PosX.png',
            urlPrefix + 'NegX.png',
            urlPrefix + 'PosY.png',
            urlPrefix + 'NegY.png',
            urlPrefix + 'PosZ.png',
            urlPrefix + 'NegZ.png'
        ],

        textureCube = THREE.ImageUtils.loadTextureCube(urls),
        shader  = THREE.ShaderUtils.lib.cube,
        material = new THREE.ShaderMaterial({
            fragmentShader  : shader.fragmentShader,
            vertexShader    : shader.vertexShader,
            uniforms        : shader.uniforms
        });

    shader.uniforms.tCube.texture = textureCube;

    this.skyboxMesh  = new THREE.Mesh(new THREE.CubeGeometry(100000, 100000, 100000, 1, 1, 1, null, true), material);
    // If you turn camera around, won't see skybox
    this.skyboxMesh.flipSided = true;

    this.scene.add(this.skyboxMesh);
}

SkyBox.prototype.reset = function(){
    this.skyboxMesh.position.z = 0;
};

SkyBox.prototype.update = function () {
    this.skyboxMesh.position.z = window.levelProgress;
};