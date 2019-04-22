'use strict';
window.addEventListener('DOMContentLoaded', function() {
  console.log('dans le js');
  
  var avatar;
  var avatarColor = "#0000ff";
  
  window.addEventListener("load", startup, false);
  function startup() {
      console.log('dans le event');
      avatar = document.querySelector("#avatar");
      avatar.value = avatarColor;
      avatar.addEventListener("input", updateFirst, false);
      avatar.addEventListener("change", updateAll, false);
      avatar.select();
     
  }
  function updateFirst(event) {
      var play = document.getElementById("player1");
      play.style.backgroundColor  = event.target.value || "#0000ff";
  }
  function updateAll(event) {
      play.style.backgroundColor  = event.target.value || "#0000ff";
  }
  function stagechange(){
  document.getElementById('player1').style.backgroundColor =  event.target.value;
  }
  stagechange();//fin event listener pour color picker



});// fin event listener global