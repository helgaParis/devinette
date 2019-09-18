**Jeu Multi-joueur**

**Atelier Back - Projet de Formation**

Lien vers le site : [https://petrovic.ovh](http://petrovic.ovh)
Lien vers le jeu et son serveur :  [https://jeu.petrovic.ovh](http://jeu.petrovic.ovh)

**Hébergement**

Mon site et son serveur sont installés sur un vps. Ce serveur sert des pages statiques et dynamiques, en html et pug.

Le jeu et son serveur sont installés sur le même vps, sur une autre porte.

Le serveur utilise Express et quelques fonctionnalités de pug pour afficher le contenu de base.

**Authentification**

L'accès à ce jeu passe via une authentification dans une base de données Mongo. 

La bd est maintenant installé sur une version de Mongo standalone sur le VPS, le db.js dans ce depot git utilise encore un compte Atlas, qui n'existe plus.

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

Coté navigateur, les échanges sont affichés.


**Différences entre le depot et les fichiers en ligne** 
le ficher jeulocal.js installé indique la vrai adresse du serveur.
Sur le serveur, j'utilise pm2 au lieu de nodemon. 

**Dernier changements**
Serveur Nginx installé sur le vps. 
Certbot installé et sites en https.
Firewall installé sur le serveur.
Nginx est proxy pour les apps en node. 
Le jeu a sa propre sous-domain, gère par Nginx.
Portes des apps changés (pour libérer 80)
Code websocket adapté à https et gestion du domaine par Nginx.
Server.js: changé max listeners pour socket
Installation Mongodb sur le VPS en standalone et transfert des données du db sur Atlas sur le db du VPS
