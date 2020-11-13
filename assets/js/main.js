// =================================================
// =================================================
// ============ INIT

// ===> Determine some settings of the game
let settings = {
    'version' : 1.4,
    'basicStats' : {
        'health' : 25,
        'healthMax' : 25,
        'strength' : 5,
        'shield' : 0,
        'xp' : 0,
        'xpTo' : 50,
        'level' : 1,
        'floor' : 1,
        'room' : 1,
        'heal' : 0,
        'magic' : 0,
        'escape' : 0,
        'score' : 0,
        'itemLimit' : 5
    },
    'bonusLvl' : {
        'health' : 20,
        'strength' : 2, 
        'shield' : 0, 
    },
    'bonusSpirit' : {
        'health' : 5,
        'strength' : 1,
        'shield' : 1
    },
    'refreshDisplay' : null,
    'mobileDevice' : /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
    'messageDisplay' : 1000,
    'githubLink' : "<a href=\"https://github.com/n-deleforge/game-tower\" target=\"_blank\">GitHub</a>",
    'ndLink' : "<a href=\"https://nicolas-deleforge.fr\" target=\"_blank\">nd</a>"
}

// ===> Correct the bug of the viewport on mobile
if (settings.mobileDevice) get("#container").style.minHeight = window.outerHeight + 'px';

// ===> Create data game or parse it
if (storage("get", "TOWER-gameSettings")) var game = JSON.parse(storage("get", "TOWER-gameSettings"))
else {
    var game = {
        'core' : {
            'ongoing' : false, 
            'name' : null, 
            'sound' : true,
            'version' : 1.3
        },
        'events' : {
            'lastAction' : null,  
            'newAction' : null, 
            'subAction' : null, 
            'monster' : null,
            'currentEvent' : null
        },
        'stats' : {
            'bestScore' : 0,
            'totalGame' : 0,
            'bestFloor' : 0,
            'totalRoom' : 0,
            'maxLevel' : 0,
            'totalExp' : 0,
            'healUsed' : 0,
            'swordKill' : 0,
            'magicKill' : 0,
            'runAway' : 0,
            'healFound' : 0,
            'magicFound': 0,
            'escapeFound' : 0,
            'chestTrap' : 0,
            'chestNotOpened' : 0,
            'fireSpiritMeet' : 0,
            'waterSpiritMeet' : 0,
            'earthSpiritMeet' : 0,
            'windSpiritMeet' : 0,
            'lighSpiritMeet' : 0 
        },
        'character' : {
            'health' : settings.basicStats.health,
            'healthMax' : settings.basicStats.healthMax,
            'strength' : settings.basicStats.strength,
            'shield' : settings.basicStats.shield,
            'xp' : settings.basicStats.xp,
            'xpTo' : settings.basicStats.xpTo,
            'level' : settings.basicStats.level,
            'floor' : settings.basicStats.floor,
            'room' : settings.basicStats.room,
            'heal' : settings.basicStats.heal,
            'magic' : settings.basicStats.magic,
            'escape' : settings.basicStats.escape,
            'score' : settings.basicStats.score,
            'itemLimit' : settings.basicStats.itemLimit,
        },
        'bonusLvl' : {
            'health' : settings.bonusLvl.health,
            'strength' : settings.bonusLvl.strength,
            'shield' : settings.bonusLvl.shield
        }
    }

    storage("set", "TOWER-gameSettings", JSON.stringify(game));
}

