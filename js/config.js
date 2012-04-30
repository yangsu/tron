var CONFIG = {
    // Color Presets
    'white' : new THREE.Color(0xFFFFFF),

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
    'cameraOffset' : 200,

    'viewDistance' : 1000,

    // Player Settings
    'playerScale' : 3,
    'playerForwardVelMultiplier' : 0.05,
    'playerDefaultForwardVel' : -150,
    'playerMaxForwardVel' : -600,
    'playerMinForwardVel' : 0,
    'playerLateralVelMultiplier' : 0.25,
    'playerRotationalMultiplier' : 0.25,
    'playerRotationMultiplier' : 0.25,
    'playerMaxLateralVel' : Math.PI,
    'playerBoosterLimit' : 3,
    'playerPos' : UTIL.v3c(75, 1.5 * Math.PI, 0),
    'playerDefaulVel' : UTIL.v3c(1, 0, 0),
    'playerDefaulTargetVel' : UTIL.v3c(0, 0, -150),
    'defaultPlayerJumpVel' : -450,
    'playerGravityAcceleration' : 1000,
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
    'tunnelLiveSections' : 15, // should be 1 + cameraFar/(segdepth * seg/sec)
    'tunnelMapData' : null,
    'GRAYVAL' : 154,
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
    'itemProbability' : 0.3,
    'PowerUpMesh' : null,
    'PowerUpMaterial' : new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('img/LightDisk.png'),
        transparent : false
    }),

    'CreditValue' : 200,
    'CreditCountPerGen' : 10,
    'CreditCountRotX' : 0.04,
    'CreditCountRotZ' : -0.03,

    // Particle Settings
    'particleCount' : 2000,
    'particleTexture' : THREE.ImageUtils.loadTexture('img/Particle.png'),
    'particleVelocityRange' : 1000,

    // Derezz Settings
    'derezzTexture' : THREE.ImageUtils.loadTexture('img/LightCycle_Glow.png'),

    // Sound Settings
    'bgSound' : 'sounds/TronMusic1.mp3',
    'soundVolume' : 0.7,

    // Intro Settings
    'penPath' : [
        [-500, 0, 0], // Starting Point

        [-250, 0, HALFPI], [-250, 75, HALFPI], [-300, 75, -HALFPI], // T
        [-300, 100, -HALFPI], [-175, 100, -HALFPI], [-175, 75, -HALFPI],
        [-225, 75, HALFPI], [-225, 0, HALFPI],

        [-100, 0, HALFPI], [-100, 100, -HALFPI], [-25, 100, -HALFPI], // R
        [-25, 50, -HALFPI], [-60, 50, HALFPI], [-25, 0, HALFPI],

        [50, 0, HALFPI], [50, 100, -HALFPI], [125, 100, -HALFPI], [125, 0, HALFPI], // O

        [200, 0, HALFPI], [200, 100, -HALFPI], [225, 100, -HALFPI], [275, 0, PI],// N
        [275, 100, -HALFPI], [300, 100, HALFPI], [300, 0, HALFPI],

        [500, 0, HALFPI] // Ending Point
    ],
    'PenDrawSpeed' : 1000,
    'introLightPosition' : UTIL.v3(10, 50, 130),

    // Obstacles Settings
    'boxObstacleHeight' : 30,
    'obstacleMaterial' : new THREE.MeshLambertMaterial({
        color : 0x47C5D8,
        ambient : 0x47C5D8,
        // shading : THREE.SmoothShading,
        wireframe : false
    }),

    'init' : function (callback) {
        var wrappedcallback = _.once(callback),
            testFinished = function () {
            if (_.all(CONFIG, function (value, key) {
                    return (value !== null && value !== undefined);
                })) {
                console.log('finished');
                wrappedcallback();
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
        THREE.ImageUtils.loadTexture('img/tunnelmap2.png', {}, function (data) {
            CONFIG.tunnelMapData = UTIL.getImageData(data);
            testFinished();
        });
    }
};