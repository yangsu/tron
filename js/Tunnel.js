/**
 * @author Troy Ferrell & Yang Su
 */

function Tunnel(scene) {
    this.scene = scene;
    this.tunnelSegments = [];
    this.numOfSegments = 30;
    this.tunnelMaterial = null;

    // create new tunnel segments & add to array
    this.tunnelMaterial = new THREE.MeshBasicMaterial({
                            color: 0x47C5D8,
                            wireframe:true
                        });

    var newTunnelSeg, newTunnelMesh, i;
    for(i = 0; i < this.numOfSegments; i += 1) {
        newTunnelSeg = new TunnelSegment(-i*10);
        newTunnelMesh = new THREE.Mesh(newTunnelSeg.geometry, this.tunnelMaterial);
        this.scene.add(newTunnelMesh);

        this.tunnelSegments[i] = newTunnelMesh;
    }
}

Tunnel.prototype.update = function(){
    // Move Tunnel Along
    _.each(this.tunnelSegments, function (segment) {
        segment.position.z += 5;
    });

    // Add new Segment to tunnel
    var newTunnelSeg = new TunnelSegment(-this.tunnelSegments.length*10);

    var newTunnelMesh = new THREE.Mesh(newTunnelSeg.geometry, this.tunnelMaterial);
    this.scene.add(newTunnelMesh);

    this.tunnelSegments.push(newTunnelMesh);
};

function TunnelSegment(startZ) {
    this.geometry = new THREE.Geometry();
    this.geometry.dynamic = true;

    var deltaTheta = Math.PI/8,
        radius = 50,
        faceCounter = 0,
        depth = 10,
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
        this.geometry.vertices.push(UTIL.v3(rcos, rsin, startZ),
                                    UTIL.v3(rcos, rsin, startZ - depth),
                                    UTIL.v3(rcosd, rsind, startZ - depth),
                                    UTIL.v3(rcosd, rsind, startZ));

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