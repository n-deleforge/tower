// =================================================
// ============ MAIN

/**
 * Initialize the application
 **/

checkVersion();
_game.core.ongoing == false ? launcher() : startGame("load");

/**
 * Display the screen title : show tip and allow new game
 **/

function launcher() {
    // Display the start screen
    get('#titleScreen').style.display = "flex";
    get('#titleTip').innerHTML = CONTENT.tips[rand(0, CONTENT.tips.length)];

    // Check if the name is registred
    if (_game.core.name != null && _game.core.name != "") {
        get("#titleCharacter").value = _game.core.name
    }
    else {
        get("#titleCharacter").value = "";
        get('#titleCharacter').placeholder = CONTENT.main.titleCharacterPlaceholder;
        get('#titleCharacter').focus();
    }

    // Check of the regex and start of the game
    get("#play").addEventListener("click", () => {
        if (get("#titleCharacter").checkValidity()) {
            startGame("new");
        }
        else {
            get("#titleCharacter").style.borderColor = getVariableCSS("error-color");
        }
    });
}

/**
 *  Display the game screen,  create menu and buttons
 * @param {string} mode "new" to start a new game or "load" to load an existing game
 **/

function startGame(mode) {
    // Modify the display
    get('#titleScreen').style.display = "none";
    get('#board').style.display = "flex";
    changeDisplay("normal-game");

    // Add sounds, create menu and add listeners
    addSound();
    createActionMenu();
    createActionButton();

    // Refresh game display every 100ms
    _refreshDisplay = setInterval(displayGame, 100);

    // If it's a new game
    if (mode == "new") {
        _game.core.name = get("#titleCharacter").value;
        _game.events.lastAction = null;
        _game.events.newAction = null;
        _game.core.ongoing = true; 
        playSound("Room");

        get("#game").innerHTML = '<div id="containerImage"><img src="assets/image/' + SETTINGS.images.start + '" alt=""></div>';
        get("#game").innerHTML += '<p>' + CONTENT.events.startGame_part1 +  '.</p>';
        get("#game").innerHTML += '<em>' + CONTENT.events.startGame_part2 +  '.</em>';
        get("#game").innerHTML += '<p>' + CONTENT.events.startGame_part3 +  '.</p>';
    } 
    
    // If it's not a new game
    else if (mode == "load") {
        // Restore fight screen
        if (_game.events.lastAction == "fight" && _game.events.subAction != "fightOver") {
            changeDisplay("normal-to-fight");
        }

        // Restore chest screen
        if (_game.events.lastAction == "chest" && _game.events.subAction != "chestOver") {
            changeDisplay("normal-to-chest");
        }

        // Restore merchant screen
        if (_game.events.lastAction == "merchant" && _game.events.subAction != "merchantOver") {
            changeDisplay("normal-to-merchant");
        }

        get('#game').innerHTML = _game.events.currentEvent;
    }
}

/**
 * Main game function which manage floor and room, then call the choiceAction function
 **/

function playTurn() {
    _game.events.subAction = null;
    _game.character.room++;
    changeDisplay("game-to-info");

    // At the 10th room
    if (_game.character.room > 10) {
        _refreshInterval = 2000;
        _game.character.room = 1; 
        _game.character.floor++; 
        playSound("Floor");

       get("#information").innerHTML = "<p class=\"important\">" + CONTENT.vocabulary.floor + ' ' + _game.character.floor + "</p>";
    }

    // All rooms expect the 10th
    else { 
        _refreshInterval = 1000;
        _game.stats.totalRoom++;
        playSound("Room");

       get("#information").innerHTML = "<p class=\"important\">" + CONTENT.vocabulary.floor + ' ' + parseInt(_game.character.floor) + "</p>";
       get("#information").innerHTML += "<p>" + CONTENT.vocabulary.room + ' ' + _game.character.room + "</p>";
    }

    // Timeout to show the game again
    setTimeout(function () {
        changeDisplay("info-to-game");
    }, _refreshInterval);
    
    // Starting the floor 5, there is one chance on two to meet the merchant each floor
    if (_game.character.floor > 5 && _game.character.room == 5) {
        const merchantMeeting = rand(1,2);
        (merchantMeeting == 2) ? merchant() : choiceAction();
    } 
    else {
        choiceAction();
    }
}

// =================================================
// ============ MAIN EVENTS

/**
 * Randomly choose between no event, fight, chest or meeting a spirit
 **/

