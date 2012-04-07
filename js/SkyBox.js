/**
 * @author Troy
 */

function SkyBox(){
      
    // http://learningthreejs.com/data/lets_do_a_sky/docs/lets_do_a_sky.html  
    var urlPrefix   = "img/SkyBox/";
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
    
    var skyboxMesh  = new THREE.Mesh( new THREE.CubeGeometry( CONFIG.cameraFar, CONFIG.cameraFar, CONFIG.cameraFar, 1, 1, 1, null, true ), material );
    
    window.scene.add( skyboxMesh );
}

SkyBox.prototype.update = function(){
    // need to move box to keep up with position of player???
}
