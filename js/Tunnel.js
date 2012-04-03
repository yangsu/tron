  /**
 * @author Troy Ferrell & Yang Su
 */

function Tunnel(callback) {

    this.tunnelSegments = [];
    this.tunnelSections = [];
    // Index used to delete segments from the scene
    this.oldestLiveSection = 0;
    this.imagePosition = 0;

    var __self = this,
        texture_1 = THREE.ImageUtils.loadTexture('img/TunnelTexture.png'),
        j,
        tunnelRing,
        startZ;
    //var texture_2 = THREE.ImageUtils.loadTexture('img/TrailTexture_2.png');
    //texture.wrapT = THREE.RepeatWrapping;
    THREE.ImageUtils.loadTexture('img/tunnelmap.jpg', {}, function (data) {
        __self.imageData = UTIL.getImageData(data);
        __self.generateTunnelSection(0);
        callback();
    });

    this.tunnelMaterial = [
        new THREE.MeshLambertMaterial({
            map: texture_1,
            transparent : true
        }),
        //new THREE.MeshLambertMaterial(CONFIG.tunnelMaterial),
        new THREE.MeshLambertMaterial({
            color: 0x000000,
            opacity: 0.1,
            shading: THREE.FlatShading
        }),
        new THREE.MeshFaceMaterial()
    ];

    this.tunnelLights = [];
    startZ = -CONFIG.tunnelSegmentPerSection * CONFIG.tunnelSegmentDepth;
    for (j = 0; j < 3; j += 1) {
        tunnelRing = new LightRing(startZ - CONFIG.cameraFar * j);
        this.tunnelLights.push(tunnelRing);
    }
}

Tunnel.prototype.update = function (playerZ) {
    // Dynamic tunnel generation based on player position
    if (this.tunnelSegments.length * CONFIG.tunnelSegmentDepth <
            Math.abs(playerZ) + CONFIG.cameraFar) {
        this.generateTunnelSection(-this.tunnelSegments.length * CONFIG.tunnelSegmentDepth);
        if (this.tunnelSections.length - this.oldestLiveSection > CONFIG.tunnelLiveSections) {
            // Remove from scene
            window.scene.remove(this.tunnelSections[this.oldestLiveSection]);
            // Remove from tunnelSections
            delete this.tunnelSections[this.oldestLiveSection];
            // Move counter along
            this.oldestLiveSection += 1;
        }
    }

    // can't dynamically add lights to scene???
    // maybe instead of splicing array up everytime

    var firstLightRing = this.tunnelLights[0],
        lastLightRing = this.tunnelLights[this.tunnelLights.length - 1];
    if (Math.abs(firstLightRing.z) < Math.abs(playerZ) - CONFIG.cameraFar) {
        firstLightRing.repositionLightRing(lastLightRing.z - CONFIG.cameraFar);
        this.tunnelLights.splice(0, 1); // remove first element
        this.tunnelLights.push(firstLightRing); // add first element to element
    }

    _.each(this.tunnelLights, function (light) {
        light.update();
    });
};

Tunnel.prototype.generateTunnelSection = function (startZ) {
    var i = 0,
        column = this.imagePosition,
        newTunnelSeg = new TunnelSegment(
            startZ,
            this.tunnelMaterial,
            UTIL.getColumn(this.imageData, column)
        ),
        geometry = newTunnelSeg.geometry,
        newTunnelMesh;

    this.tunnelSegments.push(newTunnelSeg);

    for (i = 1; i < CONFIG.tunnelSegmentPerSection; i += 1) {
        newTunnelSeg = new TunnelSegment(
            startZ - i * CONFIG.tunnelSegmentDepth,
            this.tunnelMaterial,
            UTIL.getColumn(this.imageData, column + i)
        );
        this.tunnelSegments.push(newTunnelSeg);
        // Merge with geometry
        THREE.GeometryUtils.merge(geometry, newTunnelSeg.geometry);
    }

    // Create a single mesh
    newTunnelMesh = new THREE.Mesh(geometry, this.tunnelMaterial[this.tunnelMaterial.length - 1]);
    this.tunnelSections.push(newTunnelMesh);
    window.scene.add(newTunnelMesh);

    this.imagePosition += CONFIG.tunnelSegmentPerSection;
    if (this.imagePosition >= this.imageData.width) {
        // End level here, wrap map for now
        this.imagePosition = 0;
    }
};

