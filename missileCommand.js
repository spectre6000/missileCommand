//  ----------------------- Missile Command - tOP  ----------------------- 
var missileCommand = (function() {
  //HOUSE VARS
    //DOM declaration
      var $canvasElement = $('canvas');
    //Canvas API selection
      var $canvas = $canvasElement[0].getContext("2d");
    //Canvas dimensions
      var CANVAS_WIDTH = $canvasElement[0].width;
      var CANVAS_HEIGHT = $canvasElement[0].height;
    //Object arrays
      var cities = [];

  //Object rendering coordinate sets
    //Background
      var backgroundRenderingCoords = 
        [[0,0], [0,1], [1,1], [1,0]];

      var surfaceRenderingCoords = 
        [[0, 1] /*BL corner*/, [0, 0.904] /*TL corner*/, [0.007, 0.897], [0.011, 0.897], [0.024, 0.874], 
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
        [0.997, 0.868], [1, 0.877] /* end third mountain*/, [1, 1] /*BR corner*/]

    //Cities
      //Placement coordinates
        var cityLocationCoords = 
          [[0.141, 0.918], [0.241, 0.918], [0.338, 0.919], [0.545, 0.910], [0.672, 0.894], [0.777, 0.918]];

      //Rendering Coordinates
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

    //Temporary utility function for converting single origin coords to convertible coords
      // var tempCoordConversion = function(coordSet){
      //   var holder = []
      //   for (coord in coordSet) {
      //     holder.push([coordSet[coord][0]/1000, coordSet[coord][1]/668]);
      //   }
      //   console.log('coords' + holder);
      // }
  
  //Movement
    //Initialize
      var initialize = function() {
        setup();
        // tempCoordConversion(cityRenderingCoordsLTBlue);
      }
      //Controller for starting the game
        var setup = function() {
          canvasSetup();
          objectCreator(City, cities, cityLocationCoords);
          drawBackground();
          drawCities();
          setupListeners();
        }

        //Raw canvas setup
          var canvasSetup = function(){
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

        //Create Objects
          var objectCreator = function(objectType, objectHolder, objectLocations){
            //Cycle through locating coordinate set, and push new object to object array
            for (var coords in objectLocations) {
              objectHolder.push( new objectType( CANVAS_WIDTH * objectLocations[coords][0], CANVAS_HEIGHT * objectLocations[coords][1] ) );
            }
          };

        //Draw cities
          var drawCities = function(){
            for (var city in cities) {
              cities[city].standing ? cities[city].render() : false;
            }
          }

    var setupListeners = function() {
      $canvasElement.on( 'click', function( event ) {
        console.log('width: ' + ( (event.pageX - this.offsetLeft)) );
        console.log('height: ' + ( (event.pageY - this.offsetTop)) );
      });
    }

  //Object Declarations
    //City Object
      function City(x, y) {
        this.x = x;
        this.y = y;
        this.standing = true;
        this.render = function(){
          //Dark blue
          drawFromCoords('#00F', cityRenderingCoordsDKBlue, this.x, this.y);
          //Light blue
          drawFromCoords('#ADD8E6', cityRenderingCoordsLTBlue, this.x, this.y);
        };
      }

  //Utility Functions
    //Use coordinate sets to render objects in their respective locations
      var drawFromCoords = function(color, coordSet, originX, originY) {
        $canvas.fillStyle = color;
        $canvas.beginPath();
        for (var coord in coordSet) {
          $canvas.lineTo( originX + CANVAS_WIDTH*coordSet[coord][0], originY + CANVAS_HEIGHT*coordSet[coord][1] ); 
        }
        $canvas.closePath();
        $canvas.fill();
      }

  //Public exposure declaration
    //Revealing Module design pattern
      return {
        initialize: initialize
      };

})();

$(document).ready(function(){
  missileCommand.initialize();
});