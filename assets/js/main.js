// =================================================
// =================================================
// ============ MAIN

/**
 * Initialize the application
 **/

GAME.core.ongoing == false ? launcher() : startGame("load");

/**
 * Display the screen title : show tip and allow new game
 **/

function launcher() {
    // Display the start screen
    get('#startScreen').style.display = "flex";
    get('#displayTip').innerHTML = _CONTENT.tips[rand(0, _CONTENT.tips.length)];

    // Check if the name is registred
    if (GAME.core.name != null && GAME.core.name != "") get("#nameHero").value = GAME.core.name
    else {
        get("#nameHero").value = "";
        get('#nameHero').focus();
    }

    // Check of the regex and start of the game
    get("#startGame").addEventListener("click", function () {
        if (!get("#nameHero").checkValidity() || get("#nameHero").value == "") {
            get("#nameHeroLabel").innerHTML = _CONTENT.events.nameHeroCheck;
            get("#nameHeroLabel").style.color = getVariableCSS("errorTextColor");
        }
        else startGame("new");
    });
}

/**
 *  Display the game screen,  create menu and buttons
 * @param {string} mode "new" to start a new game or "load" to load an existing game
 **/

function startGame(mode) {
    // Display the game screen
    get('#startScreen').style.display = "none";
    get('#gameScreen').style.display = "flex";
    changeDisplay("actionGameMode");
    createMenu();
    createButtons();
    checkVersion();
    REFRESH_DISPLAY = setInterval(displayGame, 100);

    // If it's a new game
    if (mode == "new") {
        GAME.core.name = get("#nameHero").value;
        GAME.core.ongoing = true; 
        playSound("Room");

        get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/' + _SETTINGS.images.start + '" alt=""></div>';
        get("#gameContent").innerHTML += '<p>' + _CONTENT.events.startGame_part1 +  '.</p>';
        get("#gameContent").innerHTML += '<em>' + _CONTENT.events.startGame_part2 +  '.</em>';
        get("#gameContent").innerHTML += '<p>' + _CONTENT.events.startGame_part3 +  '.</p>';
    } 
    
    // If it's not a new game
    else if (mode == "load") {
        if (GAME.events.lastAction == "fight" && GAME.events.subAction != "fightOver") changeDisplay("actionGameToFight");
        if (GAME.events.lastAction == "chest" && GAME.events.subAction != "chestOver") changeDisplay("actionGameToChest");

        get('#gameContent').innerHTML = GAME.events.currentEvent;
    }
}

/**
 * Main game function which manage floor and room, then call the choiceAction function
 **/

function playTurn() {
    GAME.events.subAction = null;
    GAME.character.room++;
    changeDisplay("screenDisplayMessage");

    // At the 10th room
    if (GAME.character.room > 10) {
        INTERVAL_REFRESH = 2000;
        GAME.character.room = 1; 
        GAME.character.floor++; 
        playSound("Floor");

        get("#gameMessage").innerHTML = "<p class=\"bigger\">" + _CONTENT.vocabulary.floor + ' ' + GAME.character.floor + "</p>";
    } 

    // All rooms expect the 10th
    else { 
        INTERVAL_REFRESH = 1000;
        GAME.stats.totalRoom++;
        playSound("Room");

        get("#gameMessage").innerHTML = "<p class=\"bigger\">" + _CONTENT.vocabulary.floor + ' ' + parseInt(GAME.character.floor) + "</p>";
        get("#gameMessage").innerHTML += "<p>" + _CONTENT.vocabulary.room + ' ' + GAME.character.room + "</p>";
    }

    // Timeout to show the game again
    setTimeout(function () {
        changeDisplay("screenHideMessage");
    }, INTERVAL_REFRESH);
    
    choiceAction();
}

// =================================================
// =================================================
// ============ EVENTS

/**
 * Randomly choose between no event, fight, chest or meeting a spirit
 **/

