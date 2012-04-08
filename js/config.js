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
    'playerForwardVelMultiplier' : 0.05,
    'playerDefaultForwardVel' : -150,
    'playerMaxForwardVel' : -600,
    'playerMinForwardVel' : 0,
    'playerLateralVelMultiplier' : 0.25,
    'playerMaxLateralVel' : Math.PI,
    'playerMeshOffest' : -45,
    'playerPos' : UTIL.v3c(75, 1.5 * Math.PI, 0),
    'playerDefaulVel' : UTIL.v3c(0, 0, -150),
    'playerDefaulTargetVel' : UTIL.v3c(0, 0, -150),
    'playerTrail' : UTIL.v3(0.005, 7, 50),
    'trailRadiusUpper' : 75,
    'trailRadiusLower' : 85,

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

    // Trail Settings
    'trailLiveSections' : 35,

    // Light Ring Settings
    'lightRingCount' : 8,
    'lightColor' : 0xFFFFFF,
    'lightIntensity' : 0.55,
    'lightRange' : 800,
    'lightIntensityStep' : 0.05
};