function choiceAction() {
    const event = rand(1,4);

    // Spirit event
    if (event == 4) {
       _game.events.newAction = "spirit";
        (_game.events.newAction != _game.events.lastAction) ? spirit() : choiceAction();
    } 
    
    // Fight event
    else if (event == 3) { 
        _game.events.newAction = "fight";
        (_game.events.newAction != _game.events.lastAction) ? fight() : choiceAction();
    } 
    
    // Chest event
    else if (event == 2) { 
        _game.events.newAction = "chest";
        (_game.events.newAction != _game.events.lastAction) ? chest() : choiceAction();
    } 
    
    // No event
    else { 
        _game.events.newAction = "noEvent";
        (_game.events.newAction != _game.events.lastAction) ? noEvent() : choiceAction();
    }
}

/**
 * Use a potion and regain all health
 **/

function usePotion() {
    if (_game.character.itemPotion > 0 && _game.character.health < _game.character.healthMax) {
        _game.character.itemPotion --; 
        _game.character.health = _game.character.healthMax; 
        _game.stats.potionUsed++;
        playSound("Potion");

        get("#game").innerHTML += '<hr><p class="goodInformation">' + CONTENT.events.healing + '</p>';
    }
}

/**
 * When there is no event
 **/

function noEvent() {
    _game.events.lastAction = "noEvent";

    get("#game").innerHTML = '<div id="containerImage"></div>';
    get("#containerImage").style.background = "url('assets/image/" + SETTINGS.images.noEvent + "') no-repeat center"; 
    get("#containerImage").style.backgroundSize = "cover"; 
    get("#game").innerHTML += '<p>' + CONTENT.events.noEvent + '.</p>';
}

/**
 * Meeting with a spirit : randomly choose between fire, water, earth and light
 **/

function spirit() {
    _game.events.lastAction = "spirit";
    _game.stats.spiritMeet++;

    const meeting = rand(1, 4)

    // 7-8 : Earth spirit : add stamina
    if (meeting == 4) { 
        _game.character.stamina = _game.character.stamina + SETTINGS.data.spiritStamina;

        get("#game").innerHTML = '<div id="containerImage"><img src="assets/image/' + SETTINGS.images.earthSpirit + '" alt=""></div>';
        get("#game").innerHTML += '<p>' +CONTENT.events.spiritEarth_part1 + '.</p>';
        get("#game").innerHTML += '<p class="goodInformation">' + CONTENT.events.spiritEarth_part2 + ' <strong>' + SETTINGS.data.spiritStamina + '</strong> ' + plural(SETTINGS.data.spiritStamina, CONTENT.vocabulary.point_singular, CONTENT.vocabulary.point_plural) + '.</p>';
    } 

    // 5-6 : Light spirit : add experience
    else if (meeting == 3) {
        const xp = rand(parseInt(_game.character.xpTo / 10), parseInt(_game.character.xpTo / 5));
        _game.character.xp = _game.character.xp + xp;

        get("#game").innerHTML = '<div id="containerImage"><img src="assets/image/' + SETTINGS.images.lightSpirit + '" alt=""></div>';
        get("#game").innerHTML += '<p>' + CONTENT.events.spiritLight_part1 + '.</p>';
        get("#game").innerHTML += '<p class="goodInformation">' + CONTENT.events.spiritLight_part2 + '<strong>' + xp + '</strong> ' + plural(xp, CONTENT.vocabulary.point_singular, CONTENT.vocabulary.point_plural) + CONTENT.events.spiritLight_part3 + '.</p>';
    } 

    // 3-4 : Fire spirit : add power
    else if (meeting == 2) {
        _game.character.power = _game.character.power + SETTINGS.data.spiritPower;

        get("#game").innerHTML = '<div id="containerImage"><img src="assets/image/' + SETTINGS.images.fireSpirit + '" alt=""></div>';
        get("#game").innerHTML += '<p>' +CONTENT.events.spiritFire_part1 + '.</p>';
        get("#game").innerHTML += '<p class="goodInformation">' + CONTENT.events.spiritFire_part2 + ' <strong>' + SETTINGS.data.spiritPower + '</strong> ' + plural(SETTINGS.data.spiritPower, CONTENT.vocabulary.point_singular, CONTENT.vocabulary.point_plural) + '.</p>';
    } 

    // 1-2 : Water spirit : add health
    else {
        _game.character.healthMax = _game.character.healthMax + SETTINGS.data.spiritHealth;

        get("#game").innerHTML = '<div id="containerImage"><img src="assets/image/' + SETTINGS.images.waterSpirit + '" alt=""></div>';
        get("#game").innerHTML += '<p>' + CONTENT.events.spiritWater_part1 + '.</p>';
        get("#game").innerHTML += '<p class="goodInformation">' + CONTENT.events.spiritWater_part2 + ' <strong>' + SETTINGS.data.spiritHealth + '</strong> ' + plural(SETTINGS.data.spiritHealth, CONTENT.vocabulary.point_singular, CONTENT.vocabulary.point_plural) + '.</p>';
    }
}

