/**
 * @author Troy Ferrell & Yang Su
 */

function Pen(scene, path, rotations) {

    if (path.length === 0 || rotations.length === 0) {
        console.log("ERROR IN PATH SIZE FOR PEN IN INTRO");
        return;
    }

    this.scene = scene;

    // Pen Parameter Intialization
    this.isDone = false;

    this.penPath = path;
    this.penRotations = rotations;

    this.trailSegments = [];

    // Object Initialization
    this.material = CONFIG.playerMaterial;

    this.dist = 0;
    this.pathIndex = 1;

    var startVec3 = UTIL.v3(this.penPath[0].x, this.penPath[0].y, 0),
        endVec3 = UTIL.v3(this.penPath[this.pathIndex].x, this.penPath[this.pathIndex].y, 0);

    this.currentEdgeDist = startVec3.distanceTo(endVec3);
    this.curve = new THREE.LineCurve(this.penPath[0], this.penPath[this.pathIndex]);

    this.penMesh = new THREE.Mesh(CONFIG.playerGeometry, this.material);
    this.penMesh.position = startVec3;
    //this.penMesh.scale.set(1.25,1.25,1.25);
    this.penMesh.rotation.x = HALFPI;
    this.penMesh.rotation.y = HALFPI;

    // may adjust rotations array to be array of vec3 like penpath for rotation.x,.y,.z
    //this.penMesh.rotation.y = this.penRotations[0];

    this.lastVec3 = startVec3;
    this.lineMaterial = new THREE.LineBasicMaterial({
        color: 0x47C5D8,
        linewidth: 3
        //color: 0x0000FF,
        //linewidth:
        //vertexColors: array
    });

    this.scene.add(this.penMesh);
}

// TODO: need to include trail drawing
Pen.prototype.update = function (dt) {
    if (!this.isDone) {
        var pos, startVec3, endVec3, newVec3, lineGeo;
        if (this.dist + dt * CONFIG.PenDrawSpeed > this.currentEdgeDist) {
            pos = this.curve.getPoint(1);

            if (this.pathIndex === this.penPath.length - 1) {
                this.isDone = true;
                return;
            }

            startVec3 = this.penPath[this.pathIndex];
            endVec3 = this.penPath[this.pathIndex + 1];

            this.curve = new THREE.LineCurve(startVec3, endVec3);

            this.penMesh.rotation.y += this.penRotations[this.pathIndex];

            this.pathIndex += 1;
            this.dist = 0;
            this.currentEdgeDist = startVec3.distanceTo(endVec3);
        } else {
            this.dist += dt * CONFIG.PenDrawSpeed;
            pos = this.curve.getPoint(this.dist / this.currentEdgeDist);
        }

        this.penMesh.position = new THREE.Vector3(pos.x, pos.y, 0);
        //this.line.geometry.vertices.push(new THREE.Vertex(new THREE.Vector3(pos.x, pos.y, 0)));
        //this.line.geometry.__dirtyVertices = true;
        //this.line.geometry.dynamic = true;

        // Create & add new line segment
        newVec3 = this.penMesh.position.clone();
        lineGeo = new THREE.Geometry();
        lineGeo.vertices.push(new THREE.Vertex(this.lastVec3));
        lineGeo.vertices.push(new THREE.Vertex(newVec3));
        this.scene.add(new THREE.Line(lineGeo, this.lineMaterial));

        this.lastVec3 = newVec3;
    }
};