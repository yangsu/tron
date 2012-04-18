function CollisionManager(tunnel, player, itemmanager) {
    this.tunnel = tunnel;
    this.player = player;
    this.itemmanager = itemmanager;
}

CollisionManager.prototype.update = function (dt) {
    var ppos = this.player.position,
        theta = Math.abs(ppos.theta) % TWOPI,
        face = null;

    this.i = Math.floor(Math.abs(ppos.z) / CONFIG.tunnelSegmentDepth);
    this.j = Math.floor(theta / (TWOPI / this.tunnel.width));
    face = this.tunnel.getFace(this.i, this.j);
    if (!face) {
        $('#score').html('off');
    } else {
        $('#score').html('oon');
    }
};