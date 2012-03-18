/**
 * @author Troy Ferrell & Yang Su
 */
var camera, scene, renderer, geometry, material, mesh, segment;

var tunnel;

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

    tunnel = new Tunnel(scene);

    renderer = new THREE.CanvasRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);
}

function animate() {
    // note: three.js includes requestAnimationFrame shim
    requestAnimationFrame(animate);
    render();
}

function render() {
    tunnel.render();

    renderer.render(scene, camera);
}
