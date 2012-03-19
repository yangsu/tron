/**
 * @author Troy Ferrell & Yang Su
 */
var camera, scene, renderer, geometry, material, mesh, segment;

var tunnel, myPlayer;

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
	myPlayer = new Player(scene);
	
    renderer = new THREE.CanvasRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);
    
    // bind key events
    document.onkeypress = keyPressed;
}

function animate() {
    // note: three.js includes requestAnimationFrame shim
    requestAnimationFrame(animate);
    render();
}

function render() {
    tunnel.render();
	myPlayer.render();
	
    renderer.render(scene, camera);
}

function keyPressed(e)
{	
	var code = e.charCode;
	if(code == 100) // 'd'
	{
		//alert("pressed d");
		myPlayer.moveRight();	
	}
	
	if(code == 97) // 'a'
	{
		//alert("pressed a");
		myPlayer.moveLeft();	
	}
}
