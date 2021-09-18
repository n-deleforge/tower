// =================================================
// ============ MAIN

/**
 * Initialize the application
 **/

game.core.ongoing == false ? launcher() : startGame("load");

/**
 * Display the screen title : show tip and allow new game
 **/

function launcher() {
    // Switch language on the start screen
    get("#switchLanguage").addEventListener("click", switchLanguage);

    // Display the start screen
    get('#start').style.display = "flex";
    get('#displayTip').innerHTML = _content.tips[rand(0, _content.tips.length)];

    // Check if the name is registred
    if (game.core.name != null && game.core.name != "") get("#nameCharacter").value = game.core.name
    else {
        get("#nameCharacter").value = "";
        get('#nameCharacter').focus();
    }

    // Check of the regex and start of the game
    get("#play").addEventListener("click", function () {
        if (!get("#nameCharacter").checkValidity() || get("#nameCharacter").value == "") {
            get("#nameCharacterLabel").innerHTML = _content.events.nameHeroCheck;
            get("#nameCharacterLabel").style.color = getVariableCSS("text-error");
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
    get('#start').style.display = "none";
    get('#game').style.display = "flex";
    changeDisplay("normal-game");
    createMenu();
    createButtons();
    checkVersion();
    refreshDisplay = setInterval(displayGame, 100);

    // If it's a new game
    if (mode == "new") {
        game.core.name = get("#nameCharacter").value;
        game.core.ongoing = true; 
        playSound("Room");

        get("#screen").innerHTML = '<div id="containerImage"><img src="assets/image/' + _settings.images.start + '" alt=""></div>';
        get("#screen").innerHTML += '<p>' + _content.events.startGame_part1 +  '.</p>';
        get("#screen").innerHTML += '<em>' + _content.events.startGame_part2 +  '.</em>';
        get("#screen").innerHTML += '<p>' + _content.events.startGame_part3 +  '.</p>';
    } 
    
    // If it's not a new game
    else if (mode == "load") {
        if (game.events.lastAction == "fight" && game.events.subAction != "fightOver") changeDisplay("normal-to-fight");
        if (game.events.lastAction == "chest" && game.events.subAction != "chestOver") changeDisplay("normal-to-chest");
        if (game.events.lastAction == "merchant" && game.events.subAction != "merchantOver") changeDisplay("normal-to-merchant");

        get('#screen').innerHTML = game.events.currentEvent;
    }
}

/**
 * Main game function which manage floor and room, then call the choiceAction function
 **/

function playTurn() {
    game.events.subAction = null;
    game.character.room++;
    changeDisplay("screen-to-message");

    // At the 10th room
    if (game.character.room > 10) {
        refreshInterval = 2000;
        game.character.room = 1; 
        game.character.floor++; 
        playSound("Floor");

        get("#message").innerHTML = "<p class=\"bigger\">" + _content.vocabulary.floor + ' ' + game.character.floor + "</p>";
    } 

    // All rooms expect the 10th
    else { 
        refreshInterval = 1000;
        game.stats.totalRoom++;
        playSound("Room");

        get("#message").innerHTML = "<p class=\"bigger\">" + _content.vocabulary.floor + ' ' + parseInt(game.character.floor) + "</p>";
        get("#message").innerHTML += "<p>" + _content.vocabulary.room + ' ' + game.character.room + "</p>";
    }

    // Timeout to show the game again
    setTimeout(function () {
        changeDisplay("message-to-screen");
    }, refreshInterval);
    
    choiceAction();
}

// =================================================
// ============ EVENTS

/**
 * Randomly choose between no event, fight, chest or meeting a spirit
 **/

function choiceAction() {
    // The merchant is only accessible after the floor 10
    let event = (game.character.floor > 5) ? rand(1,5) : rand(1,4);

    // Merchant event
    if (event == 5) {
        game.events.newAction = "merchant";
        (game.events.newAction != game.events.lastAction) ? merchant() : choiceAction();
    } 

    // Spirit event
    else if (event == 4) {
        game.events.newAction = "spirit";
        (game.events.newAction != game.events.lastAction) ? spirit() : choiceAction();
    } 
    
    // Fight event
    else if (event == 3) { 
        game.events.newAction = "fight";
        (game.events.newAction != game.events.lastAction) ? fight() : choiceAction();
    } 
    
    // Chest event
    else if (event == 2) { 
        game.events.newAction = "chest";
        (game.events.newAction != game.events.lastAction) ? chest() : choiceAction();
    } 
    
    // No event
    else { 
        game.events.newAction = "noEvent";
        (game.events.newAction != game.events.lastAction) ? noEvent() : choiceAction();
    }
}

/**
 * Use a potion and regain all health
 **/

function heal() {
    if (game.character.itemHeal > 0 && game.character.health < game.character.healthMax) {
        game.character.itemHeal --; 
        game.character.health = game.character.healthMax; 
        game.stats.healUsed++;
        playVibrate(10);
        playSound("Heal");

        get("#screen").innerHTML += '<hr><p class="green">' + _content.events.healing + '</p>';
    }
    else playVibrate(250);
}

/**
 * When there is no event
 **/

function noEvent() {
    game.events.lastAction = "noEvent";

    get("#screen").innerHTML = '<div id="containerImage"></div>';
    get("#containerImage").style.background = "url('assets/image/" + _settings.images.noEvent + "') no-repeat center"; 
    get("#containerImage").style.backgroundSize = "cover"; 
    get("#screen").innerHTML += '<p>' + _content.events.noEvent + '.</p>';
}

/**
 * Meeting with a spirit : randomly choose between fire, water, earth and light
 **/

function spirit() {
    game.events.lastAction = "spirit";
    game.stats.spiritMeet++;

    let meeting = rand(1, 4)

    // 7-8 : Earth spirit : add shield
    if (meeting == 4) { 
        game.character.shield = game.character.shield + _settings.data.spiritShield;

        get("#screen").innerHTML = '<div id="containerImage"><img src="assets/image/' + _settings.images.earthSpirit + '" alt=""></div>';
        get("#screen").innerHTML += '<p>' +_content.events.spiritEarth_part1 + '.</p>';
        get("#screen").innerHTML += '<p class="green">' + _content.events.spiritEarth_part2 + ' <strong>' + _settings.data.spiritShield + '</strong> ' + plural(_settings.data.spiritShield, _content.vocabulary.point_singular, _content.vocabulary.point_plural) + '.</p>';
    } 

    // 5-6 : Light spirit : add experience
    else if (meeting == 3) {
        const xp = rand(parseInt(game.character.xpTo / 8), parseInt(game.character.xpTo / 6));
        game.character.xp = game.character.xp + xp;

        get("#screen").innerHTML = '<div id="containerImage"><img src="assets/image/' + _settings.images.lightSpirit + '" alt=""></div>';
        get("#screen").innerHTML += '<p>' + _content.events.spiritLight_part1 + '.</p>';
        get("#screen").innerHTML += '<p class="green">' + _content.events.spiritLight_part2 + '<strong>' + xp + '</strong> ' + plural(xp, _content.vocabulary.point_singular, _content.vocabulary.point_plural) + _content.events.spiritLight_part3 + '.</p>';
    } 

    // 3-4 : Fire spirit : add strenght
    else if (meeting == 2) {
        game.character.strength = game.character.strength + _settings.data.spiritStrength;

        get("#screen").innerHTML = '<div id="containerImage"><img src="assets/image/' + _settings.images.fireSpirit + '" alt=""></div>';
        get("#screen").innerHTML += '<p>' +_content.events.spiritFire_part1 + '.</p>';
        get("#screen").innerHTML += '<p class="green">' + _content.events.spiritFire_part2 + ' <strong>' + _settings.data.spiritStrength + '</strong> ' + plural(_settings.data.spiritStrength, _content.vocabulary.point_singular, _content.vocabulary.point_plural) + '.</p>';
    } 

    // 1-2 : Water spirit : add health
    else {
        game.character.healthMax = game.character.healthMax + _settings.data.spiritHealth;

        get("#screen").innerHTML = '<div id="containerImage"><img src="assets/image/' + _settings.images.waterSpirit + '" alt=""></div>';
        get("#screen").innerHTML += '<p>' + _content.events.spiritWater_part1 + '.</p>';
        get("#screen").innerHTML += '<p class="green">' + _content.events.spiritWater_part2 + ' <strong>' + _settings.data.spiritHealth + '</strong> ' + plural(_settings.data.spiritHealth, _content.vocabulary.point_singular, _content.vocabulary.point_plural) + '.</p>';
    }
}

// =================================================
// ============ MERCHANT EVENTS

/**
 * Meeting with the merchant : exchange of minerals
 **/

function merchant() {
    game.events.lastAction = "merchant";
    get("#screen").innerHTML = '<div id="containerImage"><img src="assets/image/' + _settings.images.merchant + '" alt=""></div>';
    get("#screen").innerHTML += '<p>' + _content.events.merchant + '.</p>';

    // If enough mineral
    if (game.character.itemMineral > 1) {
        changeDisplay("normal-to-merchant");
        get("#screen").innerHTML += '<p>' + _content.events.merchant_proposition + ' ... </p>';
    } 

    // If not
    else {
        game.events.subAction = "merchantOver";
        get("#screen").innerHTML += '<p>' + _content.events.merchant_noMineral + ' ...</p>';
    }
}


/**
 * Accept the offer of the merchant
 **/

function acceptMerchant() {
    game.events.subAction = "merchantOver";
    game.stats.merchantAccepted++;
    playVibrate(90);
    playSound("Merchant");
    changeDisplay("merchant-to-normal");

    const deal = rand(1,3);

    // Offer 1 : strength + 2
    if (deal == 3) { 
        game.character.strength = game.character.strength + 2;

        get("#screen").innerHTML = '<div id="containerImage"><img src="assets/image/' + _settings.images.merchant + '" alt=""></div>';
        get("#screen").innerHTML += '<p>' + _content.events.merchant_accepted + ' !</p>';
        get("#screen").innerHTML += '<p class="green">' + _content.events.merchant_offer1 + '.</p>';
    } 

    // Offer 2 : health + 5 and stamina + 1
    else if (deal == 2) {
    game.character.healthMax = game.character.healthMax + 5;
    game.character.shield = game.character.shield + 1;

    get("#screen").innerHTML = '<div id="containerImage"><img src="assets/image/' + _settings.images.merchant + '" alt=""></div>';
    get("#screen").innerHTML += '<p>' + _content.events.merchant_accepted + ' !</p>';
    get("#screen").innerHTML += '<p class="green">' + _content.events.merchant_offer2 + '.</p>';
    }

    // Offer 3 : nothing
    else if (deal == 3) {
    get("#screen").innerHTML = '<div id="containerImage"><img src="assets/image/' + _settings.images.merchant + '" alt=""></div>';
    get("#screen").innerHTML += '<p>' + _content.events.merchant_accepted + ' !</p>';
    get("#screen").innerHTML += '<p class="green">' + _content.events.merchant_offer3 + '.</p>';
    }

    game.character.itemMineral = game.character.itemMineral - 2;
}

/**
 * Refuse the offer of the merchant
 **/

function refuseMerchant() {
    game.events.subAction = "merchantOver";
    game.stats.merchantRefused++;
    playVibrate(10);
    changeDisplay("merchant-to-normal");

    get("#screen").innerHTML = '<div id="containerImage"><img src="assets/image/' + _settings.images.merchant + '" alt=""></div>';
    get("#screen").innerHTML += '<p>' + _content.events.merchant + ' ... </p>';
    get("#screen").innerHTML += '<p>' + _content.events.merchant_refused + ' !</p>';
}

// =================================================
// ============ CHEST EVENTS

/**
 * Initialize the chest event : allow open / avoid
 **/

function chest() {
    game.events.lastAction = "chest";
    changeDisplay("normal-to-chest");

    get("#screen").innerHTML = '<div id="containerImage"><img src="assets/image/' + _settings.images.chest + '" alt=""></div>';
    get("#screen").innerHTML += '<p>' + _content.events.chest + ' !</p>';
}

/**
 * Open the chest : randomly choose between trap, potion, magic or scroll
 **/

function openChest() {
    game.events.subAction = "chestOver";
    game.stats.chestOpen++;
    playVibrate(90);
    playSound("Chest");
    changeDisplay("chest-to-normal");

    const chest = rand(1, 4);
    let limited = false;

    // Trap
    if (chest == 4) { 
        game.stats.chestTrap++;
        const damage = rand(1, game.character.health / 4);
        game.character.health = game.character.health - damage;

        get("#screen").innerHTML = '<div id="containerImage"><img src="assets/image/' + _settings.images.chestOpen + '" alt=""></div>';
        get("#screen").innerHTML += '<p>' + _content.events.chestTrap_part1 + ' !</p>';
        get("#screen").innerHTML += '<p class="red">' + _content.events.chestTrap_part2 + '<strong>' + damage + '</strong> ' + plural(damage, _content.vocabulary.point_singular, _content.vocabulary.point_plural) + _content.events.chestTrap_part3 + '.</p>';
    } 

    // Mineral
    else if (chest == 3) { 
        _settings.data.itemLimit > game.character.itemMineral ? game.character.itemMineral++ : limited = true;

        get("#screen").innerHTML = '<div id="containerImage"><img src="assets/image/' + _settings.images.chestOpen + '" alt=""></div>';
        get("#screen").innerHTML += '<p>' + _content.events.chestMineral + '.</p>';
        if (limited) get("#screen").innerHTML += '<p>' + _content.events.chestLimit + '.</p>';
    } 

     // Spell
    else if (chest == 2) {
        _settings.data.itemLimit > game.character.itemMagic ? game.character.itemMagic++ : limited = true;

        get("#screen").innerHTML = '<div id="containerImage"><img src="assets/image/' + _settings.images.chestOpen + '" alt=""></div>';
        get("#screen").innerHTML += '<p>' + _content.events.chestMagic + '.</p>';
        if (limited) get("#screen").innerHTML += '<p>' + _content.events.chestLimit + '.</p>';
    } 

    // Potion
    else { 
        _settings.data.itemLimit > game.character.itemHeal ? game.character.itemHeal++ : limited = true;

        get("#screen").innerHTML = '<div id="containerImage"><img src="assets/image/' + _settings.images.chestOpen + '" alt=""></div>';
        get("#screen").innerHTML += '<p>' + _content.events.chestHeal + '.</p>';
        if (limited) get("#screen").innerHTML += '<p>' + _content.events.chestLimit + '.</p>';
    }
}

/**
 * Avoid the chest and do not open it
 **/

function closeChest() {
    game.events.subAction = "chestOver";
    game.stats.chestNotOpened++;
    playVibrate(10);
    changeDisplay("chest-to-normal");

    get("#screen").innerHTML = '<div id="containerImage"><img src="assets/image/' + _settings.images.chest + '" alt=""></div>';
    get("#screen").innerHTML += '<p>' + _content.events.chest + ' !</p>';
    get("#screen").innerHTML += '<p>' + _content.events.chest_notOpened + '.</p>';
}

// =================================================
// ============ FIGHT EVENTS

/**
 * Initialize the fight event : allow attack, magic or escaping
 **/

function fight() {
    game.events.lastAction = "fight";
    game.events.monster = bestiary();
    changeDisplay("normal-to-fight");

    get("#screen").innerHTML = '<div id="containerImage"><img src="assets/image/' + game.events.monster[3] + '" alt="' + game.events.monster[2] + '"></div>';
    get("#screen").innerHTML += '<p><strong>' + game.events.monster[2] + '</strong> ' + _content.events.fightStart + '</p>';
    get("#screen").innerHTML += '<p>' + _content.vocabulary.health + ' : <strong>' + game.events.monster[0] + '</strong> / ' + _content.vocabulary.strength + ' : <strong>'  + game.events.monster[1] + '</strong></p>';
}

/**
 * Choose the monster according the height in the tower
 **/

function bestiary() {
    const monsterHealth = rand(game.character.floor * 3, game.character.floor * 5);
    let monsterStrenght = parseInt(rand(monsterHealth / 4, monsterHealth / 3));
    if (monsterStrenght == 0 || monsterStrenght < 0) monsterStrenght = 1;
    
    if (monsterHealth > 500) return [monsterHealth, monsterStrenght, _content.monsters.lich, _settings.images.monster17];
    if (monsterHealth > 400) return [monsterHealth, monsterStrenght, _content.monsters.lightSword, _settings.images.monster16];
    if (monsterHealth > 300) return [monsterHealth, monsterStrenght, _content.monsters.golem, _settings.images.monster15];
    if (monsterHealth > 200) return [monsterHealth, monsterStrenght, _content.monsters.deadWarrior, _settings.images.monster14];
    if (monsterHealth > 185) return [monsterHealth, monsterStrenght, _content.monsters.daemon, _settings.images.monster13];
    if (monsterHealth > 170) return [monsterHealth, monsterStrenght, _content.monsters.minotaur, _settings.images.monster12];
    if (monsterHealth > 155) return [monsterHealth, monsterStrenght, _content.monsters.cerberus, _settings.images.monster11];
    if (monsterHealth > 140) return [monsterHealth, monsterStrenght, _content.monsters.troll, _settings.images.monster10];
    if (monsterHealth > 125) return [monsterHealth, monsterStrenght, _content.monsters.eyeghost, _settings.images.monster09];
    if (monsterHealth > 110) return [monsterHealth, monsterStrenght, _content.monsters.werewolf, _settings.images.monster08];
    if (monsterHealth > 95)   return [monsterHealth, monsterStrenght, _content.monsters.monster, _settings.images.monster07];
    if (monsterHealth > 80)   return [monsterHealth, monsterStrenght, _content.monsters.lizard, _settings.images.monster06];
    if (monsterHealth > 65)   return [monsterHealth, monsterStrenght, _content.monsters.gargoyle, _settings.images.monster05];
    if (monsterHealth > 50)   return [monsterHealth, monsterStrenght, _content.monsters.gobelin, _settings.images.monster04];
    if (monsterHealth > 35)   return [monsterHealth, monsterStrenght, _content.monsters.snake,_settings.images.monster03];
    if (monsterHealth > 20)   return [monsterHealth, monsterStrenght, _content.monsters.bat, _settings.images.monster02];
    return [monsterHealth, monsterStrenght, _content.monsters.slim, _settings.images.monster01];
}

/**
 * Fight monster by physical attack : 100% of experience, taking damage
 **/

function attack() {
    game.events.subAction = "fightOver";
    game.stats.fightVictory++;
    playVibrate(10);
    playSound("Attack");
    changeDisplay("fight-to-normal");

    // Damage
    const nbHit = Math.ceil(game.events.monster[0] / game.character.strength);
    let damage = parseInt(nbHit * game.events.monster[1]) - game.character.shield; 
    if (nbHit == 1 ) damage = 0; if (damage < 0) damage = 0; // Can't be negative
    game.character.health = game.character.health - damage;

    // Experience
    const xp = rand(parseInt(game.character.xpTo / 8), parseInt(game.character.xpTo / 6));
    game.character.xp = game.character.xp + xp;

    get("#screen").innerHTML = '<div id="containerImage"><img src="assets/image/' + game.events.monster[3] + '" alt="' + game.events.monster[2] + '"></div>';
    get("#screen").innerHTML += '<p><strong>' + game.events.monster[2] + '</strong> ' + _content.events.fightWin_part1 + '<strong>' + nbHit+ '</strong> ' + plural(nbHit, _content.vocabulary.hit_singular, _content.vocabulary.hit_plural) + ' !</p>';
    get("#screen").innerHTML += '<p class="red">' + _content.events.fightWin_part2 + '<strong>' + damage + '</strong> ' + plural(damage, _content.vocabulary.point_singular, _content.vocabulary.point_plural) + ' ' + _content.events.fightWin_part3 + '.</p>';
    
    if (game.character.health > 0) // Displayed only if still alive
        get("#screen").innerHTML += '<p class="green">' + _content.events.fightWin_part5 + '<strong>' + xp + '</strong> ' + plural(xp, _content.vocabulary.point_singular, _content.vocabulary.point_plural) + _content.events.fightWin_part4 + ".</p>";
}

/**
 * Fight monster by magic : no damage but less experience
 **/ 

function magic() {
    if (game.character.itemMagic > 0) {
        game.events.subAction = "fightOver"; 
        game.character.itemMagic--;
        game.stats.fightVictory++; 
        playVibrate(10);
        playSound("Magic");
        changeDisplay("fight-to-normal");

        // Experience
        const xp = parseInt(game.character.xpTo / 8);
        game.character.xp = game.character.xp + xp;

        get("#screen").innerHTML = '<div id="containerImage"><img src="assets/image/' + game.events.monster[3] + '" alt="' + game.events.monster[2] + '"></div>';
        get("#screen").innerHTML += '<p>' + _content.events.fightMagic + ".</p>";
        get("#screen").innerHTML += '<p class="green">' + _content.events.fightWin_part5 + '<strong>' + xp + '</strong> ' + plural(xp, _content.vocabulary.point_singular, _content.vocabulary.point_plural) + _content.events.fightWin_part4 + ".</p>";
    }
    else playVibrate(250);
}

// =================================================
// ============ DISPLAY


/**
 * Display all the informations, check death and save game
 **/

function displayGame() {
    if (game.character.health < 1) gameOver();
    else {
        // Check everything and display values
        checkExperience();
        checkInfo();
        checkItems();
        checkScore();

        // Save content and save all data
        if (get("#screen").innerHTML != "") game.events.currentEvent = get("#screen").innerHTML;
        setStorage("TOWER-save", JSON.stringify(game))
    }
}

/**
 * Display the score and allow to restart the game
 **/

function gameOver() {
    clearInterval(refreshDisplay);
    playVibrate(500);
    changeDisplay("screen-to-message");
    get("#message").style.backgroundColor = getVariableCSS("background-gameover");
    get('#message').innerHTML = "<p>" + _content.events.gameover_part1  + game.character.floor + ".</p>";
    get('#message').innerHTML += '<p class="bigger">' + _content.events.gameover_part2  + game.character.score + '</p>';
    get('#message').innerHTML += "<button class=\"button buttonAction\" id=\"restart\">" + _content.events.gameoverButton + "</button>";
    get('#restart').addEventListener("click", () => { location.reload(); });
    resetGame();
}

/**
 * Modify the screen or the list of accessible buttons
 * @param {string} set keyword to hide or show buttons / screen
 **/

function changeDisplay(set) {
    // Classic game mode
    if (set == "normal-game") {
        get("#chestMode").style.display = "none";
        get("#merchantMode").style.display = "none";
        get("#fightMode").style.display = "none";
    }

    // Chest event
    if (set == "normal-to-chest") {
        get("#classicMode").style.display = "none";
        get("#chestMode").style.display = "flex";
    }
    if (set == "chest-to-normal") {
        get("#classicMode").style.display = "flex";
        get("#chestMode").style.display = "none";
    }

    // Merchant event
    if (set == "normal-to-merchant") {
        get("#classicMode").style.display = "none";
        get("#merchantMode").style.display = "flex";
    }
    if (set == "merchant-to-normal") {
        get("#classicMode").style.display = "flex";
        get("#merchantMode").style.display = "none";
    }

    // Fight event
    if (set == "normal-to-fight") {
        get("#classicMode").style.display = "none";
        get("#fightMode").style.display = "flex";
    }
    if (set == "fight-to-normal") {
        get("#classicMode").style.display = "flex";
        get("#fightMode").style.display = "none";
    }

    // Screen message
    if (set == "screen-to-message") {
        get('~header').style.display = "none";
        get('#game').style.display = "none";
        get('#message').style.display = "flex";
    }
    if (set == "message-to-screen") {
        get('~header').style.display = "flex";
        get('#game').style.display = "flex";
        get('#message').style.display = "none";
    }
}

// =================================================
// ============ CHECKS

/**
 * Check the hero's stats and the floor
 **/

function checkInfo() {
    get('#headerTitle').innerHTML = _content.vocabulary.floor + ' ' + game.character.floor + " - " + _content.vocabulary.room + ' ' + game.character.room;
    get("#healthData").innerHTML = game.character.health + ' / ' + game.character.healthMax;
    get("#health").style.width = ((game.character.health * 100) / game.character.healthMax) + "%";
    get("#level").innerHTML = _content.vocabulary.level + ' ' + game.character.level;
    get("#xp").style.width = ((game.character.xp * 100) / game.character.xpTo) + "%";
    get("#strength").innerHTML = '<img src="assets/image/' + _settings.images.iconStrength + '" alt="">  ' + game.character.strength;
    get("#shield").innerHTML = '<img src="assets/image/' + _settings.images.iconShield + '" alt="">  ' + game.character.shield;
}

/**
 * Check numbers and availability of the items
 **/

function checkItems() {
    // Buttons
    if (game.character.itemHeal > 0 && game.character.health != game.character.healthMax) get("#useHeal").classList.remove("disabled"); 
    else get("#useHeal").classList.add("disabled");
    if (game.character.itemMagic > 0) get("#useMagic").classList.remove("disabled"); 
    else get("#useMagic").classList.add("disabled");

    // Pictures and texts
    get("#potion").innerHTML = '<img src="assets/image/' +_settings.images.iconPotion + '" alt=""> ' + game.character.itemHeal;
    get("#magic").innerHTML = '<img src="assets/image/' +_settings.images.iconMagic + '" alt=""> ' + game.character.itemMagic;
    get("#mineral").innerHTML = '<img src="assets/image/' + _settings.images.iconMineral + '" alt="">  ' + game.character.itemMineral;
}

/**
 * Check experience and level of the hero
 **/

function checkExperience() {
    if (game.character.xp >= game.character.xpTo) {
        // Level up
        game.character.level++;
        game.character.strength =  game.character.strength + _settings.data.lvlUpStrength;
        game.character.shield =  game.character.shield + _settings.data.lvlUpShield;
        game.character.healthMax =  game.character.healthMax + _settings.data.lvlUpHealth;

        // Heal and reset of the experience
        game.character.health = game.character.healthMax;
        game.character.xp = 0;
        game.character.xpTo = rand(parseInt(1.5 *  game.character.xpTo), 2 *  game.character.xpTo);

        get("#screen").innerHTML += '<hr><p class="green"><strong>' + _content.events.levelUp_part1 + '</strong>.</p>';
        get("#screen").innerHTML += '<p class="green">' + _content.events.levelUp_part2 + '.</p>';
    }
}

/**
 * Check all the scores (best score, best floor, best level)
 **/

function checkScore() {
    game.character.score = (((game.character.strength + game.character.healthMax) * game.character.level) * game.character.floor) - 30;
    if (game.character.score > game.stats.bestScore) game.stats.bestScore = game.character.score;
    if (game.character.floor > game.stats.bestFloor) game.stats.bestFloor = game.character.floor;
    if (game.character.level > game.stats.maxLevel) game.stats.maxLevel = game.character.level;
}

/**
 * Check the activation of the volume (+ button)
 **/

function checkSound() {
    if (game.core.sound) {
        game.core.sound = false;
        get("#volumeButton").innerHTML = _settings.icons.soundOff;
        get("#volumeButton").style.opacity = 0.5;
    } else {
        game.core.sound = true;
        get("#volumeButton").innerHTML = _settings.icons.soundOn;
        get("#volumeButton").style.opacity = 1;
    }
}

/**
 * Check the activation of the vibration (+ button)
 **/

function checkVibrate() {
    if (game.core.vibrate) {
        game.core.vibrate = false;
        get("#vibrateButton").innerHTML = _settings.icons.vibrateOff;
        get("#vibrateButton").style.opacity = 0.5;
    }
    else {
        game.core.vibrate = true;
        get("#vibrateButton").innerHTML = _settings.icons.vibrateOn;
        get("#vibrateButton").style.opacity = 1;
    }
}

/**
 * Check and display the stats in the menu
 **/

function checkStats() {
    let titles = Object.values(_content.stats);
    let values = Object.values(game.stats);
    
    for (let i = 0; i < titles.length; i++) {
        (i == 0) ? get('#listStats').innerHTML = "<li>" + titles[i] + values[i] + "</li>" : get('#listStats').innerHTML += "<li>" + titles[i] + values[i] + "</li>"
    }    
}

// =================================================
// ============ UNCATEGORIZED

/**
 * Check if there is a new version
 **/

function checkVersion() {
    game.core.version = _version;
    if (!game.core.language) game.core.language = "EN";
    if (!game.character.itemMineral) game.character.itemMineral = 0;
    if (!game.stats.merchantAccepted) game.stats.merchantAccepted = 0;
    if (!game.stats.merchantRefused) game.stats.merchantRefused = 0;
    setStorage("TOWER-save", JSON.stringify(game));
}

/**
 * Switch the app language between French and English
 **/

 function switchLanguage() {
    game.core.language = (game.core.language == "FR") ? "EN" : "FR";
    setStorage("TOWER-save", JSON.stringify(game));
    location.reload();
}

/**
 * Create the menu (allow opening, closing, restarting etc)
 **/

function createMenu() {
    // Open menu
    get("#openMenu").addEventListener("click", () => {
        get("#blankMenu").style.display = "block";
        get("#menu").style.display = "flex";
        get("#closeMenu").style.visibility = "visible";
        checkStats();
    });

    // Close menu with the button
    get('#closeMenu').addEventListener("click", () => {
        get("#closeMenu").style.visibility = "hidden";
        get("#blankMenu").style.display = "none";
        get("#menu").style.display = "none";
    });

    // Close the menu with the void
    get('#blankMenu').addEventListener("click", () => {
        get("#closeMenu").style.visibility = "hidden";
        get("#blankMenu").style.display = "none";
        get("#menu").style.display = "none";
    });

    // Inside menu - restart
    get('#confirmRestart').addEventListener("click", () => {
        get("#blankPopup").style.display = "block";
        get("#popup").style.display = "flex";
        get("#popupText").innerHTML = _content.main.popupRestart;

        get("#popupCancel").addEventListener("click", () => {
            get("#blankPopup").style.display = "none";
            get("#popup").style.display = "none";
        });

        get("#popupAccept").addEventListener("click", () => {
            clearInterval(refreshDisplay);
            game.core.ongoing = false;
            resetGame();
            location.reload();
        });
    });

    // Inside menu - total restart
    get('#confirmDelete').addEventListener("click", () => {
        get("#blankPopup").style.display = "block";
        get("#popup").style.display = "flex";
        get("#popupText").innerHTML = _content.main.popupDelete;

        get("#popupCancel").addEventListener("click", () => {
            get("#blankPopup").style.display = "none";
            get("#popup").style.display = "none";
        });

        get("#popupAccept").addEventListener("click", () => {
            clearInterval(refreshDisplay);
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

    if (!game.core.sound) {
        get("#volumeButton").innerHTML = _settings.icons.soundOff;
        get("#volumeButton").style.opacity = 0.5;
    } else get("#volumeButton").innerHTML = _settings.icons.soundOn;

    if (!game.core.vibrate) {
        get("#vibrateButton").innerHTML = _settings.icons.vibrateOff;
        get("#vibrateButton").style.opacity = 0.5;
    } else get("#vibrateButton").innerHTML = _settings.icons.vibrateOn;

    // Actions
    get("#useHeal").addEventListener("click", heal);
    get("#openChest").addEventListener("click", openChest);
    get("#closeChest").addEventListener("click", closeChest);
    get("#acceptOffer").addEventListener("click", acceptMerchant);
    get("#refuseOffer").addEventListener("click", refuseMerchant);
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
    if (game.core.sound == true) get("#sound" + value).play();
}

/**
 * Play vibration if it's enabled
 * @param {string} value the "length" of the vibration
 **/

function playVibrate(length) {
    if (game.core.vibrate == true) navigator.vibrate(length);
}

/**
 * Reset the game (reinitialize stats and floor)
 **/

function resetGame() {
    game.core.ongoing = false;
    game.stats.totalGame++;
    game.character.health = _settings.data.health;
    game.character.healthMax = _settings.data.healthMax;
    game.character.strength = _settings.data.strength;
    game.character.shield = _settings.data.shield;
    game.character.xp = _settings.data.xp;
    game.character.xpTo = _settings.data.xpTo;
    game.character.itemHeal = _settings.data.itemHeal;
    game.character.itemMagic = _settings.data.itemMagic;
    game.character.itemMineral = _settings.data.itemMineral;
    game.character.level = _settings.data.level;
    game.character.floor = _settings.data.floor;
    game.character.room = _settings.data.room;
    setStorage("TOWER-save", JSON.stringify(game))
}