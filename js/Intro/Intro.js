/**
 * @author Troy Ferrell & Yang Su
 */

function Intro(rendermanager) {
    // Init
    this.resourceLoaded = false;

    // Scene Initialization
    var offset = 6,
        aspectRatio = (window.innerWidth - offset) / (window.innerHeight - offset);

    // Camera Setup
    this.camera = new THREE.PerspectiveCamera(
        CONFIG.cameraAngle,
        aspectRatio,
        CONFIG.cameraNear,
        CONFIG.cameraFar
    );
    this.camera.position.z = 300;

    // Scene setup
    this.scene = new THREE.Scene();
    this.scene.add(this.camera);
    //window.scene.add(new THREE.AmbientLight(0xAAAAAA));

    // create a point light
    var pointLight = new THREE.PointLight(0xFFFFFF);

    // set its position
    pointLight.position = CONFIG.introLightPosition;

    // add to the scene
    this.scene.add(pointLight);

    // Wrap the function to be called while preserving the context
    CONFIG.init(UTIL.wrap(this, function () {
        var tronPath = _.map(CONFIG.penPath, function (val) {
            return UTIL.v2(val[0], val[1]);
        }),
            tronRotations = _.pluck(CONFIG.penPath, '2');
        this.tronPen = new Pen(this.scene, tronPath, tronRotations);
        this.resourcesLoaded = true;
    }));

    rendermanager.add('Intro', this, function (delta, renderer) {
        if (this.resourcesLoaded) {
            this.update(delta);

            renderer.render(this.scene, this.camera);
        }
    });
}

Intro.prototype.update = function (dt) {
    this.tronPen.update(dt);
};