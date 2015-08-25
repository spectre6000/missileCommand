
//HOUSE VARS
  var CANVAS_WIDTH = 1000;
  var CANVAS_HEIGHT = 750;
  var FPS = 30;
  var keyboard = { };

//CANVAS SETUP
  var canvasElement = $("<canvas width='" + CANVAS_WIDTH + "px' height='" + CANVAS_HEIGHT +
                      "px' style='display:block;border:1px solid black;margin:0 auto;'></canvas>");
  var canvas = canvasElement.get(0).getContext("2d");
  canvasElement.appendTo('body');

  setInterval(function(){
    update();
    draw();
  }, 1000/FPS);

//PLAYER
  var player = {
    color: "#00A",
    x: 220,
    y: 270,
    width: 32,
    height: 32,
    draw: function() {
      canvas.fillStyle = this.color;
      canvas.fillRect(this.x, this.y, this.width, this.height);
    }
  };

//Animation

  function update() {
    //left arrow
    if(keyboard[37])  { 
      player.x -= 10; 
      if(player.x < 0) player.x = 0;
    } 
    //right arrow
    if(keyboard[39]) { 
      player.x += 10; 
      var right = CANVAS_WIDTH - player.width;
      if(player.x > right) player.x = right;
    }
  }

  function doSetup() {
    attachEvent(document, "keydown", function(e) {
      keyboard[e.keyCode] = true;
    });
    attachEvent(document, "keyup", function(e) {
      keyboard[e.keyCode] = false;
    });
  }

  function attachEvent(node,name,func) {
    if(node.addEventListener) {
      node.addEventListener(name,func,false);
    } else if(node.attachEvent) {
      node.attachEvent(name,func);
    }
  };


  function draw() {
    canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    player.draw();
  }

  doSetup();

