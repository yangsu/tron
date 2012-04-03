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
        var position = c,
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
    }
};
