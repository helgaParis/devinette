'use strict';
document.addEventListener('DOMContentLoaded', function() {
  //console.log('dans le js');
  
  var message;
  var deusexmachina = document.querySelector("h3");
  var deus = function() {
    deusexmachina.innerHTML = message;
  };
  
  var formsend = document.querySelector("#crea");
  formsend.addEventListener("submit", function(e){
    //e.preventDefault();
    message = 'envoyé';
    deus();
    console.log(message);

  }); //fin event listener formsend



});// fin event listener global