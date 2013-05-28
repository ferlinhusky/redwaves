<!doctype html>
<!--[if lt IE 7]> <html class="no-js ie6 oldie" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js ie7 oldie" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js ie8 oldie" lang="en"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

	<title>Over red waves of sand</title>
	<meta name="description" content="">
	<meta name="author" content="">

	<!-- iPad -->
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="default" />
	<meta name="viewport" content="user-scalable=no, width=device-width" />
	<link rel="apple-touch-icon" href="apple-touch-icon.png" />
	<link rel="apple-touch-startup-image" href="startup.png" /> 

	<!-- Styles -->
	<link rel="stylesheet" href="css/ui-lightness/jquery-ui.css">
        <link rel="stylesheet" href="css/style.css">

	<script src="js/libs/modernizr-2.0.6.min.js"></script>
</head>
<body>
	
	<div id="container">
		<div id="main" role="main"></div>
	</div>
    
    <!-- Welcome dialog -->
    <div class="dialog_content" id="dialog_welcome">
    	<p>
            <i>
                In all four directions my fortune it grows,<br/>
                but over red waves of sand the wind never blows,<br/>
                white sand at dusk turns orange before black,<br/>
                over red waves of sand I will not come back.
            </i>
        </p>
        <select id="pick_a_map"></select>
    </div>
    
    <!-- Select team dialog -->
    <div class="dialog_content" id="dialog_select_team">
    	<p>You need three "friends" to, let's face it, kill for you.</p>
	
	<table width="100%" cellspacing="5" align="center">
		<tr>
			<td>
				<input type="checkbox" id="st_fighter" class="select_team_opt" value="Fighter" /><label for="st_fighter">Fighter</label><br/>
				<input type="checkbox" id="st_knight" class="select_team_opt" value="Knight" /><label for="st_knight">Knight</label><br/>
				<input type="checkbox" id="st_wizard" class="select_team_opt" value="Wizard" /><label for="st_wizard">Wizard</label><br/>
			</td>
			<td>
				<input type="checkbox" id="st_thief" class="select_team_opt" value="Thief" /><label for="st_thief">Thief</label><br/>
				<input type="checkbox" id="st_wolfman" class="select_team_opt" value="Wolfman" /><label for="st_wolfman">Wolfman</label><br/>
				<input type="checkbox" id="st_lamia" class="select_team_opt" value="Lamia" /><label for="st_lamia">Lamia</label>
			</td>
		</tr>
	</table>
    </div>

    <!-- Help dialog -->
    <div class="dialog_content" id="dialog_help">
        <p>If using a mobile device, "Click" -> "Touch</p>
        <ul>
            <li>HP = Hit points, MV = Moves (per turn), WPN = Duh, ATK = Max damage
            per attack, AC = Armor class (lower the better), WEARS = Come on!
            <li>Use up/down/left/right arrow keys to move/attack - sorry diagonal :( -
            on a mobile device, touch in the the desired direction</li>
            <li>Click and drag map to move it</li>
            <li>Click "End Turn" (rotation icon)...to end your turn.</li>
            <li>Click "Door" (key icon) to open/close doors (+/-)</li>
            <li>To cast a spell (as the Wizard), click the arrow beside "Spell" (scroll
            icon) to select a spell, then click the spell name to show the spell range.
            Click enemeies within range to cast the spell at them.</li>
        </ul>
        <hr/>
        <p class="copyright">Over red waves of sand &copy; 2013 Cranfield<br/>
            <a href="https://twitter.com/HuskyFerlin" target="_blank">@HuskyFerlin |
            <a href="mailto:kingmountain@gmail.com">kingmountain@gmail.com</a>
        </p>
    </div>
	<script>
		var passcode = "<?php echo $_GET["passcode"]; ?>";
	</script>
    
	<!--! end of #container -->
	<script src="js/classes.js"></script>
	<!-- jQuery -->
	<script src="js/libs/jquery-1.9.1.min.js"></script>
	<script src="js/libs/jquery-ui.js"></script>
	<!-- Setup and support functions -->
	<script src="js/libs/Starter.js"></script>
	<script src="js/libs/Helpers.js"></script>
	<script src="js/classes/Status.js"></script>
	<!-- World -->
	<script src="js/classes/Map.js"></script>
	<script src="js/classes/World.js"></script>
	<!-- Actors -->
	<script src="js/classes/Character.js"></script>
	<script src="js/classes/Player.js"></script>
	<script src="js/classes/Monsters.js"></script>
	<script src="js/classes/Battle.js"></script>
	<!-- Items -->
	<script src="js/classes/Items.js"></script>
	<script src="js/classes/Weapons.js"></script>
	<script src="js/classes/Armor.js"></script>
	<!-- Abilities -->
	<script src="js/classes/Spells.js"></script>
	<script src="js/classes/Skills.js"></script>
	<!-- Features -->
	<script src="js/classes/Terrain.js"></script>
        <!-- Adventures -->
	<script src="js/classes/Adventures.js"></script>
	<!-- Map building and user interaction -->
	<script src="js/classes/Square.js"></script>
	<script src="js/classes/Dialogs.js"></script>
	<script src="js/classes/Input.js"></script>
	<!-- Plugins and initialization -->
	<script src="js/libs/astar.js"></script>
	<script src="js/libs/graph.js"></script>
	<script src="js/plugins.js"></script>
	<script src="js/script.js"></script>
	<!-- end scripts-->
	
	<script>
		var _gaq=[['_setAccount','UA-248730-1'],['_trackPageview']]; // Change UA-XXXXX-X to be your site's ID
		(function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];g.async=1;
		g.src=('https:'==location.protocol?'//ssl':'//www')+'.google-analytics.com/ga.js';
		s.parentNode.insertBefore(g,s)}(document,'script'));
	</script>
	
	<!--[if lt IE 7 ]>
		<script src="//ajax.googleapis.com/ajax/libs/chrome-frame/1.0.2/CFInstall.min.js"></script>
		<script>window.attachEvent("onload",function(){CFInstall.check({mode:"overlay"})})</script>
	<![endif]-->
        
</body>
</html>
