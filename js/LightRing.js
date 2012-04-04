function LightRing (startZ) {
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
        window.scene.add(newLight);
    }
}

LightRing.prototype.update = function () {
    var step = CONFIG.lightIntensityStep;
    /*
     * I'm a fucking idiot. Just use sin funciton
     * EX: light.intensity = (MaxIntensity-MinIntensity)*sin(t) + MinIntensity;

    _.each(this.lights, function (light) {
        if (light.intensity >= step*10) this.rising = false;
        else if (light.intensity <= step*2) this.rising = true;

        if (this.rising) {
            light.intensity += step;
        }
        else{
            light.intensity -= step;
        }
    });*/
};

LightRing.prototype.repositionLightRing = function (newZ) {
    this.z = newZ;
    _.each(this.lights, function (light) {
        light.position.z = newZ;
    });
};
