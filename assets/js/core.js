// =================================================
// ============ CORE VARIABLES

const VERSION = "2.1.60";
const GITHUB = "<a href=\"https://github.com/n-deleforge/tower\" target=\"_blank\">GitHub</a>";
const FOOTER = "V. " + VERSION + " | © 2020-22 | " + GITHUB + " |  <a id=\"switchLanguage\"></a>";

let _game, 
    _refreshDisplay,
    _refreshInterval;

const SETTINGS = {
    'data' : {
        'health' : 25,
        'healthMax' : 25,
        'power' : 5,
        'stamina' : 0,
        'xp' : 0,
        'xpTo' : 50,
        'level' : 1,
        'floor' : 1,
        'room' : 1,
        'itemPotion' : 0,
        'itemScroll' : 0,
        'itemMineral' : 0,
        'itemLimit' : 9,
        'score' : 0,
        'lvlUpHealth' : 20,
        'lvlUpPower' : 2,
        'lvlUpStamina' : 1,
        'spiritHealth' : 10,
        'spiritPower' : 1,
        'spiritStamina' : 1,
    },
    'icons' : {
        'soundOn' : "<i class='fas fa-volume-up'></i>",
        'soundOff' : "<i class='fas fa-volume-mute'></i>",
    },
    'sounds' : {
        'soundAttack' : "attack",
        'soundScroll' : "scroll",
        'soundMerchant' : "merchant",
        'soundChest' : "chest",
        'soundPotion' : "potion",
        'soundRoom' : "room",
        'soundFloor' : "floor",
    },
    'images' : {
        // ux
        'menuClosed' : "assets/image/icon/book-a.png",
        'menuOpened' : "assets/image/icon/book-b.png",
        // events
        'start' : "event/firstFloor.png?" + VERSION,
        'noEvent' : "event/noEvent.png?" + VERSION,
        'chest' : "event/chest.png?" + VERSION,
        'chestOpen' : "event/chestOpen.png?" + VERSION,
        'merchant' : "event/merchant.png?" + VERSION,
        'earthSpirit' : "event/spiritEarth.png?" + VERSION,
        'lightSpirit' : "event/spiritLight.png?" + VERSION,
        'fireSpirit' : "event/spiritFire.png?" + VERSION,
        'waterSpirit' : "event/spiritWater.png?" + VERSION,
        // icons
        'iconPower' : "icon/sword.png?" + VERSION,
        'iconStamina' : "icon/shield.png?" + VERSION,
        'iconPotion' : "icon/potion.png?" + VERSION,
        'iconScroll' : "icon/scroll.png?" + VERSION,
        'iconMineral' : "icon/mineral.png?" + VERSION,
        // monsters
        'monster01' : "monster/monster_01.png?" + VERSION,
        'monster02' : "monster/monster_02.png?" + VERSION,
        'monster03' : "monster/monster_03.png?" + VERSION,
        'monster04' : "monster/monster_04.png?" + VERSION,
        'monster05' : "monster/monster_05.png?" + VERSION,
        'monster06' : "monster/monster_06.png?" + VERSION,
        'monster07' : "monster/monster_07.png?" + VERSION,
        'monster08' : "monster/monster_08.png?" + VERSION,
        'monster09' : "monster/monster_09.png?" + VERSION,
        'monster10' : "monster/monster_10.png?" + VERSION,
        'monster11' : "monster/monster_11.png?" + VERSION,
        'monster12' : "monster/monster_12.png?" + VERSION,
        'monster13' : "monster/monster_13.png?" + VERSION,
        'monster14' : "monster/monster_14.png?" + VERSION,
        'monster15' : "monster/monster_15.png?" + VERSION,
        'monster16' : "monster/monster_16.png?" + VERSION,
        'monster17' : "monster/monster_17.png?" + VERSION,
    }
};

