function CollisionManager(tunnel, player, itemmanager) {
    this.tunnel = tunnel;
    this.player = player;
    this.itemmanager = itemmanager;
}

CollisionManager.prototype.update = function (dt) {
    var ppos = this.player.position,
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

    _.each(this.itemmanager.gameItems, function (item) {
        if (this.boundingBoxHitTest(this.player.boundingBox, item.boundingBox)) {
            console.log('hit');
        }
    });
};

CollisionManager.prototype.boundingBoxHitTest = function (first, second) {
    var firstcoords = UTIL.generateBoxCoord(first),
        secondcoords = UTIL.generateBoxCoord(second);
    return _.any(firstcoords, function (coord) {
        return UTIL.boxTest(coord, second.min, second.max);
    }) || _.any(secondcoords, function (coord) {
        return UTIL.boxTest(coord, first.min, first.max);
    });
};