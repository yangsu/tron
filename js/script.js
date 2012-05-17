/**
 * @author Troy Ferrell & Yang Su
 */

var levelProgress,
    isMobileDevice,
    renderer,
    myGame;

$(document).ready(function () {
    var startmenu = $('#startmenu'),
        ingamemenu = $('#ingamemenu'),
        myIntro,
        renderManager,
        soundManager;

    function init() {

        if (!Detector.webgl) {
            Detector.addGetWebGLMessage();
            return;
        }

        // Find out if user is on mobile device
        window.isMobileDevice = navigator.userAgent.search(/iPhone|iPod|iPad/) !== -1;

        // Scene Initialization
        var OFFSET = 6,
            WIDTH = window.innerWidth - OFFSET,
            HEIGHT = window.innerHeight - OFFSET;
            
        // Renderer Initialization
        window.renderer = new THREE.WebGLRenderer(CONFIG.renderer);
        window.renderer.autoClear = window.isMobileDevice;

        window.renderer.setSize(WIDTH, HEIGHT);
        window.renderer.setClearColorHex(CONFIG.background, 1.0);
        window.renderer.clear();

        document.body.appendChild(window.renderer.domElement);

        renderManager = new THREE.Extras.RenderManager(renderer);

        myIntro = new Intro(renderManager);
        soundManager = new SoundManager();

        // Load intro view
        renderManager.setCurrent('Intro');

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

    function animate() {
        requestAnimationFrame(animate);
        renderManager.renderCurrent();
    }
    
    function launchGame(){
         myGame.newGame();
         renderManager.setCurrent('Game');
    }

    // Initialization
    init();
    animate();

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
            // If game not initalized, create game object & when initalized launch
            // If already initialized, then proceed to launch game
            if(myGame == null){
                myGame = new Game(renderManager, soundManager, function(){
                    launchGame()
                });
            }
            else{
                launchGame();
            }
            });
    });
    $('#resume').click(function () {
        myGame.paused = false;
        ingamemenu.fadeOut();
    });

    $('#mainmenu').click(function () {
        $('#gameovermenu').fadeOut('fast', function () {
            $('#startmenu').fadeIn();
            renderManager.setCurrent('Intro');
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
            //myGame.load();
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