const FRENCH = {
    'main' : {
        'title' : "La Tour",
        'tower' : "La Tour",
        'titleText' : "Bienvenue aventurier",
        'titleCharacterPlaceholder' : "Quel est ton nom ?",
        'play' : "Entrer",
        'titleFooter' : FOOTER,
        'menuFooter' : FOOTER,
        'move' : "Avancer",
        'usePotion' : "Utiliser une potion",
        'attack' : "Attaque",
        'useScroll' : "Sortilège",
        'openChest' : "Ouvrir le coffre",
        'closeChest' : "Ne pas l'ouvrir",
        'acceptOffer' : "Accepter l'offre",
        'refuseOffer' : "Refuser l'offre",
        'settingsTitle' : "Paramètres de jeu",
        'statsTitle' : "Statistiques",
        'popupTitle' : "Information importante",
        'popupAccept' : "Confirmer",
        'popupCancel' : "Annuler",
        'popupRestart' : "Voulez-vous recommencer la partie en cours ?<br />Votre progression actuelle sera perdue mais vos statistiques seront gardées.",
        'popupDelete' : "Voulez-vous effacer toutes les données de jeu ? L'application sera réinitialisée, vous perdrez votre progression et vos statistiques.",
        'switchLanguage' : "<i class=\"fas fa-sync\"></i> EN",
        'updated' : "L'application a été mise à jour et une réinitialisation est requise. Vous allez perdre votre progression et vos statistiques."
    },
    'stats' : {
        'bestScore' : "Meilleur score : ",
        'totalGame' : "Nombre de partie : ",
        'bestFloor' : "Étage atteint le plus haut : ",
        'totalRoom' : "Nombre de salle parcourue : ",
        'maxLevel' : "Niveau d'expérience le plus haut : ",
        'potionUsed' : "Nombre de potion utilisé : ",
        'fightVictory' : "Monstre vaincu : ",
        'chestOpen': "Coffre ouvert : ",
        'chestTrap' : "Coffre piégé : ",
        'chestNotOpened' : "Coffre non ouvert : ",
        'spiritMeet' : "Esprit rencontré : ",
        'merchantAccepted' : "Propostion du marchant accepté : ",
        'merchantRefused' : "Proposition du marchant refusé : ",
    },
    'vocabulary': {
        'health' : "Santé",
        'score' : "Score",
        'power' : "Puissance",
        'stamina' : "Endurance",
        'floor' : "Étage",
        'room' : "Salle",
        'level' : "Niveau",
        'point_singular' : "point",
        'point_plural' : "points",
        'hit_singular' : "coup",
        'hit_plural' : "coups",
    },
    'events' : {
        // Level up
        'levelUp_part1' : "Votre niveau augmente",
        'levelUp_part2' : "Votre santé est regénérée, votre puissance et votre endurance augmentent",
        // Simple events
        'healing' : "Vous avez utilisé une potion, votre santé est regénérée",
        'noEvent' : "Vous traversez tranquillement de longs couloirs",
        'startGame_part1' : "Une vieille pancarte. La plupart des mots sont effacés par le temps.",
        'startGame_part2' : "\"Celui qui ... le sommet pourra ... l'un de ses ... ! ... le danger, restez en ... et grimpez le ... haut ...\"",
        'startGame_part3' : "Vous continuez votre chemin d'un pas déterminé..",
        // Spirits
        'spiritEarth_part1' : "Un <strong>esprit de la terre</strong> partage son énergie",
        'spiritEarth_part2' : "Votre endurance augmente de ",
        'spiritLight_part1' : "Un <strong>esprit de lumière</strong> partage son énergie",
        'spiritLight_part2' : "Vous gagnez ",
        'spiritLight_part3' : " d'expérience",
        'spiritFire_part1' : "Un <strong>esprit de feu</strong> partage son énergie",
        'spiritFire_part2' : "Votre puissance augmente de ",
        'spiritWater_part1' : "Un <strong>esprit d'eau</strong> partage son énergie",
        'spiritWater_part2' : "Votre santé augmente de ",
        // Merchant
        'merchant' : "Un individu se dresse devant vous. Il propose un marché",
        'merchant_noMineral' : "Mais vous n'avez pas assez de <strong>pierre précieuse</strong>",
        'merchant_proposition' : "Deux <strong>pierre précieuse</strong> contre",
        'merchant_offer1' : "Votre statistique de puissance augmente beaucoup",
        'merchant_offer2' : "Votre santé et votre endurance augmente",
        'merchant_offer3' : "Mais rien ne se passe",
        'merchant_accepted' : "L'individu se met à rire avant de vous lancer un sort",
        'merchant_refused' : "Mais vous refusez l'offre",
        // Chest
        'chest' : "Vous avez trouvé un <strong>coffre</strong>",
        'chest_notOpened' : "Mais vous décidez de ne pas l'ouvrir",
        'chestTrap_part1' : "Mais c'est un <strong>piège</strong>, un poison se répand",
        'chestTrap_part2' : "Vous perdez ",
        'chestTrap_part3' : " de santé",
        'chestScroll' : "Vous trouvez un <strong>parchemin magique</strong>",
        'chestPotion' : "Vous trouvez une <strong>potion de soin</strong>",
        'chestMineral' : "Vous trouvez une <strong>pierre précieuse</strong>",
        'chestLimit' : "Mais vous n'avez plus assez de place",
        // Fight
        'fightStart' : "apparaît",
        'fightWin_part1' : " vaincu en ",
        'fightWin_part2' : "Vous avez perdu ",
        'fightWin_part3' : " de santé",
        'fightWin_part4' : " d'expérience",
        'fightWin_part5' : "Vous avez gagné ",
        'fightMagic' : "Vous avez vaincu le monstre grâce à un sort magique",
        // Game over
        'gameover_part1' : "Vous avez été vaincu.<br />Vous êtes arrivé à l'étage ",
        'gameover_part2' : "Score : ",
        'gameoverButton' : "Recommencer"
    },
    'monsters' : {
        'lich' : "Liche des ténèbres",
        'lightSword' : "Épée de lumière",
        'golem' : "Golem de pierre",
        'deadWarrior' : "Guerrier mort-vivant",
        'daemon' : "Daémon",
        'minotaur' : "Minotaure",
        'cerberus' : "Cerbère",
        'troll' : "Troll",
        'eyeghost' : "Oeil maléfique",
        'werewolf' : "Loup-garou",
        'monster' : "Monstre marin",
        'lizard' : "Homme-lézard",
        'gargoyle' : "Gargouille",
        'gobelin' : "Gobelin",
        'snake' : "Serpent",
        'bat' : "Chauve souris",
        'slim' : "Blob"
    },
    'tips' : [
        "Lorsque la santé de votre personnage tombe à 0, la partie est terminée. Cependant, un gain de niveau ou une potion restaure la totalité des points de santé.",
        "La statistique de bouclier permet de réduire les dégâts lors d'une attaque dans un combat. Elle est uniquement augmentée par l'esprit de la terre.",
        "Les combats se déroulent automatiquement alors veillez à bien choisir votre action de combat entre attaque et sortilège.",
        "Chaque monstre nécessite un nombre de coups pour être vaincu qui est calculé de la manière suivante : santé du monstre / force du héros.",
        "Les dégâts d'un monstre sont calculés selon la formule suivante : (nombre de coups pour être vaincu * force du monstre) - le bouclier du héros.",
        "Vaincre un monstre avec un sort rapporte peu de points d'expérience mais peut éviter une morte certaine ou de très gros dégâts.",
        "La Tour est peuplée de divers esprits, la plupart d'entre eux vous aideront grandement lors de votre quête.",
        "Lorsque vous ouvrez un coffre, vous avez une chance de tomber sur un monstre qui vous infligera des dégâts qui ignorent votre statistique de bouclier.",
        "La Tour est divisé par étages. Chaque étage est lui-même composé de 10 salles. A chaque étage, les monstres deviennent plus puissants.",
        "Pour les plus curieux, le score de fin de partie est calculé selon la formule suivante : ((bouclier + force + santé maximale) * niveau) * étage.",
        "Chaque objet que vous pouvez récupérer est limité à une certaine quantité. Il faut faire attention à ne pas trop les utiliser et à ne pas trop les accumuler.",
        "Un étrange marchand habite dans la Tour, il est possible qu'il vous propose une transaction contre des pierres précieuses"
    ]
};

