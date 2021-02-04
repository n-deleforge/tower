// =================================================
// =================================================
// ============ MAIN

// ===> Check if a game is ongoing
GAME.core.ongoing == false ? launcher() : startGame("load");

// ===> Display the launcher 
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
            get("#nameHeroLabel").innerHTML = _CONTENT.app.nameHeroCheck;
            get("#nameHeroLabel").style.color = getVariableCSS("--errorTextColor");
        }
        else startGame("new");
    });
}

// ===> Start a new game or a loaded game
function startGame(mode) {
    // Display the game screen
    get('#startScreen').style.display = "none";
    get('#gameScreen').style.display = "flex";
    changeDisplay("actionGameMode");
    createMenu();
    createButtons();
    REFRESH_DISPLAY = setInterval(displayGame, 100);

    // If it's a new game
    if (mode == "new") {
        GAME.core.name = get("#nameHero").value;
        GAME.core.ongoing = true; 
        playSound("sound", "Room");

        get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/' + _SETTINGS.images.start + '" alt=""></div>';
        get("#gameContent").innerHTML += '<p>' + _CONTENT.app.startGame_part1 +  '.</p>';
        get("#gameContent").innerHTML += '<em>' + _CONTENT.app.startGame_part2 +  '.</em>';
        get("#gameContent").innerHTML += '<p>' + _CONTENT.app.startGame_part3 +  '.</p>';
    } 
    
    // If it's not a new game
    else if (mode == "load") {
        if (GAME.events.lastAction == "fight" && GAME.events.subAction != "fightOver") changeDisplay("actionGameToFight");
        if (GAME.events.lastAction == "chest" && GAME.events.subAction != "chestOver") changeDisplay("actionGameToChest");

        get('#gameContent').innerHTML = GAME.events.currentEvent;
    }
}