// ===> French translation
const FR = {
    'auto' : {
        'title' : "La Tour",

        'headerTitle' : "La Tour",
        'startScreenTitle' : "Bienvenue aventurier",
        'nameHeroLabel' : "Quel est ton nom ?",
        'startGame' : "Entrer",
        'footer' : "Disponible sur " + settings.githubLink + " (v " + settings.version + ")<br />Hébergé sur " + settings.ndLink,

        'move' : "Avancer",
        'useHeal' : "Utiliser une potion",
        'openChest' : "Ouvrir le coffre",
        'closeChest' : "Ne pas l'ouvrir",
        'useAttack' : "Attaque",
        'useMagic' : "Sortilège",
        'useEscape' : "Fuite",

        'optionMenuTitle' : "Paramètres",
        'statsMenuTitle' : "Statistiques",
        'closeStatsMenu' : "Fermer",
        'openStatsMenu' : "Statistiques",
        'closeOptionMenu' : "Fermer",
        'confirmRestart' : "Recommencer la partie",
        'confirmTotalRestart' : "⚠ EFFACER les données",
        'openInfoMenu' : "Plus d'informations",
        'closeInfoMenu' : "Fermer",
        'infoMenuTitle' : "Plus d'informations",
        'infoMenuContent' : `<li>L'application a été réalisée uniquement en Javascript pure, sans aucune librairies externes.</li>
                                         <li>La majorité des ressources (images et sons) proviennent de la librairie de base de RPG Maker MV que je possède. Les icones de statut proviennent d'un pack gratuit sur <a href="https://kyrise.itch.io/kyrises-free-16x16-rpg-icon-pack">Itchio</a>.</li>`
    },
    'stats' : {
        'bestScore' : "Meilleur score : ",
        'totalGame' : "Nombre de parties : ",
        'bestFloor' : "Étage atteint le plus haut : ",
        'totalRoom' : "Nombre de salle parcourue : ",
        'maxLevel' : "Niveau d'expérience le plus haut : ",
        'totalExp' : "Total de points d'expérience : ",
        'healUsed' : "Nombre de potion utilisé : ",
        'swordKill' : "Monstre vaincu avec une épée : ",
        'magicKill' : "Monstre vaincu avec la magie : ",
        'runAway' : "Fuite de combat : ",
        'healFound' : "Coffre - potions trouvée : ",
        'magicFound': "Coffre - sortilège trouvé : ",
        'escapeFound' : "Coffre - parchemin trouvé : ",
        'chestTrap' : "Coffre - piège : ",
        'chestNotOpened' : "Coffre - non ouverts : ",
        'fireSpiritMeet' : "Esprit rencontré - feu : ",
        'waterSpiritMeet' : "Esprit rencontré - eau : ",
        'earthSpiritMeet' : "Esprit rencontré - terre : ",
        'windSpiritMeet' : "Esprit rencontré - vent : ",
        'lighSpiritMeet' : "Esprit rencontré - lumière : ",
    },
    'app' : {
        'nameHeroCheck' : "Votre nom doit être composé de 2 à 15 lettres",

        'health' : "Santé",
        'experience' : "Exp.",
        'level' : "niv.",
        'score' : "Score",
        'strength' : "Force",
        'shield' : "Bouclier",
        'floor' : "Étage",
        'room' : "Salle",
        'heal_singular' : "Potion",
        'heal_plural' : "Potions",
        'magic_singular' : "Sort",
        'magic_plural' : "Sorts",
        'escape_singular' : "Parchemin",
        'escape_plural' : "Parchemins",
        'point_singular' : "point",
        'point_plural' : "points",
        'hit_singular' : "coup",
        'hit_plural' : "coups",

        'levelUp_part1' : "Votre niveau augmente",
        'levelUp_part2' : "Votre santé est regénérée et vos statistiques augmentent",

        'healing' : "Vous avez utilisé une potion, vous regagnez toute votre santé",

        'noEvent' : "Vous traversez tranquillement de longs couloirs",

        'spiritEarth_part1' : "Un <strong>esprit de la terre</strong> vous protège",
        'spiritEarth_part2' : "Votre bouclier augmente de ",

        'spiritWind' : "Un <strong>esprit du vent</strong> virevolte autour de vous",
        'spiritWind_noStealing' : "Et s'enfuit",
        'spiritWind_healStealing' : "Il dérobe une <strong>potion de soin</strong>",
        'spiritWind_magicStealing' : "Il dérobe un <strong>sort magique</strong>",
        'spiritWind_escapeStealing' : "Il dérobe un <strong>parchemin de fuite</strong>",

        'spiritLight_part1' : "Un <strong>esprit de lumière</strong> se rapproche de vous",
        'spiritLight_part2' : "Vous gagnez ",
        'spiritLight_part3' : " d'expérience",

        'spiritFire_part1' : "Un <strong>esprit de feu</strong> partage son énergie",
        'spiritFire_part2' : "Votre force augmente de ",

        'spiritWater_part1' : "Un <strong>esprit d'eau</strong> partage sa vitalité",
        'spiritWater_part2' : "Votre santé augmente de ",

        'chest' : "Vous avez trouvé un <strong>coffre</strong>",
        'chest_notOpened' : "Mais vous décidez de ne pas l'ouvrir",
        'chestTrap_part1' : "Mais c'est un <strong>piège</strong>, le coffre vous attaque",
        'chestTrap_part2' : "Vous perdez ",
        'chestTrap_part3' : " de santé",
        'chestEscape' : "Vous trouvez un <strong>parchemin de fuite</strong>",
        'chestMagic' : "Vous trouvez un <strong>sort magique</strong>",
        'chestHeal' : "Vous trouvez une <strong>potion de soin</strong>",
        'chestLimit' : "Mais vous n'avez plus assez de place",

        'fightStart' : "apparaît !",
        'fightWin_part1' : " vaincu en ",
        'fightWin_part2' : "Vous avez perdu ",
        'fightWin_part3' : " de santé",
        'fightWin_part4' : " d'expérience",
        'fightWin_part5' : "Vous avez gagné ",
        'fightMagic' : "Vous avez vaincu le monstre grâce à un sort magique",
        'fightEscape' : "Vous vous échappez grâce au parchemin de fuite",

        'bossFight_start' : "Un adversaire puissant vous barre la route",
        'bossFight_win' : "L'adversaire puissant vaincu en ",
        'bossFight_magic' : "Vous avez vaincu l'adversaire puissant grâce à un sort magique",

        'death' : "Vous tombez de fatigue ...",
        'results' : "Voir les résultats",
        'gameover' : "La partie est terminée.<br />Vous avez obtenu un score de : ",
        'gameoverButton' : "Recommencer",
        'shareScore_part1' : "Wahou! Je viens de faire un score de ",
        'shareScore_part2' : " points dans La Tour !",
        'shareScore_button' : "Partager",

        'initialContent' : `<div id="containerImage"><img src="assets/images/special/sign.png" alt=""></div>
                                    <p>Une vieille pancarte. La plupart des mots sont effacés par le temps.</p>
                                    <em>"Celui qui ... le sommet pourra ... l'un de ses ... ! ... le danger, restez en ... et grimpez le ... haut ..."</em>
                                    <p>Vous continuez votre chemin d'un pas déterminé.</p>`
    },
    'monsters' : {
        'dragon' : "Dragon légendaire",
        'supDemon' : "Démon supérieur",
        'bigSpirit' : "Esprit errant",
        'deadWarrior' : "Guerrier mort-vivant",
        'troll' : "Chef-troll",
        'behemot' : "Béhémot",
        'minotaur' : "Minotaure",
        'cerberus' : "Cerbère",
        'goblin' : "Gobelin",
        'ghost' : "Fantôme",
        'cockatrice' : "Basilic",
        'lamia' : "Lamia",
        'imp' : "Diablotin",
        'plant' : "Plante venimeuse",
        'scorpio' : "Grand scorpion",
        'spider' : "Araignée géante",
        'slim' : "Blob"
    },
    'tips' : [
        "Lorsque la santé du héros tombe à 0, la partie est terminée. Cependant, un gain de niveau ou une potion restaure la totalité des points de santé.",
        "Chaque monstre nécessite un nombre de coups pour être vaincu qui est calculé de la manière suivante : <em>\"santé du monstre divisé par la force du héros\"</em>",
        "Les dégâts d'un monstre sont calculés selon la formule suivante : <em>\"(nombre de coups pour être vaincu multiplié par la force du monstre) moins le bouclier du héros\"</em>",
        "Vaincre un monstre avec un sort rapporte seulement 50% de points d'expérience mais peut éviter une morte certaine ou de très gros dégâts.",
        "Les combats se déroulent automatiquement alors veillez à bien choisir votre action de jeu. La fuite peut être une bonne solution pour rester en vie.",
        "La statistique de bouclier permet de réduire les dégâts lors d'une attaque dans un combat. Elle peut être uniquement augmentée par l'esprit de la terre.",    
        "La Tour est peuplée de divers esprits. La plupart d'entre eux vous aideront grandement lors de votre quête, néanmoins certains peuvent être aggressifs.",
        "Lorsque vous ouvrez un coffre, vous avez une chance de tomber sur un monstre qui vous infligera des dégâts qui ignorent votre statistique de bouclier.",
        "La Tour est divisé par étages. Chaque étage est lui-même composé de 10 salles. A chaque étage, les monstres deviennent plus puissants.",
        "Pour les plus curieux, le score de fin de partie est calculé selon la formule suivante : <em>\"((bouclier + force + santé maximale) * niveau) * étage\"</em>",
        "Un combat contre un adversaire puissant est plus compliqué. Vous ne pouvez pas fuir et il est nécessaire de posséder au moins 3 sorts pour gagner grâce au sortillège.",
        "En début de partie, chaque objet que vous pouvez récupérer est limité à une certaine quantité. Par la suite, vous pourrez en garder devantage. "
    ]
}