const ENGLISH = {
    'main' : {
        'title' : "The Tower",
        'tower' : "The Tower",
        'titleText' : "Welcome adventurer",
        'titleCharacterPlaceholder' : "What's your name ?",
        'play' : "Enter",
        'titleFooter' : FOOTER,
        'menuFooter' : FOOTER,
        'move' : "Move",
        'usePotion' : "Use a potion",
        'attack' : "Attack",
        'useScroll' : "Spell",
        'openChest' : "Open the chest",
        'closeChest' : "Do not open",
        'acceptOffer' : "Accept offer",
        'refuseOffer' : "Refuse offer",
        'settingsTitle' : "Game settings",
        'statsTitle' : "Statistiques",
        'popupTitle' : "Important information",
        'popupAccept' : "Confirm",
        'popupCancel' : "Cancel",
        'popupRestart' : "Do you want to restart the current game? Your current progress will be lost but your stats will be saved.",
        'popupDelete' : "Do you want to erase all game data? The application will be reset and you'll lose your data and your stats.",
        'switchLanguage' : "<i class=\"fas fa-sync\"></i> FR",
        'updated' : "The application has been updated and needs to be reset. You're gonna lose your progression and your stats."
    },
    'stats' : {
        'bestScore' : "Best score : ",
        'totalGame' : "Number of game : ",
        'bestFloor' : "Highest floor : ",
        'totalRoom' : "Number of rooms : ",
        'maxLevel' : "Highest exp. level : ",
        'potionUsed' : "Potion used : ",
        'fightVictory' : "Monsters defeated  : ",
        'chestOpen' : "Chest opened : ",
        'chestTrap' : "Trapped chest : ",
        'chestNotOpened' : "Chest not opened : ",
        'spiritMeet' : "Spirit meet : ",
        'merchantAccepted' : "Merchant deals accepted : ",
        'merchantRefused' : "Merchant deals refused : ",
    },
    'vocabulary' : {
        'health' : "Health",
        'score' : "Score",
        'power' : "Power",
        'stamina' : "Stamina",
        'floor' : "Floor",
        'room' : "Room",
        'level' : "Level",
        'point_singular' : "point",
        'point_plural' : "points",
        'hit_singular' : "hit",
        'hit_plural' : "hits",
    },
    'events' : {
        // Level up
        'levelUp_part1' : "Level up",
        'levelUp_part2' : "Your health is regenerated, your power and your stamina increase",
        // Simple events
        'healing' : "You use a potion, your health is regenerated",
        'noEvent' : "You walk quietly through long corridors",
        'startGame_part1' : "An old sign. Most of the words are erased by time.",
        'startGame_part2' : "\"Whoever ... the top may ... one of its ...! ... danger, stay in ... and climb the ... top ...\"",
        'startGame_part3' : "You continue your journey with a determined step.",
        // Spirits
        'spiritEarth_part1' : "A <strong>earth spirit</strong> shares its energy",
        'spiritEarth_part2' : "Your stamina increases by ",
        'spiritLight_part1' : "A <strong>light spirit</strong> shares its energy",
        'spiritLight_part2' : "You win ",
        'spiritLight_part3' : " of experience",
        'spiritFire_part1' : "A <strong>fire spirit</strong> shares its energy",
        'spiritFire_part2' : "Your power increases by ",
        'spiritWater_part1' : "A <strong>water spirit</strong> shares its energy",
        'spiritWater_part2' : "Your health increases by ",
        // Merchant
        'merchant' : "A person stands in front of you. He proposes you a deal ",
        'merchant_noMineral' : "But you don't have enough <strong>gemstone</strong> ",
        'merchant_proposition' : "Two <strong>gemstones</strong> for",
        'merchant_offer1' : "Your strength increases a lot",
        'merchant_offer2' : "Your health and your stamina increase",
        'merchant_offer3' : "But nothing happened",
        'merchant_accepted' : "The person laughs before casting a spell on you",
        'merchant_refused' : "But you refuse the deal",
        // Chest
        'chest' : "You have found a <strong>chest</strong>",
        'chest_notOpened' : "But you decide not to open it",
        'chestTrap_part1' : "But it's a <strong>trap</strong>, a poison is spreading",
        'chestTrap_part2' : "You lost ",
        'chestTrap_part3' : " of health",
        'chestScroll' : "You find a <strong>magic scroll</strong>",
        'chestPotion' : "You find a <strong>healing potion</strong>",
        'chestMineral' : "You find a <strong>gemstone</strong>",
        'chestLimit' : "But you don't have enough room",
        // Fight
        'fightStart' : "appears",
        'fightWin_part1' : " defeated with ",
        'fightWin_part2' : "You have lost ",
        'fightWin_part3' : " of health",
        'fightWin_part4' : " of experience",
        'fightWin_part5' : "You have won ",
        'fightMagic' : "You have defeated the monster with a magic spell",
        // Game over
        'gameover_part1' : "You have lost.<br />You have been at the floor  ",
        'gameover_part2' : "Score : ",
        'gameoverButton' : "Restart",
    },
    'monsters' : {
        'lich' : "Darkness lich",
        'lightSword' : "Sword of light",
        'golem' : "Stone Golem",
        'deadWarrior' : "Undead warrior",
        'daemon' : "Daemon",
        'minotaur' : "Minotaur",
        'cerberus' : "Cerberus",
        'troll' : "Troll",
        'eyeghost' : "Evil eye",
        'werewolf' : "Werewolf",
        'monster' : "Sea monster",
        'lizard' : "Lizard man",
        'gargoyle' : "Gargoyle",
        'gobelin' : "Gobelin",
        'snake' : "Snake",
        'bat' : "Bat",
        'slim' : "Blob"
    },
    'tips' : [
        "When the hero's health drops to 0, the game is over. However, leveling up or a potion restores all health points.",
        "The shield stat is used to reduce damage when attacked in combat. It can only be increased by the spirit of the earth.",
        "The fights take place automatically so be sure to choose your fight action.",
        "Each monster requires a number of hits to be defeated which is calculated as follows: monster health / hero strength.",
        "The damage of a monster is calculated according to the following formula: (number of hits to be defeated * strength of the monster) - hero's shield.",
        "Defeating a monster with a spell doesn't grant much experience points but can prevent certain death or very large damage.",
        "The Tower is populated by various spirits. Most of them will help you greatly on your quest.",
        "When you open a chest, you have a chance to stumble upon a monster that will deal damage to you that ignores your shield stat.",
        "The Tower is divided by floors. Each floor itself is made up of 10 rooms. On each floor, the monsters become more powerful.",
        "For the more curious, the end-of-game score is calculated according to the following formula: ((shield + strength + maximum health) * level) * floor.",
        "At the start of the game, each item you can collect is limited to a certain quantity. Later, you can keep more.",
        "A mysterious merchant lives in the Tower, it is possible that he offers you a transaction for gemstones" 
    ]
};

