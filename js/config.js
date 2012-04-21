var CONFIG = {
    // Renderer Settings
    'renderer' : {
        antialias: true,
        maxLights: 20
        //antialias: true,	// to get smoother output
    },
    'background' : 0x000000,

    // Camera Settings
    'cameraAngle' : 75,
    'cameraNear' : 0.1,
    'cameraFar' : 100000,
    'cameraPos' : UTIL.v3(-15, 0, 200),
    'cameraVel' : UTIL.v3c(0, 0, -150),

    'viewDistance' : 1000,

    // Player Settings
    'playerScale' : 3,
    'playerForwardVelMultiplier' : 0.05,
    'playerDefaultForwardVel' : -150,
    'playerMaxForwardVel' : -600,
    'playerMinForwardVel' : 0,
    'playerLateralVelMultiplier' : 0.25,
    'playerRotationalMultiplier' : 0.25,
    'playerMaxLateralVel' : Math.PI,
    'playerPos' : UTIL.v3c(75, 1.5 * Math.PI, 0),
    'playerDefaulVel' : UTIL.v3c(1, 0, -150),
    'playerDefaulTargetVel' : UTIL.v3c(0, 0, -150),
    'defaultPlayerJumpVel' : -450,
    'playerGravityAcceleration' : 850,
    'playerGlowMaterial' : new THREE.MeshPhongMaterial({
        map: THREE.ImageUtils.loadTexture('img/LightCycle_Glow.png'),
        ambient: 0xFFFFFF,
        color: 0x000000
    }),
    'playerGeometry' : null,

    // Tunnel Settings
    'tunnelRadius' : 100,
    'tunnelSegmentDepth' : 10,
    'tunnelSegmentPerSection' : 10,
    'tunnelResolution' : 16,
    'tunnelMaterial' : {
        color : 0x47C5D8,
        ambient : 0x47C5D8,
        wireframe : true
    },
    'tunnelLiveSections' : 15, // should be 1 + cameraFar/(segdepth * seg/sec)
    'tunnelMapData' : null,

    // Trail Settings
    'trailMeshOffest' : 45,
    'trailLiveSections' : 35,
    'trailHeight' : 5,

    // Light Ring Settings
    'lightRingCount' : 8,
    'lightColor' : 0xFFFFFF,
    'lightIntensity' : 0.55,
    'lightRange' : 800,
    'lightIntensityStep' : 0.05,

    // Items Settings
    'PowerUpMesh' : null,
    'PowerUpMaterial' : new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('img/LightDisk.png'),
        transparent : false
    }),

    'init' : function (callback) {
        var testFinished = function () {
            if (_.all(CONFIG, function (value, key) {
                    return (value !== null && value !== undefined);
                })) {
                console.log('finished');
                callback();
            }
        };

        new THREE.JSONLoader().load('obj/LightDisk.js', function (geometry) {
            CONFIG.PowerUpMesh = geometry;
            testFinished();
        });
        new THREE.JSONLoader().load('obj/LightCycle.js', function (geometry) {
            CONFIG.playerGeometry = geometry;
            testFinished();
        });
        THREE.ImageUtils.loadTexture('img/TunnelMap.png', {}, function (data) {
            CONFIG.tunnelMapData = UTIL.getImageData(data);
            testFinished();
        });
    }
};