// ===> English translation
const EN = {
    'auto' : {
        'title' : "The Tower",

        'headerTitle' : "The Tower",
        'startScreenTitle' : "Welcome adventurer",
        'nameHeroLabel' : "What's your name ?",
        'startGame' : "Enter",
        'footer' : "Soon available on " + settings.githubLink + " (v " + settings.version + ")<br />Hosted on  " + settings.ndLink,

        'move' : "Move",
        'useHeal' : "Use a potion",
        'openChest' : "Open the chest",
        'closeChest' : "Do not open",
        'useAttack' : "Attack",
        'useMagic' : "Spell",
        'useEscape' : "Escape",

        'optionMenuTitle' : "Settings",
        'statsMenuTitle' : "Statistics",
        'closeStatsMenu' : "Close",
        'openStatsMenu' : "Statistics",
        'closeOptionMenu' : "Close",
        'confirmRestart' : "Restart the game",
        'confirmTotalRestart' : "⚠ DELETE all data",
        'openInfoMenu' : "More informations",
        'closeInfoMenu' : "Close",
        'infoMenuTitle' : "More informations",
        'infoMenuContent' : `<li>The application has been realized only with pure Javascript, no external libraries has been used.</li>
                                         <li>The majority of the resources (images and sounds) are from the basic library of RPG Maker MV that I own. The icons of the top bar are from a free pack on <a href="https://kyrise.itch.io/kyrises-free-16x16-rpg-icon-pack">Itchio</a>.</li>`
    },
    'stats' : {
        'bestScore' : "Best score : ",
        'totalGame' : "Number of games : ",
        'bestFloor' : "Highest floor : ",
        'totalRoom' : "Number of rooms : ",
        'maxLevel' : "Highest exp. level : ",
        'totalExp' : "Total exp. point : ",
        'healUsed' : "Potion used : ",
        'swordKill' : "Monsters defeated with a sword : ",
        'magicKill' : "Monsters defeated with magic  : ",
        'runAway' : "Fight escaped: ",
        'healFound' : "Chest - potion found : ",
        'magicFound': "Chest - spell found : ",
        'escapeFound' : "Chest - scroll found : ",
        'chestTrap' : "Chest - trap : ",
        'chestNotOpened' : "Chest - not opened : ",
        'fireSpiritMeet' : "Spirit meet - fire : ",
        'waterSpiritMeet' : "Spirit meet - water : ",
        'earthSpiritMeet' : "Spirit meet - earth : ",
        'windSpiritMeet' : "Spirit meet - wind : ",
        'lighSpiritMeet' : "Spirit meet - light : ",
    },
    'app' : {
        'nameHeroCheck' : "Your name must be composed between 2 to 15 letters.",

        'health' : "Health",
        'experience' : "Exp.",
        'level' : "lvl",
        'score' : "Score",
        'strength' : "Strength",
        'shield' : "Shield",
        'floor' : "Floor",
        'room' : "Room",
        'heal_singular' : "Potion",
        'heal_plural' : "Potions",
        'magic_singular' : "Spell",
        'magic_plural' : "Spells",
        'escape_singular' : "Scroll",
        'escape_plural' : "Scrolls",
        'point_singular' : "point",
        'point_plural' : "points",
        'hit_singular' : "hit",
        'hit_plural' : "hits",

        'levelUp_part1' : "Level up",
        'levelUp_part2' : "Your health is regenerated and your stats increase",

        'healing' : "You use a potion, you regain all your health",

        'noEvent' : "You walk quietly through long corridors",

        'spiritEarth_part1' : "A <strong>earth spirit</strong> protects you",
        'spiritEarth_part2' : "Your shield increases by ",

        'spiritWind' : "A <strong>wind spirit</strong> flies around you",
        'spiritWind_noStealing' : "And fled",
        'spiritWind_healStealing' : "He steals a <strong>healing potion</strong>",
        'spiritWind_magicStealing' : "He steals a <strong>magic spell</strong>",
        'spiritWind_escapeStealing' : "He steals a <strong>escape scroll</strong>",

        'spiritLight_part1' : "A <strong>light spirit</strong> draws near to you",
        'spiritLight_part2' : "You win ",
        'spiritLight_part3' : " of experience",

        'spiritFire_part1' : "A <strong>fire spirit</strong> shares its energy",
        'spiritFire_part2' : "Your strength increases by ",

        'spiritWater_part1' : "A <strong>water spirit</strong> shares its vitality",
        'spiritWater_part2' : "Your health increases by ",

        'chest' : "You have found a <strong>chest</strong>",
        'chest_notOpened' : "But you decide not to open it",
        'chestTrap_part1' : "But it's a <strong>trap</strong>, the chest attacks you",
        'chestTrap_part2' : "You lost ",
        'chestTrap_part3' : " of health",
        'chestEscape' : "You find a <strong>escape scroll</strong>",
        'chestMagic' : "You find a <strong>magic spell</strong>",
        'chestHeal' : "You find a <strong>healing potion</strong>",
        'chestLimit' : "But you don't have enough room",

        'fightStart' : "appears !",
        'fightWin_part1' : " defeated with ",
        'fightWin_part2' : "You have lost ",
        'fightWin_part3' : " of health",
        'fightWin_part4' : " of experience",
        'fightWin_part5' : "You have won ",
        'fightMagic' : "You have defeated the monster with a magic spell",
        'fightEscape' : "You escape thanks to the escape scroll",

        'bossFight_start' : "A powerful opponent stands in your way",
        'bossFight_win' : "The mighty opponent defeated in ",
        'bossFight_magic' : "You defeated the mighty opponent with a magic spell",

        'death' : "You're very tired ...",
        'results' : "See the results",
        'gameover' : "The game is over.<br />You got a score of: ",
        'gameoverButton' : "Restart",
        'shareScore_part1' : "Wow! I just made a score of ",
        'shareScore_part2' : " points in The Tower!",
        'shareScore_button' : "Share",

        'initialContent': `<div id ="containerImage"><img src="assets/images/special/sign.png" alt =""></div>
                                <p>An old sign. Most of the words are erased by time.</p>
                                <em>"Whoever ... the top may ... one of its ...! ... danger, stay in ... and climb the ... top ..."</em>
                                <p>You continue your journey with a determined step.</p> `
        },
    'monsters' : {
        'dragon' : "Legendary dragon",
        'supDemon' : "Superior demon",
        'bigSpirit' : "Wandering spirit",
        'deadWarrior' : "Undead warrior",
        'troll' : "Chief troll",
        'behemot' : "Behemot",
        'minotaur' : "Minotaur",
        'cerberus' : "Cerberus",
        'goblin' : "Goblin",
        'ghost' : "Ghost",
        'cockatrice' : "Cockatrice",
        'lamia' : "Lamia",
        'imp' : "Imp",
        'plant' : "Poisonous plant",
        'scorpio' : "Big scorpion",
        'spider' : "Giant spider",
        'slim' : "Blob"
    },
    'tips' : [
        "When the hero's health drops to 0, the game is over. However, leveling up or a potion restores all health points.",
        "Each monster requires a number of hits to be defeated which is calculated as follows: <em>\" monster health divided by hero strength \"</em>",
        "The damage of a monster is calculated according to the following formula: <em>\" (number of hits to be defeated multiplied by the strength of the monster) minus the hero's shield \"</em>",
        "Defeating a monster with a spell only grants 50% experience points but can prevent certain death or very large damage.",
        "The fights take place automatically so be sure to choose your game action. Escape can be a good way to stay alive.",
        "The shield stat is used to reduce damage when attacked in combat. It can only be increased by the spirit of the earth.",
        "The Tower is populated by various spirits. Most of them will help you greatly on your quest, however some can be aggressive.",
        "When you open a chest, you have a chance to stumble upon a monster that will deal damage to you that ignores your shield stat.",
        "The Tower is divided by floors. Each floor itself is made up of 10 rooms. On each floor, the monsters become more powerful.",
        "For the more curious, the end-of-game score is calculated according to the following formula: <em>\" ((shield + strength + maximum health) * level) * floor \"</em>",
        "A fight against a powerful opponent is more complicated. You cannot flee and it is necessary to have at least 3 spells to win thanks to the spell.",
        "At the start of the game, each item you can collect is limited to a certain quantity. Later, you can keep more."
    ]
}