// ===> Main function of the game
function playTurn() {
    GAME.events.subAction = null;
    GAME.character.room++;
    changeDisplay("screenDisplayMessage");

    // At the 10th room
    if (GAME.character.room > 10) {
        INTERVAL_REFRESH = 2000;
        GAME.character.room = 1; 
        GAME.character.floor++; 
        playSound("sound", "Floor");

        get("#gameMessage").innerHTML = "<p class=\"bigger\">" + _CONTENT.app.floor + ' ' + GAME.character.floor + "</p>";
    } 

    // All rooms expect the 10th
    else { 
        INTERVAL_REFRESH = 1000;
        GAME.stats.totalRoom++;
        playSound("sound", "Room");

        get("#gameMessage").innerHTML = "<p class=\"bigger\">" + _CONTENT.app.floor + ' ' + parseInt(GAME.character.floor) + "</p>";
        get("#gameMessage").innerHTML += "<p>" + _CONTENT.app.room + ' ' + GAME.character.room + "</p>";
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

// ===> Choose a game action
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

// ===> Using a potion
function heal() {
    if (GAME.character.itemHeal > 0 && GAME.character.health < GAME.character.healthMax) {
        GAME.character.itemHeal --; 
        GAME.character.health = GAME.character.healthMax; 
        GAME.stats.healUsed++;
        playSound("vibrate", 10);
        playSound("sound", "Heal");

        get("#gameContent").innerHTML += '<hr><p class="green">' + _CONTENT.app.healing + '</p>';
    }
    else playSound("vibrate", 250);
}

// ===> When there is no event
function noEvent() {
    GAME.events.lastAction = "noEvent";

    get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/' + _SETTINGS.images.noEvent + '" alt=""></div>';
    get("#gameContent").innerHTML += '<p>' + _CONTENT.app.noEvent + '.</p>';
}

// ===> When meeting a spirit
function spirit() {
    GAME.events.lastAction = "spirit";
    GAME.stats.spiritMeet++;

    let nb = rand(1, 8)

    // 7-8 : Earth spirit : add shield
    if (nb > 6) { 
        GAME.character.shield = GAME.character.shield + _SETTINGS.data.spiritShield;

        get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/' + _SETTINGS.images.earthSpirit + '" alt=""></div>';
        get("#gameContent").innerHTML += '<p>' +_CONTENT.app.spiritEarth_part1 + '.</p>';
        get("#gameContent").innerHTML += '<p class="green">' + _CONTENT.app.spiritEarth_part2 + ' <strong>' + _SETTINGS.data.spiritShield + '</strong> ' + plural(_SETTINGS.data.spiritShield, _CONTENT.app.point_singular, _CONTENT.app.point_plural) + '.</p>';
    } 

    // 5-6 : Light spirit : add experience
    else if (nb > 4) {
        let xp = rand(parseInt(GAME.character.xpTo / 8), parseInt(GAME.character.xpTo / 6));
        GAME.character.xp = GAME.character.xp + xp;

        get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/' + _SETTINGS.images.lightSpirit + '" alt=""></div>';
        get("#gameContent").innerHTML += '<p>' + _CONTENT.app.spiritLight_part1 + '.</p>';
        get("#gameContent").innerHTML += '<p class="green">' + _CONTENT.app.spiritLight_part2 + '<strong>' + xp + '</strong> ' + plural(xp, _CONTENT.app.point_singular, _CONTENT.app.point_plural) + _CONTENT.app.spiritLight_part3 + '.</p>';
    } 

    // 3-4 : Fire spirit : add strenght
    else if (nb > 2) {
        GAME.character.strength = GAME.character.strength + _SETTINGS.data.spiritStrength;

        get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/' + _SETTINGS.images.fireSpirit + '" alt=""></div>';
        get("#gameContent").innerHTML += '<p>' +_CONTENT.app.spiritFire_part1 + '.</p>';
        get("#gameContent").innerHTML += '<p class="green">' + _CONTENT.app.spiritFire_part2 + ' <strong>' + _SETTINGS.data.spiritStrength + '</strong> ' + plural(_SETTINGS.data.spiritStrength, _CONTENT.app.point_singular, _CONTENT.app.point_plural) + '.</p>';
    } 

    // 1-2 : Water spirit : add health
    else {
        GAME.character.healthMax = GAME.character.healthMax + _SETTINGS.data.spiritHealth;

        get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/' + _SETTINGS.images.waterSpirit + '" alt=""></div>';
        get("#gameContent").innerHTML += '<p>' + _CONTENT.app.spiritWater_part1 + '.</p>';
        get("#gameContent").innerHTML += '<p class="green">' + _CONTENT.app.spiritWater_part2 + ' <strong>' + _SETTINGS.data.spiritHealth + '</strong> ' + plural(_SETTINGS.data.spiritHealth, _CONTENT.app.point_singular, _CONTENT.app.point_plural) + '.</p>';
    }
}

// =================================================
// =================================================
// ============ CHEST EVENTS

// ===> When finding a chest
function chest() {
    GAME.events.lastAction = "chest";
    changeDisplay("actionGameToChest");

    get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/' + _SETTINGS.images.chest + '" alt=""></div>';
    get("#gameContent").innerHTML += '<p>' + _CONTENT.app.chest + ' !</p>';
}

// ===> When opening a chest
function openChest() {
    GAME.events.subAction = "chestOver";
    GAME.stats.chestOpen++;
    playSound("vibrate", 90);
    playSound("sound", "Chest");
    changeDisplay("actionChestToGame");

    let nb = rand(0, 10);
    let limited = false;

    // 8 - 10 : trap chest
    if (nb > 7) { 
        GAME.stats.chestTrap++;
        let damage = rand(1, GAME.character.health / 4);
        GAME.character.health = GAME.character.health - damage;

        get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/' + _SETTINGS.images.chestTrap + '" alt=""></div>';
        get("#gameContent").innerHTML += '<p>' + _CONTENT.app.chestTrap_part1 + ' !</p>';
        get("#gameContent").innerHTML += '<p class="red">' + _CONTENT.app.chestTrap_part2 + '<strong>' + damage + '</strong> ' + plural(damage, _CONTENT.app.point_singular, _CONTENT.app.point_plural) + _CONTENT.app.chestTrap_part3 + '.</p>';
    } 

    // 6 - 7 : escape item
    else if (nb > 5) { 
        _SETTINGS.data.itemLimit > GAME.character.itemEscape ? GAME.character.itemEscape++ : limited = true;

        get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/' + _SETTINGS.images.chestEscape + '" alt=""></div>';
        get("#gameContent").innerHTML += '<p>' + _CONTENT.app.chestEscape +  '.</p>';
        if (limited) get("#gameContent").innerHTML += '<p>' + _CONTENT.app.chestLimit + '.</p>';
    } 

     // 4 - 5 : magic item
    else if (nb > 3) {
        _SETTINGS.data.itemLimit > GAME.character.itemMagic ? GAME.character.itemMagic++ : limited = true;

        get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/' + _SETTINGS.images.chestMagic + '" alt=""></div>';
        get("#gameContent").innerHTML += '<p>' + _CONTENT.app.chestMagic + '.</p>';
        if (limited) get("#gameContent").innerHTML += '<p>' + _CONTENT.app.chestLimit + '.</p>';
    } 

    // 1 - 3 : heal item
    else { 
        _SETTINGS.data.itemLimit > GAME.character.itemHeal ? GAME.character.itemHeal++ : limited = true;

        get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/' + _SETTINGS.images.chestHeal + '" alt=""></div>';
        get("#gameContent").innerHTML += '<p>' + _CONTENT.app.chestHeal + '.</p>';
        if (limited) get("#gameContent").innerHTML += '<p>' + _CONTENT.app.chestLimit + '.</p>';
    }
}

// ===> When avoiding a chest
function closeChest() {
    GAME.events.subAction = "chestOver";
    GAME.stats.chestNotOpened++;
    playSound("vibrate", 10);
    changeDisplay("actionChestToGame");

    get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/' + _SETTINGS.images.chest + '" alt=""></div>';
    get("#gameContent").innerHTML += '<p>' + _CONTENT.app.chest + ' !</p>';
    get("#gameContent").innerHTML += '<p>' + _CONTENT.app.chest_notOpened + '.</p>';
}

// =================================================
// =================================================
// ============ FIGHT EVENTS

// ===> When a fight start
function fight() {
    GAME.events.lastAction = "fight";
    GAME.events.monster = choiceMonster();
    changeDisplay("actionGameToFight");

    get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/' + GAME.events.monster[3] + '" alt="' + GAME.events.monster[2] + '"></div>';
    get("#gameContent").innerHTML += '<p><strong>' + GAME.events.monster[2] + '</strong> ' + _CONTENT.app.fightStart + '</p>';
    get("#gameContent").innerHTML += '<p>' + _CONTENT.app.health + ' : <strong>' + GAME.events.monster[0] + '</strong> / ' + _CONTENT.app.strength + ' : <strong>'  + GAME.events.monster[1] + '</strong></p>';
}

// ===> Choose a monster according the floor
function choiceMonster() {
    let monsterLevel = rand(GAME.character.floor * 2, GAME.character.floor * 4)
    if (monsterLevel > 500) return [monsterLevel, parseInt(monsterLevel / 3), _CONTENT.monsters.dragon, _SETTINGS.images.monster17];
    if (monsterLevel > 450) return [monsterLevel, parseInt(monsterLevel / 3), _CONTENT.monsters.supDemon, _SETTINGS.images.monster16];
    if (monsterLevel > 400) return [monsterLevel, parseInt(monsterLevel / 3), _CONTENT.monsters.bigSpirit, _SETTINGS.images.monster15];
    if (monsterLevel > 350) return [monsterLevel, parseInt(monsterLevel / 3), _CONTENT.monsters.deadWarrior, _SETTINGS.images.monster14];
    if (monsterLevel > 290) return [monsterLevel, parseInt(monsterLevel / 3), _CONTENT.monsters.troll, _SETTINGS.images.monster13];
    if (monsterLevel > 240) return [monsterLevel, parseInt(monsterLevel / 3), _CONTENT.monsters.behemot, _SETTINGS.images.monster12];
    if (monsterLevel > 190) return [monsterLevel, parseInt(monsterLevel / 3), _CONTENT.monsters.minotaur, _SETTINGS.images.monster11];
    if (monsterLevel > 160) return [monsterLevel, parseInt(monsterLevel / 3), _CONTENT.monsters.cerberus, _SETTINGS.images.monster10];
    if (monsterLevel > 130) return [monsterLevel, parseInt(monsterLevel / 3), _CONTENT.monsters.goblin, _SETTINGS.images.monster09];
    if (monsterLevel > 100) return [monsterLevel, parseInt(monsterLevel / 3), _CONTENT.monsters.ghost, _SETTINGS.images.monster08];
    if (monsterLevel > 75)   return [monsterLevel, parseInt(monsterLevel / 3), _CONTENT.monsters.cockatrice, _SETTINGS.images.monster07];
    if (monsterLevel > 50)   return [monsterLevel, parseInt(monsterLevel / 3), _CONTENT.monsters.lamia, _SETTINGS.images.monster06];
    if (monsterLevel > 40)   return [monsterLevel, parseInt(monsterLevel / 3), _CONTENT.monsters.imp, _SETTINGS.images.monster05];
    if (monsterLevel > 30)   return [monsterLevel, parseInt(monsterLevel / 3), _CONTENT.monsters.plant, _SETTINGS.images.monster04];
    if (monsterLevel > 20)   return [monsterLevel, parseInt(monsterLevel / 3), _CONTENT.monsters.scorpio,_SETTINGS.images.monster03];
    if (monsterLevel > 10)   return [monsterLevel, parseInt(monsterLevel / 3), _CONTENT.monsters.spider, _SETTINGS.images.monster02];
                                          return [monsterLevel, parseInt(monsterLevel / 3), _CONTENT.monsters.slim, _SETTINGS.images.monster01];
}

// ===> When attacking a monster
function attack() {
    GAME.events.subAction = "fightOver";
    GAME.stats.fightVictory++;
    playSound("vibrate", 10);
    playSound("sound", "Attack");
    changeDisplay("actionFightToGame");

    // Damage
    let nbHit = Math.ceil(GAME.events.monster[0] / GAME.character.strength);
    let damage = parseInt(nbHit * GAME.events.monster[1] - parseInt(GAME.events.monster[1]) / nbHit) - GAME.character.shield; 
    if (nbHit == 1 ) damage = 0; if (damage < 0) damage = 0; // Can't be negative
    GAME.character.health = GAME.character.health - damage;

    // Experience
    let xp= rand(GAME.character.level * (GAME.events.monster[0]), GAME.character.level * GAME.events.monster[0] * 2);
    GAME.character.xp = GAME.character.xp + xp;
    GAME.stats.totalExp = GAME.stats.totalExp + xp;

    get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/' + GAME.events.monster[3] + '" alt="' + GAME.events.monster[2] + '"></div>';
    get("#gameContent").innerHTML += '<p><strong>' + GAME.events.monster[2] + '</strong> ' + _CONTENT.app.fightWin_part1 + '<strong>' + nbHit+ '</strong> ' + plural(nbHit, _CONTENT.app.hit_singular, _CONTENT.app.hit_plural) + ' !</p>';
    get("#gameContent").innerHTML += '<p class="red">' + _CONTENT.app.fightWin_part2 + '<strong>' + damage + '</strong> ' + plural(damage, _CONTENT.app.point_singular, _CONTENT.app.point_plural) + ' ' + _CONTENT.app.fightWin_part3 + '.</p>';
    
    if (GAME.character.health > 0) // Displayed only if still alive
        get("#gameContent").innerHTML += '<p class="green">' + _CONTENT.app.fightWin_part5 + '<strong>' + xp + '</strong> ' + plural(xp, _CONTENT.app.point_singular, _CONTENT.app.point_plural) + _CONTENT.app.fightWin_part4 + ".</p>";
}

// ===> When using magic
function magic() {
    if (GAME.character.itemMagic > 0) {
        GAME.events.subAction = "fightOver"; 
        GAME.character.itemMagic--;
        GAME.stats.fightVictory++; 
        playSound("vibrate", 10);
        playSound("sound", "Magic");
        changeDisplay("actionFightToGame");

        // Experience : 50% with magic
        let xp = rand(parseInt(GAME.character.level * (GAME.events.monster[0]) / 2), GAME.character.level * GAME.events.monster[0] );
        GAME.character.xp = GAME.character.xp + xp; 
        GAME.stats.totalExp = GAME.stats.totalExp + xp;
        
        get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/' + GAME.events.monster[3] + '" alt="' + GAME.events.monster[2] + '"></div>';
        get("#gameContent").innerHTML += '<p>' + _CONTENT.app.fightMagic + ".</p>";
        get("#gameContent").innerHTML += '<p class="green">' + _CONTENT.app.fightWin_part5 + '<strong>' + xp + '</strong> ' + plural(xp, _CONTENT.app.point_singular, _CONTENT.app.point_plural) + _CONTENT.app.fightWin_part4 + ".</p>";
    }
    else playSound("vibrate", 250);
}

// ===> When running away
function runAway() {
    if (GAME.character.itemEscape > 0) {
        GAME.character.itemEscape--;
        GAME.stats.fightEscape++; 
        playSound("vibrate", 10);
        playSound("sound", "sound", "Escape");
        changeDisplay("actionFightToGame");

        get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/' + GAME.events.monster[3] + '" alt="' + GAME.events.monster[2] + '"></div>';
        get("#gameContent").innerHTML += '<p>' + _CONTENT.app.fightEscape + '.</p>';
    }
    else playSound("vibrate", 250);
}

// =================================================
// =================================================
// ============ DISPLAY

// ===> Display informations, check death and save data
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
        storage("set", "TOWER-save", JSON.stringify(GAME))
    }
}

