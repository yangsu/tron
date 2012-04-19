function CollisionManager(tunnel, player, itemmanager) {
    this.tunnel = tunnel;
    this.player = player;
    this.itemmanager = itemmanager;
    this.i = 0;
    this.j = 0;
}

CollisionManager.prototype.update = function (dt) {
    var ppos = this.player.position,
        twopi = 2 * Math.PI,
        theta = Math.abs(ppos.theta) % twopi,
        face = null;

    this.i = Math.floor(Math.abs(ppos.z) / CONFIG.tunnelSegmentDepth);
    this.j = Math.floor(theta / (twopi / UTIL.getColumn(this.tunnel.imageData, 0).length));
    face = this.tunnel.getFace(this.i, this.j);
    if (!face) {
        $('#score').html('off');
    } else {
        $('#score').html('oon');
    }
};