function choiceAction() {
    let nb = rand(1, 9);

    // 8-9 : spirit event
    if (nb > 7) {
        GAME.events.newAction = "spirit";
        GAME.events.newAction != GAME.events.lastAction ? spirit() : choiceAction();
    } 
    
    // 5-7 : fight event
    else if (nb > 4) { 
        GAME.events.newAction = "fight";
        GAME.events.newAction != GAME.events.lastAction ? fight() : choiceAction();
    } 
    
    // 3-4 : chest event
    else if (nb > 2) { 
        GAME.events.newAction = "chest";
        GAME.events.newAction != GAME.events.lastAction ? chest() : choiceAction();
    } 
    
    // 1-2 : no event
    else { 
        GAME.events.newAction = "noEvent";
        GAME.events.newAction != GAME.events.lastAction ? noEvent() : choiceAction();
    }
}

/**
 * Use a potion and regain all health
 **/

function heal() {
    if (GAME.character.itemHeal > 0 && GAME.character.health < GAME.character.healthMax) {
        GAME.character.itemHeal --; 
        GAME.character.health = GAME.character.healthMax; 
        GAME.stats.healUsed++;
        playVibrate(10);
        playSound("Heal");

        get("#gameContent").innerHTML += '<hr><p class="green">' + _CONTENT.events.healing + '</p>';
    }
    else playVibrate(250);
}

/**
 * When there is no event
 **/

function noEvent() {
    GAME.events.lastAction = "noEvent";

    get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/' + _SETTINGS.images.noEvent + '" alt=""></div>';
    get("#gameContent").innerHTML += '<p>' + _CONTENT.events.noEvent + '.</p>';
}

/**
 * Meeting with a spirit : randomly choose between fire, water, earth and light
 **/

function spirit() {
    GAME.events.lastAction = "spirit";
    GAME.stats.spiritMeet++;

    let nb = rand(1, 8)

    // 7-8 : Earth spirit : add shield
    if (nb > 6) { 
        GAME.character.shield = GAME.character.shield + _SETTINGS.data.spiritShield;

        get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/' + _SETTINGS.images.earthSpirit + '" alt=""></div>';
        get("#gameContent").innerHTML += '<p>' +_CONTENT.events.spiritEarth_part1 + '.</p>';
        get("#gameContent").innerHTML += '<p class="green">' + _CONTENT.events.spiritEarth_part2 + ' <strong>' + _SETTINGS.data.spiritShield + '</strong> ' + plural(_SETTINGS.data.spiritShield, _CONTENT.vocabulary.point_singular, _CONTENT.vocabulary.point_plural) + '.</p>';
    } 

    // 5-6 : Light spirit : add experience
    else if (nb > 4) {
        const xp = rand(parseInt(GAME.character.xpTo / 8), parseInt(GAME.character.xpTo / 6));
        GAME.character.xp = GAME.character.xp + xp;

        get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/' + _SETTINGS.images.lightSpirit + '" alt=""></div>';
        get("#gameContent").innerHTML += '<p>' + _CONTENT.events.spiritLight_part1 + '.</p>';
        get("#gameContent").innerHTML += '<p class="green">' + _CONTENT.events.spiritLight_part2 + '<strong>' + xp + '</strong> ' + plural(xp, _CONTENT.vocabulary.point_singular, _CONTENT.vocabulary.point_plural) + _CONTENT.events.spiritLight_part3 + '.</p>';
    } 

    // 3-4 : Fire spirit : add strenght
    else if (nb > 2) {
        GAME.character.strength = GAME.character.strength + _SETTINGS.data.spiritStrength;

        get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/' + _SETTINGS.images.fireSpirit + '" alt=""></div>';
        get("#gameContent").innerHTML += '<p>' +_CONTENT.events.spiritFire_part1 + '.</p>';
        get("#gameContent").innerHTML += '<p class="green">' + _CONTENT.events.spiritFire_part2 + ' <strong>' + _SETTINGS.data.spiritStrength + '</strong> ' + plural(_SETTINGS.data.spiritStrength, _CONTENT.vocabulary.point_singular, _CONTENT.vocabulary.point_plural) + '.</p>';
    } 

    // 1-2 : Water spirit : add health
    else {
        GAME.character.healthMax = GAME.character.healthMax + _SETTINGS.data.spiritHealth;

        get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/' + _SETTINGS.images.waterSpirit + '" alt=""></div>';
        get("#gameContent").innerHTML += '<p>' + _CONTENT.events.spiritWater_part1 + '.</p>';
        get("#gameContent").innerHTML += '<p class="green">' + _CONTENT.events.spiritWater_part2 + ' <strong>' + _SETTINGS.data.spiritHealth + '</strong> ' + plural(_SETTINGS.data.spiritHealth, _CONTENT.vocabulary.point_singular, _CONTENT.vocabulary.point_plural) + '.</p>';
    }
}

