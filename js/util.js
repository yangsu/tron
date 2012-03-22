var UTIL = {
    v3 : function (x,y,z) {
        return new THREE.Vertex(new THREE.Vector3(x,y,z));
    },
    v3c : function (radius, theta, z) {
        var Coord = function(_r, _th, _z){
            this.radius = _r;
            this.theta = _th;
            this.z = _z;
        };
        Coord.prototype.convertToCartesian = function() {
            return new UTIL.v3(this.radius*Math.cos(this.theta),
                               this.radius*Math.sin(this.theta),
                               this.z);
        };
        return new Coord(radius, theta, z);
    }

};