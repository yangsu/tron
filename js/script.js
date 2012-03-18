/* Author: Troy Ferrell & Yang Su */
var camera, scene, renderer, geometry, material, mesh, segment;

var tunnelSegmentMeshes, tunnelMeshIndex, radius, segments,
    rings, numOfSegments, tunnelMaterial;

init();
animate();
function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75,
                                         window.innerWidth / window.innerHeight,
                                         1,
                                         10000);
    camera.position.z = 100;
    scene.add(camera);

    tunnelSegmentMeshes = [];
    radius = 50;
    segments = 16;
    rings = 16;
    numOfSegments = 30;
    tunnelMaterial = new THREE.MeshBasicMaterial({
        color: 0xFF0000,
        wireframe:true
    });

    var newTunnelSeg, newTunnelMesh, i;
    for(i = 0; i < numOfSegments; i += 1) {
        newTunnelSeg = CreateTunnelSegment(-i*10);
        newTunnelMesh = new THREE.Mesh(newTunnelSeg, tunnelMaterial);
        scene.add(newTunnelMesh);

        tunnelSegmentMeshes[tunnelSegmentMeshes.length] = newTunnelMesh;
    }

    renderer = new THREE.CanvasRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);
}


function CreateTunnelSegment(startZ)
{
    var geo = new THREE.Geometry();
    geo.dynamic = true;

    var deltaTheta = Math.PI/6,
        radius = 50,
        faceCounter = 0,
        depth = 10,
        theta, face,
        rcos, rsin, rcosd, rsind,
        temp;
    for (theta = 0; theta < 2*Math.PI; theta += deltaTheta){
        rcos = radius*Math.cos(theta);
        rsin = radius*Math.sin(theta);
        rcosd = radius*Math.cos(theta + deltaTheta);
        rsind = radius*Math.sin(theta + deltaTheta);

        // Create vertices for current quad in cylinder segment
        geo.vertices.push(UTIL.v3(rcos, rsin, startZ),
                          UTIL.v3(rcos, rsin, startZ - depth),
                          UTIL.v3(rcosd, rsind, startZ - depth),
                          UTIL.v3(rcosd, rsind, startZ));

        // Define normals to point inward
        temp = faceCounter*4;
        face = new THREE.Face4(temp + 3,
                               temp + 2,
                               temp + 1,
                               temp);

          geo.faces.push(face);
          faceCounter += 1;
    }

    geo.computeFaceNormals();
    geo.computeVertexNormals();

    return geo;
}

function animate() {
    // note: three.js includes requestAnimationFrame shim
    requestAnimationFrame(animate);
    render();
}

function render() {
    // remove first segment in array
    if (tunnelSegmentMeshes[0].position.z < -100)
        tunnelSegmentMeshes.shift();

    // Move Tunnel Along
    _.each(tunnelSegmentMeshes, function (segment) {
        segment.position.z += 5;
    });

    // Add new Segment to tunnel
    var newTunnelSeg = CreateTunnelSegment(-numOfSegments*10);

    var newTunnelMesh = new THREE.Mesh(newTunnelSeg, tunnelMaterial);
    scene.add(newTunnelMesh);

    tunnelSegmentMeshes.push(newTunnelMesh);

    renderer.render(scene, camera);
}