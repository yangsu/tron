/**
 * @author Troy Ferrell & Yang Su
 */
function Trail() {
    this.segments = [];
    this.segmentMeshes = [];
    this.glowSegmentMeshes = [];
    this.oldestLiveSection = 0;

    var theta = CONFIG.playerPos.theta,
        z = CONFIG.playerPos.z,
        startBottomVertex = UTIL.vtx3(
            CONFIG.trailRadiusLower * Math.cos(theta),
            CONFIG.trailRadiusLower * Math.sin(theta),
            z
        ),
        startTopVertex = UTIL.vtx3(
            CONFIG.trailRadiusUpper * Math.cos(theta),
            CONFIG.trailRadiusUpper * Math.sin(theta),
            z
        ),
        startTunnelSegment = new TrailSegment(startTopVertex, startBottomVertex, CONFIG.playerPos);

    this.material = new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('img/TrailTexture2.png'),
        transparent: true
        // reflectivity: 0.15,
        // refractionRatio: 0.75
    });
    this.glowMaterial = new THREE.MeshPhongMaterial({
        map: THREE.ImageUtils.loadTexture('img/TrailTexture2_glow.png'),
        ambient: 0x444444,
        color: 0x000000
    });

    this.segments.push(startTunnelSegment);
    this.lastSegment = startTunnelSegment;
}

Trail.prototype.update = function (playerPosition) {

    // generate new trail segment to fill gap created by player movement
    this.generateSegment(playerPosition);

    // delete any stale trail segments
    if (this.segmentMeshes.length - this.oldestLiveSection > CONFIG.trailLiveSections) {
        // Remove from scene
        window.scene.remove(this.segmentMeshes[this.oldestLiveSection]);
        // Remove from segmentMeshes
        delete this.segmentMeshes[this.oldestLiveSection];
        // Remove from glowscene
        window.glowscene.remove(this.glowSegmentMeshes[this.oldestLiveSection]);
        // Remove from glowSegmentMeshes
        delete this.glowSegmentMeshes[this.oldestLiveSection];
        // Move counter along
        this.oldestLiveSection += 1;
    }
};

Trail.prototype.generateSegment = function (playerPosition) {
    var newSegment = new TrailSegment(
            this.lastSegment.frontTopVertex,
            this.lastSegment.frontBottomVertex,
            playerPosition
        ),
        newMesh;

    this.segments.push(newSegment);
    this.lastSegment = newSegment;

    newMesh = new THREE.Mesh(newSegment.geometry, this.material);
    this.segmentMeshes.push(newMesh);
    window.scene.add(newMesh);

    newMesh = new THREE.Mesh(newSegment.geometry, this.glowMaterial);
    this.glowSegmentMeshes.push(newMesh);
    window.glowscene.add(newMesh);
};


function TrailSegment(lastVertexTop, lastVertexBottom, playerPos) {

    this.geometry = new THREE.Geometry();
    this.geometry.dynamic = true;

    var theta = playerPos.theta,
        z = playerPos.z,
        face,
        faceuv;

    // Define forward two vertices
    this.frontBottomVertex =  UTIL.vtx3(
        CONFIG.trailRadiusLower * Math.cos(theta),
        CONFIG.trailRadiusLower * Math.sin(theta),
        z
    );
    this.frontTopVertex = UTIL.vtx3(
        CONFIG.trailRadiusUpper * Math.cos(theta),
        CONFIG.trailRadiusUpper * Math.sin(theta),
        z
    );

    // push vertices to three.js geoemetry
    this.geometry.vertices.push(
        this.frontBottomVertex,
        this.frontTopVertex,
        lastVertexTop,
        lastVertexBottom
    );

    // Create face out of vertices & push
    face = new THREE.Face4(3, 2, 1, 0);
    this.geometry.faces.push(face);
    // Creates opposite face to cover the other side
    face = new THREE.Face4(0, 1, 2, 3);
    this.geometry.faces.push(face);

    // Configure UV Texturing coord data
    faceuv = [
        new THREE.UV(0, 1),
        new THREE.UV(0, 0),
        new THREE.UV(1, 0),
        new THREE.UV(1, 1)
    ];
    // TODO: This is kind of a hack. fix later?
    this.geometry.faceUvs[0].push(new THREE.UV(0, 1));
    this.geometry.faceUvs[0].push(new THREE.UV(0, 1));
    this.geometry.faceVertexUvs[0].push(faceuv);
    this.geometry.faceVertexUvs[0].push(faceuv);
}

