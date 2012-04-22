/**
 * @author Troy
 */

function ParticleEngine() {
    this.particles = new THREE.Geometry();
    /*
    pMaterial = new THREE.ParticleBasicMaterial({
        color: 0xFFFFFF,
        size: 5,
        //map: THREE.ImageUtils.loadTexture('),
        blending: THREE.AdditiveBlending,
        transparent: true
    });
    */
    var theta, radius, pX, pY, pZ, particle;
    _.times(CONFIG.particleCount, function () {
        theta = Math.random() * TWOPI;
        radius = Math.random() * 75 + CONFIG.tunnelRadius + 125;

        pX = radius * Math.cos(theta);
        pY = radius * Math.sin(theta);
        pZ = Math.random() * (-CONFIG.viewDistance * 20);

        particle = UTIL.vtx3(pX, pY, pZ);
        particle.velocity = UTIL.v3(0, 0, Math.random());

        this.particles.vertices.push(particle);
    });

    // Set Shader Material Parameters
    this.attributes = {
        size: {type: 'f', value: []},
        ca:   {type: 'c', value: []}
    };

    this.uniforms = {
        amplitude: {type: 'f', value: 1.0 },
        color:     {type: 'c', value: new THREE.Color(0xFFFFFF)},
        texture:   {type: 't', value: 0, texture: CONFIG.particleTexture}
    };

    this.uniforms.texture.texture.wrapS = this.uniforms.texture.texture.wrapT = THREE.RepeatWrapping;

    this.shader = {
        vertexShader: [
            'attribute float size;',
            'attribute vec3 ca;',
            'varying vec3 vColor;',
            'void main(){',
                'vColor = ca;',
                'vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);',
                'gl_PointSize = size;',
                'gl_Position = projectionMatrix * mvPosition;',
            '}'
        ].join('\n'),

        fragmentShader: [
            'uniform vec3 color;',
            'uniform sampler2D texture;',
            'varying vec3 vColor;',
            'void main(){',
                //'gl_FragColor = vec4(color, 1.0);',
                'gl_FragColor = vec4(color*vColor, 1.0);',
                //'gl_FragColor = gl_FragColor * texture2D(texture, gl_PointCoord);',
            '}'
        ].join('\n')
    };

    this.shaderMaterial = new THREE.ShaderMaterial({
        uniforms:       this.uniforms,
        attributes:     this.attributes,
        vertexShader:   this.shader.vertexShader,//document.getElementById('vertexshader').textContent,
        fragmentShader: this.shader.fragmentShader,//document.getElementById('fragmentshader').textContent,
        blending: THREE.AdditiveBlending,
        transparent: true
    });

    // Modify attributes of shader on per-particle basis
    var sizes = this.attributes.size.value,
        colors = this.attributes.ca.value;
    _.each(this.particles.vertices, function(vertex, v) {
        sizes.push(Math.random() * 10 + 5);
        colors[v] = new THREE.Color(0xFFFFFF);

        var value = Math.abs(vertex.position.z)/(CONFIG.viewDistance * 20);
        colors[v].setHSV(0.55, 0.75, 1.0);
        //colors[v].setHSV(Math.random(), Math.random(), Math.random());
    });

    this.particleSystem = new THREE.ParticleSystem(this.particles, this.shaderMaterial);
    this.particleSystem.sortParticles = true;
    this.particleSystem.dynamic = true;

    window.scene.add(this.particleSystem);

    this.loadMusic();
}

ParticleEngine.prototype.loadMusic = function(){
    if(!window.isMobileDevice){
        // Initialize BgMusic
        var __self = this;

        var bgMusic = new Sound(CONFIG.bgSound);
        bgMusic.volume(CONFIG.soundVolume);
        bgMusic.on('load', function(){
            // set intialized sound
        });

        bgMusic.on('audioprocess', function(input){
            var bars = input.length,
                index,
                percentage;
           _.each(__self.particles.vertices, function (vertex) {
               percentage = Math.abs(vertex.position.z)/Math.abs(window.levelProgress - CONFIG.viewDistance*20);
               index = bars - 1 - Math.floor(percentage * bars);

               __self.attributes.size.value[i] = input[index]/50;
                //vertex.position.addSelf();
           });
           __self.attributes.size.needsUpdate = true;
        });

        bgMusic.on('progress', function(loaded, total){
            var progress = loaded / total;
        });

        bgMusic.play();
    }
};

// NEed to refactor code
ParticleEngine.prototype.update = function () {
    var pCount = CONFIG.particleCount,
        particle;
    _.each(this.particles.vertices, function (particle) {
        // check if we need to reset
        if (Math.abs(particle.position.z) < Math.abs(window.levelProgress)) {
            particle.position.z = window.levelProgress - CONFIG.viewDistance * 20;
            particle.velocity.z = 0;
        }

        // update the velocity with a splat of randomniz
        particle.velocity.z += Math.random() * 0.1;

        // and the position
        particle.position.addSelf(particle.velocity);
    });

    // flag to the particle system
    // that we've changed its vertices.
    this.particleSystem.geometry.__dirtyVertices = true;
};