// =================================================
// =================================================
// ============ CHEST EVENTS

/**
 * Initialize the chest event : allow open / avoid
 **/

function chest() {
    GAME.events.lastAction = "chest";
    changeDisplay("actionGameToChest");

    get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/' + _SETTINGS.images.chest + '" alt=""></div>';
    get("#gameContent").innerHTML += '<p>' + _CONTENT.events.chest + ' !</p>';
}

/**
 * Open the chest : randomly choose between trap, potion, magic or scroll
 **/

function openChest() {
    GAME.events.subAction = "chestOver";
    GAME.stats.chestOpen++;
    playVibrate(90);
    playSound("Chest");
    changeDisplay("actionChestToGame");

    const nb = rand(0, 10);
    let limited = false;

    // 7 - 10 : trap chest
    if (nb > 6) { 
        GAME.stats.chestTrap++;
        const damage = rand(1, GAME.character.health / 4);
        GAME.character.health = GAME.character.health - damage;

        get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/' + _SETTINGS.images.chestTrap + '" alt=""></div>';
        get("#gameContent").innerHTML += '<p>' + _CONTENT.events.chestTrap_part1 + ' !</p>';
        get("#gameContent").innerHTML += '<p class="red">' + _CONTENT.events.chestTrap_part2 + '<strong>' + damage + '</strong> ' + plural(damage, _CONTENT.vocabulary.point_singular, _CONTENT.vocabulary.point_plural) + _CONTENT.events.chestTrap_part3 + '.</p>';
    } 

     // 4 - 6 : magic item
    else if (nb > 3) {
        _SETTINGS.data.itemLimit > GAME.character.itemMagic ? GAME.character.itemMagic++ : limited = true;

        get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/' + _SETTINGS.images.chestMagic + '" alt=""></div>';
        get("#gameContent").innerHTML += '<p>' + _CONTENT.events.chestMagic + '.</p>';
        if (limited) get("#gameContent").innerHTML += '<p>' + _CONTENT.events.chestLimit + '.</p>';
    } 

    // 1 - 3 : heal item
    else { 
        _SETTINGS.data.itemLimit > GAME.character.itemHeal ? GAME.character.itemHeal++ : limited = true;

        get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/' + _SETTINGS.images.chestHeal + '" alt=""></div>';
        get("#gameContent").innerHTML += '<p>' + _CONTENT.events.chestHeal + '.</p>';
        if (limited) get("#gameContent").innerHTML += '<p>' + _CONTENT.events.chestLimit + '.</p>';
    }
}

/**
 * Avoid the chest and do not open it
 **/

function closeChest() {
    GAME.events.subAction = "chestOver";
    GAME.stats.chestNotOpened++;
    playVibrate(10);
    changeDisplay("actionChestToGame");

    get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/' + _SETTINGS.images.chest + '" alt=""></div>';
    get("#gameContent").innerHTML += '<p>' + _CONTENT.events.chest + ' !</p>';
    get("#gameContent").innerHTML += '<p>' + _CONTENT.events.chest_notOpened + '.</p>';
}