// ===> Determine language of the app
if (navigator.language == "fr" || navigator.language == "fr-FR" || navigator.language == "FR-fr") {
    get("#htmlTag").lang = "fr";
    language = FR;
}
else {
    get("#htmlTag").lang = "en";
    language = EN;
}

// ===> Automatically display all the "language.auto" object
for(let i = 0; i < Object.keys(language).length - 4; i++) { 
    let allData = language[Object.keys(language)[i]];
    let idName = Object.keys(allData);
    let values = Object.values(allData);
    for (let j = 0; j < idName.length; j++) get("#" + idName[j]).innerHTML = values[j];
}

// =================================================
// =================================================
// ============ MAIN

// ===> Fisrt start a new game or load game
if (game.core.ongoing == false) {
    get('#startScreen').style.display = "flex";
    get('#displayTip').innerHTML = randomTip();
    
    // Check if the name is registred
    if (game.core.name != null && game.core.name != "") get("#nameHero").value = game.core.name
    else {
        get("#nameHero").value = "";
        get('#nameHero').focus();
    }

    // Check of the regex and start of the game
    get("#startGame").addEventListener("click", function () {
        if (!get("#nameHero").checkValidity() || get("#nameHero").value == "") {
            get("#nameHeroLabel").innerHTML = language.app.nameHeroCheck;
            get("#nameHeroLabel").style.color = "red";
        }
        else startGame("new");
    });
} 
else startGame("load");

// ===> Display game and add listeners
function startGame(mode) {
    // Display the correct container and the boutons
    get('#startScreen').style.display = "none";
    get('#gameScreen').style.display = "flex";
    changeDisplay("classic");

    // Display all the character data and add an interval of refresh
    displayGame();
    settings.refreshDisplay = setInterval(displayGame, 100);

    // Check the option and volume button
    get("#optionButton").style.visibility = "visible";
    get("#volumeButton").style.visibility = "visible";
    get("#volumeButton").addEventListener("click", checkSound);
    if (game.core.sound == true) get("#volumeButton").innerHTML = "🔊";
    else get("#volumeButton").innerHTML = "🔈";

    // Add listener for the menu - settings
    get("#optionButton").addEventListener("click", function() {
        get("#containerPopup").style.display = "flex";
        get("#optionMenu").style.display = "block";
        get('#closeOptionMenu').addEventListener("click", function() {
            get("#containerPopup").style.display = "none";
            get("#optionMenu").style.display = "none";
        });
    });

    // Add listener for the menu - stats
    get("#openStatsMenu").addEventListener("click", function () {
        let titles = Object.values(language.stats);
        let values = Object.values(game.stats);

        for (let i = 0; i < titles.length; i++) {
            if (i == 0) get('#listStats').innerHTML = "<li>" + titles[i] + values[i] + "</li>"
            else get('#listStats').innerHTML += "<li>" + titles[i] + values[i] + "</li>"
        }

        get("#optionMenu").style.display = "none";
        get("#statsMenu").style.display = "block";
        get('#closeStatsMenu').addEventListener("click", function () {
            get("#containerPopup").style.display = "none";
            get("#statsMenu").style.display = "none";
        });
    });

    // Add listener for the menu - credits
    get("#openInfoMenu").addEventListener("click", function() {
        get("#optionMenu").style.display = "none";
        get("#infoMenu").style.display = "block";
        get('#closeInfoMenu').addEventListener("click", function() {
            get("#containerPopup").style.display = "none";
            get("#infoMenu").style.display = "none";
            });
    });

    // Add listener for the menu - restart
    get('#confirmRestart').addEventListener("click", function() {
        clearInterval(settings.refreshDisplay);
        game.core.ongoing = false;
        resetData();
        location.reload();
    });

    // Add listener for the menu - total restart
    get('#confirmTotalRestart').addEventListener("click", function () {
        clearInterval(settings.refreshDisplay);
        storage("rem", "TOWER-gameSettings");
        location.reload();
    });

    // Add listener for the list actions
    get("#move").addEventListener("click", play);
    get("#useHeal").addEventListener("click", heal);
    get("#openChest").addEventListener("click", openChest);
    get("#closeChest").addEventListener("click", closeChest);
    get("#useAttack").addEventListener("click", attack);
    get("#useMagic").addEventListener("click", magic);
    get("#useEscape").addEventListener("click", runAway);

    // If it's a new game
    if (mode == "new") {
        get('#gameContent').innerHTML = language.app.initialContent;
        game.core.name = get("#nameHero").value;
        if (game.core.sound == true) get("#soundRoom").play();
    } 
    
    // If it's not a new game
    if (mode == "load") {
        get('#gameContent').innerHTML = game.events.currentEvent;
        if (game.events.lastAction == "fight" && game.events.subAction != "fightOver") changeDisplay("gameToFight"); // If it's a fight
        if (game.events.lastAction == "bossFight" && game.events.subAction != "fightOver") changeDisplay("gameToBossFight"); // If it's a boss ight
        if (game.events.lastAction == "chest" && game.events.subAction != "chestOver") changeDisplay("gameToChest"); // If it's a chest event
    }
}