// ===> Display gameover after the death
function gameOver() {
    clearInterval(REFRESH_DISPLAY);
    playSound("vibrate", 500);
    changeDisplay('buttonGameMode');

    get("#move").removeEventListener("click", playTurn);
    get("#move").addEventListener("click", displayScore);
    get("#move").innerHTML = _CONTENT.app.results;
    get("#useHeal").style.display = "none";
    get("#gameContent").innerHTML += '<p class="red"><strong>' + _CONTENT.app.death + '</strong></p>';  
}

// ===> Display the score after the gameover
function displayScore() {
    resetData();
    changeDisplay("screenDisplayMessage");

    get("#gameMessage").style.backgroundColor = getVariableCSS("--gameoverBackground");
    get('#gameMessage').innerHTML = "<p class=\"bigger\">" + _CONTENT.app.gameover  + GAME.character.score + " pts.</p>";
    get('#gameMessage').innerHTML += "<button id=\"restart\">" + _CONTENT.app.gameoverButton + "</button>";
    get('#restart').addEventListener("click", function() { location.reload(); });
}

// ===> Modify actions
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

// ===> Check hero's stats
function checkInfo() {
    // Infos
    get('#headerTitle').innerHTML = _CONTENT.app.floor + ' ' + GAME.character.floor + " - " + _CONTENT.app.room + ' ' + GAME.character.room;
    get("#name").innerHTML = '<img src="assets/images/' + _SETTINGS.images.iconHero + '" alt=""> ' + GAME.core.name + " (" + _CONTENT.app.level + " " + GAME.character.level + ")";
    
    // Stats
    get("#health").innerHTML = '<img src="assets/images/' + _SETTINGS.images.iconHealth + '" alt=""> ' + _CONTENT.app.health + ' ' + GAME.character.health + ' / ' + GAME.character.healthMax;
    get("#xp").innerHTML = '<img src="assets/images/' + _SETTINGS.images.iconExperience + '" alt=""> ' + _CONTENT.app.experience + ' ' + GAME.character.xp + ' / ' + GAME.character.xpTo;
    get("#strength").innerHTML = '<img src="assets/images/' + _SETTINGS.images.iconStrength + '" alt="">  ' + _CONTENT.app.strength + ' ' + GAME.character.strength;
    get("#shield").innerHTML = '<img src="assets/images/' + _SETTINGS.images.iconShield + '" alt="">  ' + _CONTENT.app.shield + ' ' + GAME.character.shield;
}

