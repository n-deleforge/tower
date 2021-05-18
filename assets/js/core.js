// =================================================
// =================================================
// ============ SERVICE WORKER

"serviceWorker" in navigator && window.addEventListener ("load", function() {navigator.serviceWorker.register("serviceWorker.js")});

// =================================================
// =================================================
// ============ CORE VARIABLES

let GAME; let REFRESH_DISPLAY; let INTERVAL_RESFRESH;
const _VERSION = 1.9;
const _GITHUB = "<a href=\"https://github.com/n-deleforge/game-tower\" target=\"_blank\">GitHub</a>";
const _HOME = "<a target=\"_blank\" href=\"https://nicolas-deleforge.fr/\">NDDev</a>";
const _MOBILE = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent); 
const _SETTINGS = {
    'data' : {
        'health' : 25,
        'healthMax' : 25,
        'strength' : 5,
        'shield' : 0,
        'xp' : 0,
        'xpTo' : 50,
        'level' : 1,
        'floor' : 1,
        'room' : 1,
        'itemHeal' : 0,
        'itemMagic' : 0,
        'itemLimit' : 9,
        'score' : 0,
        'lvlUpHealth' : 30,
        'lvlUpStrength' : 2, 
        'lvlUpShield' : 1,
        'spiritHealth' : 15,
        'spiritStrength' : 1,
        'spiritShield' : 1
    },
    'images' : {
        'start' : "events/firstFloor.png",
        'monster01' : "monsters/monster_01.png",
        'monster02' : "monsters/monster_02.png",
        'monster03' : "monsters/monster_03.png",
        'monster04' : "monsters/monster_04.png",
        'monster05' : "monsters/monster_05.png",
        'monster06' : "monsters/monster_06.png",
        'monster07' : "monsters/monster_07.png",
        'monster08' : "monsters/monster_08.png",
        'monster09' : "monsters/monster_09.png",
        'monster10' : "monsters/monster_10.png",
        'monster11' : "monsters/monster_11.png",
        'monster12' : "monsters/monster_12.png",
        'monster13' : "monsters/monster_13.png",
        'monster14' : "monsters/monster_14.png",
        'monster15' : "monsters/monster_15.png",
        'monster16' : "monsters/monster_16.png",
        'monster17' : "monsters/monster_17.png",
        'noEvent' : "events/noEvent.png",
        'earthSpirit' : "events/spiritEarth.png",
        'lightSpirit' : "events/spiritLight.png",
        'fireSpirit' : "events/spiritFire.png",
        'waterSpirit' : "events/spiritWater.png",
        'chest' : "events/chest.png",
        'chestTrap' : "events/chestTrap.png",
        'chestEscape' : "events/chestEscape.png",
        'chestMagic' : "events/chestMagic.png",
        'chestHeal' : "events/chestHeal.png",
        'iconPotion' : "icons/potion.png",
        'iconMagic' : "icons/magic.png",
        'iconHealth' : "icons/health.png",
        'iconExperience' : "icons/xp.png",
        'iconStrength' : "icons/strength.png",
        'iconShield' : "icons/shield.png"
    }
};
const _FRENCH = {
    'main' : {
        'title' : "La Tour",
        'headerTitle' : "La Tour",
        'startScreenTitle' : "Bienvenue aventurier",
        'nameHeroLabel' : "Quel est ton nom ?",
        'startGame' : "Entrer",
        'startFooter' : "Disponible sur " + _GITHUB + " (v " + _VERSION + ") ©  " + _HOME,
        'move' : "Avancer",
        'useHeal' : "Utiliser une potion",
        'openChest' : "Ouvrir le coffre",
        'closeChest' : "Ne pas l'ouvrir",
        'useAttack' : "Attaque",
        'useMagic' : "Sortilège",
        'optionMenuTitle' : "Paramètres",
        'statsMenuTitle' : "Statistiques",
        'confirmRestart' : "Recommencer",
        'confirmDelete' : "Effacer les données",
        'popupTitle' : "Attention !",
        'popupAccept' : "Confirmer",
        'popupCancel' : "Annuler",
        'popupRestart' : "Cette action va arrêter votre partie en cours, vous allez perdre votre progression et reprendre de zéro.",
        'popupDelete' : "Cette action va arrêter votre partie en cours et supprimer toutes les données de jeu sauvegardées.",
    },
    'stats' : {
        'bestScore' : "Meilleur score : ",
        'totalGame' : "Nombre de partie : ",
        'bestFloor' : "Étage atteint le plus haut : ",
        'totalRoom' : "Nombre de salle parcourue : ",
        'maxLevel' : "Niveau d'expérience le plus haut : ",
        'healUsed' : "Nombre de potion utilisé : ",
        'fightVictory' : "Monstre vaincu : ",
        'chestOpen': "Coffre ouvert : ",
        'chestTrap' : "Coffre piégé : ",
        'chestNotOpened' : "Coffre non ouvert : ",
        'spiritMeet' : "Esprit rencontré : ",
    },
    'vocabulary': {
        'health' : "Santé",
        'score' : "Score",
        'strength' : "Force",
        'shield' : "Bouclier",
        'floor' : "Étage",
        'room' : "Salle",
        'point_singular' : "point",
        'point_plural' : "points",
        'hit_singular' : "coup",
        'hit_plural' : "coups",
    },
    'events' : {
        // Regex check
        'nameHeroCheck' : "Votre nom doit être composé de 2 à 15 lettres",
        // Level up
        'levelUp_part1' : "Votre niveau augmente",
        'levelUp_part2' : "Votre santé est regénérée et vos statistiques augmentent",
        // Simple events
        'healing' : "Vous avez utilisé une potion, vous regagnez toute votre santé",
        'noEvent' : "Vous traversez tranquillement de longs couloirs",
        'startGame_part1' : "Une vieille pancarte. La plupart des mots sont effacés par le temps.",
        'startGame_part2' : "\"Celui qui ... le sommet pourra ... l'un de ses ... ! ... le danger, restez en ... et grimpez le ... haut ...\"",
        'startGame_part3' : "Vous continuez votre chemin d'un pas déterminé..",
        // Spirits
        'spiritEarth_part1' : "Un <strong>esprit de la terre</strong> vous protège",
        'spiritEarth_part2' : "Votre bouclier augmente de ",
        'spiritLight_part1' : "Un <strong>esprit de lumière</strong> se rapproche de vous",
        'spiritLight_part2' : "Vous gagnez ",
        'spiritLight_part3' : " d'expérience",
        'spiritFire_part1' : "Un <strong>esprit de feu</strong> partage son énergie",
        'spiritFire_part2' : "Votre force augmente de ",
        'spiritWater_part1' : "Un <strong>esprit d'eau</strong> partage sa vitalité",
        'spiritWater_part2' : "Votre santé augmente de ",
        // Chest
        'chest' : "Vous avez trouvé un <strong>coffre</strong>",
        'chest_notOpened' : "Mais vous décidez de ne pas l'ouvrir",
        'chestTrap_part1' : "Mais c'est un <strong>piège</strong>, le coffre vous attaque",
        'chestTrap_part2' : "Vous perdez ",
        'chestTrap_part3' : " de santé",
        'chestEscape' : "Vous trouvez un <strong>parchemin de fuite</strong>",
        'chestMagic' : "Vous trouvez un <strong>sort magique</strong>",
        'chestHeal' : "Vous trouvez une <strong>potion de soin</strong>",
        'chestLimit' : "Mais vous n'avez plus assez de place",
        // Fight
        'fightStart' : "apparaît !",
        'fightWin_part1' : " vaincu en ",
        'fightWin_part2' : "Vous avez perdu ",
        'fightWin_part3' : " de santé",
        'fightWin_part4' : " d'expérience",
        'fightWin_part5' : "Vous avez gagné ",
        'fightMagic' : "Vous avez vaincu le monstre grâce à un sort magique",
        // Game over
        'death' : "Vous tombez de fatigue ...",
        'results' : "Voir les résultats",
        'gameover_part1' : "La partie est terminée.<br />Vous êtes arrivé à l'étage ",
        'gameover_part2' : "Score : ",
        'gameoverButton' : "Recommencer"
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
        // Stats
        "Lorsque la santé du héros tombe à 0, la partie est terminée. Cependant, un gain de niveau ou une potion restaure la totalité des points de santé.",
        "La statistique de bouclier permet de réduire les dégâts lors d'une attaque dans un combat. Elle peut être uniquement augmentée par l'esprit de la terre.",    
        // Fights
        "Les combats se déroulent automatiquement alors veillez à bien choisir votre action de combat entre attaque et sortilège.",
        "Chaque monstre nécessite un nombre de coups pour être vaincu qui est calculé de la manière suivante : <em>\"santé du monstre / force du héros\"</em>",
        "Les dégâts d'un monstre sont calculés selon la formule suivante : <em>\"(nombre de coups pour être vaincu * force du monstre) - le bouclier du héros\"</em>",
        "Vaincre un monstre avec un sort rapporte peu de points d'expérience mais peut éviter une morte certaine ou de très gros dégâts.",
        // Events
        "La Tour est peuplée de divers esprits, la plupart d'entre eux vous aideront grandement lors de votre quête.",
        "Lorsque vous ouvrez un coffre, vous avez une chance de tomber sur un monstre qui vous infligera des dégâts qui ignorent votre statistique de bouclier.",
        // Informations
        "La Tour est divisé par étages. Chaque étage est lui-même composé de 10 salles. A chaque étage, les monstres deviennent plus puissants.",
        "Pour les plus curieux, le score de fin de partie est calculé selon la formule suivante : <em>\"((bouclier + force + santé maximale) * niveau) * étage\"</em>",
        "Chaque objet que vous pouvez récupérer est limité à une certaine quantité. Il faut faire attention à ne pas trop les utiliser et à ne pas trop les accumuler."
    ]
};
const _ENGLISH = {
    'main' : {
        'title' : "The Tower",
        'headerTitle' : "The Tower",
        'startScreenTitle' : "Welcome adventurer",
        'nameHeroLabel' : "What's your name ?",
        'startGame' : "Enter",
        'startFooter' : "Available on " + _GITHUB + " (v " + _VERSION + ") ©  " + _HOME,
        'move' : "Move",
        'useHeal' : "Use a potion",
        'openChest' : "Open the chest",
        'closeChest' : "Do not open",
        'useAttack' : "Attack",
        'useMagic' : "Spell",
        'optionMenuTitle' : "Settings",
        'statsMenuTitle' : "Statistics",
        'confirmRestart' : "Restart",
        'confirmDelete' : "Delete all data",
        'popupTitle' : "Warning !",
        'popupAccept' : "Confirm",
        'popupCancel' : "Cancel",
        'popupRestart' : "This action is gonna stop your game, you're gonna lost your progression and restart.",
        'popupDelete' : "this action is gonna stop your game and delete all the saved game data.",
    },
    'stats' : {
        'bestScore' : "Best score : ",
        'totalGame' : "Number of game : ",
        'bestFloor' : "Highest floor : ",
        'totalRoom' : "Number of rooms : ",
        'maxLevel' : "Highest exp. level : ",
        'healUsed' : "Potion used : ",
        'fightVictory' : "Monsters defeated  : ",
        'chestOpen' : "Chest opened : ",
        'chestTrap' : "Trapped chest : ",
        'chestNotOpened' : "Chest not opened : ",
        'spiritMeet' : "Spirit meet : ",
    },
    'vocabulary' : {
        'health' : "Health",
        'score' : "Score",
        'strength' : "Strength",
        'shield' : "Shield",
        'floor' : "Floor",
        'room' : "Room",
        'point_singular' : "point",
        'point_plural' : "points",
        'hit_singular' : "hit",
        'hit_plural' : "hits",
    },
    'events' : {
        // Regex check
        'nameHeroCheck' : "Your name must be composed between 2 to 15 letters.",
        // Level up
        'levelUp_part1' : "Level up",
        'levelUp_part2' : "Your health is regenerated and your stats increase",
        // Simple events
        'healing' : "You use a potion, you regain all your health",
        'noEvent' : "You walk quietly through long corridors",
        'startGame_part1' : "An old sign. Most of the words are erased by time.",
        'startGame_part2' : "\"Whoever ... the top may ... one of its ...! ... danger, stay in ... and climb the ... top ...\"",
        'startGame_part3' : "You continue your journey with a determined step.",
        // Spirits
        'spiritEarth_part1' : "A <strong>earth spirit</strong> protects you",
        'spiritEarth_part2' : "Your shield increases by ",
        'spiritLight_part1' : "A <strong>light spirit</strong> draws near to you",
        'spiritLight_part2' : "You win ",
        'spiritLight_part3' : " of experience",
        'spiritFire_part1' : "A <strong>fire spirit</strong> shares its energy",
        'spiritFire_part2' : "Your strength increases by ",
        'spiritWater_part1' : "A <strong>water spirit</strong> shares its vitality",
        'spiritWater_part2' : "Your health increases by ",
        // Chest
        'chest' : "You have found a <strong>chest</strong>",
        'chest_notOpened' : "But you decide not to open it",
        'chestTrap_part1' : "But it's a <strong>trap</strong>, the chest attacks you",
        'chestTrap_part2' : "You lost ",
        'chestTrap_part3' : " of health",
        'chestEscape' : "You find a <strong>escape scroll</strong>",
        'chestMagic' : "You find a <strong>magic spell</strong>",
        'chestHeal' : "You find a <strong>healing potion</strong>",
        'chestLimit' : "But you don't have enough room",
        // Fight
        'fightStart' : "appears !",
        'fightWin_part1' : " defeated with ",
        'fightWin_part2' : "You have lost ",
        'fightWin_part3' : " of health",
        'fightWin_part4' : " of experience",
        'fightWin_part5' : "You have won ",
        'fightMagic' : "You have defeated the monster with a magic spell",
        // Game over
        'death' : "You're very tired ...",
        'results' : "See the results",
        'gameover' : "The game is over.<br />Your score : ",
        'gameover_part1' : "The game is over.<br />You have been at the floor  ",
        'gameover_part2' : "Score : ",
        'gameoverButton' : "Restart",
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
        // Stats
        "When the hero's health drops to 0, the game is over. However, leveling up or a potion restores all health points.",
        "The shield stat is used to reduce damage when attacked in combat. It can only be increased by the spirit of the earth.",
        // Fights
        "The fights take place automatically so be sure to choose your fight action.",
        "Each monster requires a number of hits to be defeated which is calculated as follows: <em>\" monster health / hero strength \"</em>",
        "The damage of a monster is calculated according to the following formula: <em>\" (number of hits to be defeated * strength of the monster) - hero's shield \"</em>",
        "Defeating a monster with a spell doesn't grant much experience points but can prevent certain death or very large damage.",
        // Events
        "The Tower is populated by various spirits. Most of them will help you greatly on your quest.",
        "When you open a chest, you have a chance to stumble upon a monster that will deal damage to you that ignores your shield stat.",
        // Informations
        "The Tower is divided by floors. Each floor itself is made up of 10 rooms. On each floor, the monsters become more powerful.",
        "For the more curious, the end-of-game score is calculated according to the following formula: <em>\" ((shield + strength + maximum health) * level) * floor \"</em>",
        "At the start of the game, each item you can collect is limited to a certain quantity. Later, you can keep more."
    ]
};

