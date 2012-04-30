/**
 * @author Troy Ferrell & Yang Su
 */

var levelProgress, isMobileDevice,
    renderer,
    myGame;

$(document).ready(function () {
    var startmenu = $('#startmenu'),
        ingamemenu = $('#ingamemenu'),
        myIntro;

    function init() {

        if (!Detector.webgl) {
            Detector.addGetWebGLMessage();
            return;
        }

        window.isMobileDevice = navigator.userAgent.search(/iPhone|iPod|iPad/) !== -1;


        // TODO: to fix multiple scenes solution
        // http://demo.bkcore.com/threejs/webgl_rendermanager.html
        // Scene Initialization
        var OFFSET = 6,
            WIDTH = window.innerWidth - OFFSET,
            HEIGHT = window.innerHeight - OFFSET,
            ASPECT = WIDTH / HEIGHT;

        // Renderer Initialization
        window.renderer = new THREE.WebGLRenderer(CONFIG.renderer);
        window.renderer.autoClear = window.isMobileDevice;

        window.renderer.setSize(WIDTH, HEIGHT);
        window.renderer.setClearColorHex(CONFIG.background, 1.0);
        window.renderer.clear();

        document.body.appendChild(window.renderer.domElement);

        // INIT Game.js or intro.js
        myIntro = new Intro();

        // Load initial view
        myIntro.loadView();

        // Stats Initialization
        var stats = new Stats(),
            statsdom = stats.getDomElement();
        // Align top-left
        statsdom.id = 'stats';
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
            if (!myGame) {
                myGame = new Game();
            }

            // switch to my game
            myIntro.unloadView();
            myGame.loadView();
            myGame.newGame();
        });
    });
    $('#resume').click(function () {
        myGame.paused = false;
        ingamemenu.fadeOut();
    });

    $('#mainmenu').click(function () {
        $('#gameovermenu').fadeOut('fast', function () {

            $('#startmenu').fadeIn();

            // unload game view & load intro view
            myGame.unloadView();
            myIntro.loadView();
        });
    });

    $('#newgame').click(function () {
        $('#gameovermenu').fadeOut('fast', function () {
            //start new game here
            myGame.newGame();
        });
    });


    // mousemove
    $(document).mouseup(function (e) {
        if (myGame) {
            myGame.mouseMoved(event.clientX, event.clientY);
        }
    });

    // Only keyup can capture the key event for the 'esc' key
    $(document).keyup(function (event) {
        if (myGame) {
            myGame.keyUp(event.which);
        }
    });
    $(document).keydown(function (event) {
        switch (event.which) {
        case 82: /* R */ // testing restart
            //myGame = new Game();
            //myGame.loadView();
            break;
        default:
            if (myGame) {
                myGame.keyDown(event.which);
            }
            break;
        }
    });

    window.onerror = function (err) {
        $('#score').html(err);
    };
});