// ===> Check items availability
function checkItems() {
    // Buttons
    get("#useHeal").style.opacity = GAME.character.itemHeal < 1 || GAME.character.health == GAME.character.healthMax ? 0.5 : 1;
    get("#useMagic").style.opacity = GAME.character.itemMagic > 0 ? 1 : 0.5;
    get("#useEscape").style.opacity = GAME.character.itemEscape > 0 ? 1 : 0.5;

    // Pictures and texts
    get("#potion").innerHTML = '<img src="assets/images/' +_SETTINGS.images.iconPotion + '" alt=""> ' + GAME.character.itemHeal + ' ' + plural(GAME.character.itemHeal, _CONTENT.app.heal_singular, _CONTENT.app.heal_plural);
    get("#magic").innerHTML = '<img src="assets/images/' +_SETTINGS.images.iconMagic + '" alt=""> ' + GAME.character.itemMagic + ' ' + plural(GAME.character.itemMagic, _CONTENT.app.magic_singular, _CONTENT.app.magic_plural);
    get("#escape").innerHTML = '<img src="assets/images/' +_SETTINGS.images.iconEscape + '"alt=""> ' + GAME.character.itemEscape + ' ' + plural(GAME.character.itemEscape, _CONTENT.app.escape_singular, _CONTENT.app.escape_plural);     
}