// =================================================
// ============ SPECIAL EVENT : MERCHANT

/**
 * Meeting with the merchant : exchange of minerals
 **/

function merchant() {
    _game.events.lastAction = "merchant";
    get("#game").innerHTML = '<div id="containerImage"><img src="assets/image/' + SETTINGS.images.merchant + '" alt=""></div>';
    get("#game").innerHTML += '<p>' + CONTENT.events.merchant + '.</p>';

    // If enough mineral
    if (_game.character.itemMineral > 1) {
        changeDisplay("normal-to-merchant");
        get("#game").innerHTML += '<p>' + CONTENT.events.merchant_proposition + ' ... </p>';
    }

    // If not
    else {
        _game.events.subAction = "merchantOver";
        get("#game").innerHTML += '<p>' + CONTENT.events.merchant_noMineral + ' ...</p>';
    }
}

/**
 * Accept the offer of the merchant
 **/

function acceptMerchant() {
    _game.events.subAction = "merchantOver";
    _game.stats.merchantAccepted++;
    playSound("Merchant");
    changeDisplay("merchant-to-normal");

    const deal = rand(1,3);

    // Offer 1 : power + 2
    if (deal == 3) { 
        _game.character.power = _game.character.power + 3;

        get("#game").innerHTML = '<div id="containerImage"><img src="assets/image/' + SETTINGS.images.merchant + '" alt=""></div>';
        get("#game").innerHTML += '<p>' + CONTENT.events.merchant_accepted + ' !</p>';
        get("#game").innerHTML += '<p class="goodInformation">' + CONTENT.events.merchant_offer1 + '.</p>';
    }

    // Offer 2 : health + 5 and stamina + 1
    else if (deal == 2) {
        _game.character.healthMax = _game.character.healthMax + 10;
        _game.character.stamina = _game.character.stamina + 2;

        get("#game").innerHTML = '<div id="containerImage"><img src="assets/image/' + SETTINGS.images.merchant + '" alt=""></div>';
        get("#game").innerHTML += '<p>' + CONTENT.events.merchant_accepted + ' !</p>';
        get("#game").innerHTML += '<p class="goodInformation">' + CONTENT.events.merchant_offer2 + '.</p>';
    }

    // Offer 3 : nothing
    else {
        get("#game").innerHTML = '<div id="containerImage"><img src="assets/image/' + SETTINGS.images.merchant + '" alt=""></div>';
        get("#game").innerHTML += '<p>' + CONTENT.events.merchant_accepted + ' !</p>';
        get("#game").innerHTML += '<p class="badInformation">' + CONTENT.events.merchant_offer3 + ' ...</p>';
    }

    _game.character.itemMineral = _game.character.itemMineral - 2;
}

/**
 * Refuse the offer of the merchant
 **/

function refuseMerchant() {
    _game.events.subAction = "merchantOver";
    _game.stats.merchantRefused++;
    changeDisplay("merchant-to-normal");

    get("#game").innerHTML = '<div id="containerImage"><img src="assets/image/' + SETTINGS.images.merchant + '" alt=""></div>';
    get("#game").innerHTML += '<p>' + CONTENT.events.merchant + ' ... </p>';
    get("#game").innerHTML += '<p>' + CONTENT.events.merchant_refused + ' !</p>';
}

// =================================================
// ============ SPECIAL EVENT : CHEST

/**
 * Initialize the chest event : allow open / avoid
 **/

function chest() {
    _game.events.lastAction = "chest";
    changeDisplay("normal-to-chest");

    get("#game").innerHTML = '<div id="containerImage"><img src="assets/image/' + SETTINGS.images.chest + '" alt=""></div>';
    get("#game").innerHTML += '<p>' + CONTENT.events.chest + ' !</p>';
}

/**
 * Open the chest : randomly choose between trap, potion, magic or scroll
 **/

