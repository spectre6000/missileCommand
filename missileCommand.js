//  ----------------------- Missile Command - tOP  ----------------------- 
var missileCommand = (function() {
  //HOUSE VARS
    //DOM declaration
      var $canvasElement = $('canvas');
    //Canvas API selection
      var $canvas = $canvasElement[0].getContext("2d");
    //Canvas dimensions
      var canvas_width = $canvasElement[0].width;
      var canvas_height = $canvasElement[0].height;
    //Framerate
      var fps = 30;
      var animation;
      var attack;
    //Animation parameters
      //Pixels per axis per frame... 
      var attackingMissileSpeed = 3; 
      var defendingMissileSpeed = 2;
      var enemyFireRate = 2000;
      //Blast size
      var blastRadius = 25;
    //Object arrays
      var cities = [];
      var batteries = [];
      var enemyMissilesPending = 30;
      var firedMissiles = [];

  //Object rendering coordinate sets
    //Background
      var backgroundRenderingCoords = 
        [[0,0], [0,1], [1,1], [1,0]];

      var surfaceRenderingCoords = 
        [[0, 0.904] /*TL corner*/, [0.007, 0.897], [0.011, 0.897], [0.024, 0.874], 
        [0.047, 0.845], [0.055, 0.845], [0.060, 0.859], [0.107, 0.859], [0.112, 0.847], [0.121, 0.847], 
        [0.164, 0.916] /*end first mountain*/, [0.202, 0.915], [0.205, 0.903], [0.214, 0.903], 
        [0.221, 0.888], [0.227, 0.888], [0.243, 0.912], [0.275, 0.912], [0.303, 0.901], [0.358, 0.901], 
        [0.377, 0.915], [0.398, 0.915] /*end left valley*/, [0.402, 0.904], [0.417, 0.904], [0.421, 0.895], 
        [0.433, 0.895], [0.448, 0.871], [0.448, 0.863], [0.457, 0.853], [0.457, 0.853], [0.457, 0.845], 
        [0.464, 0.845], [0.472, 0.855], [0.499, 0.855], [0.505, 0.844], [0.513, 0.844], [0.520, 0.856], 
        [0.520, 0.868], [0.524, 0.868], [0.533, 0.888], [0.533, 0.901] /*end second mountain*/, 
        [0.572, 0.901], [0.592, 0.908], [0.654, 0.908], [0.658, 0.895], [0.662, 0.900], [0.669, 0.883],
        [0.734, 0.883], [0.743, 0.894], [0.743, 0.906], [0.751, 0.906], [0.757, 0.913], [0.779, 0.913],
        [0.795, 0.919], [0.834, 0.919], [0.846, 0.907], [0.866, 0.907] /*end second valley*/, [0.873, 0.894], 
        [0.877, 0.898], [0.899, 0.867], [0.899, 0.860], [0.904, 0.847], [0.908, 0.847], [0.908, 0.844], 
        [0.918, 0.844], [0.918, 0.855], [0.971, 0.855], [0.976, 0.846], [0.983, 0.846], [0.997, 0.868], 
        [0.997, 0.868], [1, 0.877] /* end third mountain*/, [1, 1] /*BR corner*/, [0, 1] /*BL corner*/]

    //Cities
      //Placement coordinates
        var cityLocationCoords = 
          [[0.141, 0.918], [0.241, 0.918], [0.338, 0.919], [0.545, 0.910], [0.672, 0.894], [0.777, 0.918]];

      //Rendering coordinates
        //Dark blue
          var cityRenderingCoordsDKBlue = 
            [[0, 0], [0.006, -0.006], [0.009, -0.036], [0.017, -0.022], [0.024, -0.024], [0.029, -0.012], 
            [0.038, -0.033], [0.045, -0.025], [0.047, -0.039], [0.053, -0.015], [0.057, -0.022], [0.056, -0.004]];
        //Light blue
          var cityRenderingCoordsLTBlue = 
            [[0.003, 0], [0.007, -0.006], [0.006, -0.021], [0.018, -0.004], [0.021, -0.021], [0.027, -0.012], 
            [0.028, -0.019], [0.03, -0.015], [0.032, -0.021], [0.037, -0.021], [0.04, -0.028], [0.041, -0.013], 
            [0.043, -0.012], [0.048, -0.007], [0.048, -0.019], [0.051, -0.010], [0.054, -0.013], [0.058, 0.001], 
            [0.041, 0.001], [0.04, -0.009], [0.037, -0.006], [0.034, -0.016], [0.031, -0.007], [0.025, -0.009], 
            [0.022, 0.003]];

    //Defense Missile Batteries
      //Defense missile battery placement coordinates
        var defenseMissileBatteryLocationCoords = 
          [[0.080, 0.859], [0.485, 0.855], [0.944, 0.855]];

      //Defense missile placement coordinates **relative to batteries**
        var defenseMissileLocationCoords = 
          [[0.000, 0.000], [-0.012, 0.018], [0.013, 0.018], [-0.025, 0.036], [0.000, 0.036], [0.025, 0.036], 
          [-0.037, 0.054], [-0.012, 0.054], [0.013, 0.054], [0.038, 0.054]];
      
      //Defense missile rendering coordinates
        var loadedDefenseMissileRenderingCoords = 
          [[0.000, 0.000], [0.005, 0.000], [0.005, 0.017], [0.010, 0.027], [0.005, 0.027], [0.0025, 0.0195], 
          [0.000, 0.027], [-0.005, 0.027], [0.000, 0.017]];
  
  //Object Declarations
    //Game object prototype
      // function GameObject(x, y) {
      //   this.x = x;
      //   this.y = y;
      //   this.extant = true;
      // }
    //************************** Come back and set up object inheritance **************************
    //City Object
      function City(x, y) {
        this.x = x;
        this.y = y;
        this.extant = true;
        this.render = function(){
          //Dark blue
          drawFromCoords('#00F', cityRenderingCoordsDKBlue, this.x, this.y);
          //Light blue
          drawFromCoords('#ADD8E6', cityRenderingCoordsLTBlue, this.x, this.y);
        };
        this.draw = function(){
          this.extant ? this.render() : false;
        }
        this.draw();
      }
      // City.prototype = Object.create( GameObject.prototype );
      // City.prototype.constructor = City;
      

    //Defense missile battery object
      function DefenseMissileBattery(x, y) {
        this.x = x;
        this.y = y;
        // this.extant = true;
        this.missiles = [];
        //go through missile location array and add missiles
        this.loadMissiles = function(){
          objectCreator(DefenseMissile, this.missiles, defenseMissileLocationCoords, this);
        };
        this.loadMissiles();
        //Check to make sure battery has missiles; if not, remove from battery array
        this.loaded = function() {
          this.missiles.length > 0 ? true : false;
        }
        //Remove last missile from missile array
        //**************************be sure to prevent removed missile from rendering**************************
        //**************************start missile firing animation, etc.**************************
        this.fire = function(x, y) {
          if (this.missiles.length > 1) {
            //Remove missile from battery
            this.missiles.splice(-1, 1);
            //Fire missile
            firedMissiles.push(new FiredMissile(this.x, this.y, this.x, this.y, x, y, '#00F')) 
          } else {
            //Remove missile from battery
            this.missiles.splice(-1, 1);
            //Fire missile
            firedMissiles.push(new FiredMissile(this.x, this.y, this.x, this.y, x, y, '#00F'))
            //Remove battery from batteries array
            batteries.splice(batteries.indexOf(this), 1)
          }
        }
        this.draw = function() {
          for (missile in this.missiles) {
            this.missiles[missile].draw();
          }
        }
      };

    //Defense missile object
      function DefenseMissile(x, y) {
        this.x = x;
        this.y = y;
        this.extant = true;
        this.originX;
        this.originY;
        this.targetX;
        this.targetY;
        this.render = function(){
          drawFromCoords('#00F', loadedDefenseMissileRenderingCoords, this.x, this.y);
        };
        this.draw = function(){
          this.extant ? this.render() : false;
        }
        this.draw();
      }

    //Missile in flight object
      function FiredMissile(originX, originY, currentX, currentY, targetX, targetY, color) {
        this.originX = originX;
        this.originY = originY;
        this.currentX = originX;
        this.currentY = originY;
        this.targetX = targetX;
        this.targetY = targetY;
        this.color = color;
        this.blastStatus = 0; 
        this.renderingCoords = function() {
          if (originY === 0 ) {
            return [[ 0.001, 0], [ -0.001, 0], 
              [ (this.currentX - this.originX)/canvas_width - 0.001 , (this.currentY + this.originY)/canvas_height ], 
              [ (this.currentX - this.originX)/canvas_width + 0.001 , (this.currentY + this.originY)/canvas_height ]];
          } else {
            return [[ 0.001, 0], [ -0.001, 0], 
              [ (this.currentX - this.originX)/canvas_width - 0.001 , (this.currentY - this.originY)/canvas_height ], 
              [ (this.currentX - this.originX)/canvas_width + 0.001 , (this.currentY - this.originY)/canvas_height ]];
          }
        }
        this.draw = function() {
          drawFromCoords(this.color, this.renderingCoords(), this.originX, this.originY);
        }
        this.cityHit = function() {
          for (var i = 0; i < cities.length; i++) {
            //check both elements of sub-array
            if ( cities[i].x === targetX && cities[i].y === targetY ) {
              return i;
            }
          }
        }
        this.update = function() {
          //Enemyfire
            if (originY === 0 && this.currentY + attackingMissileSpeed <= this.targetY) {
              this.currentY += attackingMissileSpeed; 
              this.currentX += ( this.targetX - this.originX ) / (( this.targetY + this.originY ) / attackingMissileSpeed);
              this.draw();
          //Defensive fire
            } else if (this.currentY - defendingMissileSpeed >= this.targetY) {
              this.currentY -= defendingMissileSpeed; 
              this.currentX -= ( this.targetX - this.originX ) / (( this.targetY - this.originY ) / defendingMissileSpeed);
              this.draw();
          //Blowed up
            } else if (this.blastStatus <= blastRadius) {
              this.currentY = targetY;
              this.currentX = targetX;
              this.draw();
              //blow up
              //************************** make it blow up **************************
              this.blastStatus += blastRadius/fps;
              $canvas.fillStyle = '#FFF';
              $canvas.beginPath();
              $canvas.arc(targetX, targetY, this.blastStatus, 0, 2*Math.PI);
              $canvas.stroke();
              $canvas.fill();
          //Remove from firedMissiles array
            } else {
              var target = this.cityHit();
              if (originY === 0 && target !== undefined) {
                // console.log(this.cityHit());
                cities.splice(this.cityHit(), 1); 
              }
              firedMissiles.splice(firedMissiles.indexOf(this), 1);
            }
        }
      }

  //Movement
    //Initialize
      var initialize = function() {
        startupScreen();
        startupListener();
        // tempCoordConversion(loadedDefenseMissileRenderingCoordinates);
      }

        //Startup screen
          var startupScreen = function(){
            canvasCreator();
            drawFromCoords('#000', backgroundRenderingCoords, 0, 0);
            $canvas.fillStyle = 'blue';
            $canvas.font = 'bold ' + canvas_height * 0.06 + 'px arial';
            $canvas.fillText( 'MISSILE COMMAND: tOP', canvas_width * 0.26, canvas_height * 0.45 );
            $canvas.fillStyle = 'blue';
            $canvas.font = 'bold ' + canvas_height * 0.03 + 'px arial';
            $canvas.fillText( 'CLICK TO FIRE MISSILES AND DEFEND CITIES', canvas_width * 0.275, canvas_height * 0.59 );
          }

        //Control setup
          var startupListener = function() {
            $canvasElement.one( 'click', function( event ) {
              levelSetup();
            });
          }

    //Controller for starting the game
      var levelSetup = function() {
        canvasCreator();
        drawBackground();
        objectCreator(City, cities, cityLocationCoords);
        objectCreator(DefenseMissileBattery, batteries, defenseMissileBatteryLocationCoords);
        gameListener();
        // gameplay flow controller
        startAnimation();
        // tempCoordConversion(loadedDefenseMissileRenderingCoordinates);
      }

      //Raw canvas setup
        var canvasCreator = function(){
          $canvasElement.css({ 
            'display': 'block',
            'margin': '0 auto',
            'cursor': 'crosshair'
          });
        }

        //Draw level background
          var drawBackground = function(){
            //Black background
              drawFromCoords('#000', backgroundRenderingCoords, 0, 0);
            //Yellow surface
              drawFromCoords('#ff0', surfaceRenderingCoords, 0, 0);
          };

        var gameListener = function() {
          $canvasElement.on( 'click', function( event ) {
            // console.log('x: ' + ( (event.pageX - this.offsetLeft)) );
            // console.log('y: ' + ( (event.pageY - this.offsetTop)) );
            selectBattery(event.pageX - this.offsetLeft, event.pageY - this.offsetTop);
          });
        }

          var selectBattery = function(x, y) {
            //Make sure target is in firing range
            if ( y < 565) {
              //Divide screen into thirds
              var sectionWidth = canvas_width/batteries.length;
              //Figure out which battery allocation function to use
              switch (batteries.length) {
                //All three batteries still have missiles
                case 3 : 
                  allBatteriesFire(x, y, sectionWidth);
                  break;
                //One spent battery
                case 2 : 
                  twoBatteriesFire(x, y, sectionWidth);
                  break;
                //One remaining battery
                case 1 : 
                  batteries[0].fire(x, y);
                  break;
                //no missiles left
                default:
                  console.log('gameover');
              }
            }
            //************************** either game over or... **************************
          }

            var allBatteriesFire = function( x, y, sectionWidth ) {
              //Middle third
              if (x < sectionWidth * 2 && x > sectionWidth) {
                batteries[1].fire(x, y)
              //Left third
              } else if (x < sectionWidth) {
                batteries[0].fire(x, y)
              //Right third
              } else {
                batteries[2].fire(x, y);
              }
            }

            var twoBatteriesFire = function( x, y, sectionWidth ) {
              //Left half
              if (x < sectionWidth) {
                batteries[0].fire(x, y)
              //Right half
              } else {
                batteries[1].fire(x, y);
              }
            }

      //SetInterval declaration
        var startAnimation = function() {
          animation = setInterval( advance, 1000 / fps );
          attack = setInterval( enemyFire, enemyFireRate );
        }

          //Frame handler
            var advance = function() {
              //Wipe it clean
              $canvas.clearRect(0,0,canvas_width,canvas_height); 
              //Re-render background
              drawBackground();
              //Update loaded missiles in each battery
              for (battery in batteries) {
                batteries[battery].draw();
              }
              //Re-render remaining cities
              for (city in cities) {
                cities[city].draw();
              }
              for (missile in firedMissiles) {
                firedMissiles[missile].update();
              }
              if (cities.length === 0 ){
                clearInterval(animation);
                clearInterval(attack);
                initialize();
              }
            }

          var enemyFire = function() {
            if ( enemyMissilesPending > 0 ) {
              enemyMissilesPending -= 1;
              var originX = Math.floor(Math.random() * canvas_width);
              var target = cities[Math.floor(Math.random() * cities.length)];
              firedMissiles.push(new FiredMissile(originX, 0, originX, 0, target.x, target.y, '#F00'))
            }
          }

  //Utility Functions
    //Use coordinate sets to render objects in their respective locations
      var drawFromCoords = function(color, coordSet, originX, originY) {
        $canvas.fillStyle = color;
        $canvas.moveTo(originX, originY);
        $canvas.beginPath();
        for (var coord in coordSet) {
          //Percentage of canvas deviation from origin
          $canvas.lineTo( originX + canvas_width*coordSet[coord][0], originY + canvas_height*coordSet[coord][1] ); 
        }
        $canvas.closePath();
        $canvas.fill();
      }

    //Create Objects
      var objectCreator = function(objectType, objectHolder, objectLocations, parentObject){
        //Create 'zero' object if no parent passed
        var parent = parentObject || {x: 0, y: 0};
        //Cycle through locating coordinate set, and push new object to object array
        for (var coords in objectLocations) {
          objectHolder.push( new objectType(  parent.x + ( canvas_width * objectLocations[coords][0] ), 
                                              parent.y + ( canvas_height * objectLocations[coords][1] ) 
                                            ));
        }
      };

  //Public exposure declaration
    //Revealing Module design pattern
      return {
        initialize: initialize
      };

})();

$(document).ready(function(){
  //Make it so, #1!
  missileCommand.initialize();
});