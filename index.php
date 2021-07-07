<?php
    $_version = "1.931";
    $_sounds = ["attack", "magic", "chest", "heal", "room", "floor"];
?>

<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="black">
    <title id="title"></title>
    <link rel="stylesheet" href="assets/css/main.min.css?v=<?php echo $_version; ?>">
    <link rel="manifest" id="manifest">
    <link rel="icon" href="assets/images/favicon.ico" rel="icon" type="image/x-icon">
</head>

<body>
    <!-- MAIN CONTAINER -->
    <div id="container">

        <header>
            <span id="headerTitle"></span>
            <button id="openMenu">⚙️</button>
            <button id="closeMenu">❌</button>
        </header>
        
        <!-- START -->
        <div id="startScreen">
            <img src="assets/images/events/tower.png">
            <h1 id="startScreenTitle"></h1>

            <form>
                <label id="nameHeroLabel"></label>
                <input type="text" id="nameHero" pattern="^[[A-ZÀ-Ýa-zà-ý '-]{2,25}([ -]{1}[[A-ZÀ-Ýa-zà-ý '-]*)?$">
                <button type='submit' id="startGame" onclick="return false"></button>
            </form>

            <p id="displayTip"></p>
            <p id="startFooter"></p>
        </div>
        <!-- // START -->

        <!-- GAME -->
        <div id="gameMessage"></div>

        <div id="gameScreen">
            <div id="heroStatus">
                <div class="heroStatusLine">
                    <div class="heroStatusBlock" id="health"></div>
                    <div class="heroStatusBlock" id="level"></div>
                    <div class="heroStatusBlock" id="xp"></div>
                </div>
                <div class="heroStatusLine">
                    <div class="heroStatusBlock" id="strength"></div>
                    <div class="heroStatusBlock" id="shield"></div>
                    <div class="heroStatusBlock" id="potion"></div>
                    <div class="heroStatusBlock" id="magic"></div>
                    <div class="heroStatusBlock" id="escape"></div>
                </div>
            </div>

            <div id="gameContent"></div>
    
            <div id="listActions">
                <div class="listActionsLine">
                    <button class="action" id="move"></button>
                    <button class="action" id="useHeal"></button>
                </div>
                <div class="listActionsLine">
                    <button class="action" id="openChest"></button>
                    <button class="action" id="closeChest"></button>
                </div>
                <div class="listActionsLine">
                    <button class="action" id="useAttack"></button>
                    <button class="action" id="useMagic"></button>
                </div>
            </div>
        </div>
        <!-- // GAME-->

    </div>
    <!-- // MAIN CONTAINER -->

    <!-- MENU -->
    <div id="blankMenu"></div>
    <div id="menu">
        <h1 id="optionMenuTitle"></h1>
            <div class="buttonList">
                <button id="volumeButton"></button>
                <button id="vibrateButton"></button>
            </div>
            <div class="buttonList">
                <button id="confirmRestart"></button>
                <button id="confirmDelete"></button>
            </div>

        <h1 id="statsMenuTitle"></h1>
            <ul id="listStats"></ul>

        <p id="gameFooter"></p>
    </div>
    <!-- // MENU -->

    <!-- POPUP -->
    <div id="blankPopup"></div>
    <div id="popup">
        <div id="popupContent">
            <h1 id="popupTitle"></h1>
            <p id="popupText"></p>
        </div>
        <div class="buttonList">
            <button id="popupAccept"></button>
            <button id="popupCancel"></button>
        </div>
    </div>
    <!-- // POPUP -->

    <?php 
    // Add all audio files
        foreach($_sounds as $file) {
            echo '<audio preload id="sound' . ucFirst($file) . '">';
                echo '<source src="assets/sounds/' . $file . '.ogg" type="audio/ogg">';
                echo '<source src="assets/sounds/' . $file . '.mp3" type="audio/mp3">';
            echo '</audio>';
        }
    ?>

    <script src="../../libraries/littleJS.min.js?v=<?php echo $_version; ?>"></script>
    <script src="assets/js/core.min.js?v=<?php echo $_version; ?>"></script>
    <script src="assets/js/main.min.js?v=<?php echo $_version; ?>"></script>
</body>
</html>