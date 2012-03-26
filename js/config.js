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
    'cameraFar' : 1000,
    'cameraInitZ' : 100,
    'cameraVel' : UTIL.v3c(0, 0, -350),

    // Player Settings
    'playerPos' : UTIL.v3c(35, 1.5*Math.PI, 0),
    'playerVel' : UTIL.v3c(0, Math.PI/40, -350),

    // Tunnel Settings
    'tunnelRadius' : 50,
    'tunnelSegmentDepth' : 10,
    'tunnelSegmentPerSection' : 10,
    'tunnelResolution' : 10,
    'tunnelMaterial' : {
        color : 0x47C5D8,
        wireframe : true,
        transparent : false
    },
    'tunnelLiveSections' : 11, // should be 1 + cameraFar/(segdepth * seg/sec)

    // Light Ring Settings
    'lightRingCount' : 8,
    'lightColor' : 0xFFFFFF,
    'lightIntensity' : 0.55,
    'lightRange' : 800,
    'lightIntensityStep' : 0.05
};