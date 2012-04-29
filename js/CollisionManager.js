function CollisionManager() {}

CollisionManager.prototype.checkPlayerTunnelCollision = function (player, tunnel) {
    var ppos = player.getPosition(),
        pposcart = ppos.convertToCartesian(),
        offset = 3,
        theta = Math.abs(ppos.theta) % TWOPI,
        face = null,
        i,
        j;

	// If player is in air, don't attempt to test collision with tunnel
	if(ppos.radius < CONFIG.playerPos.radius - offset){
		return true;
	}

    // If actual theta is negative, convert to corresponding postive angle value
    if (ppos.theta < 0) {
        theta = TWOPI - theta;// 360 - 80
    }

    // Find index for face corresponding to player's position
    i = Math.floor(Math.abs(ppos.z) / CONFIG.tunnelSegmentDepth);
    j = Math.floor((theta / TWOPI) * tunnel.width);
    face = tunnel.getFace(i, j);

    // Convert to boolean value
    return !!face;
};

CollisionManager.prototype.checkPlayerItemCollision = function (player, item) {
    var pposcart = player.position.convertToCartesian();

    return CollisionManager.prototype.boundingCylinderHitTest(
        pposcart,
        player.boundingCylinder,
        item.position,
        item.boundingSphere
    );
};

CollisionManager.prototype.boundingBoxHitTest = function (first, firstpos, second, secondpos) {
    if (!first || !second || !firstpos || !secondpos) {
        return false;
    }

    var firstmin = first.min.clone().addSelf(firstpos),
        firstmax = first.max.clone().addSelf(firstpos),
        firstcoords = UTIL.generateBoxCoord(firstmin, firstmax),
        secondmin = second.min.clone().addSelf(secondpos),
        secondmax = second.max.clone().addSelf(secondpos),
        secondcoords = UTIL.generateBoxCoord(secondmin, secondmax);
    return _.any(firstcoords, function (coord) {
        return UTIL.boxTest(coord, secondmin, secondmax);
    }) || _.any(secondcoords, function (coord) {
        return UTIL.boxTest(coord, firstmin, firstmax);
    });
};

CollisionManager.prototype.boundingSphereHitTest = function (first, firstBoundingSphere, second, secondBoundingSphere) {
    if (!first || !firstBoundingSphere || !second || !secondBoundingSphere) {
        return false;
    }
    return first.distanceTo(second) <= (firstBoundingSphere.radius + secondBoundingSphere.radius);
};

CollisionManager.prototype.boundingCylinderHitTest = function (playerPos, playerBoundingCylinder, item, itemBoundingSphere) {
    if (!playerPos || !playerBoundingCylinder || !item || !itemBoundingSphere) {
        return false;
    }
    return UTIL.lateralDistance(item, playerPos) <= (playerBoundingCylinder.radius + itemBoundingSphere.radius) &&
        (item.z + itemBoundingSphere.radius) >= (playerBoundingCylinder.minz + playerPos.z) &&
        (item.z - itemBoundingSphere.radius) <= (playerBoundingCylinder.maxz + playerPos.z);
};