var UTIL = {
    v2 : function(x,y){
        return new THREE.Vector2(x,y);
    },
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
        Coord.prototype.clone = function(){
            return new UTIL.v3c(this.radius, this.theta, this.z);
        };
        return new Coord(radius, theta, z);
    },
    now : function () {
        return new Date().getTime();
    },

    load : function(loadCount, callback){
        var LOAD = function(_loadCount, _callback){
            this.numOfLoads = _loadCount;
            this.wrappedCallback = _.once(_callback);
        };
        
        LOAD.prototype.loadFinished = function(){
            this.numOfLoads--;
            if(this.numOfLoads == 0){
                this.wrappedCallback();
            }
        };
        
        return new LOAD(loadCount, callback);
    },
    
    /*
    Image Utils
    var imagedata = getImageData(imgTexture.image);
    var color = getPixel(imagedata, 10, 10);
    */
    getImageData : function (image) {
        var canvas = document.createElement('canvas'),
            context;
        canvas.width = image.width;
        canvas.height = image.height;

        context = canvas.getContext('2d');
        context.drawImage(image, 0, 0);

        return context.getImageData(0, 0, image.width, image.height);
    },
    rgba : function (r, g, b, a) {
        return {
            r: r,
            g: g,
            b: b,
            a: a
        };
    },
    getPixel : function (imagedata, x, y) {
        var data = imagedata.data,
            position = (x + imagedata.width * y) * 4;
        return UTIL.rgba(
            data[position],
            data[position + 1],
            data[position + 2],
            data[position + 3]
        );
    },
    getRow : function (imagedata, r) {
        var position = (imagedata.width * r) * 4,
            data = imagedata.data,
            row = new Array(imagedata.width),
            end = imagedata.width,
            i;
        for (i = 0; i < end; position += 4, i += 1) {
            row[i] = UTIL.rgba(
                data[position],
                data[position + 1],
                data[position + 2],
                data[position + 3]
            );
        }
        return row;
    },
    getColumn : function (imagedata, c) {
        var position = c * 4,
            data = imagedata.data,
            column = new Array(imagedata.height),
            inc = imagedata.width * 4,
            end = imagedata.height,
            i;
        for (i = 0; i < end; position += inc, i += 1) {
            column[i] = UTIL.rgba(
                data[position],
                data[position + 1],
                data[position + 2],
                data[position + 3]
            );
        }
        return column;
    },
    generateBoxCoord: function (min, max) {
        return [
            min.clone(),
            UTIL.v3(max.x, min.y, min.z),
            UTIL.v3(min.x, max.y, min.z),
            UTIL.v3(min.x, min.y, max.z),
            UTIL.v3(max.x, max.y, min.z),
            UTIL.v3(min.x, max.y, max.z),
            UTIL.v3(max.x, min.y, max.z),
            max.clone()
        ];
    },
    boxTest: function (pos, min, max) {
        return (
            pos.x >= min.x && pos.x <= max.x &&
            pos.y >= min.y && pos.y <= max.y &&
            pos.z >= min.z && pos.z <= max.z
        );
    },
    lateralDistance: function (vec1, vec2) {
        return Math.sqrt(Math.pow(vec2.x - vec1.x, 2) + Math.pow(vec2.y - vec1.y, 2));
    },
    wrap: function (ctx, func) {
        return function () {
            func.call(ctx);
        };
    }
};