// =================================================
// =================================================
// ============ FIGHT EVENTS

/**
 * Initialize the fight event : allow attack, magic or escaping
 **/

function fight() {
    GAME.events.lastAction = "fight";
    GAME.events.monster = choiceMonster();
    changeDisplay("actionGameToFight");

    get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/' + GAME.events.monster[3] + '" alt="' + GAME.events.monster[2] + '"></div>';
    get("#gameContent").innerHTML += '<p><strong>' + GAME.events.monster[2] + '</strong> ' + _CONTENT.events.fightStart + '</p>';
    get("#gameContent").innerHTML += '<p>' + _CONTENT.vocabulary.health + ' : <strong>' + GAME.events.monster[0] + '</strong> / ' + _CONTENT.vocabulary.strength + ' : <strong>'  + GAME.events.monster[1] + '</strong></p>';
}

/**
 * Choose the monster according the height in the tower
 **/

function choiceMonster() {
    const monsterHealth = rand(GAME.character.floor * 3, GAME.character.floor * 6);
    if (monsterLevel > 500) return [monsterHealth, rand(parseInt(monsterHealth / 5), parseInt(monsterHealth / 3)), _CONTENT.monsters.dragon, _SETTINGS.images.monster17];
    if (monsterLevel > 450) return [monsterHealth, rand(parseInt(monsterHealth / 5), parseInt(monsterHealth / 3)), _CONTENT.monsters.supDemon, _SETTINGS.images.monster16];
    if (monsterLevel > 400) return [monsterHealth, rand(parseInt(monsterHealth / 5), parseInt(monsterHealth / 3)), _CONTENT.monsters.bigSpirit, _SETTINGS.images.monster15];
    if (monsterLevel > 350) return [monsterHealth, rand(parseInt(monsterHealth / 5), parseInt(monsterHealth / 3)), _CONTENT.monsters.deadWarrior, _SETTINGS.images.monster14];
    if (monsterLevel > 290) return [monsterHealth, rand(parseInt(monsterHealth / 5), parseInt(monsterHealth / 3)), _CONTENT.monsters.troll, _SETTINGS.images.monster13];
    if (monsterLevel > 240) return [monsterHealth, rand(parseInt(monsterHealth / 5), parseInt(monsterHealth / 3)), _CONTENT.monsters.behemot, _SETTINGS.images.monster12];
    if (monsterLevel > 190) return [monsterHealth, rand(parseInt(monsterHealth / 5), parseInt(monsterHealth / 3)), _CONTENT.monsters.minotaur, _SETTINGS.images.monster11];
    if (monsterLevel > 160) return [monsterHealth, rand(parseInt(monsterHealth / 5), parseInt(monsterHealth / 3)), _CONTENT.monsters.cerberus, _SETTINGS.images.monster10];
    if (monsterLevel > 130) return [monsterHealth, rand(parseInt(monsterHealth / 5), parseInt(monsterHealth / 3)), _CONTENT.monsters.goblin, _SETTINGS.images.monster09];
    if (monsterLevel > 100) return [monsterHealth, rand(parseInt(monsterHealth / 5), parseInt(monsterHealth / 3)), _CONTENT.monsters.ghost, _SETTINGS.images.monster08];
    if (monsterLevel > 75)   return [monsterHealth, rand(parseInt(monsterHealth / 5), parseInt(monsterHealth / 3)), _CONTENT.monsters.cockatrice, _SETTINGS.images.monster07];
    if (monsterLevel > 50)   return [monsterHealth, rand(parseInt(monsterHealth / 5), parseInt(monsterHealth / 3)), _CONTENT.monsters.lamia, _SETTINGS.images.monster06];
    if (monsterLevel > 40)   return [monsterHealth, rand(parseInt(monsterHealth / 5), parseInt(monsterHealth / 3)), _CONTENT.monsters.imp, _SETTINGS.images.monster05];
    if (monsterLevel > 30)   return [monsterHealth, rand(parseInt(monsterHealth / 5), parseInt(monsterHealth / 3)), _CONTENT.monsters.plant, _SETTINGS.images.monster04];
    if (monsterLevel > 20)   return [monsterHealth, rand(parseInt(monsterHealth / 5), parseInt(monsterHealth / 3)), _CONTENT.monsters.scorpio,_SETTINGS.images.monster03];
    if (monsterLevel > 10)   return [monsterHealth, rand(parseInt(monsterHealth / 5), parseInt(monsterHealth / 3)), _CONTENT.monsters.spider, _SETTINGS.images.monster02];
                                          return [monsterHealth, rand(parseInt(monsterHealth / 5), parseInt(monsterHealth / 3)), _CONTENT.monsters.slim, _SETTINGS.images.monster01];
}