function openChest() {
    _game.events.subAction = "chestOver";
    _game.stats.chestOpen++;
    playSound("Chest");
    changeDisplay("chest-to-normal");

    const loot = rand(1, 15);
    let limited = false;

    // Potion (11,12,13,14,15)
    if (loot > 10) {
        SETTINGS.data.itemLimit > _game.character.itemPotion ? _game.character.itemPotion++ : limited = true;

        get("#game").innerHTML = '<div id="containerImage"><img src="assets/image/' + SETTINGS.images.chestOpen + '" alt=""></div>';
        get("#game").innerHTML += '<p>' + CONTENT.events.chestPotion + '.</p>';

        if (limited) {
            get("#game").innerHTML += '<p>' + CONTENT.events.chestLimit + '.</p>';
        }
    }

    // Spell (6,7,8,9,10)
    else if (loot > 5) {
        SETTINGS.data.itemLimit > _game.character.itemScroll ? _game.character.itemScroll++ : limited = true;

        get("#game").innerHTML = '<div id="containerImage"><img src="assets/image/' + SETTINGS.images.chestOpen + '" alt=""></div>';
        get("#game").innerHTML += '<p>' + CONTENT.events.chestScroll + '.</p>';

        if (limited) {
            get("#game").innerHTML += '<p>' + CONTENT.events.chestLimit + '.</p>';
        }
    } 

    // Mineral (2,3,4,5)
    else if (loot > 1) { 
        SETTINGS.data.itemLimit > _game.character.itemMineral ? _game.character.itemMineral++ : limited = true;

        get("#game").innerHTML = '<div id="containerImage"><img src="assets/image/' + SETTINGS.images.chestOpen + '" alt=""></div>';
        get("#game").innerHTML += '<p>' + CONTENT.events.chestMineral + '.</p>';

        if (limited) {
            get("#game").innerHTML += '<p>' + CONTENT.events.chestLimit + '.</p>';
        }
    } 

    // Trap (0,1)
    else {
        _game.stats.chestTrap++;
        const damage = rand(1, _game.character.health / 5);
        _game.character.health = _game.character.health - damage;

        get("#game").innerHTML = '<div id="containerImage"><img src="assets/image/' + SETTINGS.images.chestOpen + '" alt=""></div>';
        get("#game").innerHTML += '<p>' + CONTENT.events.chestTrap_part1 + ' !</p>';
        get("#game").innerHTML += '<p class="badInformation">' + CONTENT.events.chestTrap_part2 + '<strong>' + damage + '</strong> ' + plural(damage, CONTENT.vocabulary.point_singular, CONTENT.vocabulary.point_plural) + CONTENT.events.chestTrap_part3 + '.</p>';
    }
}

/**
 * Avoid the chest and do not open it
 **/

function closeChest() {
    _game.events.subAction = "chestOver";
    _game.stats.chestNotOpened++;
    changeDisplay("chest-to-normal");

    get("#game").innerHTML = '<div id="containerImage"><img src="assets/image/' + SETTINGS.images.chest + '" alt=""></div>';
    get("#game").innerHTML += '<p>' + CONTENT.events.chest + ' !</p>';
    get("#game").innerHTML += '<p>' + CONTENT.events.chest_notOpened + '.</p>';
}

// =================================================
// ============ SPECIAL EVENT : FIGHT

/**
 * Initialize the fight event : allow attack, magic or escaping
 **/

function fight() {
    _game.events.lastAction = "fight";
    _game.events.monster = bestiary();
    changeDisplay("normal-to-fight");

    get("#game").innerHTML = '<div id="containerImage"><img src="assets/image/' + _game.events.monster[3] + '" alt="' + _game.events.monster[2] + '"></div>';
    get("#game").innerHTML += '<p><strong>' + _game.events.monster[2] + '</strong> ' + CONTENT.events.fightStart + ' !</p>';
    get("#game").innerHTML += '<p>' + CONTENT.vocabulary.health + ' : <strong>' + _game.events.monster[0] + '</strong> / ' + CONTENT.vocabulary.power + ' : <strong>'  + _game.events.monster[1] + '</strong></p>';
}

/**
 * Choose the monster according the height in the tower
 **/

