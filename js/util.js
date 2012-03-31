var UTIL = {
    v3 : function (x, y, z) {
        return new THREE.Vector3(x, y, z);
    },
    vtx3 : function (x, y, z) {
        return new THREE.Vertex(UTIL.v3(x, y, z));
    },
    v3c : function (radius, theta, z) {
        var Coord = function (_r, _th, _z) {
            this.radius = _r;
            this.theta = _th;
            this.z = _z;
        };
        Coord.prototype.convertToCartesian = function () {
            return UTIL.v3(
                this.radius * Math.cos(this.theta),
                this.radius * Math.sin(this.theta),
                this.z
            );
        };
        return new Coord(radius, theta, z);
    },
    now : function () {
        return new Date().getTime();
    }
};