/**
 * Fight monster by physical attack : 100% of experience, taking damage
 **/

function attack() {
    GAME.events.subAction = "fightOver";
    GAME.stats.fightVictory++;
    playVibrate(10);
    playSound("Attack");
    changeDisplay("actionFightToGame");

    // Damage
    const nbHit = Math.ceil(GAME.events.monster[0] / GAME.character.strength);
    let damage = parseInt(nbHit * GAME.events.monster[1]) - GAME.character.shield; 
    if (nbHit == 1 ) damage = 0; if (damage < 0) damage = 0; // Can't be negative
    GAME.character.health = GAME.character.health - damage;

    // Experience
    const xp = rand(parseInt(GAME.character.xpTo / 8), parseInt(GAME.character.xpTo / 6));
    GAME.character.xp = GAME.character.xp + xp;

    get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/' + GAME.events.monster[3] + '" alt="' + GAME.events.monster[2] + '"></div>';
    get("#gameContent").innerHTML += '<p><strong>' + GAME.events.monster[2] + '</strong> ' + _CONTENT.events.fightWin_part1 + '<strong>' + nbHit+ '</strong> ' + plural(nbHit, _CONTENT.vocabulary.hit_singular, _CONTENT.vocabulary.hit_plural) + ' !</p>';
    get("#gameContent").innerHTML += '<p class="red">' + _CONTENT.events.fightWin_part2 + '<strong>' + damage + '</strong> ' + plural(damage, _CONTENT.vocabulary.point_singular, _CONTENT.vocabulary.point_plural) + ' ' + _CONTENT.events.fightWin_part3 + '.</p>';
    
    if (GAME.character.health > 0) // Displayed only if still alive
        get("#gameContent").innerHTML += '<p class="green">' + _CONTENT.events.fightWin_part5 + '<strong>' + xp + '</strong> ' + plural(xp, _CONTENT.vocabulary.point_singular, _CONTENT.vocabulary.point_plural) + _CONTENT.events.fightWin_part4 + ".</p>";
}

/**
 * Fight monster by magic : no damage but less experience
 **/ 
function magic() {
    if (GAME.character.itemMagic > 0) {
        GAME.events.subAction = "fightOver"; 
        GAME.character.itemMagic--;
        GAME.stats.fightVictory++; 
        playVibrate(10);
        playSound("Magic");
        changeDisplay("actionFightToGame");

        // Experience
        const xp = parseInt(GAME.character.xpTo / 8);
        GAME.character.xp = GAME.character.xp + xp;

        get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/' + GAME.events.monster[3] + '" alt="' + GAME.events.monster[2] + '"></div>';
        get("#gameContent").innerHTML += '<p>' + _CONTENT.events.fightMagic + ".</p>";
        get("#gameContent").innerHTML += '<p class="green">' + _CONTENT.events.fightWin_part5 + '<strong>' + xp + '</strong> ' + plural(xp, _CONTENT.vocabulary.point_singular, _CONTENT.vocabulary.point_plural) + _CONTENT.events.fightWin_part4 + ".</p>";
    }
    else playVibrate(250);
}

// =================================================
// =================================================
// ============ DISPLAY


/**
 * Display all the informations, check death and save game
 **/

