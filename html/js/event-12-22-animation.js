var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var snow = [],
  snowMax = 100,
  snowFre = 10,
  snowFreCount = 0;

var WINDOW_WIDTH = deviceWidth,
  WINDOW_HEIGHT = $(window).height();

canvas.width = WINDOW_WIDTH;
canvas.height = WINDOW_HEIGHT;

render();

setInterval(function() {
  update();
}, 50);

function update() {
  snowFreCount++;

  if(snowFreCount == snowFre) {
    snowFreCount = 0;
    snowCreate();
  }

  for(var i = 0; i < snow.length; i++) {
    snow[i].y += snow[i].speed;
    snow[i].rotate += snow[i].rotateSpeed;
  }

  for(var i = 0; i < snow.length; i++) {
    if(snow[i].y > WINDOW_HEIGHT + snow[i].fontsize) {
      snow.splice(i, 1);
    }
  }
  render();
}

function render() {

  context.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);

  for(var i = 0; i < snow.length; i++) {
    context.save();
    context.font = snow[i].fontsize + 'px Arial';
    context.fillStyle = '#fff';
    context.translate(snow[i].x, snow[i].y);
    context.rotate(snow[i].rotate / 180 * Math.PI);
    context.fillText('❄', 0, 0);
    context.restore();
  }
}

function snowCreate() {
  var snowObj = {};

  if(snow.length >= snowMax) {
    return false;
  }

  snowObj.x = parseInt(Math.random() * WINDOW_WIDTH + 1);
  snowObj.y = -5;
  snowObj.speed = parseInt(Math.random() * 2 + 3);
  snowObj.rotate = 0;
  snowObj.rotateSpeed = parseInt(Math.random() * 5 + 1);
  snowObj.fontsize = Math.round(Math.random() * 20 + 10);

  snow.push(snowObj);
}