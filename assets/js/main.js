// =================================================
// =================================================
// ============ MAIN

// ===> Check if a game is ongoing
game.core.ongoing == false ? launcher() : startGame("load");

// ===> Display the launcher 
function launcher() {
    get('#startScreen').style.display = "flex";
    get('#displayTip').innerHTML = CONTENT.tips[rand(0, CONTENT.tips.length)]; // random tip

    // Check if the name is registred
    if (game.core.name != null && game.core.name != "") get("#nameHero").value = game.core.name
    else {
        get("#nameHero").value = "";
        get('#nameHero').focus();
    }

    // Check of the regex and start of the game
    get("#startGame").addEventListener("click", function () {
        if (!get("#nameHero").checkValidity() || get("#nameHero").value == "") {
            get("#nameHeroLabel").innerHTML = CONTENT.app.nameHeroCheck;
            get("#nameHeroLabel").style.color = getVariableCSS("--errorTextColor");
        }
        else startGame("new");
    });
}

// ===> Start a new game or a loaded game
function startGame(mode) {
    get('#startScreen').style.display = "none";
    get('#gameScreen').style.display = "flex";
    changeDisplay("classic");
    createMenu();
    createButtons();
    displayGame();
    refreshDisplay = setInterval(displayGame, 100);

    // If it's a new game
    if (mode == "new") {
        if (game.core.sound == true) get("#soundRoom").play();
        game.core.name = get("#nameHero").value;
        game.core.ongoing = true; // the game is ongoing
        get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/' + SETTINGS.images.start + '" alt=""></div>';
        get("#gameContent").innerHTML += '<p>' + CONTENT.app.startGame_part1 +  '.</p>';
        get("#gameContent").innerHTML += '<em>' + CONTENT.app.startGame_part2 +  '.</em>';
        get("#gameContent").innerHTML += '<p>' + CONTENT.app.startGame_part3 +  '.</p>';
    } 
    
    // If it's not a new game
    else if (mode == "load") {
        get('#gameContent').innerHTML = game.events.currentEvent;
        if (game.events.lastAction == "fight" && game.events.subAction != "fightOver") changeDisplay("gameToFight"); // Fight event
        if (game.events.lastAction == "chest" && game.events.subAction != "chestOver") changeDisplay("gameToChest"); // Chest event
    }
}

// ===> Main function of the game
function play() {
    game.events.subAction = null; // reset of the sub action
    game.character.room++;
    changeDisplay("displayMessage");

    // At the 10th room
    if (game.character.room > 10) {
        if (game.core.sound == true) get("#soundFloor").play();
        timeDisplay = 2000;
        game.character.room = 1; 
        game.character.floor++; 
        if (game.character.floor > game.stats.bestFloor) game.stats.bestFloor = game.character.floor;
        get("#gameMessage").innerHTML = "<p class=\"bigger\">" + CONTENT.app.floor + ' ' + game.character.floor + "</p>";
    } 

    // All rooms expect the 10th
    else { 
        if (game.core.sound == true) get("#soundRoom").play();
        timeDisplay = 1000;
        game.stats.totalRoom++;
        get("#gameMessage").innerHTML = "<p class=\"bigger\">" + CONTENT.app.floor + ' ' + parseInt(game.character.floor) + "</p>";
        get("#gameMessage").innerHTML += "<p>" + CONTENT.app.room + ' ' + game.character.room + "</p>";
    }

    // Timeout to show the game again
    setTimeout(function () {
        changeDisplay("hideMessage");
    },  timeDisplay);
    
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
        game.events.newAction = "spirit";
        if (game.events.newAction != game.events.lastAction) 
            spirit();
        else 
            choiceAction();
    } 
    
    // 5-7 : fight event
    else if (nb > 4) { 
        game.events.newAction = "fight";
        if (game.events.newAction != game.events.lastAction) 
            fight();
        else 
            choiceAction();
    } 
    
    // 3-4 : chest event
    else if (nb > 2) { 
        game.events.newAction = "chest";
        if (game.events.newAction != game.events.lastAction) 
            chest();
        else 
            choiceAction();
    } 
    
    // 1-2 : no event
    else { 
        game.events.newAction = "noEvent";
        if (game.events.newAction != game.events.lastAction) 
            noEvent();
        else 
            choiceAction();
    }
}

