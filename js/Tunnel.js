  /**
 * @author Troy Ferrell & Yang Su
 */

function Tunnel(callback) {

    this.segments = [];
    this.sections = [];
    // Index used to delete segments from the scene
    this.oldestLiveSection = 0;
    this.imagePosition = 0;

    var __self = this,
        texture_1 = THREE.ImageUtils.loadTexture('img/TunnelTexture5.png'),
        j,
        tunnelRing,
        startZ;
    //var texture_2 = THREE.ImageUtils.loadTexture('img/TrailTexture_2.png');
    //texture.wrapT = THREE.RepeatWrapping;
    THREE.ImageUtils.loadTexture('img/TunnelMap.png', {}, function (data) {
        __self.imageData = UTIL.getImageData(data);
        __self.width = __self.imageData.height;
        __self.generateSection(0);
        callback();
    });

    this.material = [
        // new THREE.MeshLambertMaterial(CONFIG.tunnelMaterial),
        new THREE.MeshLambertMaterial({
            map: texture_1,
            transparent : true
        }),
        new THREE.MeshLambertMaterial({
            color: 0x000000,
            opacity: 0.1,
            shading: THREE.FlatShading
        }),
        new THREE.MeshFaceMaterial()
    ];

    this.lights = [];
    startZ = -CONFIG.tunnelSegmentPerSection * CONFIG.tunnelSegmentDepth;
    for (j = 0; j < 3; j += 1) {
        tunnelRing = new LightRing(startZ - CONFIG.viewDistance * j);
        this.lights.push(tunnelRing);
    }
}

Tunnel.prototype.update = function () {
    // Dynamic tunnel generation based on player position
    if (this.segments.length * CONFIG.tunnelSegmentDepth <
            Math.abs(window.levelProgress) + CONFIG.viewDistance) {
        this.generateSection(-this.segments.length * CONFIG.tunnelSegmentDepth);
        if (this.sections.length - this.oldestLiveSection > CONFIG.tunnelLiveSections) {
            // Remove from scene
            window.scene.remove(this.sections[this.oldestLiveSection]);
            // Remove from sections
            delete this.sections[this.oldestLiveSection];
            // Move counter along
            this.oldestLiveSection += 1;
        }
    }

    // can't dynamically add lights to scene???
    // maybe instead of splicing array up everytime

    var firstLightRing = this.lights[0],
        lastLightRing = this.lights[this.lights.length - 1];
    if (Math.abs(firstLightRing.z) < Math.abs(window.levelProgress) - CONFIG.viewDistance) {
        firstLightRing.repositionLightRing(lastLightRing.z - CONFIG.viewDistance);
        this.lights.splice(0, 1); // remove first element
        this.lights.push(firstLightRing); // add first element to element
    }

    _.each(this.lights, function (light) {
        light.update();
    });
};

Tunnel.prototype.generateSection = function (startZ) {
    var i = 0,
        column = this.imagePosition,
        newSegment = new TunnelSegment(
            startZ,
            this.material,
            UTIL.getColumn(this.imageData, column)
        ),
        geometry = newSegment.geometry,
        newMesh;

    this.segments.push(newSegment);

    for (i = 1; i < CONFIG.tunnelSegmentPerSection; i += 1) {
        newSegment = new TunnelSegment(
            startZ - i * CONFIG.tunnelSegmentDepth,
            this.material,
            UTIL.getColumn(this.imageData, column + i)
        );
        this.segments.push(newSegment);
        // Merge with geometry
        THREE.GeometryUtils.merge(geometry, newSegment.geometry);
    }

    // Create a single mesh
    newMesh = new THREE.Mesh(geometry, this.material[this.material.length - 1]);
    this.sections.push(newMesh);
    window.scene.add(newMesh);

    this.imagePosition += CONFIG.tunnelSegmentPerSection;
    if (this.imagePosition >= this.imageData.width) {
        // End level here, wrap map for now
        this.imagePosition = 0;
    }
};

Tunnel.prototype.getFace = function (i, j) {
    if (i < this.segments.length && i > this.oldestLiveSection) {
        return this.segments[i].getFace(j);
    } else {
        console.log('Error: Tunnel getFace(' + i + ',' + j + ') index out of bounds');
        return null;
    }
};

function TunnelSegment(startZ, materials, imageData) {
    this.geometry = new THREE.Geometry();
    this.geometry.dynamic = true;
    this.geometry.materials = materials;
    this.faces = [];

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
        // TODO: Temporary hack need to add in structure to create different tiles
        if (temp.r + temp.g + temp.b > 10) {
            rcos = radius * Math.cos(theta);
            rsin = radius * Math.sin(theta);
            rcosd = radius * Math.cos(theta + deltaTheta);
            rsind = radius * Math.sin(theta + deltaTheta);

            // Create vertices for current quad in cylinder segment
            this.geometry.vertices.push(
                UTIL.vtx3(rcos, rsin, startZ),
                UTIL.vtx3(rcos, rsin, startZ - depth),
                UTIL.vtx3(rcosd, rsind, startZ - depth),
                UTIL.vtx3(rcosd, rsind, startZ)
            );

            // Define normals to point inward
            temp = this.geometry.faces.length * 4;
            face = new THREE.Face4(
                temp + 3,
                temp + 2,
                temp + 1,
                temp
            );

            face.materialIndex = 0;
            this.geometry.faces.push(face);
            this.faces[i] = face;

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
    if (i < this.faces.length && i >= 0) {
        return this.faces[i];
    } else {
        console.log('Error: TunnelSegment getFace(' + i + ') index out of bounds');
        return null;
    }
};