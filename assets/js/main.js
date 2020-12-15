// =================================================
// =================================================
// ============ MAIN

// ===> Start a new game or load game
if (game.core.ongoing == false) {
    get('#startScreen').style.display = "flex";
    get('#displayTip').innerHTML = randomTip();
    
    // Check if the name is registred
    if (game.core.name != null && game.core.name != "") 
        get("#nameHero").value = game.core.name
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
else 
    startGame("load");

// ===> Display game and add listeners
function startGame(mode) {
    // Display the correct container and the boutons
    get('#startScreen').style.display = "none";
    get('#gameScreen').style.display = "flex";
    changeDisplay("classic");

    // Display all the data and add a refresh
    displayGame();
    settings.refreshDisplay = setInterval(displayGame, 100);

    // Check the option and volume button
    get("#optionButton").style.visibility = "visible";
    get("#volumeButton").style.visibility = "visible";
    get("#volumeButton").addEventListener("click", checkSound);
    if (game.core.sound == true) get("#volumeButton").innerHTML = "🔊";
    else get("#volumeButton").innerHTML = "🔈";

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
        let titles = Object.values(language.stats);
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
        clearInterval(settings.refreshDisplay);
        game.core.ongoing = false;
        resetData();
        location.reload();
    });

    // Menu - total restart
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
        get('#gameContent').innerHTML = language.app.startGame;
        game.core.name = get("#nameHero").value;
        if (game.core.sound == true) get("#soundRoom").play();
    } 
    
    // If it's not a new game
    if (mode == "load") {
        get('#gameContent').innerHTML = game.events.currentEvent;

        if (game.events.lastAction == "fight" && game.events.subAction != "fightOver") 
            changeDisplay("gameToFight"); // Fight event

        if (game.events.lastAction == "bossFight" && game.events.subAction != "fightOver") 
            changeDisplay("gameToBossFight"); // Boss event

        if (game.events.lastAction == "chest" && game.events.subAction != "chestOver") 
            changeDisplay("gameToChest"); // Chest event
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
        settings.messageTimeDisplay = 2000;
        game.character.room = 1; 
        game.character.floor++; 
        if (game.character.floor > game.stats.bestFloor) game.stats.bestFloor = game.character.floor;

        get("#gameMessage").innerHTML = "<p class=\"bigger\">" + language.app.floor + ' ' + game.character.floor + "</p>";
    } 

    // All rooms expect the 10th
    else { 
        if (game.core.sound == true) get("#soundRoom").play();
        settings.messageTimeDisplay = 1000;
        game.stats.totalRoom++;

        get("#gameMessage").innerHTML = "<p class=\"bigger\">" + language.app.floor + ' ' + parseInt(game.character.floor) + "</p>";
        get("#gameMessage").innerHTML += "<p>" + language.app.room + ' ' + game.character.room + "</p>";
    }

    // Timeout to show the game again
    setTimeout(function () {
        changeDisplay("hideMessage");
    },  settings.messageTimeDisplay);

    //  Events
    if (settings.floorSpecial.indexOf(game.character.floor) != -1 && game.character.room == 1)
        specialEvent();
   else if (settings.floorBoss.indexOf(game.character.floor) != -1 && game.character.room == 10) {
        if (game.core.sound == true) get("#soundBossFight").play();
        fight("bossFight")
   }
    else
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
    game.stats.spiritMeet++;
    let nb = rand(1, 10)

    // 9-10 : Earth spirit
    if (nb > 8) { 
        game.character.shield = game.character.shield + settings.data.spiritShield;

        get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/events/spiritEarth.png" alt=""></div>';
        get("#gameContent").innerHTML += '<p>' +language.app.spiritEarth_part1 + '.</p>';
        get("#gameContent").innerHTML += '<p class="green">' + language.app.spiritEarth_part2 + ' <strong>' + settings.data.spiritShield + '</strong> ' + plural(settings.data.spiritShield, language.app.point_singular, language.app.point_plural) + '.</p>';
    } 
    
    // 7-8 : Wind spirit
    else if (nb > 6) { 
        get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/events/spiritWind.png" alt=""></div>';
        get("#gameContent").innerHTML += '<p>' + language.app.spiritWind + '.</p>';

       let item = rand(1, 3);

        switch (item) {
            // Heal stealing
            case 1:
                if (game.character.itemHeal != 0) {
                    game.character.itemHeal--;
                    get("#gameContent").innerHTML += '<p class="red">' + language.app.spiritWind_healStealing + '.</p>';
                } 
                else 
                    get("#gameContent").innerHTML += '<p>' + language.app.spiritWind_noStealing + '.</p>';
                break;

            // Magic stealing
            case 2:
                if (game.character.itemMagic != 0) {
                    game.character.itemMagic--;
                    get("#gameContent").innerHTML += '<p class="red">' + language.app.spiritWind_magicStealing + '.</p>';
                } 
                else 
                    get("#gameContent").innerHTML += '<p>' + language.app.spiritWind_noStealing + '.</p>';
                break;

            // Escape stealing
            case 3:
                if (game.character.itemEscape != 0) {
                    game.character.itemEscape--;
                    get("#gameContent").innerHTML += '<p class="red">' + language.app.spiritWind_escapeStealing + '.</p>';
                } 
                else 
                    get("#gameContent").innerHTML += '<p>' + language.app.spiritWind_noStealing + '.</p>';
                break;
        }
    }

    // 5-6 : Light spirit
    else if (nb > 4) { 
        let xp = rand(parseInt(game.character.xpTo / 8), parseInt(game.character.xpTo / 6));
        game.character.xp = game.character.xp + xp;

        get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/events/spiritLight.png" alt=""></div>';
        get("#gameContent").innerHTML += '<p>' + language.app.spiritLight_part1 + '.</p>';
        get("#gameContent").innerHTML += '<p class="green">' + language.app.spiritLight_part2 + '<strong>' + xp + '</strong> ' + plural(xp, language.app.point_singular, language.app.point_plural) + language.app.spiritLight_part3 + '.</p>';
    } 

    // 3-4 : Fire spirit
    else if (nb > 2) { 
        game.character.strength = game.character.strength + settings.data.spiritStrength;

        get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/events/spiritFire.png" alt=""></div>';
        get("#gameContent").innerHTML += '<p>' +language.app.spiritFire_part1 + '.</p>';
        get("#gameContent").innerHTML += '<p class="green">' + language.app.spiritFire_part2 + ' <strong>' + settings.data.spiritStrength + '</strong> ' + plural(settings.data.spiritStrength, language.app.point_singular, language.app.point_plural) + '.</p>';
    } 

    // 1-2 : Water spirit
    else { 
        game.character.healthMax = game.character.healthMax + settings.data.spiritHealth;

        get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/events/spiritWater.png" alt=""></div>';
        get("#gameContent").innerHTML += '<p>' + language.app.spiritWater_part1 + '.</p>';
        get("#gameContent").innerHTML += '<p class="green">' + language.app.spiritWater_part2 + ' <strong>' + settings.data.spiritHealth + '</strong> ' + plural(settings.data.spiritHealth, language.app.point_singular, language.app.point_plural) + '.</p>';
    }

    saveContent();
}