// ===> Main function
function play() {
    game.core.ongoing = true; // the game is on going
    game.events.subAction = null; // reset of the sub action
    game.character.room++;

    changeDisplay("displayMessage");

    // At the 10th room
    if (game.character.room > 10) {
        if (game.core.sound == true) get("#soundFloor").play();
        settings.messageDisplay = 2000;
        game.character.room = 1; 
        game.character.floor++; 
        if (game.character.floor > game.stats.bestFloor) game.stats.bestFloor = game.character.floor;

        get("#gameMessage").innerHTML = "<p class=\"bigger\">" + language.app.floor + ' ' + game.character.floor + "</p>";
    } 
    // All rooms expect the 10th
    else { 
        if (game.core.sound == true) get("#soundRoom").play();
        settings.messageDisplay = 1000;
        game.stats.totalRoom++;

        get("#gameMessage").innerHTML = "<p class=\"bigger\">" + language.app.floor + ' ' + parseInt(game.character.floor) + "</p>";
        get("#gameMessage").innerHTML += "<p>" + language.app.room + ' ' + game.character.room + "</p>";
    }

    setTimeout(function () {
        changeDisplay("hideMessage");
    },  settings.messageDisplay);

    // Boss & special events
    if(game.character.floor == 8  && game.character.room == 10) specialEvt("evtBoss")
    else if(game.character.floor == 11 && game.character.room == 10) specialEvt("evtBoss")
    else if(game.character.floor == 14 && game.character.room == 10) specialEvt("evtBoss")
    else if(game.character.floor == 17 && game.character.room == 10) specialEvt("evtBoss")
    else if(game.character.floor == 20 && game.character.room == 10) specialEvt("evtBoss")
    else if(game.character.floor == 23 && game.character.room == 10) specialEvt("evtBoss")
    else if(game.character.floor == 26 && game.character.room == 10) specialEvt("evtBoss")
    else if(game.character.floor == 29 && game.character.room == 10) specialEvt("evtBoss")
    else if(game.character.floor == 32 && game.character.room == 10) specialEvt("evtBoss")
    else if(game.character.floor == 35 && game.character.room == 10) specialEvt("evtBoss")
    else if(game.character.floor == 38 && game.character.room == 10) specialEvt("evtBoss")
    else if(game.character.floor == 41 && game.character.room == 10) specialEvt("evtBoss")
    else if(game.character.floor == 43 && game.character.room == 10) specialEvt("evtBoss")
    else if(game.character.floor == 46 && game.character.room == 10) specialEvt("evtBoss")
    else if(game.character.floor == 49 && game.character.room == 10) specialEvt("evtBoss")
    else if(game.character.floor == 52 && game.character.room == 10) specialEvt("evtBoss")
    else if(game.character.floor == 55 && game.character.room == 10) specialEvt("evtBoss")

    // Classic events
    else choiceAction();
}

// =================================================
// =================================================
// ============ SPECIAL EVENTS

// ===> Choose a game action
function choiceAction() {
    let nb = nbRandom(1, 9);

    // 8-9 : meet with a spirit or chest
    if (nb > 7) {
        game.events.newAction = "spirit";
        if (game.events.newAction != game.events.lastAction) spirit();
        else choiceAction();
    } 
    
    // 5-7 : fight or no event
    else if (nb > 4) { 
        game.events.newAction = "fight";
        if (game.events.newAction != game.events.lastAction) fight();
        else choiceAction();
    } 
    
    // 3-4 : chest or meet spirit
    else if (nb > 2) { 
        game.events.newAction = "chest";
        if (game.events.newAction != game.events.lastAction) chest();
        else choiceAction();
    } 
    
    // 1-2 : no event or fight
    else { 
        game.events.newAction = "noEvent";
        if (game.events.newAction != game.events.lastAction) noEvent();
        else choiceAction();
    }
}

// ===> Choose a special event
function specialEvt(evt) {
    game.events.lastAction = "special";

    // Boss events
    if (evt == "evtBoss") {
        if (game.core.sound == true) get("#soundBossFight").play();
        fight("bossFight")
    }

    // Special events
    // else {

    // }

    saveContent();
}

// =================================================
// =================================================
// ============ SIMPLE EVENTS

// ===> Using a potion
function heal() {
    if (game.character.heal > 0 && game.character.health < game.character.healthMax) {
        if (game.core.sound == true) get("#soundHeal").play();
        game.character.heal --;
        game.character.health = game.character.healthMax;
        game.stats.healUsed++;

        get("#gameContent").innerHTML += '<hr><p class="green">' + language.app.healing + '</p>';

        saveContent();
    }
}

// ===> When there is no event
function noEvent() {
    game.events.lastAction = "noEvent";

    get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/events/noEvent.png" alt=""></div><p>' + language.app.noEvent + '.</p>';
    
    saveContent();
}

// ===> When meeting a spirit
function spirit() {
    game.events.lastAction = "spirit";
    let nb = nbRandom(1, 10)

    // 9-10 : Earth spirit
    if (nb > 8) { 
        game.stats.earthSpiritMeet++;
        game.character.shield = game.character.shield + settings.bonusSpirit.shield;

        get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/events/spiritEarth.png" alt=""></div>';
        get("#gameContent").innerHTML += '<p>' +language.app.spiritEarth_part1 + '.</p>';
        get("#gameContent").innerHTML += '<p class="green">' + language.app.spiritEarth_part2 + ' <strong>' + settings.bonusSpirit.shield + '</strong> ' + singularPlural(settings.bonusSpirit.shield, language.app.point_singular, language.app.point_plural) + '.</p>';
    } 
    
    // 7-8 : Wind spirit
    else if (nb > 6) { 
        game.stats.windSpiritMeet++;

        get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/events/spiritWind.png" alt=""></div>';
        get("#gameContent").innerHTML += '<p>' + language.app.spiritWind + '.</p>';

       let item = nbRandom(1, 3);

        switch (item) {
            // Heal stealing
            case 1:
                if (game.character.heal != 0) {
                    game.character.heal--;
                    get("#gameContent").innerHTML += '<p class="red">' + language.app.spiritWind_healStealing + '.</p>';
                } 
                else get("#gameContent").innerHTML += '<p>' + language.app.spiritWind_noStealing + '.</p>';
                break;

            // Magic stealing
            case 2:
                if (game.character.magic != 0) {
                    game.character.magic--;
                    get("#gameContent").innerHTML += '<p class="red">' + language.app.spiritWind_magicStealing + '.</p>';
                } 
                else get("#gameContent").innerHTML += '<p>' + language.app.spiritWind_noStealing + '.</p>';
                break;

            // Escape stealing
            case 3:
                if (game.character.escape != 0) {
                    game.character.escape--;
                    get("#gameContent").innerHTML += '<p class="red">' + language.app.spiritWind_escapeStealing + '.</p>';
                } 
                else get("#gameContent").innerHTML += '<p>' + language.app.spiritWind_noStealing + '.</p>';
                break;
        }
    }

    // 5-6 : Light spirit
    else if (nb > 4) { 
        game.stats.lighSpiritMeet++;
        let xp = nbRandom(parseInt(game.character.xpTo / 8), parseInt(game.character.xpTo / 6));
        game.character.xp = game.character.xp + xp;

        get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/events/spiritLight.png" alt=""></div>';
        get("#gameContent").innerHTML += '<p>' + language.app.spiritLight_part1 + '.</p>';
        get("#gameContent").innerHTML += '<p class="green">' + language.app.spiritLight_part2 + '<strong>' + xp + '</strong> ' + singularPlural(xp, language.app.point_singular, language.app.point_plural) + language.app.spiritLight_part3 + '.</p>';
    } 

    // 3-4 : Fire spirit
    else if (nb > 2) { 
        game.stats.fireSpiritMeet++;
        game.character.strength = game.character.strength + settings.bonusSpirit.strength;

        get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/events/spiritFire.png" alt=""></div>';
        get("#gameContent").innerHTML += '<p>' +language.app.spiritFire_part1 + '.</p>';
        get("#gameContent").innerHTML += '<p class="green">' + language.app.spiritFire_part2 + ' <strong>' + settings.bonusSpirit.strength + '</strong> ' + singularPlural(settings.bonusSpirit.strength, language.app.point_singular, language.app.point_plural) + '.</p>';
    } 

    // 1-2 : Water spirit
    else { 
        game.stats.waterSpiritMeet++;
        game.character.healthMax = game.character.healthMax + settings.bonusSpirit.health;

        get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/events/spiritWater.png" alt=""></div>';
        get("#gameContent").innerHTML += '<p>' + language.app.spiritWater_part1 + '.</p>';
        get("#gameContent").innerHTML += '<p class="green">' + language.app.spiritWater_part2 + ' <strong>' + settings.bonusSpirit.health + '</strong> ' + singularPlural(settings.bonusSpirit.health, language.app.point_singular, language.app.point_plural) + '.</p>';
    }

    saveContent();
}

