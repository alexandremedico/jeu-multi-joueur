"use strict";


  window.addEventListener("DOMContentLoaded", function() {
    const ioSocket = io(process.env.PORT || 5234);

    // const HTMLCollectionJoueur = document.getElementsByClassName('joueur');

    ioSocket.on("connect", function() {
      console.log("Connected to the server");
    

    var touches = {
        38: false,
        40: false,
        13: false
    }
    
    
    // let lorr = Math.round(Math.random() * 20);
    var lorr = 3;
    let scoreJ1 = 0;
    let scoreJ2 = 0;
    
    ioSocket.on('bille', function (monObjet) {
        var HTMLDivElement = window.document.getElementById('blocJoueur1');
        if ('' === HTMLDivElement.style.top) {
            HTMLDivElement.style.top = monObjet.barreJoueur1.top + '%';
        }
    
        if ('' === HTMLDivElement.style.left) {
            HTMLDivElement.style.left = monObjet.barreJoueur1.left + '%';
        }
    
        try {
            var HTMLDivElement2 = window.document.getElementById('blocJoueur2');
            if ('' === HTMLDivElement2.style.top) {
                HTMLDivElement2.style.top = monObjet.barreJoueur2.top + '%';
            }
        
            if ('' === HTMLDivElement2.style.left) {
                HTMLDivElement2.style.left = monObjet.barreJoueur2.left + '%';
            }
        } catch (error) {
            
        }

        var HTMLDivElement3 = window.document.getElementById('ball');
        if ('' === HTMLDivElement3.style.top) {
            HTMLDivElement3.style.top = monObjet.bille.top +'%';
        }

        if ('' === HTMLDivElement3.style.left) {
            HTMLDivElement3.style.left = monObjet.bille.left + '%';
        }

        var idAnimation;
        var bool = true;

        window.onkeydown = function(event){
    
            let code = event.keyCode;
            // console.log(event.keyCode);
                
            switch (code) {
                case 38:
                    // haut
                    touches[38] = true;
                    idAnimation = boucleDuJeu();
                    // console.log('keydown');
                    break;
    
                case 40:
                    // bas
                    touches[40] = true;
                    idAnimation = boucleDuJeu();
                    // console.log('keydown');
                    break;
                
                case 13:
                    // entrée
                    touches[13] = true;
                    if (bool == true){
                        boucleBille();
                        console.log('je suis la');
                        bool = false;
                    }
                    break;
            }
        
        }
    
        window.onkeyup = function (event) {
            let code1 = event.keyCode;
    
            switch (code1) {
                case 38:
                    // haut
                    touches[38] = false;
                    break;
    
                case 40:
                    // bas
                    touches[40] = false;
                    break;

                case 13:
                    // entrée
                    touches[13] = false;
                    break;
            }
        }


        function boucleDuJeu() {
        var hauteurFenetre = window.innerHeight;
        var hauteurFenetre2 = window.innerHeight;
        
        if (touches[38]) {
            // déplacer vers le haut
            var haut = parseFloat(HTMLDivElement.style.top) - 1;
            if (haut < 0) {
                haut = 0;
            }
            
            ioSocket.emit("deplacementHaut", haut);
        }

        if (touches[40]) {
            // déplacer vers le bas
            var haut = parseFloat(HTMLDivElement.style.top) + 1;
            // var hauteur = parseFloat(window.getComputedStyle(HTMLDivElement).height);
            // var bas = haut + hauteur;
            
            if (haut > 85) {
                haut = 85;
            }
            
            ioSocket.emit("deplacementBas", haut);
        }}

        function boucleBille() {
            // bille
            
            var haut;
            var cote;

            // direction de départ
            if (lorr <= 5) {
                console.log('en haut à gauche');
                haut = parseFloat(HTMLDivElement3.style.top) - 0.1;
                cote = parseFloat(HTMLDivElement3.style.left) - 0.1;
                HTMLDivElement3.style.top = haut + "%";
                HTMLDivElement3.style.left = cote + "%";

                // collision bord
                if (parseFloat(HTMLDivElement3.style.top) <= 0 || parseFloat(HTMLDivElement3.style.top) >= 99.5) {
                    lorr = 7;
                }

                // collision barre
                if (parseFloat(HTMLDivElement3.style.left) <= parseFloat(HTMLDivElement.style.left) && parseFloat(HTMLDivElement3.style.top) >= parseFloat(HTMLDivElement.style.top) && parseFloat(HTMLDivElement3.style.top) <= parseFloat(HTMLDivElement.style.top) + 129) {
                    // console.log("rebond gauche");
                    lorr = 12;
                }

                ioSocket.emit("deplacementBille", haut, cote);

                // incrémentation score
                if (parseFloat(HTMLDivElement3.style.left) <= 0) {
                    // console.log("joueur 2 + 1");
                    scoreJ2 += 1;
                    pointJoueur2.innerHTML = scoreJ2;
                    ioSocket.emit("scoreJoueur2", scoreJ2);
                    return reset();
                }

            } else if (lorr > 5 && lorr <= 10) {
                console.log('en bas à gauche');
                haut = parseFloat(HTMLDivElement3.style.top) + 0.1;
                cote = parseFloat(HTMLDivElement3.style.left) - 0.1;
                HTMLDivElement3.style.top = haut + "%";
                HTMLDivElement3.style.left = cote + "%";

                // collision bord
                if (parseFloat(HTMLDivElement3.style.top) <= 0 || parseFloat(HTMLDivElement3.style.top) >= 99.5) {
                    // console.log("je suis la !");
                    lorr = 3;
                }

                // collision barre
                if (parseFloat(HTMLDivElement3.style.left) <= parseFloat(HTMLDivElement.style.left) && parseFloat(HTMLDivElement3.style.top) >= parseFloat(HTMLDivElement.style.top) && parseFloat(HTMLDivElement3.style.top) <= parseFloat(HTMLDivElement.style.top) + 129) {
                    // console.log("rebond gauche");
                    lorr = 17;
                }

                ioSocket.emit("deplacementBille", haut, cote);

                // incrémentation score
                if (parseFloat(HTMLDivElement3.style.left) <= 0) {
                    // console.log("joueur 2 + 1");
                    scoreJ2 += 1;
                    pointJoueur2.innerHTML = scoreJ2;
                    ioSocket.emit("scoreJoueur2", scoreJ2);
                    return reset();
                }

            } else if (lorr > 10 && lorr <= 15) {
                console.log('en haut à droite');

                haut = parseFloat(HTMLDivElement3.style.top) - 0.1;
                cote = parseFloat(HTMLDivElement3.style.left) + 0.1;
                HTMLDivElement3.style.top = haut + "%";
                HTMLDivElement3.style.left = cote + "%";

                // collision bord
                if (parseFloat(HTMLDivElement3.style.top) <= 0 || parseFloat(HTMLDivElement3.style.top) >= 99.5) {
                    // console.log("je suis la !");
                    lorr = 17;
                }

                // collision barre
                if (parseFloat(HTMLDivElement3.style.left) >= parseFloat(HTMLDivElement.style.left) && parseFloat(HTMLDivElement3.style.top) <= parseFloat(HTMLDivElement.style.top) && parseFloat(HTMLDivElement3.style.top) >= parseFloat(HTMLDivElement.style.top) + 129) {
                    // console.log("rebond gauche");
                    lorr = 3;
                }

                ioSocket.emit("deplacementBille", haut, cote);

                // incrémentation score
                if (parseFloat(HTMLDivElement3.style.left) >= 99.5) {
                    // console.log("joueur 2 + 1");
                    scoreJ1 += 1;
                    pointJoueur1.innerHTML = scoreJ1;
                    ioSocket.emit("scoreJoueur1", scoreJ1);
                    return reset();
                }

            } else {
                haut = parseFloat(HTMLDivElement3.style.top) + 0.1;
                cote = parseFloat(HTMLDivElement3.style.left) + 0.1;
                HTMLDivElement3.style.top = haut + "%";
                HTMLDivElement3.style.left = cote + "%";

                // collision bord
                if (parseFloat(HTMLDivElement3.style.top) <= 0 || parseFloat(HTMLDivElement3.style.top) >= 99.5) {
                    // console.log("je suis la !");
                    lorr = 12;
                }

                // collision barre
                if (parseFloat(HTMLDivElement3.style.left) >= parseFloat(HTMLDivElement.style.left) && parseFloat(HTMLDivElement3.style.top) <= parseFloat(HTMLDivElement.style.top) && parseFloat(HTMLDivElement3.style.top) >= parseFloat(HTMLDivElement.style.top) + 129) {
                    // console.log("rebond gauche");
                    lorr = 7;
                }

                ioSocket.emit("deplacementBille", haut, cote);

                // incrémentation score
                if (parseFloat(HTMLDivElement3.style.left) >= 99.5) {
                    // console.log("joueur 2 + 1");
                    scoreJ1 += 1;
                    pointJoueur1.innerHTML = scoreJ1;
                    ioSocket.emit("scoreJoueur1", scoreJ1);
                    return reset();
                }
            }
            window.requestAnimationFrame(boucleBille);
        }

        // reset bille
        function reset() {
            HTMLDivElement3.style.top = 50 + '%';
            HTMLDivElement3.style.left = 49.75 + '%';
            var haut = HTMLDivElement3.style.top;
            var cote = HTMLDivElement3.style.left;
            console.log(haut,cote);
            bool = true;
            lorr = Math.round(Math.random() * 20);
            ioSocket.emit("reset", haut, cote);
        }


        ioSocket.on('deplacementHaut', function (haut) {
            HTMLDivElement.style.top = haut + "%";
        })

        ioSocket.on('deplacementBas', function (haut) {
            HTMLDivElement.style.top = haut + "%";
        })
        ioSocket.on('arrUsers', function (data){
            console.log('data', data);
            // console.log(data[0].ops[0].pseudonyme);
            // console.log(data[1].ops[0].pseudonyme);
        })
        ioSocket.on('deplacementBille', function (haut, cote) {
            HTMLDivElement3.style.top = haut + "%";
            HTMLDivElement3.style.left = cote + "%";
        })
        ioSocket.on('scoreJoueur1', function (scoreJ1) {
            pointJoueur1.innerHTML = scoreJ1;
        })
        ioSocket.on('scoreJoueur2', function (scoreJ2) {
            pointJoueur2.innerHTML = scoreJ2;
        })
        ioSocket.on('reset', function (haut, cote) {
            HTMLDivElement3.style.top = haut;
            HTMLDivElement3.style.left = cote;
        })
    })

    
    // les pseudonymes
    setTimeout(function(){ 
        var text1 = document.getElementsByClassName('joueurName1');
        var textHtml = text1[0].textContent;
        ioSocket.emit("pseudo", textHtml);
        try {
            var text2 = document.getElementsByClassName('joueurName2');
            var textHtml = text2[0].textContent;
            ioSocket.emit("pseudo", textHtml);
            console.log('je suis la');
        } catch (error) {
            console.log('cela ne marche pas');
        }
    }, 1000); 

    ioSocket.on("pseudo", function (tableau) {
        try {
            // var text2 = document.getElementsByClassName('joueurName2');
            // text2 = tableauJoueurs[1];
            console.log(tableau[1]);
        } catch (error) {
            console.log('cela ne marche pas');
        }
    })
  });
})

