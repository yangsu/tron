/**
 * @author Troy Ferrell
 */

function Derezz(geometry){
    
    this.particleGeo = geometry;

    // Set Shader Material Parameters
    this.attributes = {
        size: { type: 'f', value: [] },
        ca:   { type: 'c', value: [] }
    };

    this.uniforms = {
        amplitude: { type: 'f', value: 1.0 },
        color:     { type: 'c', value: new THREE.Color( 0xffffff ) },
        texture:   { type: 't', value: 0, texture: THREE.ImageUtils.loadTexture( 'img/LightCycle_Glow.png' ) }
    };

    //this.uniforms.texture.texture.wrapS = this.uniforms.texture.texture.wrapT = THREE.RepeatWrapping;

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

    this.shaderMaterial = new THREE.ShaderMaterial( {
        uniforms:       this.uniforms,
        attributes:     this.attributes,
        vertexShader:   this.shader.vertexShader, //document.getElementById( 'vertexshader' ).textContent,
        fragmentShader: this.shader.fragmentShader, //document.getElementById( 'fragmentshader' ).textContent,
        blending: THREE.AdditiveBlending,
        transparent: true
    });

    // Modify attributes of shader on per-particle basis
    var sizes = this.attributes.size.value;
    var colors = this.attributes.ca.value;

    for(var v = 0; v < this.particleGeo.vertices.length; v++) {
        sizes.push(5);
        //sizes.push(Math.random() * 10 + 5);
        colors[v] = new THREE.Color( 0xffffff );
        colors[v].setHSV(0.55, 0.75, 1.0);
    }

    this.particleSystem = new THREE.ParticleSystem(this.particleGeo, this.shaderMaterial);
    this.particleSystem.sortParticles = true;
    this.particleSystem.dynamic = true;
    this.particleSystem.geometry.__dirtyVertices = true;

    window.gameScene.add(this.particleSystem);
}

Derezz.prototype.update = function(dt){
        for(var i = 0; i < this.particleGeo.vertices.length; i++)
        {
            particle = this.particleGeo.vertices[i];

            particle.position.z += Math.random() * 500 * dt;
        }

        this.particleSystem.geometry.__dirtyVertices = true;
}
