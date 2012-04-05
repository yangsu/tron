/**
 * @author Troy Ferrell & Yang Su
 */

function ItemManager(scene) {

    this.gameItems = []; 
                                      
    // Item - super class???
    // Booster portals
    // tron disk power-ups -> different colors
    // Credit(W/ Curves)
}

ItemManager.prototype.generatePowerUps = function(curve, numOfItems) {
    
    // x1,y1 to x2,y2 where x is theta and y is z
    // Consider r is constant for items
    // division = num of items = 10    
    var itemPoints = curve.getSpacedPoints(numOfItems),
        itemRadius = CONFIG.trailRadiusLower;
        
    var i = 0, newPowerUp = null;
    for(; i < numOfItems; i++)
    {
        var point3D = UTIL.v3c(itemRadius, itemPoints[i].x, itemPoints[i].y)
        
        log(itemPoints[i].y);
        
        newPowerUp = new PowerUp(point3D.convertToCartesian());
        this.gameItems.push(newPowerUp);
    }     
}

ItemManager.prototype.update = function () {
    
    // update all items
    _.each(this.gameItems, function (item) {
      // TODO: delete past items too far back
    
        item.update();
    });

    if(Math.random() > 0.99)
    {
        //var theta = -Math.PI/2;
        var theta = 360*Math.random();
        var curve = new THREE.QuadraticBezierCurve(theta, window.levelProgress - CONFIG.cameraFar, 
                                            theta, window.levelProgress - CONFIG.cameraFar*1.5, 
                                            theta, window.levelProgress - CONFIG.cameraFar*2);
                                            
        this.generatePowerUps(curve, 10);
    }
};

function PowerUp(pos) {
    var __self = this;
    this.powerUpMesh = null;
    this.position = pos;
    
    new THREE.JSONLoader().load('obj/LightDisk.js', function (geometry) {
        
        // select texture based on type
        var texture = THREE.ImageUtils.loadTexture('img/LightDisk.png'),
            material = new THREE.MeshLambertMaterial({
                map: texture,
                transparent : false
            });
        
        __self.powerUpMesh = new THREE.Mesh(geometry, material);
        __self.powerUpMesh.scale.set(2, 2, 2);
        __self.powerUpMesh.position = __self.position;
        
        //__self.powerUpMesh.position = CONFIG.playerPos.convertToCartesian();
        //__self.powerUpMesh.position.z = __self.z;
        __self.powerUpMesh.rotation.x = Math.PI / 2;
        
        window.scene.add(__self.powerUpMesh);
    });
}

PowerUp.prototype.update = function () {
    
    if(this.powerUpMesh != null)
    {
        this.powerUpMesh.rotation.z += 0.05;
    }
};