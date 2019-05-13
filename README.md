**Jeu Multi-joueur**

**Atelier Back - Projet de Formation**

Lien vers le site: [http://petrovic.ovh](http://petrovic.ovh)

**Hébergement**

**Mon site et son serveur **sont installés sur un vps. Ce serveur sert des pages statiques et dynamiques, en html et pug.

**Le jeu et son serveur** sont installés sur le même vps, sur une autre porte.

Le serveur utilise Express et quelques fonctionnalités de pug pour afficher le contenu de base.

**Authentification**

L'accès à ce jeu passe par une authentification contre une base de données Mongo. 

Pour le moment, j'utilise le service Mongo Atlas.

MongoDb enregistre le pseudo, le mot de passe et le score. 

**Multi-joueur**

Le jeu se passe en [socket.io](http://socket.io). Le nombre de joueurs n'est pas limité, mais il s'agit plutôt d'un "proof of concept" que d'un jeu captivant, donc il n'y aura pas foule. Vous pouvez jouer tout seul.

S'il y a plusieurs joueurs en ligne, c'est le plus rapide qui gagne une ronde. 

Les changements sont implémentés en JS, des elements sont créés et changés dans le dom en fonction des messages échanges en [socket.io](http://socket.io).

Pendant le jeu, les navigateurs échangent uniquement des données visibles sur les pages, récupérés en JS, comme les valeurs d'un formulaire, d'un 'color picker' ou du texte visible.

Le serveur io enregistre les scores dans MongoDb.

**Principe du jeu** 

Le serveur cache une numéro sécrète.

Les joueurs choisissent une couleur d'avatar et un numéro à proposer.

Le serveur distribue les informations pour créer les avatars des autres (nom, couleur et score)

Il compare les estimations, indique les résultats et enregistre les scores. 

Coté navigateur, les changes sont affichés.


**Différences entre le depot et les fichiers en ligne** 
jeulocal.js contient la vrai adresse du serveur.
Sur le serveur, j'utilise pm2 au lieu de nodemon. 

**Dernier changements**
Serveur Nginx installé sur le vps. 
Certbot installé et sites en https.
Firewall installé sur le serveur.
Nginx gère les apps en node. 
Le jeu a sa propre sous-domain, gère par Nginx.
Portes des apps changés (pour libérer 80)
Code websocket adapté à https et gestion du domaine par Nginx.
Server.js: changé max listeners pour socket