function displayGame() {
    if (GAME.character.health < 1) gameOver();
    else {
        // Check everything and display values
        checkExperience();
        checkInfo();
        checkItems();
        checkScore();

        // Save content and save all data
        if (get("#gameContent").innerHTML != "") GAME.events.currentEvent = get("#gameContent").innerHTML;
        setStorage("TOWER-save", JSON.stringify(GAME))
    }
}

/**
 * Display the game over (called by the displayGame function)
 **/

function gameOver() {
    clearInterval(REFRESH_DISPLAY);
    playVibrate(500);
    changeDisplay('actionGameMode');
    get(".listActionsLine")[0].innerHTML = "<button id=\"gameover\">" +_CONTENT.events.results; + "</button>";
    get('#gameover').addEventListener("click", displayScore);
    get("#gameContent").innerHTML += '<p class="red"><strong>' + _CONTENT.events.death + '</strong></p>';  
}

/**
 * Display the score and allow to restart the game (called by the gameOver function)
 **/

function displayScore() {
    changeDisplay("screenDisplayMessage");
    get("#gameMessage").style.backgroundColor = getVariableCSS("gameoverBackground");
    get('#gameMessage').innerHTML = "<p>" + _CONTENT.events.gameover_part1  + GAME.character.floor + ".</p>";
    get('#gameMessage').innerHTML += '<p class="bigger">' + _CONTENT.events.gameover_part2  + GAME.character.score + '</p>';
    get('#gameMessage').innerHTML += "<button id=\"restart\">" + _CONTENT.events.gameoverButton + "</button>";
    get('#restart').addEventListener("click", () => { location.reload(); });
    resetGame();
}

/**
 * Modify the screen or the list of accessible buttons
 * @param {string} set keyword to hide or show buttons / screen
 **/

function changeDisplay(set) {
    // Classic game mode
    if (set == "actionGameMode") {
        get(".listActionsLine")[1].style.display = "none";
        get(".listActionsLine")[2].style.display = "none";
    }

    // Chest event
    if (set == "actionGameToChest") {
        get(".listActionsLine")[0].style.display = "none";
        get(".listActionsLine")[1].style.display = "flex";
    }
    if (set == "actionChestToGame") {
        get(".listActionsLine")[0].style.display = "flex";
        get(".listActionsLine")[1].style.display = "none";
    }

    // Fight event
    if (set == "actionGameToFight") {
        get(".listActionsLine")[0].style.display = "none";
        get(".listActionsLine")[2].style.display = "flex";
    }
    if (set == "actionFightToGame") {
        get(".listActionsLine")[0].style.display = "flex";
        get(".listActionsLine")[2].style.display = "none";
    }

    // Screen message
    if (set == "screenDisplayMessage") {
        get('~header').style.display = "none";
        get('#gameScreen').style.display = "none";
        get('#gameMessage').style.display = "flex";
    }
    if (set == "screenHideMessage") {
        get('~header').style.display = "flex";
        get('#gameScreen').style.display = "flex";
        get('#gameMessage').style.display = "none";
    }
}

// =================================================
// =================================================
// ============ CHECKS

/**
 * Check the hero's stats and the floor
 **/

function checkInfo() {
    get('#headerTitle').innerHTML = _CONTENT.vocabulary.floor + ' ' + GAME.character.floor + " - " + _CONTENT.vocabulary.room + ' ' + GAME.character.room;
    get("#health").innerHTML = '<img src="assets/images/' + _SETTINGS.images.iconHealth + '" alt=""> ' + GAME.character.health + ' / ' + GAME.character.healthMax;
    get("#xp").innerHTML = '<img src="assets/images/' + _SETTINGS.images.iconExperience + '" alt=""> ' + GAME.character.xp + ' / ' + GAME.character.xpTo + ' (' + GAME.character.level + ')';
    get("#strength").innerHTML = '<img src="assets/images/' + _SETTINGS.images.iconStrength + '" alt="">  ' + GAME.character.strength;
    get("#shield").innerHTML = '<img src="assets/images/' + _SETTINGS.images.iconShield + '" alt="">  ' + GAME.character.shield;
}