// ===> Check experience and level
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

        get("#gameContent").innerHTML += '<hr><p class="green">' + _CONTENT.app.levelUp_part1 + '.</p>';
        get("#gameContent").innerHTML += '<p class="green">' + _CONTENT.app.levelUp_part2 + '.</p>';
    }
}

// ===> Check the actual score and the best scores
function checkScore() {
    GAME.character.score = (((GAME.character.strength + GAME.character.healthMax) * GAME.character.level) * GAME.character.floor) - 30;
    if (GAME.character.score > GAME.stats.bestScore) GAME.stats.bestScore = GAME.character.score;
    if (GAME.character.floor > GAME.stats.bestFloor) GAME.stats.bestFloor = GAME.character.floor;
    if (GAME.character.level > GAME.stats.maxLevel) GAME.stats.maxLevel = GAME.character.level;
}

// ===> Check volume and its button
function checkSound() {
    if (GAME.core.sound == true) {
        GAME.core.sound = false;
        get("#volumeButton").innerHTML = "🔈";
    } else {
        GAME.core.sound = true;
        get("#volumeButton").innerHTML = "🔊";
    }
}

// ===> Check vibration and its button
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

// ===> Check game stats
function checkStats() {
    let titles = Object.values(_CONTENT.stats);
    let values = Object.values(GAME.stats);
    
    for (let i = 0; i < titles.length; i++) {
        (i == 0) ? get('#listStats').innerHTML = "<li>" + titles[i] + values[i] + "</li>" : get('#listStats').innerHTML += "<li>" + titles[i] + values[i] + "</li>"
    }    
}