// ===> Using a potion
function heal() {
    if (game.character.itemHeal > 0 && game.character.health < game.character.healthMax) {
        if (game.core.sound == true) get("#soundHeal").play();
        game.character.itemHeal --;
        game.character.health = game.character.healthMax;
        game.stats.healUsed++;

        get("#gameContent").innerHTML += '<hr><p class="green">' + CONTENT.app.healing + '</p>';
        saveContent();
    }
}

// ===> When there is no event
function noEvent() {
    game.events.lastAction = "noEvent";
    get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/' + SETTINGS.images.noEvent + '" alt=""></div>';
    get("#gameContent").innerHTML += '<p>' + CONTENT.app.noEvent + '.</p>';
    saveContent();
}

// ===> When meeting a spirit
function spirit() {
    game.events.lastAction = "spirit";
    game.stats.spiritMeet++;
    let nb = rand(1, 10)

    // 9-10 : Earth spirit
    if (nb > 8) { 
        game.character.shield = game.character.shield + SETTINGS.data.spiritShield;
        get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/' + SETTINGS.images.earthSpirit + '" alt=""></div>';
        get("#gameContent").innerHTML += '<p>' +CONTENT.app.spiritEarth_part1 + '.</p>';
        get("#gameContent").innerHTML += '<p class="green">' + CONTENT.app.spiritEarth_part2 + ' <strong>' + SETTINGS.data.spiritShield + '</strong> ' + plural(SETTINGS.data.spiritShield, CONTENT.app.point_singular, CONTENT.app.point_plural) + '.</p>';
    } 
    
    // 7-8 : Wind spirit
    else if (nb > 6) { 
        get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/' + SETTINGS.images.windSpirit + '" alt=""></div>';
        get("#gameContent").innerHTML += '<p>' + CONTENT.app.spiritWind + '.</p>';
        let item = rand(1, 3);

        switch (item) {
            // Heal stealing
            case 1:
                if (game.character.itemHeal != 0) {
                    game.character.itemHeal--;
                    get("#gameContent").innerHTML += '<p class="red">' + CONTENT.app.spiritWind_healStealing + '.</p>';
                } 
                else get("#gameContent").innerHTML += '<p>' + CONTENT.app.spiritWind_noStealing + '.</p>';
                break;

            // Magic stealing
            case 2:
                if (game.character.itemMagic != 0) {
                    game.character.itemMagic--;
                    get("#gameContent").innerHTML += '<p class="red">' + CONTENT.app.spiritWind_magicStealing + '.</p>';
                } 
                else get("#gameContent").innerHTML += '<p>' + CONTENT.app.spiritWind_noStealing + '.</p>';
                break;

            // Escape stealing
            case 3:
                if (game.character.itemEscape != 0) {
                    game.character.itemEscape--;
                    get("#gameContent").innerHTML += '<p class="red">' + CONTENT.app.spiritWind_escapeStealing + '.</p>';
                } 
                else get("#gameContent").innerHTML += '<p>' + CONTENT.app.spiritWind_noStealing + '.</p>';
                break;
        }
    }

    // 5-6 : Light spirit
    else if (nb > 4) {
        let xp = rand(parseInt(game.character.xpTo / 8), parseInt(game.character.xpTo / 6));
        game.character.xp = game.character.xp + xp;
        get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/' + SETTINGS.images.lightSpirit + '" alt=""></div>';
        get("#gameContent").innerHTML += '<p>' + CONTENT.app.spiritLight_part1 + '.</p>';
        get("#gameContent").innerHTML += '<p class="green">' + CONTENT.app.spiritLight_part2 + '<strong>' + xp + '</strong> ' + plural(xp, CONTENT.app.point_singular, CONTENT.app.point_plural) + CONTENT.app.spiritLight_part3 + '.</p>';
    } 

    // 3-4 : Fire spirit
    else if (nb > 2) {
        game.character.strength = game.character.strength + SETTINGS.data.spiritStrength;
        get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/' + SETTINGS.images.fireSpirit + '" alt=""></div>';
        get("#gameContent").innerHTML += '<p>' +CONTENT.app.spiritFire_part1 + '.</p>';
        get("#gameContent").innerHTML += '<p class="green">' + CONTENT.app.spiritFire_part2 + ' <strong>' + SETTINGS.data.spiritStrength + '</strong> ' + plural(SETTINGS.data.spiritStrength, CONTENT.app.point_singular, CONTENT.app.point_plural) + '.</p>';
    } 

    // 1-2 : Water spirit
    else {
        game.character.healthMax = game.character.healthMax + SETTINGS.data.spiritHealth;
        get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/' + SETTINGS.images.waterSpirit + '" alt=""></div>';
        get("#gameContent").innerHTML += '<p>' + CONTENT.app.spiritWater_part1 + '.</p>';
        get("#gameContent").innerHTML += '<p class="green">' + CONTENT.app.spiritWater_part2 + ' <strong>' + SETTINGS.data.spiritHealth + '</strong> ' + plural(SETTINGS.data.spiritHealth, CONTENT.app.point_singular, CONTENT.app.point_plural) + '.</p>';
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

    get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/' + SETTINGS.images.chest + '" alt=""></div>';
    get("#gameContent").innerHTML += '<p>' + CONTENT.app.chest + ' !</p>';
    saveContent();
}

// ===> When opening a chest
function openChest() {
    if (game.core.sound == true) get("#soundChest").play();
    game.events.subAction = "chestOver";
    game.stats.chestOpen++;

    let nb = rand(0, 10);
    let limited = false;
    changeDisplay("chestToGame");

    // 8 - 10 : trap chest
    if (nb > 7) { 
        game.stats.chestTrap++;
        let damage = rand(1, game.character.health / 4);
        game.character.health = game.character.health - damage;
        get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/' + SETTINGS.images.chestTrap + '" alt=""></div>';
        get("#gameContent").innerHTML += '<p>' + CONTENT.app.chestTrap_part1 + ' !</p>';
        get("#gameContent").innerHTML += '<p class="red">' + CONTENT.app.chestTrap_part2 + '<strong>' + damage + '</strong> ' + plural(damage, CONTENT.app.point_singular, CONTENT.app.point_plural) + CONTENT.app.chestTrap_part3 + '.</p>';
    } 

    // 6 - 7 : escape item
    else if (nb > 5) { 
        SETTINGS.data.itemLimit > game.character.itemEscape ? game.character.itemEscape++ : limited = true;
        get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/' + SETTINGS.images.chestEscape + '" alt=""></div>';
        get("#gameContent").innerHTML += '<p>' + CONTENT.app.chestEscape +  '.</p>';
        if (limited) get("#gameContent").innerHTML += '<p>' + CONTENT.app.chestLimit + '.</p>';
    } 

     // 4 - 5 : magic item
    else if (nb > 3) {
        SETTINGS.data.itemLimit > game.character.itemMagic ? game.character.itemMagic++ : limited = true;
        get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/' + SETTINGS.images.chestMagic + '" alt=""></div>';
        get("#gameContent").innerHTML += '<p>' + CONTENT.app.chestMagic + '.</p>';
        if (limited) get("#gameContent").innerHTML += '<p>' + CONTENT.app.chestLimit + '.</p>';
    } 

    // 1 - 3 : heal item
    else { 
        SETTINGS.data.itemLimit > game.character.itemHeal ? game.character.itemHeal++ : limited = true;
        get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/' + SETTINGS.images.chestHeal + '" alt=""></div>';
        get("#gameContent").innerHTML += '<p>' + CONTENT.app.chestHeal + '.</p>';
        if (limited) get("#gameContent").innerHTML += '<p>' + CONTENT.app.chestLimit + '.</p>';
    }

    saveContent();
}

// ===> When avoiding a chest
function closeChest() {
    game.stats.chestNotOpened++;
    game.events.subAction = "chestOver";
    changeDisplay("chestToGame");

    get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/' + SETTINGS.images.chest + '" alt=""></div>';
    get("#gameContent").innerHTML += '<p>' + CONTENT.app.chest + ' !</p>';
    get("#gameContent").innerHTML += '<p>' + CONTENT.app.chest_notOpened + '.</p>';
    saveContent();
}

// =================================================
// =================================================
// ============ FIGHT EVENTS

// ===> When a fight start
function fight() {
    game.events.lastAction = "fight";
    game.events.monster = choiceMonster();
    changeDisplay("gameToFight");

    get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/' + game.events.monster[3] + '" alt="' + game.events.monster[2] + '"></div>';
    get("#gameContent").innerHTML += '<p><strong>' + game.events.monster[2] + '</strong> ' + CONTENT.app.fightStart + '</p>';
    get("#gameContent").innerHTML += '<p>' + CONTENT.app.health + ' : <strong>' + game.events.monster[0] + '</strong> / ' + CONTENT.app.strength + ' : <strong>'  + game.events.monster[1] + '</strong></p>';
    saveContent();
}

// ===> Choose a monster
function choiceMonster() {
    let monsterLevel = rand(game.character.floor * 2, game.character.floor * 4)
    if (monsterLevel > 500) return [monsterLevel, parseInt(monsterLevel / 3), CONTENT.monsters.dragon, SETTINGS.images.monster17];
    if (monsterLevel > 450) return [monsterLevel, parseInt(monsterLevel / 3), CONTENT.monsters.supDemon, SETTINGS.images.monster16];
    if (monsterLevel > 400) return [monsterLevel, parseInt(monsterLevel / 3), CONTENT.monsters.bigSpirit, SETTINGS.images.monster15];
    if (monsterLevel > 350) return [monsterLevel, parseInt(monsterLevel / 3), CONTENT.monsters.deadWarrior, SETTINGS.images.monster14];
    if (monsterLevel > 290) return [monsterLevel, parseInt(monsterLevel / 3), CONTENT.monsters.troll, SETTINGS.images.monster13];
    if (monsterLevel > 240) return [monsterLevel, parseInt(monsterLevel / 3), CONTENT.monsters.behemot, SETTINGS.images.monster12];
    if (monsterLevel > 190) return [monsterLevel, parseInt(monsterLevel / 3), CONTENT.monsters.minotaur, SETTINGS.images.monster11];
    if (monsterLevel > 160) return [monsterLevel, parseInt(monsterLevel / 3), CONTENT.monsters.cerberus, SETTINGS.images.monster10];
    if (monsterLevel > 130) return [monsterLevel, parseInt(monsterLevel / 3), CONTENT.monsters.goblin, SETTINGS.images.monster09];
    if (monsterLevel > 100) return [monsterLevel, parseInt(monsterLevel / 3), CONTENT.monsters.ghost, SETTINGS.images.monster08];
    if (monsterLevel > 75)  return [monsterLevel, parseInt(monsterLevel / 3), CONTENT.monsters.cockatrice, SETTINGS.images.monster07];
    if (monsterLevel > 50)  return [monsterLevel, parseInt(monsterLevel / 3), CONTENT.monsters.lamia, SETTINGS.images.monster06];
    if (monsterLevel > 40)  return [monsterLevel, parseInt(monsterLevel / 3), CONTENT.monsters.imp, SETTINGS.images.monster05];
    if (monsterLevel > 30)  return [monsterLevel, parseInt(monsterLevel / 3), CONTENT.monsters.plant, SETTINGS.images.monster04];
    if (monsterLevel > 20)  return [monsterLevel, parseInt(monsterLevel / 3), CONTENT.monsters.scorpio,SETTINGS.images.monster03];
    if (monsterLevel > 10)  return [monsterLevel, parseInt(monsterLevel / 3), CONTENT.monsters.spider, SETTINGS.images.monster02];
    return [monsterLevel, parseInt(monsterLevel / 3), CONTENT.monsters.slim, SETTINGS.images.monster01];
}

// ===> When attacking a monster
function attack() {
    if (game.core.sound == true) get("#soundAttack").play();
    game.stats.fightVictory++;
    game.events.subAction = "fightOver";
    changeDisplay("fightToGame");

    // Damage
    let nbHit = Math.ceil(game.events.monster[0] / game.character.strength);
    let damage = parseInt(nbHit * game.events.monster[1] - parseInt(game.events.monster[1]) / nbHit) - game.character.shield; 
    if (nbHit == 1) damage = 0;
    if (damage < 0) damage = 0;
    game.character.health = game.character.health - damage;

    // Experience
    let xp= rand(game.character.level * (game.events.monster[0]), game.character.level * game.events.monster[0] * 2);
    game.character.xp = game.character.xp + xp;
    game.stats.totalExp = game.stats.totalExp + xp;

    get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/' + game.events.monster[3] + '" alt="' + game.events.monster[2] + '"></div>';
    get("#gameContent").innerHTML += '<p><strong>' + game.events.monster[2] + '</strong> ' + CONTENT.app.fightWin_part1 + '<strong>' + nbHit+ '</strong> ' + plural(nbHit, CONTENT.app.hit_singular, CONTENT.app.hit_plural) + ' !</p>';
    get("#gameContent").innerHTML += '<p class="red">' + CONTENT.app.fightWin_part2 + '<strong>' + damage + '</strong> ' + plural(damage, CONTENT.app.point_singular, CONTENT.app.point_plural) + ' ' + CONTENT.app.fightWin_part3 + '.</p>';
    if (game.character.health > 0) get("#gameContent").innerHTML += '<p class="green">' + CONTENT.app.fightWin_part5 + '<strong>' + xp + '</strong> ' + plural(xp, CONTENT.app.point_singular, CONTENT.app.point_plural) + CONTENT.app.fightWin_part4 + ".</p>";
    saveContent();
}

// ===> When using magic
function magic() {
    if (game.character.itemMagic > 0) {
        if (game.core.sound == true) get("#soundMagic").play();
        game.stats.fightVictory++;
        game.events.subAction = "fightOver";
        game.character.itemMagic--;
        changeDisplay("fightToGame");

        // Experience : 50% with magic
        let xp = rand(parseInt(game.character.level * (game.events.monster[0]) / 2), game.character.level * game.events.monster[0] );
        game.character.xp = game.character.xp + xp;
        game.stats.totalExp = game.stats.totalExp + xp;
        
        get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/' + game.events.monster[3] + '" alt="' + game.events.monster[2] + '"></div>';
        get("#gameContent").innerHTML += '<p>' + CONTENT.app.fightMagic + ".</p>";
        get("#gameContent").innerHTML += '<p class="green">' + CONTENT.app.fightWin_part5 + '<strong>' + xp + '</strong> ' + plural(xp, CONTENT.app.point_singular, CONTENT.app.point_plural) + CONTENT.app.fightWin_part4 + ".</p>";
        saveContent();
    }
}

// ===> When running away
function runAway() {
    if (game.character.itemEscape > 0) {
        if (game.core.sound == true) get("#soundEscape").play();
        game.stats.fightEscape++;
        game.character.itemEscape--;
        changeDisplay("fightToGame");

        get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/' + game.events.monster[3] + '" alt="' + game.events.monster[2] + '"></div>';
        get("#gameContent").innerHTML += '<p>' + CONTENT.app.fightEscape + '.</p>';
        saveContent();
    }
}

// =================================================
// =================================================
// ============ DISPLAY

// ===> Display informations and check death
function displayGame() {
    if (game.character.health < 1) gameOver();
    else {
        checkExperience();
        checkInfo();
        checkItems();
        checkScore();

        storage("set", "TOWER-gameSettings", JSON.stringify(game))
    }
}

// ===> Display gameover
function gameOver() {
    clearInterval(refreshDisplay);
    changeDisplay('classic');
    get("#move").removeEventListener("click", play);
    get("#move").addEventListener("click", displayScore);

    get("#move").innerHTML = CONTENT.app.results;
    get("#useHeal").style.display = "none";
    get("#gameContent").innerHTML += '<p class="red"><strong>' + CONTENT.app.death + '</strong></p>';  
}

// ===> Display the score
function displayScore() {
    get("#gameMessage").style.backgroundColor = getVariableCSS("--gameoverBackground");
    resetData();
    changeDisplay("displayMessage");

    get('#gameMessage').innerHTML = "<p class=\"bigger\">" + CONTENT.app.gameover  + game.character.score + " pts.</p>";
    get('#gameMessage').innerHTML += "<button id=\"restart\">" + CONTENT.app.gameoverButton + "</button>";
    get('#restart').addEventListener("click", function() { location.reload(); });

    // Share button
    if (navigator.share) {
        get('#gameMessage').innerHTML += "<button id=\"share\">" + CONTENT.app.shareScore_button + "</button>";
        const shareScore = { text: CONTENT.app.shareScore_part1 + game.character.score + CONTENT.app.shareScore_part2, url: 'https://nicolas-deleforge/apps/tower/' };
        get("#share").addEventListener('click', function() { navigator.share(shareScore); });
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

// ===> Check hero's stats and floor
function checkInfo() {
    get("#name").innerHTML = '<img src="assets/images/' + SETTINGS.images.iconHero + '" alt=""> ' + game.core.name + " (" + CONTENT.app.level + " " + game.character.level + ")";
    get("#health").innerHTML = '<img src="assets/images/' + SETTINGS.images.iconHealth + '" alt=""> ' + CONTENT.app.health + ' ' + game.character.health + ' / ' + game.character.healthMax;
    get("#xp").innerHTML = '<img src="assets/images/' + SETTINGS.images.iconExperience + '" alt=""> ' + CONTENT.app.experience + ' ' + game.character.xp + ' / ' + game.character.xpTo;
    get("#strength").innerHTML = '<img src="assets/images/' + SETTINGS.images.iconStrength + '" alt="">  ' + CONTENT.app.strength + ' ' + game.character.strength;
    get("#shield").innerHTML = '<img src="assets/images/' + SETTINGS.images.iconShield + '" alt="">  ' + CONTENT.app.shield + ' ' + game.character.shield;
    get('#headerTitle').innerHTML = CONTENT.app.floor + ' ' + game.character.floor + " - " + CONTENT.app.room + ' ' + game.character.room;
}

// ===> Check items availability
function checkItems() {
    game.character.itemHeal < 1 || game.character.health == game.character.healthMax ? get("#useHeal").disabled = true : get("#useHeal").disabled = false;
    game.character.itemMagic > 0 ? get("#useMagic").disabled = false : get("#useMagic").disabled = true;
    game.character.itemEscape > 0 ? get("#useEscape").disabled = false : get("#useEscape").disabled = true;
    
    get("#potion").innerHTML = '<img src="assets/images/' +SETTINGS.images.iconPotion + '" alt=""> ' + game.character.itemHeal + ' ' + plural(game.character.itemHeal, CONTENT.app.heal_singular, CONTENT.app.heal_plural);
    get("#magic").innerHTML = '<img src="assets/images/' +SETTINGS.images.iconMagic + '" alt=""> ' + game.character.itemMagic + ' ' + plural(game.character.itemMagic, CONTENT.app.magic_singular, CONTENT.app.magic_plural);
    get("#escape").innerHTML = '<img src="assets/images/' +SETTINGS.images.iconEscape + '"alt=""> ' + game.character.itemEscape + ' ' + plural(game.character.itemEscape, CONTENT.app.escape_singular, CONTENT.app.escape_plural);     
}

// ===> Check experience and level
function checkExperience() {
    if (game.character.xp >= game.character.xpTo) {
        game.character.level++;
        if (game.character.level > game.stats.maxLevel) game.stats.maxLevel = game.character.level;

        // Level up
        game.character.strength =  game.character.strength + SETTINGS.data.lvlUpStrength;
        game.character.shield =  game.character.shield + SETTINGS.data.lvlUpShield;
        game.character.healthMax =  game.character.healthMax + SETTINGS.data.lvlUpHealth;

        // Heal and reset of the experience
        game.character.health = game.character.healthMax;
        game.character.xp = 0;
        game.character.xpTo = rand(parseInt(1.5 *  game.character.xpTo), 2 *  game.character.xpTo);

        get("#gameContent").innerHTML += '<hr><p class="green">' + CONTENT.app.levelUp_part1 + '.</p>';
        get("#gameContent").innerHTML += '<p class="green">' + CONTENT.app.levelUp_part2 + '.</p>';
        saveContent();
    }
}

// ===> Check score and the best score
function checkScore() {
    game.character.score = (((game.character.strength + game.character.healthMax) * game.character.level) * game.character.floor) - 30;
    if (game.character.score > game.stats.bestScore) game.stats.bestScore = game.character.score;
}

// ===> Check volume and its button
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

// ===> Create events for the menu
function createMenu() {
    // Menu - settings
    get("#optionButton").addEventListener("click", function() {
        get("#containerPopup").style.display = "flex";
        get("#optionMenu").style.display = "block";

        get('#closeOptionMenu').addEventListener("click", function() {
            get("#containerPopup").style.display = "none";
            get("#optionMenu").style.display = "none";
        });
    });

    // Menu - stats
    get("#openStatsMenu").addEventListener("click", function () {
        let titles = Object.values(CONTENT.stats);
        let values = Object.values(game.stats);

        for (let i = 0; i < titles.length; i++) {
            if (i == 0) 
                get('#listStats').innerHTML = "<li>" + titles[i] + values[i] + "</li>"
            else
                get('#listStats').innerHTML += "<li>" + titles[i] + values[i] + "</li>"
        }

        get("#optionMenu").style.display = "none";
        get("#statsMenu").style.display = "block";

        get('#closeStatsMenu').addEventListener("click", function () {
            get("#containerPopup").style.display = "none";
            get("#statsMenu").style.display = "none";
        });
    });

    // Menu - credits
    get("#openInfoMenu").addEventListener("click", function() {
        get("#optionMenu").style.display = "none";
        get("#infoMenu").style.display = "block";

        get('#closeInfoMenu').addEventListener("click", function() {
            get("#containerPopup").style.display = "none";
            get("#infoMenu").style.display = "none";
        });
    });

    // Menu - restart
    get('#confirmRestart').addEventListener("click", function() {
        clearInterval(refreshDisplay);
        game.core.ongoing = false;
        resetData();
        location.reload();
    });

    // Menu - total restart
    get('#confirmTotalRestart').addEventListener("click", function () {
        clearInterval(refreshDisplay);
        storage("rem", "TOWER-gameSettings");
        location.reload();
    });
}

// ===> Create events for the buttons
function createButtons() {
    // Top buttons
    get("#optionButton").style.visibility = "visible";
    get("#volumeButton").style.visibility = "visible";
    get("#volumeButton").addEventListener("click", checkSound);
    game.core.sound == true ? get("#volumeButton").innerHTML = "🔊" : get("#volumeButton").innerHTML = "🔈";

    // Bottom buttons
    get("#move").addEventListener("click", play);
    get("#useHeal").addEventListener("click", heal);
    get("#openChest").addEventListener("click", openChest);
    get("#closeChest").addEventListener("click", closeChest);
    get("#useAttack").addEventListener("click", attack);
    get("#useMagic").addEventListener("click", magic);
    get("#useEscape").addEventListener("click", runAway);
}

// ===> Reset all character data
function resetData() {
    game.core.ongoing = false;
    game.stats.totalGame++;
    game.character.health = SETTINGS.data.health;
    game.character.healthMax = SETTINGS.data.healthMax;
    game.character.strength = SETTINGS.data.strength;
    game.character.shield = SETTINGS.data.shield;
    game.character.xp = SETTINGS.data.xp;
    game.character.xpTo = SETTINGS.data.xpTo;
    game.character.itemHeal = SETTINGS.data.heal;
    game.character.itemMagic = SETTINGS.data.magic;
    game.character.itemEscape = SETTINGS.data.escape;
    game.character.level = SETTINGS.data.level;
    game.character.floor = SETTINGS.data.floor;
    game.character.room = SETTINGS.data.room;

    storage("set", "TOWER-gameSettings", JSON.stringify(game))
}

// ===> Save the content of the app
function saveContent() {
    game.events.currentEvent = get("#gameContent").innerHTML;
}