function bestiary() {
    const monsterHealth = rand(_game.character.floor * 2, _game.character.floor * 5);
    let monsterStrenght = parseInt(rand(monsterHealth / 4, monsterHealth / 3));

    if (monsterStrenght == 0 || monsterStrenght < 0) {
        // Can't be null or negative
        monsterStrenght = 1
    }
    
    if (monsterHealth > 900) return [monsterHealth, monsterStrenght, CONTENT.monsters.lich, SETTINGS.images.monster17];
    if (monsterHealth > 700) return [monsterHealth, monsterStrenght, CONTENT.monsters.lightSword, SETTINGS.images.monster16];
    if (monsterHealth > 500) return [monsterHealth, monsterStrenght, CONTENT.monsters.golem, SETTINGS.images.monster15];
    if (monsterHealth > 400) return [monsterHealth, monsterStrenght, CONTENT.monsters.deadWarrior, SETTINGS.images.monster14];
    if (monsterHealth > 350) return [monsterHealth, monsterStrenght, CONTENT.monsters.daemon, SETTINGS.images.monster13];
    if (monsterHealth > 300) return [monsterHealth, monsterStrenght, CONTENT.monsters.minotaur, SETTINGS.images.monster12];
    if (monsterHealth > 250) return [monsterHealth, monsterStrenght, CONTENT.monsters.cerberus, SETTINGS.images.monster11];
    if (monsterHealth > 220) return [monsterHealth, monsterStrenght, CONTENT.monsters.troll, SETTINGS.images.monster10];
    if (monsterHealth > 190) return [monsterHealth, monsterStrenght, CONTENT.monsters.eyeghost, SETTINGS.images.monster09];
    if (monsterHealth > 160) return [monsterHealth, monsterStrenght, CONTENT.monsters.werewolf, SETTINGS.images.monster08];
    if (monsterHealth > 130) return [monsterHealth, monsterStrenght, CONTENT.monsters.monster, SETTINGS.images.monster07];
    if (monsterHealth > 100) return [monsterHealth, monsterStrenght, CONTENT.monsters.lizard, SETTINGS.images.monster06];
    if (monsterHealth > 80)   return [monsterHealth, monsterStrenght, CONTENT.monsters.gargoyle, SETTINGS.images.monster05];
    if (monsterHealth > 60)   return [monsterHealth, monsterStrenght, CONTENT.monsters.gobelin, SETTINGS.images.monster04];
    if (monsterHealth > 40)   return [monsterHealth, monsterStrenght, CONTENT.monsters.snake,SETTINGS.images.monster03];
    if (monsterHealth > 20)   return [monsterHealth, monsterStrenght, CONTENT.monsters.bat, SETTINGS.images.monster02];
                                            return [monsterHealth, monsterStrenght, CONTENT.monsters.slim, SETTINGS.images.monster01];
}

/**
 * Fight monster by physical attack : 100% of experience, taking damage
 **/

function attack() {
    _game.events.subAction = "fightOver";
    _game.stats.fightVictory++;
    playSound("Attack");
    changeDisplay("fight-to-normal");

    // Damage
    const nbHit = Math.ceil(_game.events.monster[0] / _game.character.power);
    let damage = parseInt(nbHit * _game.events.monster[1]) - _game.character.stamina; 
    
    if (nbHit == 1 || damage < 0) {
        // Can't be negative
        damage = 0; 
    }

    _game.character.health = _game.character.health - damage;

    // Experience
    const xp = rand(parseInt(_game.character.xpTo / 10), parseInt(_game.character.xpTo / 8));
    _game.character.xp = _game.character.xp + xp;

    get("#game").innerHTML = '<div id="containerImage"><img src="assets/image/' + _game.events.monster[3] + '" alt="' + _game.events.monster[2] + '"></div>';
    get("#game").innerHTML += '<p><strong>' + _game.events.monster[2] + '</strong> ' + CONTENT.events.fightWin_part1 + '<strong>' + nbHit+ '</strong> ' + plural(nbHit, CONTENT.vocabulary.hit_singular, CONTENT.vocabulary.hit_plural) + ' !</p>';
    get("#game").innerHTML += '<p class="badInformation">' + CONTENT.events.fightWin_part2 + '<strong>' + damage + '</strong> ' + plural(damage, CONTENT.vocabulary.point_singular, CONTENT.vocabulary.point_plural) + ' ' + CONTENT.events.fightWin_part3 + '.</p>';
    
    if (_game.character.health > 0) {
        // Displayed only if still alive
        get("#game").innerHTML += '<p class="goodInformation">' + CONTENT.events.fightWin_part5 + '<strong>' + xp + '</strong> ' + plural(xp, CONTENT.vocabulary.point_singular, CONTENT.vocabulary.point_plural) + CONTENT.events.fightWin_part4 + ".</p>";
    }
}

