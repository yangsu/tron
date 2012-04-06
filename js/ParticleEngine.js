/**
 * @author Troy
 */

function ParticleEngine(){
    
    this.particleCount = 800,
    particles = new THREE.Geometry(),
    pMaterial = new THREE.ParticleBasicMaterial({
        color: 0xFFFFFF,
        size: 5,
        //map: THREE.ImageUtils.loadTexture(""),
        blending: THREE.AdditiveBlending,
        transparent: true
    });
    
    for(var p = 0;  p < this.particleCount; p++)
    {
        var theta = Math.random() * (2 * Math.PI),
            radius = Math.random() * 75 + CONFIG.tunnelRadius + 10;
            
        var pX = radius * Math.cos(theta),
            pY = radius * Math.sin(theta),
            pZ = Math.random() * (-CONFIG.cameraFar*2);
        
        particle = new THREE.Vertex(new THREE.Vector3(pX, pY, pZ));
        particle.velocity = new THREE.Vector3(0, 0, Math.random());
            
        particles.vertices.push(particle);
    }
    
    this.particleSystem = new THREE.ParticleSystem(particles, pMaterial);
    this.particleSystem.sortParticles = true;
    
    window.scene.add(this.particleSystem);
}

// NEed to refactor code
ParticleEngine.prototype.update = function () {
  var pCount = this.particleCount;
  while(pCount--) {
    // get the particle
    var particle = particles.vertices[pCount];

    // check if we need to reset
    if( Math.abs(particle.position.z) < Math.abs(window.levelProgress) ) {
      particle.position.z = window.levelProgress - CONFIG.cameraFar*2;
      particle.velocity.z = 0;
    }
    
    // update the velocity with
    // a splat of randomniz
    particle.velocity.z += Math.random() * .1;

    // and the position
    particle.position.addSelf(particle.velocity);
  }

  // flag to the particle system
  // that we've changed its vertices.
  this.particleSystem.geometry.__dirtyVertices = true;
}