// =================================================
// =================================================
// ============ CORE INITIALISATION

// Correct the bug of the viewport on mobile
if (_MOBILE) get("#container").style.minHeight = window.innerHeight + 'px';

// Create data game or parse it if existing
if (!getStorage("TOWER-save")) {
    GAME = {
        'core' : {
            'ongoing' : false, 
            'name' : null, 
            'sound' : true,
            'vibrate' : true,
            'version' : _VERSION
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
            'healUsed' : 0,
            'fightVictory' : 0,
            'chestOpen': 0,
            'chestTrap' : 0,
            'chestNotOpened' : 0,
            'spiritMeet' : 0,
        },
        'character' : {
            'health' : _SETTINGS.data.health,
            'healthMax' : _SETTINGS.data.healthMax,
            'strength' : _SETTINGS.data.strength,
            'shield' : _SETTINGS.data.shield,
            'xp' : _SETTINGS.data.xp,
            'xpTo' : _SETTINGS.data.xpTo,
            'level' : _SETTINGS.data.level,
            'floor' : _SETTINGS.data.floor,
            'room' : _SETTINGS.data.room,
            'itemHeal' : _SETTINGS.data.itemHeal,
            'itemMagic' : _SETTINGS.data.itemMagic,
            'score' : _SETTINGS.data.score
        }
    }

    setStorage("TOWER-save", JSON.stringify(GAME));
} else GAME = JSON.parse(getStorage("TOWER-save"))

// Determine language of the application
const _CONTENT = navigator.language == "fr" || navigator.language == "fr-FR" ? _FRENCH : _ENGLISH;
get('#manifest').href = navigator.language == "fr" || navigator.language == "fr-FR" ? "french.webmanifest" : "english.webmanifest";

let names = Object.keys(_CONTENT.main);
let values = Object.values(_CONTENT.main);

for (let i = 0; i < names.length; i++) {
    if (get("#" + names[i])) get("#" + names[i]).innerHTML = values[i];
}