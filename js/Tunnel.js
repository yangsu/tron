/**
 * @author Troy Ferrell & Yang Su
 */

function Tunnel(scene) {
    this.scene = scene;
    this.tunnelSegments = [];
    this.numOfSegments = 30;
    this.counter = 0;

    // create new tunnel segments & add to array
    this.tunnelMaterial = new THREE.MeshLambertMaterial({
                            color : CONSTANTS.tunnelColor,
                            wireframe : false,
                            transparent : false
                        });
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
        newTunnelSeg = new TunnelSegment(-i*CONSTANTS.tunnelSectionDepth);
        newTunnelMesh = new THREE.Mesh(newTunnelSeg.geometry, this.tunnelMaterial);
        this.scene.add(newTunnelMesh);

        this.tunnelSegments[i] = newTunnelMesh;
    }

    // Issue with lighting!!!!
    // Seems to restrict number of lights added to scene
    // thus, need to think of solution/debug
    this.tunnelRing = new LightRing(-i*CONSTANTS.tunnelSectionDepth, this.scene);

}

Tunnel.prototype.update = function(playerZ){
    // Dynamic tunnel generation based on player position
    if(this.tunnelSegments.length*CONSTANTS.tunnelSectionDepth < Math.abs(playerZ) + CONSTANTS.cameraFar){
        log('in loop');
        var newTunnelSeg, newTunnelMesh, i = 0, startZ = -this.tunnelSegments.length*CONSTANTS.tunnelSectionDepth;
        for(i = 0; i < this.numOfSegments; i += 1) {
            newTunnelSeg = new TunnelSegment(startZ - i*CONSTANTS.tunnelSectionDepth);
            newTunnelMesh = new THREE.Mesh(newTunnelSeg.geometry, this.tunnelMaterial);
            this.scene.add(newTunnelMesh);

            this.tunnelSegments.push(newTunnelMesh);
        }
    }

    // Seems like THREE or WebGL limits number of pointlights in scene.
    // I think we can get at least 4 lights in. So we could rotate them. One in view, one in buffer to be placed further ahead
    if( Math.abs(this.tunnelRing.z) < Math.abs(playerZ) - 200){
        this.tunnelRing.update(playerZ - CONSTANTS.cameraFar);
    }
};

function LightRing(startZ, scene){
    this.lights = [];
    this.z = startZ;

    var deltaTheta = Math.PI,
        radius = CONSTANTS.tunnelRadius,
        theta, newTunnelLight;

    for (theta = 0; theta < 2*Math.PI; theta += deltaTheta){
        newTunnelLight = new THREE.PointLight(0xFFFFFF);
        newTunnelLight.position.x = radius*Math.cos(theta);
        newTunnelLight.position.y = radius*Math.sin(theta);
        newTunnelLight.position.z = startZ;

        scene.add(newTunnelLight);

        this.lights.push(newTunnelLight);
    }
}

LightRing.prototype.update = function(newZ){
    var i = 0;
    this.z = newZ;
    for(; i < this.lights.length; i++){
        this.lights[i].position.z = newZ;
    }
};

function TunnelSegment(startZ) {
    this.geometry = new THREE.Geometry();
    this.geometry.dynamic = true;

    var deltaTheta = 2*Math.PI/CONSTANTS.tunnelResolution,
        radius = CONSTANTS.tunnelRadius,
        faceCounter = 0,
        depth = CONSTANTS.tunnelSectionDepth,
        theta, face,
        rcos, rsin, rcosd, rsind,
        temp;

    // dynamically create quads for tunnel segment
    for (theta = 0; theta < 2*Math.PI; theta += deltaTheta){
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

        this.geometry.faces.push(face);
        faceCounter += 1;
    }

    this.geometry.computeFaceNormals();
    this.geometry.computeVertexNormals();
}