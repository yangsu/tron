/**
 * @author Troy Ferrell
 */
function Trail(scene) {

    this.scene = scene;
    this.trailSegments = [];
    this.lastSegment = null;

    var trailTexture = THREE.ImageUtils.loadTexture('img/TrailTexture_2.png'),
    /*this.trailMaterial = new THREE.MeshLambertMaterial({
        map: trailTexture,
        transparent: true,
        reflectivity: 0.15,
        refractionRatio: 0.75,
    });*/

        theta = CONFIG.playerPos.theta,
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

    this.trailMaterial = new THREE.MeshLambertMaterial({wireframe: true, color: 0x0000ff});
    this.trailSegments.push(startTunnelSegment);
    this.lastSegment = startTunnelSegment;

    /*
    this.playerTrail = new THREE.Mesh(
        new THREE.CubeGeometry(CONFIG.playerTrail.x, CONFIG.playerTrail.y, CONFIG.playerTrail.z),
        this.trailMaterial
);*/
}

Trail.prototype.update = function (playerPosition) {

    // generate new trail segment to fill gap created by player movement
    this.generateTrailSegment(playerPosition);

    // delete any stale trail segments
    // TODO: HERE!!!!!
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
    this.scene.add(newTrailMesh);
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
    this.geometry.vertices.push(this.frontBottomVertex,
                                this.frontTopVertex,
                                lastVertexTop,
                                lastVertexBottom);

    // Create face out of vertices & push
    face = new THREE.Face4(3, 2, 1, 0);//0, 1, 2, 3);
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

