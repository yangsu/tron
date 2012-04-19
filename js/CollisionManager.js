function CollisionManager(tunnel, player, itemmanager) {
    this.tunnel = tunnel;
    this.player = player;
    this.itemmanager = itemmanager;
}

CollisionManager.prototype.update = function (dt) {
    var __self = this,
        player = this.player,
        ppos = player.position,
        pposcart = ppos.convertToCartesian(),
        theta = Math.abs(ppos.theta) % TWOPI,
        face = null;

    this.i = Math.floor(Math.abs(ppos.z) / CONFIG.tunnelSegmentDepth);
    this.j = Math.floor(theta / (TWOPI / this.tunnel.width));
    face = this.tunnel.getFace(this.i, this.j);
    if (!face) {
        // Not on a tunnel face
    } else {
        // on a tunnel face
    }

    // Bounding box
    // _.each(this.itemmanager.gameItems, function (item) {
    //     if (CollisionManager.prototype.boundingBoxHitTest(
    //             player.boundingBox,
    //             pposcart,
    //             item.boundingBox,
    //             item.position
    //         )) {
    //         $('#score').html('hit');
    //     } else {
    //         $('#score').html('not');
    //     }
    // });

    // Bounding Spheres
    // Bounding Sphere hack
    // pposcart.z -= player.boundingSphere.offset;
    // _.each(this.itemmanager.gameItems, function (item) {
    //     if (CollisionManager.prototype.boundingSphereHitTest(
    //             pposcart,
    //             player.boundingSphere,
    //             item.position,
    //             item.boundingSphere
    //         )) {
    //         __self.itemmanager.remove(item.id);
    //     }
    // });

    // Bounding Cylinder
    _.each(this.itemmanager.gameItems, function (item) {
        if (CollisionManager.prototype.boundingCylinderHitTest(
                pposcart,
                player.boundingCylinder,
                item.position,
                item.boundingSphere
            )) {
            __self.itemmanager.remove(item.id);
        }
    });

};

CollisionManager.prototype.boundingBoxHitTest = function (first, firstpos, second, secondpos) {
    if (!first || !second || !firstpos || !secondpos) return false;
    if (!first.min || !second.min || !first.max || !second.max || !firstpos || !secondpos) debugger;
    var firstmin = first.min.clone().addSelf(firstpos);
    var firstmax = first.max.clone().addSelf(firstpos);
    var firstcoords = UTIL.generateBoxCoord(firstmin, firstmax);
    var secondmin = second.min.clone().addSelf(secondpos);
    var secondmax = second.max.clone().addSelf(secondpos);
    var secondcoords = UTIL.generateBoxCoord(secondmin, secondmax);
    return _.any(firstcoords, function (coord) {
        return UTIL.boxTest(coord, secondmin, secondmax);
    }) || _.any(secondcoords, function (coord) {
        return UTIL.boxTest(coord, firstmin, firstmax);
    });
};

CollisionManager.prototype.boundingSphereHitTest = function (first, firstBoundingSphere, second, secondBoundingSphere) {
    if (!first || !firstBoundingSphere || !second || !secondBoundingSphere) return false;
    return first.distanceTo(second) <= (firstBoundingSphere.radius + secondBoundingSphere.radius);
};

CollisionManager.prototype.boundingCylinderHitTest = function (playerPos, playerBoundingCylinder, item, itemBoundingSphere) {
    if (!playerPos || !playerBoundingCylinder || !item || !itemBoundingSphere) return false;
    return UTIL.lateralDistance(item, playerPos) <= (playerBoundingCylinder.radius + itemBoundingSphere.radius) &&
           (item.z - playerPos.z - itemBoundingSphere.radius) >= playerBoundingCylinder.minz &&
           (item.z - playerPos.z + itemBoundingSphere.radius) <= playerBoundingCylinder.maxz;
};