/**
 * Fight monster by magic : no damage but less experience
 **/ 

function useScroll() {
    if (_game.character.itemScroll > 0) {
        _game.events.subAction = "fightOver"; 
        _game.character.itemScroll--;
        _game.stats.fightVictory++; 
        playSound("Scroll");
        changeDisplay("fight-to-normal");

        // Experience
        const xp = parseInt(_game.character.xpTo / 10);
        _game.character.xp = _game.character.xp + xp;

        get("#game").innerHTML = '<div id="containerImage"><img src="assets/image/' + _game.events.monster[3] + '" alt="' + _game.events.monster[2] + '"></div>';
        get("#game").innerHTML += '<p>' + CONTENT.events.fightMagic + ".</p>";
        get("#game").innerHTML += '<p class="goodInformation">' + CONTENT.events.fightWin_part5 + '<strong>' + xp + '</strong> ' + plural(xp, CONTENT.vocabulary.point_singular, CONTENT.vocabulary.point_plural) + CONTENT.events.fightWin_part4 + ".</p>";
    }
}

// =================================================
// ============ GAME DISPLAY

/**
 * Main function : check death, then display all informations and check experience, items, score and save game
 **/

function displayGame() {
    if (_game.character.health < 1) {
        gameOver();
    }
    else {
        // == Experience and level ==
        if (_game.character.xp >= _game.character.xpTo) {
            // Level up
            _game.character.level++;
            _game.character.power =  _game.character.power + SETTINGS.data.lvlUpPower;
            _game.character.stamina =  _game.character.stamina + SETTINGS.data.lvlUpStamina;
            _game.character.healthMax =  _game.character.healthMax + SETTINGS.data.lvlUpHealth;
    
            // Heal and reset of the experience
            _game.character.health = _game.character.healthMax;
            _game.character.xp = 0;
            _game.character.xpTo = parseInt(_game.character.xpTo * 1.25);
    
            get("#game").innerHTML += '<hr><p class="goodInformation"><strong>' + CONTENT.events.levelUp_part1 + '</strong> !</p>';
            get("#game").innerHTML += '<p class="goodInformation">' + CONTENT.events.levelUp_part2 + '.</p>';
        }

        // == Main stats ==
        // Floor and room
        get('#tower').innerHTML = CONTENT.vocabulary.floor + ' ' + _game.character.floor + " - " + CONTENT.vocabulary.room + ' ' + _game.character.room;

        // Progress bars for health
        get("#healthData").innerHTML = _game.character.health + ' / ' + _game.character.healthMax;
        get("#health").style.width = ((_game.character.health * 100) / _game.character.healthMax) + "%";
    
        // Progress bars for experience
        get("#level").innerHTML = CONTENT.vocabulary.level + ' ' + _game.character.level;
        get("#xp").style.width = ((_game.character.xp * 100) / _game.character.xpTo) + "%";
    
        // Stats
        get("#power").innerHTML = '<img src="assets/image/' + SETTINGS.images.iconPower + '" alt="">  ' + _game.character.power;
        get("#stamina").innerHTML = '<img src="assets/image/' + SETTINGS.images.iconStamina + '" alt="">  ' + _game.character.stamina;

        // Items
        get("#potion").innerHTML = '<img src="assets/image/' + SETTINGS.images.iconPotion + '" alt=""> ' + _game.character.itemPotion;
        get("#scroll").innerHTML = '<img src="assets/image/' + SETTINGS.images.iconScroll + '" alt=""> ' + _game.character.itemScroll;
        get("#mineral").innerHTML = '<img src="assets/image/' + SETTINGS.images.iconMineral + '" alt="">  ' + _game.character.itemMineral;

        // == Items availability ==
        // Potion -> heal button
        if (_game.character.itemPotion > 0 && _game.character.health != _game.character.healthMax) {
            get("#usePotion").classList.remove("disabled")
        }
        else {
            get("#usePotion").classList.add("disabled");
        }

        // Scroll -> magic button
        if (_game.character.itemScroll > 0) {
            get("#useScroll").classList.remove("disabled")
        }
        else {
            get("#useScroll").classList.add("disabled");
        }
        
        // == Scores ==
        // Main score
        _game.character.score = (((_game.character.power + _game.character.stamina + _game.character.healthMax) * _game.character.level) * _game.character.floor) - 30;

        // If the score is superior to the one old
        if (_game.character.score > _game.stats.bestScore) {
            _game.stats.bestScore = _game.character.score;
        }

        // If the floor is higher to the old one
        if (_game.character.floor > _game.stats.bestFloor) {
            _game.stats.bestFloor = _game.character.floor;
        }

        // If the max level is higher to the old one
        if (_game.character.level > _game.stats.maxLevel) {
            _game.stats.maxLevel = _game.character.level;
        }

        // == Save content and save all data ==
        if (get("#game").innerHTML != "") {
            _game.events.currentEvent = get("#game").innerHTML;
        }
        setStorage("TOWER-save", JSON.stringify(_game))
    }
}