// =================================================
// =================================================
// ============ CHEST EVENTS

// ===> When finding a chest
function chest() {
    game.events.lastAction = "chest";
    changeDisplay("gameToChest");

    get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/events/chest.png" alt=""></div>';
    get("#gameContent").innerHTML += '<p>' + language.app.chest + ' !</p>';

    saveContent();
}

// ===> When opening a chest
function openChest() {
    if (game.core.sound == true) get("#soundChest").play();
    game.events.subAction = "chestOver";
    changeDisplay("chestToGame");
    let nb = nbRandom(0, 10);
    let limited = false;

    // 8 - 10 : trap chest
    if (nb > 7) { 
        game.stats.chestTrap++;
        let damage = nbRandom(1, game.character.health / 4);
        game.character.health = game.character.health - damage;

        get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/events/chestTrap.png" alt=""></div>';
        get("#gameContent").innerHTML += '<p>' + language.app.chestTrap_part1 + ' !</p>';
        get("#gameContent").innerHTML += '<p class="red">' + language.app.chestTrap_part2 + '<strong>' + damage + '</strong> ' + singularPlural(damage, language.app.point_singular, language.app.point_plural) + language.app.chestTrap_part3 + '.</p>';
    } 

    // 6 - 7 : escape item
    else if (nb > 5) { 
        game.stats.escapeFound++;
        if (game.character.itemLimit > game.character.escape) game.character.escape++;
        else limited = true;

        get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/events/chestEscape.png" alt=""></div>';
        get("#gameContent").innerHTML += '<p>' + language.app.chestEscape +  '.</p>';

        if (limited) get("#gameContent").innerHTML += '<p>' + language.app.chestLimit + '.</p>';
    } 

     // 4 - 5 : magic item
    else if (nb > 3) {
        game.stats.magicFound++;
        if (game.character.itemLimit > game.character.magic) game.character.magic++;
        else limited = true;

        get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/events/chestMagic.png" alt=""></div>';
        get("#gameContent").innerHTML += '<p>' + language.app.chestMagic + '.</p>';

        if (limited) get("#gameContent").innerHTML += '<p>' + language.app.chestLimit + '.</p>';
    } 

    // 1 - 3 : heal item
    else { 
        game.stats.healFound++;
        if (game.character.itemLimit > game.character.heal) game.character.heal++
        else limited = true;

        get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/events/chestHeal.png" alt=""></div>';
        get("#gameContent").innerHTML += '<p>' + language.app.chestHeal + '.</p>';

        if (limited) get("#gameContent").innerHTML += '<p>' + language.app.chestLimit + '.</p>';
    }

    saveContent();
}

// ===> When avoiding a chest
function closeChest() {
    game.stats.chestNotOpened++;
    game.events.subAction = "chestOver";
    changeDisplay("chestToGame");

    get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/events/chest.png" alt=""></div>';
    get("#gameContent").innerHTML += '<p>' + language.app.chest + ' !</p>';
    get("#gameContent").innerHTML += '<p>' + language.app.chest_notOpened + '.</p>';

    saveContent();
}

// =================================================
// =================================================
// ============ FIGHT EVENTS

// ===> When a fight start
function fight(mode) {
    if (mode == "bossFight") game.events.lastAction = "bossFight";
    else game.events.lastAction = "fight";
    game.events.monster = choiceMonster();

    if (mode == "bossFight") changeDisplay("gameToBossFight");
    else changeDisplay("gameToFight");

    get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/monsters/' + game.events.monster[3] + '.png" alt="' + game.events.monster[2] + '"></div>';
    
    if (mode == "bossFight") get("#gameContent").innerHTML += '<p>' + language.app.bossFight_start + ' !</p>';
    else get("#gameContent").innerHTML += '<p><strong>' + game.events.monster[2] + '</strong> ' + language.app.fightStart + '</p>';
    
    get("#gameContent").innerHTML += '<p>' + language.app.health + ' : <strong>' + game.events.monster[0] + '</strong> / ' + language.app.strength + ' : <strong>'  + game.events.monster[1] + '</strong></p>';
    
    saveContent();
}

// ===> Choose a monster
function choiceMonster() {
    if(game.events.lastAction == "bossFight") monsterLevel = nbRandom(game.character.floor * 10, game.character.floor * 15)
    else monsterLevel = nbRandom(game.character.floor * 2, game.character.floor * 4)

    if (monsterLevel > 800) return [monsterLevel, parseInt(monsterLevel / 3), language.monsters.dragon, "monster_17"];
    if (monsterLevel > 600) return [monsterLevel, parseInt(monsterLevel / 3), language.monsters.supDemon, "monster_16"];
    if (monsterLevel > 450) return [monsterLevel, parseInt(monsterLevel / 3), language.monsters.bigSpirit, "monster_15"];
    if (monsterLevel > 350) return [monsterLevel, parseInt(monsterLevel / 3), language.monsters.deadWarrior, "monster_14"];
    if (monsterLevel > 300) return [monsterLevel, parseInt(monsterLevel / 3), language.monsters.troll, "monster_13"];
    if (monsterLevel > 250) return [monsterLevel, parseInt(monsterLevel / 3), language.monsters.behemot, "monster_12"];
    if (monsterLevel > 200) return [monsterLevel, parseInt(monsterLevel / 3), language.monsters.minotaur, "monster_11"];
    if (monsterLevel > 160) return [monsterLevel, parseInt(monsterLevel / 3), language.monsters.cerberus, "monster_10"];
    if (monsterLevel > 130) return [monsterLevel, parseInt(monsterLevel / 3), language.monsters.goblin, "monster_09"];
    if (monsterLevel > 100) return [monsterLevel, parseInt(monsterLevel / 3), language.monsters.ghost, "monster_08"];
    if (monsterLevel > 75) return [monsterLevel, parseInt(monsterLevel / 3), language.monsters.cockatrice, "monster_07"];
    if (monsterLevel > 50) return [monsterLevel, parseInt(monsterLevel / 3), language.monsters.lamia, "monster_06"];
    if (monsterLevel > 40) return [monsterLevel, parseInt(monsterLevel / 3), language.monsters.imp, "monster_05"];
    if (monsterLevel > 30) return [monsterLevel, parseInt(monsterLevel / 3), language.monsters.plant, "monster_04"];
    if (monsterLevel > 20) return [monsterLevel, parseInt(monsterLevel / 3), language.monsters.scorpio, "monster_03"];
    if (monsterLevel > 10) return [monsterLevel, parseInt(monsterLevel / 3), language.monsters.spider, "monster_02"];
    return [monsterLevel, parseInt(monsterLevel / 3), language.monsters.slim, "monster_01"];
}

