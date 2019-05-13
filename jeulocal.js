'use strict';
window.addEventListener('DOMContentLoaded', function() {
//console.log('dans le js');

// le joueur peut choisir la couleur de sa div = avatar. Elle sera transmis aux autres.
var avatar;
  var avatarColor = "#0000ff";
  
  window.addEventListener("load", startup, false);
  function startup() {
     // console.log('dans le event');
      avatar = document.querySelector("#avatar");
      avatar.value = avatarColor;
      avatar.addEventListener("input", updateFirst, false);
      avatar.addEventListener("change", updateFirst, false);
      avatar.select();
     
  }
  function updateFirst(event) {
      var play = document.getElementById("player1");
      play.style.backgroundColor  = event.target.value || "#0000ff";
      avatarColor =  event.target.value;
  }
 
  function stagechange(){
  document.getElementById('player1').style.backgroundColor =  event.target.value;
  }
  stagechange();//fin event listener pour color picker


});// fin event listener decor



(function(window, io){
  window.addEventListener('DOMContentLoaded', function(){
     
   var socket = io('https://jeu.petrovic.ovh'); //changer à la mise en ligne
  
   // pour afficher les messages du serveur 
    var deusExMachina = document.getElementById('repserver');
    var deus = function(message){
      deusExMachina.innerHTML = message;
    };
 
    //premier envoi du joueur vers le serveur
    var player;
  var secret = window.document.getElementById('guessbutton');
  secret.addEventListener('click', function(event){
        event.preventDefault();
        player = {
          name : window.document.getElementById('name1').innerHTML,
          guess: window.document.getElementById('guess1').value,
          color :  window.document.getElementById("player1").style.backgroundColor,
          score: window.document.getElementById('score1global').innerHTML,
          id : socket.id
          };
       
        socket.emit('player',player);
      }); //event listener click du debut

  //le serveur renvoie des données de chauque autre 
  socket.on('adversaire', function (data) {
    var adversaire = {
      name: data.name, 
      color: data.color, 
      guess: data.guess,
      score: data.score
    };
    console.log(adversaire);



    function addElement(adversaire) {
      var newAdv = document.createElement("div"); 
      newAdv.style.backgroundColor = adversaire.color;
      newAdv.style.width = 300;
      newAdv.style.heigth = 100;
      newAdv.id = adversaire.name;
      newAdv.setAttribute("score",adversaire.score);
      newAdv.innerHTML = adversaire.name + ', score: ' + adversaire.score;
      newAdv.style.display = 'block';
      var cible = document.getElementById("player2");
        cible.appendChild(newAdv);
       
    }
    addElement(adversaire);
    }); // adversaire

    //les messages du jeu
    socket.on('message1', function (data) {
      var message= data.text;
      deus(message);
    }); //message 1  

    socket.on('message2', function (data) {
      var message= data.text;
      var pseudo=data.name;
      deus(message);
      var cible = document.getElementById(pseudo);
      var oldscore =cible.getAttribute('score');
      var newscore =parseInt(oldscore) +1;
      cible.setAttribute("score",newscore);
      cible.innerHTML = data.name + ', score: ' + newscore;
    }); //message 2 to all others

    socket.on('message2a', function (data) {
      var message= data.text;
      var pseudo=data.name;
      deus(message);
      if (pseudo == player.name) {
      var cible = document.getElementById('score1global');
      var oldscore =player.score;
      var newscore =parseInt(oldscore) +1;
      player.score = newscore;
      cible.innerHTML = newscore;
      }
    }); //message 2a to player


    socket.on('message3', function (data) {
      var message= data.text;
      var pseudo=data.name;
      deus(message);
      var cible = document.getElementById(pseudo);
      var oldscore = cible.getAttribute('score');
      var newscore =parseInt(oldscore) +3;
      cible.setAttribute("score",newscore);
      cible.innerHTML = data.name + ', score: ' + newscore;
    }); //message 3    

    socket.on('message3a', function (data) {
      var message= data.text;
      var pseudo=data.name;
      deus(message);

      if (pseudo == player.name) {
      var cible = document.getElementById('score1global');
      var oldscore =player.score;
      var newscore =parseInt(oldscore) +3;
      player.score = newscore;
      cible.innerHTML = newscore;
      }
    }); //message 3a to player
    //on deconnect

    var adieu = document.getElementById('exit');
    adieu.addEventListener('click', function(){
      var ciao =  player.name;
      socket.emit('ciao', ciao);
    });

    socket.on('logout', function (data) {
      var message= data + ' est parti.';
      var pseudopart = data;
      deus(message);
    function removeHim () {
      var sesTraces = document.getElementById(pseudopart);
      sesTraces.parentNode.removeChild(sesTraces);
    };
    removeHim();

    }); //logout
    
    


    }); //domcontent loaded

}(window, io))();//iife
