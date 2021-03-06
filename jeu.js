"use strict";

const express = require('express');
const app = express();
var MongoClient = require('mongodb').MongoClient;
const session = require('express-session');
const uuidv5 = require('uuid/v5');

const url = 'mongodb+srv://admin:Alex002@cluster0-yisoi.mongodb.net/test?retryWrites=true&w=majority';
const dbName = 'joueur';
const client = new MongoClient(url);

const connectMongo = require('connect-mongo');
const MongoStore = connectMongo(session);
const options = {
    store: new MongoStore({
        url: "mongodb+srv://admin:Alex002@cluster0-yisoi.mongodb.net/session?retryWrites=true&w=majority"
    }),
    secret: "blablabla",
    saveUninitialized: true,
    resave: false
}

app.use("/front", express.static(__dirname + '/front'));
app.set('view engine', 'pug');
app.use(session(options));

let userID = uuidv5.DNS;

// parti node + express
app.get('/', function (req, res) {
    req.session.uuid = userID;
    res.render('index');
})

var tableauJoueurs = [];

app.get('/jeu', function (req, res) {
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
        if (err) {
            return;
        }

        let db = client.db(dbName);
        let collection = db.collection('pseudo');
        // let collection2 = db.collection('sessions');
        let insertion = {};

        insertion.pseudonyme = req.query.pseudonyme;
        // console.log(uuidv5.DNS);
        insertion.uuid = userID;
        // console.log(insertion);

        if (insertion.pseudonyme == '') {
            res.render('index', { messageErreur: 'Pseudonyme vide' });
        } else {
            collection.insertOne(insertion, function (err, data) {
                console.log(tableauJoueurs.length)
                if (tableauJoueurs.length < 2) {
                    tableauJoueurs.push(data);
                    // console.log(data);
                    client.close();
                    res.render('jeu', { data: tableauJoueurs });
                } else {
                    res.render('index', { messageErreur: 'Déja 2 personnes sont connectées' });
                }
            });
        }
    })
    // res.render('jeu');
})


const HTTPServer = app.listen(process.env.PORT || 5234, function (uneErreur) {
    if (uneErreur) {
        console.log('Impossible de démarrer le serveur');
    } else {
        console.log('Serveur démarré sur le port 5234');
    }
});


// parti websocket

const io = require("socket.io");
const webSocketServer = io(HTTPServer);

webSocketServer.on("connect", function (ioSocket) {
    console.log("Connected to the client");


    // partie joueur
    var tableau = [];
    ioSocket.on("pseudo", function (textHtml) {
        tableau.push(textHtml);
        if (tableauJoueurs.length === 2) {
            console.log(tableau);
            // ioSocket.emit('arrUsers', tableauJoueurs);
            // ioSocket.emit("pseudo", textHtml);   
            ioSocket.broadcast.emit("pseudo", tableau);
        } else {
            console.log("arrUsers", tableauJoueurs.length);
            console.log(tableau);
            ioSocket.emit("pseudo", tableau);
        }
    })


    // partie bille et barreJoueur
    var barreJoueur1 = {
        top: 42,
        left: 2
    }

    var barreJoueur2 = {
        top: 42,
        left: 98
    }

    var bille = {
        top: 50,
        left: 49.75
    }

    var monObjet = {
        bille: bille,
        barreJoueur1: barreJoueur1,
        barreJoueur2: barreJoueur2
    }

    ioSocket.emit("bille", monObjet);

    ioSocket.on("deplacementHaut", function (haut) {
        ioSocket.emit("deplacementHaut", haut);
        ioSocket.broadcast.emit("deplacementHaut", haut);
    })

    ioSocket.on("deplacementBas", function (haut) {
        ioSocket.emit("deplacementBas", haut);
        ioSocket.broadcast.emit("deplacementBas", haut);
    })

    // ioSocket.on("deplacementHautJ2", function (haut) {
    //     ioSocket.emit("deplacementHautJ2", haut);
    //     ioSocket.broadcast.emit("deplacementHautJ2", haut);
    // })

    // ioSocket.on("deplacementBasJ2", function (haut) {
    //     ioSocket.emit("deplacementBasJ2", haut);
    //     ioSocket.broadcast.emit("deplacementBasJ2", haut);
    // })

    ioSocket.on("deplacementBille", function (haut, cote) {
        ioSocket.emit("deplacementBille", haut, cote);
        ioSocket.broadcast.emit("deplacementBille", haut, cote);
    })

    ioSocket.on("scoreJoueur1", function (scoreJ1) {
        ioSocket.emit("scoreJoueur1", scoreJ1);
        ioSocket.broadcast.emit("scoreJoueur1", scoreJ1);
    })

    ioSocket.on("scoreJoueur2", function (scoreJ2) {
        ioSocket.emit("scoreJoueur2", scoreJ2);
        ioSocket.broadcast.emit("scoreJoueur2", scoreJ2);
    })

    ioSocket.on("reset", function (haut, cote) {
        ioSocket.emit("reset", haut, cote);
        ioSocket.broadcast.emit("reset", haut, cote);
    })
});