// ===> When attacking a monster
function attack() {
    if (game.core.sound == true) get("#soundAttack").play();
    game.stats.swordKill++;
    game.events.subAction = "fightOver";
    changeDisplay("fightToGame");

    // Damage
    let nbHit = Math.ceil(game.events.monster[0] / game.character.strength);
    let damage = parseInt(nbHit * game.events.monster[1] - parseInt(game.events.monster[1]) / nbHit) - game.character.shield; 
    if (nbHit == 1) damage = 0;
    if (damage < 0) damage = 0;
    game.character.health = game.character.health - damage;

    // XP
    let xp= nbRandom(game.character.level * (game.events.monster[0]), game.character.level * game.events.monster[0] * 2);
    if (game.events.lastAction == "bossFight") game.character.xp = game.character.xp + (xp * 5); 
    else game.character.xp = game.character.xp + xp;
    game.stats.totalExp = game.stats.totalExp + xp;

    get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/monsters/' + game.events.monster[3] + '.png" alt="' + game.events.monster[2] + '"></div>';
    
    if (game.events.lastAction == "bossFight") get("#gameContent").innerHTML += '<p>' + language.app.bossFightWin + '<strong>' + nbHit+ '</strong> ' + singularPlural(nbHit, language.app.hit_singular, language.app.hit_plural) + ' !</p>';
    else get("#gameContent").innerHTML += '<p><strong>' + game.events.monster[2] + '</strong> ' + language.app.fightWin_part1 + '<strong>' + nbHit+ '</strong> ' + singularPlural(nbHit, language.app.hit_singular, language.app.hit_plural) + ' !</p>';
    
    get("#gameContent").innerHTML += '<p class="red">' + language.app.fightWin_part2 + '<strong>' + damage + '</strong> ' + singularPlural(damage, language.app.point_singular, language.app.point_plural) + ' ' + language.app.fightWin_part3 + '.</p>';
    
    // XP message only displayed if stil alive
    if (game.character.health > 0) get("#gameContent").innerHTML += '<p class="green">' + language.app.fightWin_part5 + '<strong>' + xp + '</strong> ' + singularPlural(xp, language.app.point_singular, language.app.point_plural) + language.app.fightWin_part4 + ".</p>";
    
    saveContent();
}

// ===> When using magic
function magic() {
    if (game.events.lastAction != "bossFight" && game.character.magic > 0 || game.events.lastAction == "bossFight" && game.character.magic > 2) {
        if (game.core.sound == true) get("#soundMagic").play();
        game.stats.magicKill++;
        game.events.subAction = "fightOver";
        changeDisplay("fightToGame");

        if (game.events.lastAction == "bossFight") game.character.magic = game.character.magic - 3;
        else game.character.magic--;

        let xp = nbRandom(parseInt(game.character.level * (game.events.monster[0]) / 2), game.character.level * game.events.monster[0] ); // 50% of the experience
        game.character.xp = game.character.xp + xp;
        game.stats.totalExp = game.stats.totalExp + xp;
        
        get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/monsters/' + game.events.monster[3] + '.png"alt="' + game.events.monster[2] + '"></div>';
        
        if (game.events.lastAction == "bossFight") get("#gameContent").innerHTML += '<p>' + language.app.bossFight_magic + ".</p>";
        else get("#gameContent").innerHTML += '<p>' + language.app.fightMagic + ".</p>";

        get("#gameContent").innerHTML += '<p class="green">' + language.app.fightWin_part5 + '<strong>' + xp + '</strong> ' + singularPlural(xp, language.app.point_singular, language.app.point_plural) + language.app.fightWin_part4 + ".</p>";
        
        saveContent();
    }
}

// ===> When running away
function runAway() {
    if (game.character.escape > 0) {
        if (game.core.sound == true) get("#soundEscape").play();
        game.stats.runAway++;
        game.character.escape--;
        changeDisplay("fightToGame");

        get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/monsters/' + game.events.monster[3] + '.png" alt="' + game.events.monster[2] + '"></div>';
        get("#gameContent").innerHTML += '<p>' + language.app.fightEscape + '.</p>';
        
        saveContent();
    }
}

// =================================================
// =================================================
// ============ DISPLAY

// ===> Display game and check death
function displayGame() {
    if (game.character.health < 1) gameOver()
    else {
        checkExperience();
        checkItems();
        checkScore();

        get("#name").innerHTML = '<img src="assets/images/icons/hero.png" alt="🤺"> ' + game.core.name + " (" + language.app.level + " " + game.character.level + ")";
        get("#health").innerHTML = '<img src="assets/images/icons/health.png" alt="💓"> ' + language.app.health + ' ' + game.character.health + ' / ' + game.character.healthMax;
        get("#xp").innerHTML = '<img src="assets/images/icons/xp.png" alt="🏆"> ' + language.app.experience + ' ' + game.character.xp + ' / ' + game.character.xpTo;
        get("#strength").innerHTML = '<img src="assets/images/icons/strength.png" alt="💪">  ' + language.app.strength + ' ' + game.character.strength;
        get("#shield").innerHTML = '<img src="assets/images/icons/shield.png" alt="🛡️">  ' + language.app.shield + ' ' + game.character.shield;
        get('#headerTitle').innerHTML = language.app.floor + ' ' + game.character.floor + " - " + language.app.room + ' ' + game.character.room;

        storage("set", "TOWER-gameSettings", JSON.stringify(game))
    }
}

// ===> Display gameover
function gameOver() {
    clearInterval(settings.refreshDisplay);
    changeDisplay('classic');

    get("#health").innerHTML = '<img src="assets/images/icons/health.png" alt="💓"> ' + language.app.health + ' ' + 0 + ' / ' + game.character.healthMax;
    get("#move").innerHTML = language.app.results;
    get("#move").removeEventListener("click", play);
    get("#move").addEventListener("click", displayScore);
    get("#useHeal").style.display = "none";
    get("#gameContent").innerHTML += '<p class="red"><strong>' + language.app.death + '</strong></p>';
}

// ===> Display the score
function displayScore() {
    resetData();
    changeDisplay("displayMessage");
    get("#gameMessage").style.backgroundColor = "lightcoral";
    get('#gameMessage').innerHTML = "<p class=\"bigger\">" + language.app.gameover  + game.character.score + " pts.</p>";

    get('#gameMessage').innerHTML += "<button id=\"restart\">" + language.app.gameoverButton + "</button>";
    get('#restart').addEventListener("click", function() { location.reload()});

    // Add a share button
    if (navigator.share) {
        get('#gameMessage').innerHTML += "<button id=\"share\">" + language.app.shareScore_button + "</button>";

        const shareScore = {
            text: language.app.shareScore_part1 + game.character.score + language.app.shareScore_part2,
            url: 'https://nicolas-deleforge/apps/tower/',
        };
    
        get("#share").addEventListener('click', function() {
            navigator.share(shareScore);
        });
    }
}

