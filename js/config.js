var CONFIG = {
    // Renderer Settings
    'renderer' : {
        antialias: true
    },
    'background' : 0x000000,

    // Camera Settings
    'cameraAngle' : 75,
    'cameraNear' : 0.1,
    'cameraFar' : 1000,
    'cameraInitZ' : 100,
    'cameraVel' : UTIL.v3c(0, 0, -2),

    // Player Settings
    'playerPos' : UTIL.v3c(50, 1.5*Math.PI, 0),
    'playerVel' : UTIL.v3c(0, Math.PI/80, -2),

    // Tunnel Settings
    'tunnelRadius' : 50,
    'tunnelSectionDepth' : 10,
    'tunnelResolution' : 30,
    'tunnelColor' : 0x47C5D8
};