/**
 * Check numbers and availability of the items
 **/

function checkItems() {
    // Buttons
    get("#useHeal").style.opacity = GAME.character.itemHeal < 1 || GAME.character.health == GAME.character.healthMax ? 0.5 : 1;
    get("#useMagic").style.opacity = GAME.character.itemMagic > 0 ? 1 : 0.5;
    // Pictures and texts
    get("#potion").innerHTML = '<img src="assets/images/' +_SETTINGS.images.iconPotion + '" alt=""> ' + GAME.character.itemHeal;
    get("#magic").innerHTML = '<img src="assets/images/' +_SETTINGS.images.iconMagic + '" alt=""> ' + GAME.character.itemMagic;
}

/**
 * Check experience and level of the hero
 **/

function checkExperience() {
    if (GAME.character.xp >= GAME.character.xpTo) {
        // Level up
        GAME.character.level++;
        GAME.character.strength =  GAME.character.strength + _SETTINGS.data.lvlUpStrength;
        GAME.character.shield =  GAME.character.shield + _SETTINGS.data.lvlUpShield;
        GAME.character.healthMax =  GAME.character.healthMax + _SETTINGS.data.lvlUpHealth;

        // Heal and reset of the experience
        GAME.character.health = GAME.character.healthMax;
        GAME.character.xp = 0;
        GAME.character.xpTo = rand(parseInt(1.5 *  GAME.character.xpTo), 2 *  GAME.character.xpTo);

        get("#gameContent").innerHTML += '<hr><p class="green"><strong>' + _CONTENT.events.levelUp_part1 + '</strong>.</p>';
        get("#gameContent").innerHTML += '<p class="green">' + _CONTENT.events.levelUp_part2 + '.</p>';
    }
}

/**
 * Check all the scores (best score, best floor, best level)
 **/

function checkScore() {
    GAME.character.score = (((GAME.character.strength + GAME.character.healthMax) * GAME.character.level) * GAME.character.floor) - 30;
    if (GAME.character.score > GAME.stats.bestScore) GAME.stats.bestScore = GAME.character.score;
    if (GAME.character.floor > GAME.stats.bestFloor) GAME.stats.bestFloor = GAME.character.floor;
    if (GAME.character.level > GAME.stats.maxLevel) GAME.stats.maxLevel = GAME.character.level;
}

/**
 * Check the activation of the volume (+ button)
 **/

function checkSound() {
    if (GAME.core.sound == true) {
        GAME.core.sound = false;
        get("#volumeButton").innerHTML = "🔈";
    } else {
        GAME.core.sound = true;
        get("#volumeButton").innerHTML = "🔊";
    }
}

/**
 * Check the activation of the vibration (+ button)
 **/

function checkVibrate() {
    if (GAME.core.vibrate == true) {
        GAME.core.vibrate = false;
        get("#vibrateButton").innerHTML = "📴";
    }
    else {
        GAME.core.vibrate = true;
        get("#vibrateButton").innerHTML = "📳";
    }
}

/**
 * Check and display the stats in the menu
 **/

function checkStats() {
    let titles = Object.values(_CONTENT.stats);
    let values = Object.values(GAME.stats);
    
    for (let i = 0; i < titles.length; i++) {
        (i == 0) ? get('#listStats').innerHTML = "<li>" + titles[i] + values[i] + "</li>" : get('#listStats').innerHTML += "<li>" + titles[i] + values[i] + "</li>"
    }    
}

// =================================================
// =================================================
// ============ UNCATEGORIZED

/**
 * Check if there is a new version
 **/

function checkVersion() {
    if (GAME.core.version != _VERSION) GAME.core.version = _VERSION;
    setStorage("TOWER-save", JSON.stringify(GAME))
}

/**
 * Create the menu (allow opening, closing, restarting etc)
 **/