/**
 * Display the score and allow to restart the game
 **/

function gameOver() {
    clearInterval(_refreshDisplay);

    changeDisplay("game-to-info");
    get("#information").style.backgroundColor = getVariableCSS("background-gameover");
    get('#information').innerHTML = "<p>" + CONTENT.events.gameover_part1  + _game.character.floor + ".</p>";
    get('#information').innerHTML += '<p class="important">' + CONTENT.events.gameover_part2  + _game.character.score + '</p>';
    get('#information').innerHTML += "<button class=\"button buttonAction\" id=\"restart\">" + CONTENT.events.gameoverButton + "</button>";
    get('#restart').addEventListener("click", () => { location.reload(); });

    resetGame();
}

/**
 * Modify the screen or the list of accessible buttons
 * @param {string} set keyword to hide or show buttons / screen
 **/

function changeDisplay(set) {
    // Classic game mode
    if (set === "normal-game") {
        get("#chestMode").style.display = "none";
        get("#merchantMode").style.display = "none";
        get("#fightMode").style.display = "none";
    }

    // Chest event
    if (set === "normal-to-chest") {
        get("#classicMode").style.display = "none";
        get("#chestMode").style.display = "flex";
    }
    if (set === "chest-to-normal") {
        get("#classicMode").style.display = "flex";
        get("#chestMode").style.display = "none";
    }

    // Merchant event
    if (set === "normal-to-merchant") {
        get("#classicMode").style.display = "none";
        get("#merchantMode").style.display = "flex";
    }
    if (set === "merchant-to-normal") {
        get("#classicMode").style.display = "flex";
        get("#merchantMode").style.display = "none";
    }

    // Fight event
    if (set === "normal-to-fight") {
        get("#classicMode").style.display = "none";
        get("#fightMode").style.display = "flex";
    }
    if (set === "fight-to-normal") {
        get("#classicMode").style.display = "flex";
        get("#fightMode").style.display = "none";
    }

    // Information screen
    if (set === "game-to-info") {
        get('~header').style.display = "none";
        get('#board').style.display = "none";
        get('#information').style.display = "flex";
    }
    if (set === "info-to-game") {
        get('~header').style.display = "flex";
        get('#board').style.display = "flex";
        get('#information').style.display = "none";
    }
}

// =================================================
// ============ UNCATEGORIZED

/**
 * Check if there is a new version
 **/

function checkVersion() {
    if (_game.core.version != VERSION) {
        get("#blankPopup").style.display = "block";
        get("#popup").style.display = "flex";
        get("#popupText").innerHTML = CONTENT.main.updated;
    
        // Only one button
        get("#popupCancel").style.display = "none";
        get("#popupAccept").style.width = "100%";
        get("#popupAccept").style.borderRadius = "0 0 10px 10px";
    
        get("#popupAccept").addEventListener("click", () => {
            clearInterval(_refreshDisplay);
            remStorage("TOWER-save");
            location.reload();
        });
    }

    setStorage("TOWER-save", JSON.stringify(_game));
}

/**
 * Create the menu and its actions (records, volume, restart, reset etc.).
 **/