// =================================================
// =================================================
// ============ GAME ASIDE

// ===> Create events for the menu
function createMenu() {
    // Open menu
    get("#openMenu").addEventListener("click", function() {
        get("#blankPage").style.display = "block";
        get("#menu").style.display = "block";
        get("#closeMenu").style.visibility = "visible";
        checkStats();
    });

    // Close menu
    get('#closeMenu').addEventListener("click", function() {
        get("#blankPage").style.display = "none";
        get("#menu").style.display = "none";
        get("#closeMenu").style.visibility = "hidden";
    });

    // Inside menu - restart
    get('#confirmRestart').addEventListener("click", function() {
        if (confirm(_CONTENT.app.confirmRestart))  {
            clearInterval(REFRESH_DISPLAY);
            GAME.core.ongoing = false;
            resetGame();
            location.reload();
        }
    });

    // Inside menu - total restart
    get('#confirmTotalRestart').addEventListener("click", function () {
        if (confirm(_CONTENT.app.confirmDelete))  {
            clearInterval(REFRESH_DISPLAY);
            storage("rem", "TOWER-save");
            location.reload();
        }
    });
}

// ===> Create events for the buttons
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
    get("#useEscape").addEventListener("click", runAway);
    get("#move").addEventListener("click", function() {
        playSound("vibrate", 50);
        playTurn();
    });
}

// ===> Play sound / vibration if it's enabled
function playSound(action, value) {
    if (action == "sound" && GAME.core.sound == true) get("#sound" + value).play();
    if (action == "vibrate" && GAME.core.vibrate == true) navigator.vibrate(value);
}

// ===> Reset all game data
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
    GAME.character.itemEscape = _SETTINGS.data.itemEscape;
    GAME.character.level = _SETTINGS.data.level;
    GAME.character.floor = _SETTINGS.data.floor;
    GAME.character.room = _SETTINGS.data.room;
    storage("set", "TOWER-save", JSON.stringify(GAME))
}