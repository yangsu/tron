/**
 * @author Troy Ferrell & Yang Su
 */

function Tunnel(scene) {
    this.scene = scene;
    this.tunnelSegments = [];

    var texture = THREE.ImageUtils.loadTexture('img/HAND.jpg');
    //texture.wrapT = THREE.RepeatWrapping;

    // create new tunnel segments & add to array
    this.tunnelMaterial = [
        new THREE.MeshLambertMaterial({
            map: texture,
            transparent : false
        }),
        //new THREE.MeshLambertMaterial(CONFIG.tunnelMaterial),
        new THREE.MeshLambertMaterial({
            color: 0x000000,
            opacity: 0.1,
            shading: THREE.FlatShading
        }),
        new THREE.MeshFaceMaterial()
    ];

    /*
    var geometry = new THREE.CylinderGeometry( 1, 1, 30, 32, 1, true );
    texture = THREE.ImageUtils.loadTexture( "images/water.jpg" );
    texture.wrapT = THREE.RepeatWrapping;

    var material = new THREE.MeshLambertMaterial({color : 0xFFFFFF, map : texture});
    var mesh = new THREE.Mesh( geometry, material );
    */

    /*
    var texture = THREE.ImageUtils.loadTexture("tronTexture.jpg");
    texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.repeat.set( 125, 125 );
    texture.offset.set( 15, 15 );
    texture.needsUpdate = true;
    var sphereMaterial = new THREE.MeshBasicMaterial( { map: texture } );
    */

    this.generateTunnelSection(0);

    this.tunnelLights = [];
    var j, tunnelRing,
        startZ = -CONFIG.tunnelSegmentPerSection*CONFIG.tunnelSegmentDepth;
    for(j = 0; j < 3; j += 1) {
        tunnelRing = new LightRing(startZ - CONFIG.cameraFar*j, this.scene);
        this.tunnelLights.push(tunnelRing);
    }
}

Tunnel.prototype.update = function(playerZ){
    // Dynamic tunnel generation based on player position
    if(this.tunnelSegments.length*CONFIG.tunnelSegmentDepth <
        Math.abs(playerZ) + CONFIG.cameraFar){
        this.generateTunnelSection(-this.tunnelSegments.length*CONFIG.tunnelSegmentDepth);
    }

    // can't dynamically add lights to scene???
    // maybe instead of splicing array up everytime
    var firstLightRing = this.tunnelLights[0];
    if( Math.abs(firstLightRing.z) < Math.abs(playerZ) - CONFIG.cameraFar){
        var lastLightRing = this.tunnelLights[this.tunnelLights.length - 1];

        firstLightRing.repositionLightRing(lastLightRing.z - CONFIG.cameraFar);
        this.tunnelLights.splice(0, 1); // remove first element
        this.tunnelLights.push(firstLightRing); // add first element to element
    }

    _.each(this.tunnelLights, function (light) {
        light.update();
    });
};

Tunnel.prototype.generateTunnelSection = function(startZ) {
    var i = 0,
        newTunnelSeg = new TunnelSegment(startZ, this.tunnelMaterial),
        geometry = newTunnelSeg.geometry,
        newTunnelMesh;

    this.tunnelSegments.push(newTunnelSeg);

    for(i = 1; i < CONFIG.tunnelSegmentPerSection; i += 1) {
        newTunnelSeg= new TunnelSegment(startZ - i*CONFIG.tunnelSegmentDepth, this.tunnelMaterial);
        this.tunnelSegments.push(newTunnelSeg);
        // Merge with geometry
        THREE.GeometryUtils.merge(geometry, newTunnelSeg.geometry);
    }

    // Create a single mesh
    newTunnelMesh = new THREE.Mesh(geometry, this.tunnelMaterial[this.tunnelMaterial.length-1]);
    this.scene.add(newTunnelMesh);
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
    this.rising = false;
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

LightRing.prototype.update = function(){
    var step = CONFIG.lightIntensityStep;
    _.each(this.lights, function (light) {
        if(light.intensity >= step*10) this.rising = false;
        else if(light.intensity <= step*2) this.rising = true;

        if(this.rising){
            light.intensity += step;
        }
        else{
            light.intensity -= step;
        }
    });
};

LightRing.prototype.repositionLightRing = function(newZ){
    this.z = newZ;
    _.each(this.lights, function (light) {
        light.position.z = newZ;
    });
};

function TunnelSegment(startZ, materials) {
    this.geometry = new THREE.Geometry();
    this.geometry.dynamic = true;
    this.geometry.materials = materials;

    var deltaTheta = 2*Math.PI/CONFIG.tunnelResolution,
        radius = CONFIG.tunnelRadius,
        faceCounter = 0,
        depth = CONFIG.tunnelSegmentDepth,
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

            // Configure UV Texturing coord data
            var faceuv = [new THREE.UV(0,1),
                        new THREE.UV(1,1),
                        new THREE.UV(1,0),
                        new THREE.UV(0,0)];

            this.geometry.faceUvs[0].push(new THREE.UV(0,1));
            this.geometry.faceVertexUvs[0].push(faceuv);

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