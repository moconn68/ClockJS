/* A clean and simple modern take on a clock and calendar. The rings around the time represent (from outside in)
 * hours, minutes, and seconds, with the exact time displayed in the center. The boxes to the left are a simple
 * calendar, with the number of boxes displayed representing the current month and the number in the filled
 * box being the date.
 *
 * Author: Matthew O'Connell
 */

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
// keeps track of am/pm
var dayNight;

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;
// for helping drawn lines somewhat scale to screen size/changes
var scaleFactor = Math.sqrt(width^2 + height^2);


// the following 3 functions do the actual drawing the "hands" for the clock.
function drawHourCircle(hours) {
  ctx.beginPath();
  var hourPercent = (hours/12);
  var startAngle = 1.5 * Math.PI;
  var endAngle = (2*Math.PI) * hourPercent;
  ctx.arc(width/2,height/2,height/2.75,startAngle,startAngle + endAngle);
  ctx.lineWidth = scaleFactor/1.3;
  ctx.stroke();
}
function drawMinuteCircle(minutes) {
  ctx.beginPath();
  var minutePercent = (minutes/60);
  var startAngle = 1.5 * Math.PI;
  var endAngle = 2*Math.PI * minutePercent;
  ctx.arc(width/2,height/2,height/3.25,startAngle,startAngle + endAngle);
  ctx.lineWidth = scaleFactor/2;
  ctx.stroke();
}
function drawSecondCircle(seconds) {
  ctx.beginPath();
  var secondsPercent = (seconds/60);
  var startAngle = 1.5 * Math.PI;
  var endAngle = 2*Math.PI * secondsPercent;
  ctx.arc(width/2,height/2,height/3.75,startAngle,startAngle + endAngle);
  ctx.lineWidth = scaleFactor/3;
  ctx.stroke();

}

// draws the squares for the calendar and places the date in the topmost box,
// height displacement determined by formula in boxY.
function drawCalendar(months,day){
  var counter = months;
  var boxWidth = width / 30;
  var boxHeight = height / 18;
  var boxX = width/10;
  var boxY = height/2 + boxHeight*(months/2-1/2);
  ctx.beginPath();
  while(counter >= 0){
    ctx.rect(boxX, boxY, boxWidth,boxHeight);
    // if current box is for current month, fill it in and write the date inside
    if(counter == 0){
      var retDay = document.getElementById("day");
      retDay.style.top = String(boxY-9) + "px";
      if(day < 10){
        retDay.style.left = String(boxX*1.13) + "px";
      }
      else {
        retDay.style.left = String(boxX*1.11) + "px";
      }

      retDay.style.color = "white";
      retDay.innerHTML = day;
      ctx.fillStyle = "black";
      ctx.fillRect(boxX, boxY, boxWidth,boxHeight)
    }
    counter--;
    boxY -= boxHeight;
  }
  ctx.lineWidth = scaleFactor/16;//5;
  ctx.stroke();
}
// simple function for adjusting canvas and scaleFactor on window resize
function windowResize(){
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  scaleFactor = Math.sqrt(width^2 + height^2);
}
function timeLeadingZero(time){
  if(time < 10){
    return "0" + time;
  }
  else {
    return time;
  }
}
// main loop
function loop(){
  windowResize();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  var now = new Date
  var offset = now.getTimezoneOffset();
  var hours = now.getHours();
  if(hours > 12){
    hours = hours-12;
    dayNight = "pm";
  }
  else {
    dayNight = "am";
  }
  if(hours == 0){
    hours = 12;

  }
  var minutes = now.getMinutes();
  var seconds = now.getSeconds();
  var months = now.getMonth();
  var day = now.getDate();
  drawHourCircle(hours);
  drawMinuteCircle(minutes);
  drawSecondCircle(seconds);
  drawCalendar(months,day);
  hours = timeLeadingZero(hours);
  minutes = timeLeadingZero(minutes);
  seconds = timeLeadingZero(seconds);
  var concatTime = hours + ": " + minutes + ": " + seconds + " " + dayNight;
  document.getElementById("time").innerHTML = concatTime;
  // necessary for keeping time centered in page at all times
  var x = document.getElementsByClassName("centered");
  var dynamicVertTextSize = height/2;
  var dvtString = String(dynamicVertTextSize) + "px";
  x[0].style.top = dvtString;
  setTimeout(loop,100);
}
loop();