function createMenu() {
    // Open menu
    get("#openMenu").addEventListener("click", () => {
        get("#blankMenu").style.display = "block";
        get("#menu").style.display = "block";
        get("#closeMenu").style.visibility = "visible";
        checkStats();
    });

    // Close menu
    get('#closeMenu').addEventListener("click", () => {
        get("#blankMenu").style.display = "none";
        get("#menu").style.display = "none";
        get("#closeMenu").style.visibility = "hidden";
    });

    // Inside menu - restart
    get('#confirmRestart').addEventListener("click", () => {
        get("#blankPopup").style.display = "block";
        get("#popup").style.display = "flex";
        get("#popupText").innerHTML = _CONTENT.main.popupRestart;

        get("#popupCancel").addEventListener("click", () => {
            get("#blankPopup").style.display = "none";
            get("#popup").style.display = "none";
        });

        get("#popupAccept").addEventListener("click", () => {
            clearInterval(REFRESH_DISPLAY);
            GAME.core.ongoing = false;
            resetGame();
            location.reload();
        });
    });

    // Inside menu - total restart
    get('#confirmDelete').addEventListener("click", () => {
        get("#blankPopup").style.display = "block";
        get("#popup").style.display = "flex";
        get("#popupText").innerHTML = _CONTENT.main.popupDelete;

        get("#popupCancel").addEventListener("click", () => {
            get("#blankPopup").style.display = "none";
            get("#popup").style.display = "none";
        });

        get("#popupAccept").addEventListener("click", () => {
            clearInterval(REFRESH_DISPLAY);
            remStorage("TOWER-save");
            location.reload();
        });
    });
}

/**
 * Create the buttons (action, fight, chest, system etc)
 **/

function createButtons() {
    // Menu
    get("#openMenu").style.visibility = "visible";
    get("#volumeButton").addEventListener("click", checkSound);
    get("#vibrateButton").addEventListener("click", checkVibrate);
    GAME.core.sound == true ? get("#volumeButton").innerHTML = "🔊" : get("#volumeButton").innerHTML = "🔈";
    GAME.core.vibrate == true ? get("#vibrateButton").innerHTML = "📳" : get("#vibrateButton").innerHTML = "📴";

    // Actions
    get("#useHeal").addEventListener("click", heal);
    get("#openChest").addEventListener("click", openChest);
    get("#closeChest").addEventListener("click", closeChest);
    get("#useAttack").addEventListener("click", attack);
    get("#useMagic").addEventListener("click", magic);
    get("#move").addEventListener("click", () => {
        playVibrate(50);
        playTurn();
    });
}

/**
 * Play sound if it's enabled
 * @param {string} value the "id" of the sound
 **/

function playSound(value) {
    if (GAME.core.sound == true) get("#sound" + value).play();
}

/**
 * Play vibration if it's enabled
 * @param {string} value the "length" of the vibration
 **/

function playVibrate(length) {
    if (GAME.core.vibrate == true) navigator.vibrate(length);
}

/**
 * Reset the game (reinitialize stats and floor)
 **/

function resetGame() {
    GAME.core.ongoing = false;
    GAME.stats.totalGame++;
    GAME.character.health = _SETTINGS.data.health;
    GAME.character.healthMax = _SETTINGS.data.healthMax;
    GAME.character.strength = _SETTINGS.data.strength;
    GAME.character.shield = _SETTINGS.data.shield;
    GAME.character.xp = _SETTINGS.data.xp;
    GAME.character.xpTo = _SETTINGS.data.xpTo;
    GAME.character.itemHeal = _SETTINGS.data.itemHeal;
    GAME.character.itemMagic = _SETTINGS.data.itemMagic;
    GAME.character.level = _SETTINGS.data.level;
    GAME.character.floor = _SETTINGS.data.floor;
    GAME.character.room = _SETTINGS.data.room;
    setStorage("TOWER-save", JSON.stringify(GAME))
}