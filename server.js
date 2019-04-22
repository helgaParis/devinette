const express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 80 //process.env.PORT || 80;

const db = require('./db.js');
const ObjectId = require('mongodb').ObjectId;

const session = require('express-session');
const uuidv1 = require('uuid/v1');

const bodyParser = require('body-parser');


// les  templates

app.set('view engine', 'pug');
app.set('views',  './views');

// Gestion des fichiers statiques
app.use('/css', express.static(__dirname + '/src/css'));
app.use('/js', express.static(__dirname + '/src/js'));
app.use('/jquery', express.static(__dirname + '/src/jquery'));
app.use('/images', express.static(__dirname + '/src/images'));




//les modules necessaires
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  uuidv1: function(req) {
    return uuidv1(); // use UUIDs for session IDs
  },
  secret: 'syrah ou corbieres',
  resave: false,
	saveUninitialized: true,
	cookie: { secure: false }
}));






//////////////*******************//////////////////****** */
//////  les reponses /////
var sess;


app.get('/', function(req, res){
    sess = req.session;
  //  console.log('session: ');
    res.render('index', {message: 'Login:'});   
  });
app.get('/index', function(req,res,next) {
    res.render('index');   
});

 app.get('/scores', function(req,res){

  db.getDB((dbClient, close) => {
		const collection = dbClient.collection("joueurs");
        // perform actions on the collection object
      
        collection.find({}).sort({score: -1}).toArray(function(err, result) {
          if (err) {
            console.log('atlas error');
            }
          close();
          console.log(result);
          return res.render('scores', {result: result});
        });
    });
});


app.get('/creacompte',function (req,res,next){
  res.render('creacompte', {message: 'Bienvenue au club!'});
});

app.post('/creation', function(req, res) {
 //console.log(req.params);
	db.getDB( (dbClient, close) => {
		const collection = dbClient.collection("joueurs");
       
        collection.find({pseudo:req.body.pseudo}).toArray(function(err, result) {
          console.log('mongo result creation ' + result);
          if (err) {
	          console.log('atlas error');
          	}
          if (result.length >0) {
	          close();
	          return res.render('index', {message:'Vous êtes déjà inscrit. Accedez via le formulaire login.'});
	           
          	} else {
              collection.insertOne( { pseudo:req.body.pseudo,
              pw:req.body.pw,
              score:0
              } );
              var name = req.body.pseudo;
              var scoreG = 0;
              console.log(name);
	          	close();
	          	res.render('jeu', {name:name, scoreG:scoreG});
          	}                   
        });
    });
});

app.post('/connect', function(req, res) {

 console.log('Envoyé par le client req.body.pseudo '+req.body.pseudo + 'pw: '+ req.body.pw);
  
   db.getDB( (dbClient, close) => {
     const collection = dbClient.collection("joueurs");
         
        collection.find({pseudo:req.body.pseudo}).toArray(function(err, result) {
           if (err) {
             console.log('atlas error');
             }
           if (result.length === 0) {
             close();
           // res.send('Vous n\'êtes pas encore inscrit. Créez un compte pour acceder au jeu.');
           return res.render('creacompte', {message: 'Vous n\'êtes pas encore inscrit. Créez un compte pour acceder au jeu.'});
              
             } else {

                if (result[0].pw == req.body.pw) {
                  console.log(result);
                  console.log(req.body.pw);
                  var name = req.body.pseudo;
                  var scoreG = result[0].score;
                  console.log(name);
                  console.log(scoreG);
                  close();
                  
                  res.render('jeu', {name:name, scoreG:scoreG});
                } else {
                  close();
                  res.render('index', {message: 'Mauvais mot de passe'});
                }
             } 
     });
 });
});

///en dernier le 404
app.use(function (req, res, next) {
	return res.status(404).render('404');
});


io.on('connection', function(socket){
  //reception d'une connexion avec envoi des données du joueur
  let randomNumber =  Math.floor(Math.random() * 11);

  socket.on('player', function (data) {
    var player = {
      name: data.name, 
      color: data.color, 
      guess: data.guess,
      score: data.score, 
      id: data.id
    };
    //console.log(data);
    //1. renvoi des données du joueur aux autres
    var pourtous = {
      name: data.name, 
      color: data.color, 
      guess: data.guess,
      score: data.score
      };
    console.log(pourtous);
    socket.broadcast.emit('adversaire', pourtous );

 
  function jeu (){
  
    var serverSecret = randomNumber ;
    var difference = Math.abs(serverSecret-data.guess);
    console.log(difference);
    if (difference > 1) {
      message = {
        text:'Personne n\'est près du but, continuez!'
        };
      socket.emit('message1', message);
    }
    if (difference < 2) {
      message = {
        text: data.name +' y est resque, 1 point gagné, continuez!',
        name: data.name,
        score: 1
        };
      var message2a = message;

      console.log(player.name);
        db.getDB( (dbClient, close) => {
          const collection = dbClient.collection("joueurs"); 
              collection.updateOne(
                {pseudo:player.name},
                {$inc:{score: 1} },
                (err, r) => {
                  if (err) {console.log('tant pis');}
                  close();
                }
                );             
        });
      socket.broadcast.emit('message2', message);
      socket.emit('message2a', message2a);
    }
    if (difference === 0) {
      message = {
        text: data.name +' a gagné 3 points, nouveau jeu!',
        name: data.name,
        score: 3
        };
       var message3a=message;
        console.log(player.name);
        db.getDB( (dbClient, close) => {
          const collection = dbClient.collection("joueurs"); 
              collection.updateOne(
                {pseudo:player.name},
                {$inc:{score: 3} },
                (err, r) => {
                  if (err) {console.log('tant pis');}
                  close();
                }
                );             
        });
      randomNumber =  Math.floor(Math.random() * 11);
      serverSecret = randomNumber ;
      socket.broadcast.emit('message3', message);
      socket.emit('message3a', message3a);
    }

  }
  jeu();
  socket.on('disconnect', function () {
  socket.emit('logout', player.name);
  });

  });

socket.on('ciao', function(data){
    console.log(data + ' part');
    message = data;
    socket.broadcast.emit('logout', message);
  });

}); //fin socket.io

http.listen(port, function(){
  console.log('listening on *:' + port);
});