// =================================================
// ============ CORE INITIALISATION

// Create data game or parse it if existing
if (!getStorage("TOWER-save")) {
    _game = {
        'core' : {
            'ongoing' : false, 
            'name' : null, 
            'sound' : true,
            'version' : VERSION,
            'language' : "EN",
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
            'potionUsed' : 0,
            'fightVictory' : 0,
            'chestOpen': 0,
            'chestTrap' : 0,
            'chestNotOpened' : 0,
            'spiritMeet' : 0,
            'merchantAccepted' : 0,
            'merchantRefused' : 0,
        },
        'character' : {
            'health' : SETTINGS.data.health,
            'healthMax' : SETTINGS.data.healthMax,
            'power' : SETTINGS.data.power,
            'stamina' : SETTINGS.data.stamina,
            'xp' : SETTINGS.data.xp,
            'xpTo' : SETTINGS.data.xpTo,
            'level' : SETTINGS.data.level,
            'floor' : SETTINGS.data.floor,
            'room' : SETTINGS.data.room,
            'itemPotion' : SETTINGS.data.itemPotion,
            'itemScroll' : SETTINGS.data.itemScroll,
            'itemMineral' : SETTINGS.data.itemMineral,
            'score' : SETTINGS.data.score
        }
    }

    setStorage("TOWER-save", JSON.stringify(_game));
} 
else {
    _game = JSON.parse(getStorage("TOWER-save"));
}

// Setup content according language
const CONTENT = (_game.core.language == "FR") ? FRENCH : ENGLISH;
Object.keys(CONTENT.main).forEach(key => {
    if (get("#" + key)) {
        get("#" + key).innerHTML = CONTENT.main[key];
    }
});

// Able to switch language between French and English
if (get("#switchLanguage")) {
    get("#switchLanguage").addEventListener("click", () => {
        _game.core.language = (_game.core.language == "FR") ? "EN" : "FR";
        setStorage("TOWER-save", JSON.stringify(_game));
        location.reload();
    });
};