// ===> Modify actions
function changeDisplay(mode) {
    // Classic mode
    if (mode == "classic") {
        get(".listActionsLine")[1].style.display = "none";
        get(".listActionsLine")[2].style.display = "none";
    }

    // Chest event
    if (mode == "gameToChest") {
        get(".listActionsLine")[0].style.display = "none";
        get(".listActionsLine")[1].style.display = "flex";
    }
    if (mode == "chestToGame") {
        get(".listActionsLine")[0].style.display = "flex";
        get(".listActionsLine")[1].style.display = "none";
    }

    // Fight event
    if (mode == "gameToFight") {
        get(".listActionsLine")[0].style.display = "none";
        get(".listActionsLine")[2].style.display = "flex";
    }
    if (mode == "fightToGame") {
        get(".listActionsLine")[0].style.display = "flex";
        get(".listActionsLine")[2].style.display = "none";
    }

    // Boss fight event
    if (mode == "gameToBossFight") {
        get(".listActionsLine")[0].style.display = "none";
        get(".listActionsLine")[2].style.display = "flex";
    }
    if (mode == "bossFightToGame") {
        get(".listActionsLine")[2].style.display = "none";
        get(".listActionsLine")[0].style.display = "flex";
    }

    // Screen message
    if (mode == "displayMessage") {
        get('~header').style.display = "none";
        get('#gameScreen').style.display = "none";
        get('#gameMessage').style.display = "flex";
    }
    if (mode == "hideMessage") {
        get('~header').style.display = "flex";
        get('#gameScreen').style.display = "flex";
        get('#gameMessage').style.display = "none";
    }
}

// =================================================
// =================================================
// ============ CHECKS

// ===> Check items availability
function checkItems() {
    if (game.character.heal < 1 || game.character.health == game.character.healthMax) get("#useHeal").disabled = true
    else get("#useHeal").disabled = false;

    if (game.events.lastAction != "bossFight" && game.character.magic > 0 || game.events.lastAction == "bossFight" && game.character.magic > 2) get("#useMagic").disabled = false
    else get("#useMagic").disabled = true;

    if (game.character.escape > 0 && game.events.lastAction != "bossFight") get("#useEscape").disabled = false
    else get("#useEscape").disabled = true;
    
    get("#potion").innerHTML = '<img src="assets/images/icons/potion.png" alt="🥃"> ' + game.character.heal + ' ' + singularPlural(game.character.heal, language.app.heal_singular, language.app.heal_plural);
    get("#magic").innerHTML = '<img src="assets/images/icons/magic.png" alt="🃏"> ' + game.character.magic + ' ' + singularPlural(game.character.magic, language.app.magic_singular, language.app.magic_plural);
    get("#escape").innerHTML = '<img src="assets/images/icons/escape.png" alt="📜"> ' + game.character.escape + ' ' + singularPlural(game.character.escape, language.app.escape_singular, language.app.escape_plural);     
}

// ===> Check xp level
function checkExperience() {
    if (game.character.xp >= game.character.xpTo) {
        game.character.level++;
        game.character.strength =  game.character.strength + game.bonusLvl.strength;
        game.character.shield =  game.character.shield + game.bonusLvl.shield;
        game.character.healthMax =  game.character.healthMax + game.bonusLvl.health;

        game.character.health = game.character.healthMax;
        game.character.xp = 0;
        game.character.xpTo = nbRandom(parseInt(1.5 *  game.character.xpTo), 2 *  game.character.xpTo);

        if (game.character.level > game.stats.maxLevel) game.stats.maxLevel = game.character.level;

        get("#gameContent").innerHTML += '<hr><p class="green">' + language.app.levelUp_part1 + '.</p>';
        get("#gameContent").innerHTML += '<p class="green">' + language.app.levelUp_part2 + '.</p>';
        game.events.currentEvent = get("#gameContent").innerHTML;
    }
}

// ===> Check score
function checkScore() {
    game.character.score = (((game.character.strength + game.character.healthMax) * game.character.level) * game.character.floor) - 30;
    if (game.character.score > game.stats.bestScore) game.stats.bestScore = game.character.score;
}

// ===> Check volume
function checkSound() {
    if (game.core.sound == true) {
        game.core.sound = false;
        get("#volumeButton").innerHTML = "🔈";
    }
    else {
        game.core.sound = true;
        get("#volumeButton").innerHTML = "🔊";
    }
}

// =================================================
// =================================================
// ============ GAME ASIDE

// ===> Display tip
function randomTip() {
    let nb = nbRandom(0, language.tips.length);
    let arr = language.tips;
    return arr[nb];
}

// ===> Display singular or plural
function singularPlural(nb, singular, plural) {
    if (nb > 1) return plural;
    return singular;
} 

// ===> Reset all character data
function resetData() {
    game.core.ongoing = false;
    game.stats.totalGame++;
    game.character.health = settings.basicStats.health;
    game.character.healthMax = settings.basicStats.healthMax;
    game.character.strength = settings.basicStats.strength;
    game.character.shield = settings.basicStats.shield;
    game.character.xp = settings.basicStats.xp;
    game.character.xpTo = settings.basicStats.xpTo;
    game.character.heal = settings.basicStats.heal;
    game.character.magic = settings.basicStats.magic;
    game.character.escape = settings.basicStats.escape;
    game.character.level = settings.basicStats.level;
    game.character.floor = settings.basicStats.floor;
    game.character.room = settings.basicStats.room;
    game.character.itemLimit = settings.basicStats.itemLimit;
    game.bonusLvl.health = settings.basicStats.bonusLvl.health;
    game.bonusLvl.strenght = settings.basicStats.bonusLvl.strenght;
    game.bonusLvl.shield = settings.basicStats.bonusLvl.shield;

    storage("set", "TOWER-gameSettings", JSON.stringify(game))
}

// ===> Save the content of the app
function saveContent() {
    game.events.currentEvent = get("#gameContent").innerHTML;
}

// =================================================
// =================================================
// ============ GENERIC

// ===> Easy selector
function get(n) {
    if (n.search("#") == 0 && n.split("#")[1] != null && document.querySelector(n) != null) return document.querySelector(n);
    if (n.search(".") == 0 && n.split(".")[1] != null && document.querySelectorAll(n) != null) return document.querySelectorAll(n);
    if (n.search("~") == 0 && n.split("~")[1] != null && document.querySelectorAll(n.split("~")[1]) != null) return document.querySelectorAll(n.split("~")[1])[0];
}

// ===> Simplier usage of the local storage
function storage(a, n, v) {
    if (a == "get") return localStorage.getItem(n);
    if (a == "set") return localStorage.setItem(n, v);
    if (a == "rem") return localStorage.removeItem(n);
}

// ===> Give a random number
function nbRandom(min, max) {
    return (Math.floor(Math.random() * Math.floor(max))) + min;
}