function createActionMenu() {
    // Open/close menu
    get("#openMenu").addEventListener("click", () => {
        if (get("#menu").style.display == "" || get("#menu").style.display == "none") {
            get("#blankMenu").style.display = "block";
            get("#menu").style.display = "flex";
            get("#openMenu").style.zIndex = "50";
            get("#openMenuImg").src = SETTINGS.images.menuOpened;
            
            // Display records
            Object.values(CONTENT.stats).forEach((title, index) => {
                if (index == 0) {
                    get('#listStats').innerHTML = "<li>" + title + Object.values(_game.stats)[index] + "</li>";
                }
                else {
                    get('#listStats').innerHTML += "<li>" + title + Object.values(_game.stats)[index] + "</li>";
                }
            });
        }
        else {
            get("#blankMenu").style.display = "none";
            get("#menu").style.display = "none";
            get("#openMenu").style.zIndex = "5";
            get("#openMenuImg").src = SETTINGS.images.menuClosed;
        }
    });

    // Inside menu - volume (1/2)
    if (!_game.core.sound) {
        get("#volumeButton").innerHTML = SETTINGS.icons.soundOff;
        get("#volumeButton").style.opacity = 0.5;
    } 
    else {
        get("#volumeButton").innerHTML = SETTINGS.icons.soundOn;
    }

    // Inside menu - volume (2/2)
    get("#volumeButton").addEventListener("click", () => {
        if (_game.core.sound) {
            _game.core.sound = false;
            get("#volumeButton").innerHTML = SETTINGS.icons.soundOff;
            get("#volumeButton").style.opacity = 0.5;
        } 
        else {
            _game.core.sound = true;
            get("#volumeButton").innerHTML = SETTINGS.icons.soundOn;
            get("#volumeButton").style.opacity = 1;
        }
    });

    // Inside menu - restart
    get('#confirmRestart').addEventListener("click", () => {
        get("#blankPopup").style.display = "block";
        get("#popup").style.display = "flex";
        get("#popupText").innerHTML = CONTENT.main.popupRestart;

        get("#popupCancel").addEventListener("click", () => {
            get("#blankPopup").style.display = "none";
            get("#popup").style.display = "none";
        });

        get("#popupAccept").addEventListener("click", () => {
            clearInterval(_refreshDisplay);
            _game.core.ongoing = false;
            resetGame();
            location.reload();
        });
    });

    // Inside menu - total restart
    get('#confirmDelete').addEventListener("click", () => {
        get("#blankPopup").style.display = "block";
        get("#popup").style.display = "flex";
        get("#popupText").innerHTML = CONTENT.main.popupDelete;

        get("#popupCancel").addEventListener("click", () => {
            get("#blankPopup").style.display = "none";
            get("#popup").style.display = "none";
        });

        get("#popupAccept").addEventListener("click", () => {
            clearInterval(_refreshDisplay);
            remStorage("TOWER-save");
            location.reload();
        });
    });
}

/**
 * Create the buttons and theirs actions (menu, actions)
 **/

function createActionButton() {
    // Menu
    get("#openMenu").style.display = "block";
    get("#openMenu").style.visibility = "visible";
    get("#openMenuImg").src = SETTINGS.images.menuClosed;

    // Actions
    get("#attack").addEventListener("click", attack);
    get("#useScroll").addEventListener("click", useScroll);
    get("#usePotion").addEventListener("click", usePotion);
    get("#openChest").addEventListener("click", openChest);
    get("#closeChest").addEventListener("click", closeChest);
    get("#acceptOffer").addEventListener("click", acceptMerchant);
    get("#refuseOffer").addEventListener("click", refuseMerchant);
    get("#move").addEventListener("click", playTurn);
}

/**
 * Add all the sources sounds into the HTML
 **/

function addSound() {    
    Object.keys(SETTINGS.sounds).forEach(sound => {
        const audio = document.createElement("audio");
        audio.id = sound;
        audio.preload = "auto";
        get("~body").appendChild(audio);

        const source = document.createElement("source");
        source.src = "assets/sound/" + SETTINGS.sounds[sound] + ".mp3";
        source.type = "audio/mpeg";
        get("#" + sound).appendChild(source);
    })
}

/**
 * Play sound if it's enabled
 * @param {string} value sound ID
 **/

function playSound(value) {
    if (_game.core.sound == true) {
        get("#sound" + value).play();
    }
}

/**
 * Reset the game
 **/

function resetGame() {
    _game.core.ongoing = false;
    _game.stats.totalGame++;
    _game.character.health = SETTINGS.data.health;
    _game.character.healthMax = SETTINGS.data.healthMax;
    _game.character.power = SETTINGS.data.power;
    _game.character.stamina = SETTINGS.data.stamina;
    _game.character.xp = SETTINGS.data.xp;
    _game.character.xpTo = SETTINGS.data.xpTo;
    _game.character.itemPotion = SETTINGS.data.itemPotion;
    _game.character.itemScroll = SETTINGS.data.itemScroll;
    _game.character.itemMineral = SETTINGS.data.itemMineral;
    _game.character.level = SETTINGS.data.level;
    _game.character.floor = SETTINGS.data.floor;
    _game.character.room = SETTINGS.data.room;
    setStorage("TOWER-save", JSON.stringify(_game))
}