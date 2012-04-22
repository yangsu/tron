/**
 * @author Troy Ferrell & Yang Su
 */

var scene, glowscene, levelProgress, isMobileDevice;

// CONSTANTS
var TWOPI = 2 * Math.PI;

$(document).ready(function () {
    var mouseX = window.innerWidth / 2,
        mouseY = window.innerHeight / 2,
        startmenu = $('#startmenu'),
        ingamemenu = $('#ingamemenu'),
        myGame;

    function init() {

        if (!Detector.webgl) {
            Detector.addGetWebGLMessage();
            return;
        }

        window.isMobileDevice = navigator.userAgent.search(/iPhone|iPod|iPad/) !== -1;

		// INIT Game.js or intro.js
		myGame = new Game();

        // Stats Initialization
        var stats = new Stats(),
            statsdom = stats.getDomElement();
        // Align top-left
        statsdom.style.position = 'absolute';
        statsdom.style.left = '0px';
        statsdom.style.top = '0px';
        document.body.appendChild(statsdom);

        setInterval(function () {
            stats.update();
        }, 1000 / 60);

    }

    // Initialization
    init();

    // Event handlers
    window.ondevicemotion = function (event) {

        //$('#score').html(event.accelerationIncludingGravity.x);

        if (event.accelerationIncludingGravity.x > 2.75) {
            //player.accelerateRight();
        } else if (event.accelerationIncludingGravity.x < -2.75) {
           //player.accelerateLeft();
        }

        // event.accelerationIncludingGravity.x
        // event.accelerationIncludingGravity.y
        // event.accelerationIncludingGravity.z
    };

    $('#play').click(function () {
        lastUpdate = UTIL.now();
        startmenu.fadeOut('fast', function () {
            myGame.started = true;
        });
    });
    $('#resume').click(function () {
        myGame.paused = false;
        ingamemenu.fadeOut();
    });

    $(document).mousemove(function (e) {
        // store the mouseX and mouseY position
        mouseX = event.clientX;
        mouseY = event.clientY;
        myGame.mouseMoved(mouseX, mouseY);
    });

    // Only keyup can capture the key event for the 'esc' key
    $(document).keyup(function (event) {
        myGame.keyUp(event.which);
    });
    $(document).keydown(function (event) {
        myGame.keyDown(event.which);
    });
    $(document).keypress(function (event) {
        // switch (event.which) {
        // }
    });

    window.onerror = function (err) {
        $('#score').html(err);
    };
});