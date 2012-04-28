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
    pointLight.position.x = 10;
    pointLight.position.y = 50;
    pointLight.position.z = 130;

    // add to the scene
    this.introScene.add(pointLight);

    // Wrap the function to be called while preserving the context
    CONFIG.init(UTIL.wrap(this, function () {
        // Objects
        // YES! Hard-coded code!
        var tronPath = [UTIL.v2(-500, 0),
                        UTIL.v2(-250, 0), UTIL.v2(-250, 75), // ***** T *****
                        UTIL.v2(-300, 75), UTIL.v2(-300, 100), UTIL.v2(-175, 100),
                        UTIL.v2(-175, 75), UTIL.v2(-225, 75), UTIL.v2(-225, 0),

                        //space = -75
                        UTIL.v2(-100, 0), UTIL.v2(-100, 100), UTIL.v2(-25, 100), UTIL.v2(-25, 50), // ***** R *****
                        UTIL.v2(-60, 50), UTIL.v2(-25, 0),

                        UTIL.v2(50, 0), UTIL.v2(50, 100), UTIL.v2(125, 100), UTIL.v2(125, 0), // **** O *****

                        UTIL.v2(200, 0), UTIL.v2(200, 100), UTIL.v2(225, 100), UTIL.v2(275, 0),// **** N *****
                        UTIL.v2(275, 100), UTIL.v2(300, 100), UTIL.v2(300, 0),

                        UTIL.v2(500, 0)];

        var tronRotations = [
            0, HALFPI, HALFPI, -HALFPI, -HALFPI, -HALFPI, -HALFPI, HALFPI, HALFPI, // *** T Turns ***
            HALFPI, -HALFPI, -HALFPI, -HALFPI, HALFPI, HALFPI, // ***** R Turns
            HALFPI, -HALFPI, -HALFPI, HALFPI, // **** O Turns
            HALFPI, -HALFPI, -HALFPI, Math.PI, -HALFPI, HALFPI
        ];
        //0, 0, 0, 0, 0, 0, 0, 0];

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