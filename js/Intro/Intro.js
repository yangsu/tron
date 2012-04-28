/**
 * @author Troy Ferrell & Yang Su
 */

function Intro() {

    // Init
    this.lastUpdate = UTIL.now();
    this.resourceLoaded = false;
    this.viewLoaded = false;

    // Scene Initialization
    var OFFSET = 6,
        WIDTH = window.innerWidth - OFFSET,
        HEIGHT = window.innerHeight - OFFSET,
        ASPECT = WIDTH / HEIGHT;

    // Camera Setup
    this.camera = new THREE.PerspectiveCamera(
        CONFIG.cameraAngle,
        ASPECT,
        CONFIG.cameraNear,
        CONFIG.cameraFar
    );
    this.camera.position.z = 300;

    // Scene setup
    this.introScene = new THREE.Scene();
    this.introScene.add(this.camera);
    //window.introScene.add(new THREE.AmbientLight(0xAAAAAA));

    // create a point light
    var pointLight = new THREE.PointLight(0xFFFFFF);

    // set its position
    pointLight.position = CONFIG.introLightPosition;

    // add to the scene
    this.introScene.add(pointLight);

    // Wrap the function to be called while preserving the context
    CONFIG.init(UTIL.wrap(this, function () {
        var tronPath = _.map(CONFIG.penPath, function (val) {
            return UTIL.v2(val[0], val[1]);
        }),
            tronRotations = _.pluck(CONFIG.penPath, '2');
        this.tronPen = new Pen(this.introScene, tronPath, tronRotations);
        this.resourcesLoaded = true;
    }));
}


Intro.prototype.loadView = function () {
    this.viewLoaded = true;
    this.animate();
};

Intro.prototype.unloadView = function () {
    this.viewLoaded = false;
};

Intro.prototype.animate = function () {
    if (this.viewLoaded) {
        if (this.resourcesLoaded) {
            this.update();

            window.renderer.render(this.introScene, this.camera);
        }
        // Preserve context
        var callback = (function (ctx) {
                return function () {
                    ctx.animate();
                };
            }(this));

        // note: three.js includes requestAnimationFrame shim
        requestAnimationFrame(callback);
    }
};

Intro.prototype.update = function () {
    var now = UTIL.now(),
        dt = (now - this.lastUpdate) / 1000;

    this.tronPen.update(dt);

    this.lastUpdate = now;
};