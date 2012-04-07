/**
 * @author Troy
 */

function SkyBox(){
      
    // http://learningthreejs.com/data/lets_do_a_sky/docs/lets_do_a_sky.html  
    var urlPrefix   = "img/TronSkyBox/";
    var urls = [ urlPrefix + "PosX.png", urlPrefix + "NegX.png",
    urlPrefix + "PosY.png", urlPrefix + "NegY.png",
    urlPrefix + "PosZ.png", urlPrefix + "NegZ.png" ];
    
    var textureCube = THREE.ImageUtils.loadTextureCube( urls );
    
    var shader  = THREE.ShaderUtils.lib["cube"];
    shader.uniforms["tCube"].texture = textureCube;
    
    var material = new THREE.ShaderMaterial({
        fragmentShader  : shader.fragmentShader,
        vertexShader    : shader.vertexShader,
        uniforms        : shader.uniforms
    });
    
    this.skyboxMesh  = new THREE.Mesh( new THREE.CubeGeometry( 100000, 100000, 100000, 1, 1, 1, null, true ), material );
    // If you turn camera around, won't see skybox
    this.skyboxMesh.flipSided = true;
    
    window.scene.add( this.skyboxMesh );
}

SkyBox.prototype.update = function(){
    // need to move box to keep up with position of player???
    
}
