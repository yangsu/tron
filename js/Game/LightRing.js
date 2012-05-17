function LightRing(scene, startZ) {
    this.scene = scene;
    this.lights = [];
    this.rising = false;
    this.z = startZ;

    var deltaTheta = 2 * Math.PI / CONFIG.lightRingCount,
        radius = CONFIG.tunnelRadius,
        theta,
        newLight;

    for (theta = 0; theta < 2 * Math.PI; theta += deltaTheta) {
        newLight = new THREE.PointLight(
            CONFIG.lightColor,
            CONFIG.lightIntensity,
            CONFIG.lightRange
        );
        newLight.position.x = radius * Math.cos(theta);
        newLight.position.y = radius * Math.sin(theta);
        newLight.position.z = startZ;

        this.lights.push(newLight);
        this.scene.add(newLight);
    }
}

LightRing.prototype.removeAllLights = function () {
    _.each(this.lights, function (light) {
        this.scene.remove(light);
    }, this);
};

LightRing.prototype.update = function () {};

LightRing.prototype.repositionLightRing = function (newZ) {
    this.z = newZ;
    _.each(this.lights, function (light) {
        light.position.z = newZ;
    });
};
