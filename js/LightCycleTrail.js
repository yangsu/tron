/**
 * @author Troy Ferrell
 */
function Trail() {
    this.trailSegments = [];
    this.trailSegmentMeshes = [];
    this.trailSegmentGlowMeshes = [];
    this.oldestLiveSection = 0;

    var theta = CONFIG.playerPos.theta,
        z = CONFIG.playerPos.z,
        startBottomVertex = UTIL.vtx3(
            CONFIG.trailRadius_Lower * Math.cos(theta),
            CONFIG.trailRadius_Lower * Math.sin(theta),
            z
        ),
        startTopVertex = UTIL.vtx3(
            CONFIG.trailRadius_Upper * Math.cos(theta),
            CONFIG.trailRadius_Upper * Math.sin(theta),
            z
        ),
        startTunnelSegment = new TrailSegment(startTopVertex, startBottomVertex, CONFIG.playerPos);

    this.trailMaterial = new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('img/TrailTexture2.png'),
        transparent: true
        // reflectivity: 0.15,
        // refractionRatio: 0.75
    });
    this.trailGlowMaterial = new THREE.MeshPhongMaterial({
        map: THREE.ImageUtils.loadTexture('img/TrailTexture2_glow.png'),
        ambient: 0x444444,
        color: 0x000000
    });

    this.trailSegments.push(startTunnelSegment);
    this.lastSegment = startTunnelSegment;
}

Trail.prototype.update = function (playerPosition) {

    // generate new trail segment to fill gap created by player movement
    this.generateTrailSegment(playerPosition);

    // delete any stale trail segments
    if (this.trailSegmentMeshes.length - this.oldestLiveSection > CONFIG.trailLiveSections) {
        // Remove from scene
        window.scene.remove(this.trailSegmentMeshes[this.oldestLiveSection]);
        // Remove from trailSegmentMeshes
        delete this.trailSegmentMeshes[this.oldestLiveSection];
        // Remove from glowscene
        window.glowscene.remove(this.trailSegmentGlowMeshes[this.oldestLiveSection]);
        // Remove from trailSegmentGlowMeshes
        delete this.trailSegmentGlowMeshes[this.oldestLiveSection];
        // Move counter along
        this.oldestLiveSection += 1;
    }
};

Trail.prototype.generateTrailSegment = function (playerPosition) {
    var newTrailSegment = new TrailSegment(
        this.lastSegment.frontTopVertex,
        this.lastSegment.frontBottomVertex,
        playerPosition
    ),
        newTrailMesh;

    this.trailSegments.push(newTrailSegment);
    this.lastSegment = newTrailSegment;

    newTrailMesh = new THREE.Mesh(newTrailSegment.geometry, this.trailMaterial);
    this.trailSegmentMeshes.push(newTrailMesh);
    window.scene.add(newTrailMesh);
    newTrailMesh = new THREE.Mesh(newTrailSegment.geometry, this.trailGlowMaterial);
    // newTrailMesh.overdraw = true;
    this.trailSegmentGlowMeshes.push(newTrailMesh);
    window.glowscene.add(newTrailMesh);
};


function TrailSegment(lastVertexTop, lastVertexBottom, playerPos) {

    this.geometry = new THREE.Geometry();
    this.geometry.dynamic = true;
//  this.geometry.materials = materials;

    var theta = playerPos.theta,
        z = playerPos.z,

    // need to create config parameters or pass basedon value
        r1 = 45,
        r2 = 35, // need to create config parameters or pass based on value

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

