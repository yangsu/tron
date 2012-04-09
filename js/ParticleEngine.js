/**
 * @author Troy
 */

function ParticleEngine() {

    this.particleCount = 800;
    
    this.particles = new THREE.Geometry();
    /*
    pMaterial = new THREE.ParticleBasicMaterial({
        color: 0xFFFFFF,
        size: 5,
        //map: THREE.ImageUtils.loadTexture(""),
        blending: THREE.AdditiveBlending,
        transparent: true
    });
    */

    // Create Particle Geometry(aka Positions)
    var p, theta, radius, pX, pY, pZ, particle;
    for (p = 0; p < this.particleCount; p += 1) {
        theta = Math.random() * (2 * Math.PI);
        radius = Math.random() * 75 + CONFIG.tunnelRadius + 10;

        pX = radius * Math.cos(theta);
        pY = radius * Math.sin(theta);
        pZ = Math.random() * (-CONFIG.viewDistance * 2);

        particle = new THREE.Vertex(new THREE.Vector3(pX, pY, pZ));
        particle.velocity = new THREE.Vector3(0, 0, Math.random());

        this.particles.vertices.push(particle);
    }


    // Set Shader Material Parameters
    this.attributes = {
        size: { type: 'f', value: [] },
        ca:   { type: 'c', value: [] }
    };
    
    this.uniforms = {
        amplitude: { type: "f", value: 1.0 },
        color:     { type: "c", value: new THREE.Color( 0xffffff ) },
       // texture:   { type: "t", value: 0, texture: THREE.ImageUtils.loadTexture( "textures/sprites/disc.png" ) },
    };

    //uniforms.texture.texture.wrapS = uniforms.texture.texture.wrapT = THREE.RepeatWrapping;

    this.shaderMaterial = new THREE.ShaderMaterial( {
        uniforms:       this.uniforms,
        attributes:     this.attributes,
        vertexShader:   document.getElementById( 'vertexshader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentshader' ).textContent
    });
    
    // Modify attributes of shader on per-particle basis
    var verts = this.particles.vertices;
    var values = this.attributes.size.value;
    for(var v = 0; v < verts.length; v++) {
        values.push(Math.random() * 10 + 5);
    }

    this.particleSystem = new THREE.ParticleSystem(this.particles, this.shaderMaterial);
    //this.particleSystem = new THREE.ParticleSystem(this.particles, pMaterial);
    this.particleSystem.sortParticles = true;
    this.particleSystem.dynamic = true;

    window.scene.add(this.particleSystem);
    
    // Initialize BgMusic
    var __self = this;
    
    //var bgMusic = new Audio("sounds/TronMusic1.mp3");
    var bgMusic = new Sound("sounds/TronMusic1.mp3");
    bgMusic.volume(0.7);
    bgMusic.on('load', function(){
        // set intialized sound
    });
    
    bgMusic.on('audioprocess', function(input){
       var bars = input.length; 
       var i = 0, sum = 0, newSize = 5;
       for(; i < bars/4; i++){
           sum += input[i];
       }
       

       if(sum > 3900){
           newSize = 25;
       }
       
       for(i = 0; i < __self.attributes.size.value.length; i++){
           __self.attributes.size.value[i] = newSize;
           //__self.attributes = sum/3000;
           //__self.attributes.size.value[i] = Math.random() * 15 + 5;
       }
       __self.attributes.size.needsUpdate = true;
       
    });
    
    bgMusic.on('progress', function(loaded, total){
        var progress = loaded / total;
    });
    
    bgMusic.play();
    
    
}

// NEed to refactor code
ParticleEngine.prototype.update = function () {
    var pCount = this.particleCount,
        particle;
    while (pCount--) {
        // get the particle
        particle = this.particles.vertices[pCount];

        // check if we need to reset
        if (Math.abs(particle.position.z) < Math.abs(window.levelProgress)) {
            particle.position.z = window.levelProgress - CONFIG.viewDistance * 2;
            particle.velocity.z = 0;
        }

        // update the velocity with
        // a splat of randomniz
        particle.velocity.z += Math.random() * 0.1;

        // and the position
        particle.position.addSelf(particle.velocity);
    }

    // flag to the particle system
    // that we've changed its vertices.
    this.particleSystem.geometry.__dirtyVertices = true;
};
