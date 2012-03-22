/**
 * @author Troy Ferrell & Yang Su
 */

function Tunnel(scene) {
    this.scene = scene;
    this.tunnelSegments = [];
    this.numOfSegments = CONFIG.tunnelInitialSectionCount;
    this.counter = 0;

    // create new tunnel segments & add to array
    this.tunnelMaterial = [
        new THREE.MeshLambertMaterial(CONFIG.tunnelMaterial),
        new THREE.MeshLambertMaterial({
            color: 0x000000,
            opacity: 0.1,
            shading: THREE.FlatShading
        }),
        new THREE.MeshFaceMaterial()
    ];
    /*
    var texture = THREE.ImageUtils.loadTexture("tronTexture.jpg");
    texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.repeat.set( 125, 125 );
    texture.offset.set( 15, 15 );
    texture.needsUpdate = true;
    var sphereMaterial = new THREE.MeshBasicMaterial( { map: texture } );
    */

    this.tunnelLights = [];
    var newTunnelSeg, newTunnelMesh, newTunnelLight, i;
    for(i = 0; i < this.numOfSegments; i += 1) {
        newTunnelSeg = new TunnelSegment(-i*CONFIG.tunnelSectionDepth, this.tunnelMaterial);
        this.tunnelSegments.push(newTunnelSeg);

        newTunnelMesh = new THREE.Mesh(newTunnelSeg.geometry, this.tunnelMaterial[this.tunnelMaterial.length-1]);
        this.scene.add(newTunnelMesh);
    }

    // Issue with lighting!!!!
    // Seems to restrict number of lights added to scene
    // thus, need to think of solution/debug
    this.tunnelRing = new LightRing(-this.numOfSegments*CONFIG.tunnelSectionDepth, this.scene);

}

Tunnel.prototype.update = function(playerZ){
    // Dynamic tunnel generation based on player position
    if(this.tunnelSegments.length*CONFIG.tunnelSectionDepth <
        Math.abs(playerZ) + CONFIG.cameraFar){
        log('in loop');
        var newTunnelSeg, newTunnelMesh,
            i = 0,
            startZ = -this.tunnelSegments.length*CONFIG.tunnelSectionDepth;
        for(; i < this.numOfSegments; i += 1) {
            newTunnelSeg = new TunnelSegment(startZ - i*CONFIG.tunnelSectionDepth, this.tunnelMaterial);
            this.tunnelSegments.push(newTunnelSeg);

            newTunnelMesh = new THREE.Mesh(newTunnelSeg.geometry, this.tunnelMaterial[this.tunnelMaterial.length-1]);
            this.scene.add(newTunnelMesh);
        }
    }

    // Seems like THREE or WebGL limits number of pointlights in scene.
    // I think we can get at least 4 lights in. So we could rotate them. One in view, one in buffer to be placed further ahead
    if( Math.abs(this.tunnelRing.z) < Math.abs(playerZ) - 200){
        this.tunnelRing.update(playerZ - CONFIG.cameraFar);
    }
};

Tunnel.prototype.getFace = function(i, j) {
    if (i <= this.tunnelSegments.length && i >= 0)
        return this.tunnelSegments[i].getFace(j);
    else {
        console.log('Error: Tunnel getFace('+i+','+j+') index out of bounds');
        return null;
    }
};

function LightRing(startZ, scene){
    this.lights = [];
    this.z = startZ;

    var deltaTheta = 2*Math.PI/CONFIG.lightRingCount,
        radius = CONFIG.tunnelRadius,
        theta, newTunnelLight;

    for (theta = 0; theta < 2*Math.PI; theta += deltaTheta){
        newTunnelLight = new THREE.PointLight(CONFIG.lightColor, CONFIG.lightIntensity, CONFIG.lightRange);
        newTunnelLight.position.x = radius*Math.cos(theta);
        newTunnelLight.position.y = radius*Math.sin(theta);
        newTunnelLight.position.z = startZ;

        this.lights.push(newTunnelLight);
        scene.add(newTunnelLight);
    }
}

LightRing.prototype.update = function(newZ){
    var i = 0;
    this.z = newZ;
    for(; i < this.lights.length; i++){
        this.lights[i].position.z = newZ;
    }
};

function TunnelSegment(startZ, materials) {
    this.geometry = new THREE.Geometry();
    this.geometry.dynamic = true;
    this.geometry.materials = materials;

    var deltaTheta = 2*Math.PI/CONFIG.tunnelResolution,
        radius = CONFIG.tunnelRadius,
        faceCounter = 0,
        depth = CONFIG.tunnelSectionDepth,
        theta, face,
        rcos, rsin, rcosd, rsind,
        temp;

    // dynamically create quads for tunnel segment
    for (theta = 0; theta < 2*Math.PI; theta += deltaTheta){
        if (Math.floor(Math.random() * (materials.length-1)) === 0) {
            rcos = radius*Math.cos(theta);
            rsin = radius*Math.sin(theta);
            rcosd = radius*Math.cos(theta + deltaTheta);
            rsind = radius*Math.sin(theta + deltaTheta);

            // Create vertices for current quad in cylinder segment
            this.geometry.vertices.push(UTIL.vtx3(rcos, rsin, startZ),
                                        UTIL.vtx3(rcos, rsin, startZ - depth),
                                        UTIL.vtx3(rcosd, rsind, startZ - depth),
                                        UTIL.vtx3(rcosd, rsind, startZ));

            // Define normals to point inward
            temp = faceCounter*4;
            face = new THREE.Face4(temp + 3,
                                   temp + 2,
                                   temp + 1,
                                   temp);
            face.materialIndex = 0;
            this.geometry.faces.push(face);
            faceCounter += 1;

        }
    }

    this.geometry.computeFaceNormals();
    this.geometry.computeVertexNormals();
}

TunnelSegment.prototype.getFace = function(i) {
    if (i <= this.geometry.faces.length && i >= 0)
        return this.geometry.faces[i];
    else {
        console.log('Error: TunnelSegment getFace('+i+') index out of bounds');
        return null;
    }
};