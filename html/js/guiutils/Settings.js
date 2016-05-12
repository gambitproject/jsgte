(function(){
  var settings = document.getElementById("settings");
  var settings_bar = document.getElementById("settings_bar");
  var offset = { x: 0, y: 0 };

  settings_bar.addEventListener('mousedown', mouseDown, false);
  window.addEventListener('mouseup', mouseUp, false);

  function mouseUp()
  {
    window.removeEventListener('mousemove', settingsMove, true);
  }

  function mouseDown(e){
    offset.x = e.clientX - settings.offsetLeft;
    offset.y = e.clientY - settings.offsetTop + 100 ;
    window.addEventListener('mousemove', settingsMove, true);
  }

  function settingsMove(e){
    settings.style.position = 'absolute';
    var top = e.clientY - offset.y ;
    var left = e.clientX - offset.x;
    settings.style.top = top + 'px';
    settings.style.left = left + 'px';
  }

}());