/**
 * @author Troy Ferrell & Yang Su
 */

function ItemManager(scene) {
    this.scene = scene;
    this.gameItems = [];
    this.typeMap = {
        'credit' : Credit,
        'powerup' : PowerUp
    };
}

ItemManager.prototype.reset = function(){
    // Clear all current items from scene
    for(var i = 0; i < this.gameItems.length; i += 1){
        this.gameItems.remove(i);
    }
    
    // Ensure array is cleared
    this.gameItems = [];
}

ItemManager.prototype.generateItems = function (type, curve, numOfItems) {
    // x1,y1 to x2,y2 where x is theta and y is z
    // Consider r is constant for items
    // division = num of items = 10
    var itemPoints = curve.getSpacedPoints(numOfItems),
        itemRadius = CONFIG.playerPos.radius,
        newPowerUp = null,
        i,
        point3D;
    for (i = 0; i < numOfItems; i += 1) {
        point3D = UTIL.v3c(itemRadius, itemPoints[i].x, itemPoints[i].y);
        newPowerUp = new (this.typeMap[type])(this.scene, point3D.convertToCartesian());
        newPowerUp.id = this.gameItems.length;
        this.gameItems.push(newPowerUp);
    }
};

ItemManager.prototype.update = function () {
    // update all items
    _.each(this.gameItems, function (item) {
      // TODO: delete past items too far back
        item.update();
    });

    if (Math.random() < 0.05) {
        this.genRandom(true);
    }
};

ItemManager.prototype.remove = function (i) {
    if (i >= 0 && i < this.gameItems.length) {
        this.gameItems[i].remove();
        delete this.gameItems[i];
    }
};

ItemManager.prototype.genRandom = function () {
    var theta, curve;
    if (CONFIG.PowerUpMesh) {
        //var theta = -HALFPI;
        theta = 360 * Math.random();
        curve = new THREE.QuadraticBezierCurve(
            theta, window.levelProgress - CONFIG.viewDistance,
            theta, window.levelProgress - CONFIG.viewDistance * 1.5,
            theta, window.levelProgress - CONFIG.viewDistance * 2
        );

        this.generateItems('powerup', curve, 1);
    } else {
        //var theta = -HALFPI;
        theta = 2 * Math.PI * Math.random();
        curve = new THREE.QuadraticBezierCurve(
            theta, window.levelProgress - CONFIG.viewDistance,
            theta + Math.PI / 2, window.levelProgress - CONFIG.viewDistance * 1.5,
            theta + Math.PI, window.levelProgress - CONFIG.viewDistance * 2
        );

        this.generateItems('credit', curve, 10);
    }
};

function PowerUp(scene, pos) {
    this.scene = scene;
    this.mesh = null;
    this.position = pos;

    this.mesh = new THREE.Mesh(CONFIG.PowerUpMesh, CONFIG.PowerUpMaterial);
    this.mesh.scale.set(3, 3, 3);
    this.mesh.position = this.position;
    this.mesh.rotation.x = Math.PI / 2;

    this.mesh.geometry.computeBoundingBox();
    this.boundingBox = this.mesh.geometry.boundingBox;
    this.mesh.geometry.computeBoundingSphere();
    this.boundingSphere = this.mesh.geometry.boundingSphere;
    this.boundingSphere.radius *= 3;

    this.scene.add(this.mesh);
}

PowerUp.prototype.update = function () {
    if (this.mesh !== null) {
        this.mesh.rotation.z += 0.05;
    }
};

PowerUp.prototype.remove = function () {
    this.scene.remove(this.mesh);
};

// Need to refactor & decide on design
function Credit(scene, pos) {
    this.scene = scene;

    var COLOR1 = 0x77bbff,
        COLOR2 = 0x8ec5e5,
        //COLOR2 = 0x8ec5e5,
        COLOR3 = 0x97a8ba,
        glyph2geom;
    //this.creditMesh = null;
    this.position = pos;

    this.parent = new THREE.Object3D();
    this.glowsparent = new THREE.Object3D();

    this.scene.add(this.parent);

    // GLOW CONTAINER (used for occluder)
    this.glowsparent.position = this.parent.position;
    this.glowsparent.rotation = this.parent.rotation;
    this.glowsparent.scale = this.parent.scale;
    //window.glowscene.add(this.glowsparent);

    // GLYPH (BIG ONE)
    this.glyph = new THREE.Mesh(
        new THREE.IcosahedronGeometry(15, 2),
        new THREE.MeshBasicMaterial({
            color: COLOR1,
            opacity: 0.25,
            wireframe: true,
            wireframeLinewidth: 4
        })
    );
    this.glyph.position = this.position;
    //this.scene.add(this.glyph);
    //this.parent.add(this.glyph);

    // Bounding Box
    this.glyph.geometry.computeBoundingBox();
    this.boundingBox = this.glyph.geometry.boundingBox;
    this.glyph.geometry.computeBoundingSphere();
    this.boundingSphere = this.glyph.geometry.boundingSphere;

    // GLYPH2 (CORE)
    glyph2geom = new THREE.IcosahedronGeometry(10, 1);
    this.glyph2 = new THREE.Mesh(
        glyph2geom,
        new THREE.MeshLambertMaterial({
            color: COLOR1,
            transparent: true,
            specular: COLOR1,
            shading: THREE.FlatShading,
            opacity: 0.75,
            ambient: 0x202830
        })
    );
    this.glyph2.position = this.position;
    this.parent.add(this.glyph2);

    // GLYPHE2 WIREFRAME
    this.glyph2wf = new THREE.Mesh(
        THREE.GeometryUtils.clone(glyph2geom),
        new THREE.MeshBasicMaterial({
            color: COLOR2,
            wireframe: true,
            opacity: 0.35,
            wireframeLinewidth: 2
        })
    );
    this.glyph2wf.position = this.position;
    this.glyph2wf.rotation = this.glyph2.rotation;
    this.glyph2wf.scale.x = this.glyph2wf.scale.y = this.glyph2wf.scale.z = this.glyph2.scale.x + 0.01;
    //this.scene.add(this.glyph2wf);
    this.parent.add(this.glyph2wf);

    // GLYPHE2 GLOW OCCLUDER
    this.glyph2oc = new THREE.Mesh(
        glyph2geom,
        new THREE.MeshPhongMaterial({
            color: 0x000000,
            specular: 0x000000,
            shading: THREE.FlatShading,
            opacity: 0.9,
            ambient: 0x000000
        })
    );
    this.glyph2oc.position = this.glyph2.position;
    this.glyph2oc.rotation = this.glyph2.rotation;
    this.glyph2oc.scale.x = this.glyph2oc.scale.y = this.glyph2oc.scale.z = this.glyph2.scale.x;
    this.glowsparent.add(this.glyph2oc);

}

Credit.prototype.remove = function () {
    this.scene.remove(this.parent);
    //.glowscene.remove(this.glowsparent);
};

Credit.prototype.update = function () {

    this.glyph.rotation.x += 0.04;
    this.glyph.rotation.z -= 0.03;

    this.glyph2.rotation.x -= 0.04;
    this.glyph2.rotation.z += 0.03;
    //this.glyph2wf.rotation = this.glyph2.rotation;
};