// ===> When there is a special event
function specialEvent() {
    // The end of the game
    if (game.character.floor == settings.lastFloor)
        gameOver();

    // Other events
    else 
        choiceAction();
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
    game.stats.chestOpen++;
    changeDisplay("chestToGame");
    let nb = rand(0, 10);
    let limited = false;

    // 8 - 10 : trap chest
    if (nb > 7) { 
        game.stats.chestTrap++;
        let damage = rand(1, game.character.health / 4);
        game.character.health = game.character.health - damage;

        get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/events/chestTrap.png" alt=""></div>';
        get("#gameContent").innerHTML += '<p>' + language.app.chestTrap_part1 + ' !</p>';
        get("#gameContent").innerHTML += '<p class="red">' + language.app.chestTrap_part2 + '<strong>' + damage + '</strong> ' + plural(damage, language.app.point_singular, language.app.point_plural) + language.app.chestTrap_part3 + '.</p>';
    } 

    // 6 - 7 : escape item
    else if (nb > 5) { 
        if (game.character.itemLimit > game.character.itemEscape) 
            game.character.itemEscape++;
        else 
            limited = true;

        get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/events/chestEscape.png" alt=""></div>';
        get("#gameContent").innerHTML += '<p>' + language.app.chestEscape +  '.</p>';

        if (limited) get("#gameContent").innerHTML += '<p>' + language.app.chestLimit + '.</p>';
    } 

     // 4 - 5 : magic item
    else if (nb > 3) {
        if (game.character.itemLimit > game.character.itemMagic)
            game.character.itemMagic++;
        else 
            limited = true;

        get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/events/chestMagic.png" alt=""></div>';
        get("#gameContent").innerHTML += '<p>' + language.app.chestMagic + '.</p>';

        if (limited) get("#gameContent").innerHTML += '<p>' + language.app.chestLimit + '.</p>';
    } 

    // 1 - 3 : heal item
    else { 
        if (game.character.itemLimit > game.character.itemHeal) 
            game.character.itemHeal++
        else
            limited = true;

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
    if (mode == "bossFight") 
        game.events.lastAction = "bossFight";
    else 
        game.events.lastAction = "fight";

    game.events.monster = choiceMonster();

    if (mode == "bossFight") 
        changeDisplay("gameToBossFight");
    else 
        changeDisplay("gameToFight");

    get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/monsters/' + game.events.monster[3] + '.png" alt="' + game.events.monster[2] + '"></div>';
    
    if (mode == "bossFight") 
        get("#gameContent").innerHTML += '<p>' + language.app.bossFight_start + ' !</p>';
    else 
        get("#gameContent").innerHTML += '<p><strong>' + game.events.monster[2] + '</strong> ' + language.app.fightStart + '</p>';
    
    get("#gameContent").innerHTML += '<p>' + language.app.health + ' : <strong>' + game.events.monster[0] + '</strong> / ' + language.app.strength + ' : <strong>'  + game.events.monster[1] + '</strong></p>';
    saveContent();
}

// ===> Choose a monster
function choiceMonster() {
    let monsterLevel;

    if (game.events.lastAction == "bossFight") 
        monsterLevel = rand(game.character.floor * 4, game.character.floor * 5)
    else 
        monsterLevel = rand(game.character.floor * 2, game.character.floor * 4)

    if (monsterLevel > 500) 
        return [monsterLevel, parseInt(monsterLevel / 3), language.monsters.dragon, "monster_17"];
    if (monsterLevel > 450) 
        return [monsterLevel, parseInt(monsterLevel / 3), language.monsters.supDemon, "monster_16"];
    if (monsterLevel > 400) 
        return [monsterLevel, parseInt(monsterLevel / 3), language.monsters.bigSpirit, "monster_15"];
    if (monsterLevel > 350) 
        return [monsterLevel, parseInt(monsterLevel / 3), language.monsters.deadWarrior, "monster_14"];
    if (monsterLevel > 290)
        return [monsterLevel, parseInt(monsterLevel / 3), language.monsters.troll, "monster_13"];
    if (monsterLevel > 240)
        return [monsterLevel, parseInt(monsterLevel / 3), language.monsters.behemot, "monster_12"];
    if (monsterLevel > 190)
        return [monsterLevel, parseInt(monsterLevel / 3), language.monsters.minotaur, "monster_11"];
    if (monsterLevel > 160)
        return [monsterLevel, parseInt(monsterLevel / 3), language.monsters.cerberus, "monster_10"];
    if (monsterLevel > 130)
        return [monsterLevel, parseInt(monsterLevel / 3), language.monsters.goblin, "monster_09"];
    if (monsterLevel > 100)
        return [monsterLevel, parseInt(monsterLevel / 3), language.monsters.ghost, "monster_08"];
    if (monsterLevel > 75)
        return [monsterLevel, parseInt(monsterLevel / 3), language.monsters.cockatrice, "monster_07"];
    if (monsterLevel > 50)
        return [monsterLevel, parseInt(monsterLevel / 3), language.monsters.lamia, "monster_06"];
    if (monsterLevel > 40)
        return [monsterLevel, parseInt(monsterLevel / 3), language.monsters.imp, "monster_05"];
    if (monsterLevel > 30)
        return [monsterLevel, parseInt(monsterLevel / 3), language.monsters.plant, "monster_04"];
    if (monsterLevel > 20)
        return [monsterLevel, parseInt(monsterLevel / 3), language.monsters.scorpio, "monster_03"];
    if (monsterLevel > 10)
        return [monsterLevel, parseInt(monsterLevel / 3), language.monsters.spider, "monster_02"];
    return [monsterLevel, parseInt(monsterLevel / 3), language.monsters.slim, "monster_01"];
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

    // XP
    let xp= rand(game.character.level * (game.events.monster[0]), game.character.level * game.events.monster[0] * 2);
    if (game.events.lastAction == "bossFight") 
        game.character.xp = game.character.xp + (xp * 5); 
    else 
        game.character.xp = game.character.xp + xp;
    game.stats.totalExp = game.stats.totalExp + xp;

    get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/monsters/' + game.events.monster[3] + '.png" alt="' + game.events.monster[2] + '"></div>';
    
    if (game.events.lastAction == "bossFight") 
        get("#gameContent").innerHTML += '<p>' + language.app.bossFight_win + '<strong>' + nbHit+ '</strong> ' + plural(nbHit, language.app.hit_singular, language.app.hit_plural) + ' !</p>';
    else 
        get("#gameContent").innerHTML += '<p><strong>' + game.events.monster[2] + '</strong> ' + language.app.fightWin_part1 + '<strong>' + nbHit+ '</strong> ' + plural(nbHit, language.app.hit_singular, language.app.hit_plural) + ' !</p>';
    
    get("#gameContent").innerHTML += '<p class="red">' + language.app.fightWin_part2 + '<strong>' + damage + '</strong> ' + plural(damage, language.app.point_singular, language.app.point_plural) + ' ' + language.app.fightWin_part3 + '.</p>';
    if (game.character.health > 0) get("#gameContent").innerHTML += '<p class="green">' + language.app.fightWin_part5 + '<strong>' + xp + '</strong> ' + plural(xp, language.app.point_singular, language.app.point_plural) + language.app.fightWin_part4 + ".</p>";
    saveContent();
}

// ===> When using magic
function magic() {
    if (game.events.lastAction != "bossFight" && game.character.itemMagic > 0 || game.events.lastAction == "bossFight" && game.character.itemMagic > 2) {
        if (game.core.sound == true) get("#soundMagic").play();
        game.stats.fightVictory++;
        game.events.subAction = "fightOver";
        changeDisplay("fightToGame");

        if (game.events.lastAction == "bossFight")
            game.character.itemMagic = game.character.itemMagic - 3;
        else
            game.character.itemMagic--;

        let xp = rand(parseInt(game.character.level * (game.events.monster[0]) / 2), game.character.level * game.events.monster[0] ); // 50% of the experience
        game.character.xp = game.character.xp + xp;
        game.stats.totalExp = game.stats.totalExp + xp;
        
        get("#gameContent").innerHTML = '<div id="containerImage"><img src="assets/images/monsters/' + game.events.monster[3] + '.png"alt="' + game.events.monster[2] + '"></div>';
        
        if (game.events.lastAction == "bossFight")
            get("#gameContent").innerHTML += '<p>' + language.app.bossFight_magic + ".</p>";
        else
            get("#gameContent").innerHTML += '<p>' + language.app.fightMagic + ".</p>";

        get("#gameContent").innerHTML += '<p class="green">' + language.app.fightWin_part5 + '<strong>' + xp + '</strong> ' + plural(xp, language.app.point_singular, language.app.point_plural) + language.app.fightWin_part4 + ".</p>";
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
    if (game.character.health < 1) 
        gameOver();
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

    if (game.character.floor == settings.lastFloor) {
        changeDisplay("hideMessage");
        get('#headerTitle').innerHTML = language.app.floor + " " + settings.lastFloor;
    }

    get("#move").removeEventListener("click", play);
    get("#move").addEventListener("click", displayScore);
    get("#move").innerHTML = language.app.results;
    get("#useHeal").style.display = "none";

    if (game.character.floor == settings.lastFloor) 
        get("#gameContent").innerHTML = language.app.endGame;  
    else 
        get("#gameContent").innerHTML += '<p class="red"><strong>' + language.app.death + '</strong></p>';  
}

// ===> Display the score
function displayScore() {
    if (game.character.floor == settings.lastFloor)
        get("#gameMessage").style.backgroundColor = "lightbluesky";
    else
        get("#gameMessage").style.backgroundColor = "lightcoral";

    resetData();
    changeDisplay("displayMessage");

    get('#gameMessage').innerHTML = "<p class=\"bigger\">" + language.app.gameover  + game.character.score + " pts.</p>";
    get('#gameMessage').innerHTML += "<button id=\"restart\">" + language.app.gameoverButton + "</button>";
    get('#restart').addEventListener("click", function() { location.reload(); });

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
    if (game.character.itemHeal < 1 || game.character.health == game.character.healthMax) 
        get("#useHeal").disabled = true
    else
        get("#useHeal").disabled = false;

    if (game.events.lastAction != "bossFight" && game.character.itemMagic > 0 || game.events.lastAction == "bossFight" && game.character.itemMagic > 2)
        get("#useMagic").disabled = false
    else
        get("#useMagic").disabled = true;

    if (game.character.itemEscape > 0 && game.events.lastAction != "bossFight")
        get("#useEscape").disabled = false
    else 
        get("#useEscape").disabled = true;
    
    get("#potion").innerHTML = '<img src="assets/images/icons/potion.png" alt="🥃"> ' + game.character.itemHeal + ' ' + plural(game.character.itemHeal, language.app.heal_singular, language.app.heal_plural);
    get("#magic").innerHTML = '<img src="assets/images/icons/magic.png" alt="🃏"> ' + game.character.itemMagic + ' ' + plural(game.character.itemMagic, language.app.magic_singular, language.app.magic_plural);
    get("#escape").innerHTML = '<img src="assets/images/icons/escape.png" alt="📜"> ' + game.character.itemEscape + ' ' + plural(game.character.itemEscape, language.app.escape_singular, language.app.escape_plural);     
}

// ===> Check xp level
function checkExperience() {
    if (game.character.xp >= game.character.xpTo) {
        game.character.level++;
        game.character.strength =  game.character.strength + game.character.lvlUpStrength;
        game.character.shield =  game.character.shield + game.character.lvlUpShield;
        game.character.healthMax =  game.character.healthMax + game.character.lvlUpealth;

        game.character.health = game.character.healthMax;
        game.character.xp = 0;
        game.character.xpTo = rand(parseInt(1.5 *  game.character.xpTo), 2 *  game.character.xpTo);

        if (game.character.level > game.stats.maxLevel) game.stats.maxLevel = game.character.level;

        get("#gameContent").innerHTML += '<hr><p class="green">' + language.app.levelUp_part1 + '.</p>';
        get("#gameContent").innerHTML += '<p class="green">' + language.app.levelUp_part2 + '.</p>';
        saveContent();
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
    let nb = rand(0, language.tips.length);
    let arr = language.tips;

    return arr[nb];
}

// ===> Reset all character data
function resetData() {
    game.core.ongoing = false;
    game.stats.totalGame++;
    game.character.health = settings.data.health;
    game.character.healthMax = settings.data.healthMax;
    game.character.strength = settings.data.strength;
    game.character.shield = settings.data.shield;
    game.character.xp = settings.data.xp;
    game.character.xpTo = settings.data.xpTo;
    game.character.itemHeal = settings.data.heal;
    game.character.itemMagic = settings.data.magic;
    game.character.itemEscape = settings.data.escape;
    game.character.level = settings.data.level;
    game.character.floor = settings.data.floor;
    game.character.room = settings.data.room;
    game.character.itemLimit = settings.data.itemLimit;
    game.character.lvlUpHealth = settings.data.lvlUpHealth;
    game.character.lvlUpStrenght = settings.data.lvlUpStrenght;
    game.character.lvlUpShield = settings.data.lvlUpShield;

    storage("set", "TOWER-gameSettings", JSON.stringify(game))
}

// ===> Save the content of the app
function saveContent() {
    game.events.currentEvent = get("#gameContent").innerHTML;
}