Tunnel.prototype.getFace = function (i, j) {
    if (i <= this.tunnelSegments.length && i >= 0) {
        return this.tunnelSegments[i].getFace(j);
    } else {
        console.log('Error: Tunnel getFace(' + i + ',' + j + ') index out of bounds');
        return null;
    }
};

function LightRing (startZ) {
    this.lights = [];
    this.rising = false;
    this.z = startZ;

    var deltaTheta = 2 * Math.PI / CONFIG.lightRingCount,
        radius = CONFIG.tunnelRadius,
        theta,
        newTunnelLight;

    for (theta = 0; theta < 2 * Math.PI; theta += deltaTheta) {
        newTunnelLight = new THREE.PointLight(CONFIG.lightColor, CONFIG.lightIntensity, CONFIG.lightRange);
        newTunnelLight.position.x = radius * Math.cos(theta);
        newTunnelLight.position.y = radius * Math.sin(theta);
        newTunnelLight.position.z = startZ;

        this.lights.push(newTunnelLight);
        window.scene.add(newTunnelLight);
    }
}

LightRing.prototype.update = function () {
    var step = CONFIG.lightIntensityStep;
    /*
     * I'm a fucking idiot. Just use sin funciton
     * EX: light.intensity = (MaxIntensity-MinIntensity)*sin(t) + MinIntensity;

    _.each(this.lights, function (light) {
        if (light.intensity >= step*10) this.rising = false;
        else if (light.intensity <= step*2) this.rising = true;

        if (this.rising) {
            light.intensity += step;
        }
        else{
            light.intensity -= step;
        }
    });*/
};

LightRing.prototype.repositionLightRing = function (newZ) {
    this.z = newZ;
    _.each(this.lights, function (light) {
        light.position.z = newZ;
    });
};

function TunnelSegment(startZ, materials, imageData) {
    this.geometry = new THREE.Geometry();
    this.geometry.dynamic = true;
    this.geometry.materials = materials;

    // var deltaTheta = 2 * Math.PI / CONFIG.tunnelResolution,
    var deltaTheta = 2 * Math.PI / imageData.length,
        radius = CONFIG.tunnelRadius,
        depth = CONFIG.tunnelSegmentDepth,
        face,
        faceuv,
        theta,
        rcos,
        rsin,
        rcosd,
        rsind,
        temp,
        i;

    // dynamically create quads for tunnel segment
    for (i = 0, theta = 0; theta < 2 * Math.PI; theta += deltaTheta, i += 1) {
        temp = imageData[i];
        // Temporary thing, need to add in structure to create different tiles
        if (temp.r + temp.g + temp.b > 10) {
            rcos = radius * Math.cos(theta);
            rsin = radius * Math.sin(theta);
            rcosd = radius * Math.cos(theta + deltaTheta);
            rsind = radius * Math.sin(theta + deltaTheta);

            // Create vertices for current quad in cylinder segment
            this.geometry.vertices.push(UTIL.vtx3(rcos, rsin, startZ),
                                        UTIL.vtx3(rcos, rsin, startZ - depth),
                                        UTIL.vtx3(rcosd, rsind, startZ - depth),
                                        UTIL.vtx3(rcosd, rsind, startZ));

            // Define normals to point inward
            temp = this.geometry.faces.length * 4;
            face = new THREE.Face4(temp + 3,
                                   temp + 2,
                                   temp + 1,
                                   temp);

            face.materialIndex = 0;
            this.geometry.faces.push(face);

            // Configure UV Texturing coord data
            faceuv = [
                new THREE.UV(0, 1),
                new THREE.UV(1, 1),
                new THREE.UV(1, 0),
                new THREE.UV(0, 0)
            ];

            this.geometry.faceUvs[0].push(new THREE.UV(0, 1));
            this.geometry.faceVertexUvs[0].push(faceuv);
        }
    }

    this.geometry.computeFaceNormals();
    this.geometry.computeVertexNormals();
}

TunnelSegment.prototype.getFace = function (i) {
    if (i <= this.geometry.faces.length && i >= 0) {
        return this.geometry.faces[i];
    } else {
        console.log('Error: TunnelSegment getFace(' + i + ') index out of bounds');
        return null;
    }
};