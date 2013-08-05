<!doctype html>
<!--[if lt IE 7]> <html class="no-js ie6 oldie" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js ie7 oldie" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js ie8 oldie" lang="en"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

	<title>Over red waves of sand (BETA)</title>
	<meta name="description" content="">
	<meta name="author" content="">

	<!-- iPad -->
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="default" />
	<meta name="viewport" content="user-scalable=no, initial-scale=1.0, maximum-scale=1.0, width=device-width" />
	<link rel="apple-touch-icon" href="apple-touch-icon.png" />
	<link rel="apple-touch-startup-image" href="startup.png" /> 

	<!-- Styles -->
	<link rel="stylesheet" href="css/ui-lightness/jquery-ui.css">
        <link rel="stylesheet" href="css/style.css">

	<script src="js/libs/modernizr-2.0.6.min.js"></script>
</head>
<body>
	<!-- Help content -->
	<div id="help">
		<h1>How to play <i>Over red waves of sand</i></h1>
		<h2>Overview</h2>
			<p><b>Over red waves of sand</b> is a single-player adventure game in a semi-ASCII style. If
			you've every played D&D or any adventure game of any sort you're probably familiar with
			the player types and stats being used here. If that's the case, you're probably just like,
			"Why come I can't cast spells?" or "What's up with the blinking buttons?" For that stuff,
			<a href="#interface">skip to the section on the interface</a>.</p>
		<h2>Player characters (PCs)</h2>
			<p>There are 8 available player types: Fighter, Knight, Wizard, Thief, Wolfman, Harpy, Young
			Priest, and Old Priest. In the descriptions I'll be mixing him/her/he/she/etc. but for all
			characters (except for the Wolfman and Harpy) genders are randomly assigned in the game.</p>
			<h3>Fighter</h3>
			<p>The Fighter, as you may have guessed, likes to fight. He comes equipped with a long sword
			and a crossbow. He's is both a <b>marksman</b> and <b>tenacious</b>. Marksmanship gives the
			fighter a better chance of hitting his target with any ranged weapon; tenacity allows the
			Fighter to overcome certain death (50% of the time) and regain hit points after what would have
			been a fatal blow.</p>
			<h3>Knight</h3>
			<p>The Knight is a walking, talking (always talking) medieval tank. She wears the heaviest armor
			and carries the biggest swords. She's a swordsman by nature, giving her a better chance to hit
			as well as more damage with sword attacks than any other. Her strong starting armor class is more
			than enough to recommend her.</p>
			<h3>Wizard</h3>
			<p>The Wizard is, as always, a total weakling physically but devastating with his spells. He
			begins with four spells (fireball, freeze, lighning, earthquake) and a badass wooden staff. So
			badass. He's super-smart and pretty dextrous, which makes him somewhat hard to hit. He also takes
			half spell damage, which must be nice.</p>
			<h3>Thief</h3>
			<p>The Thief, you know, she's pretty quick. She's likely going to be the fastest and hardest
			to hit of any character at the start. Her dual daggers offer a nice amount of finishing power and
			her stealthy ways mean monsters can't find her once she's out of sight.</p>
			<h3>Wolfman</h3>
			<p>For being a Wolfman, he's almost never a man. He's more like a really smart wolf who looks
			kind of mannish. Smart compared to an actual wolf, that is. He's still pretty dumb, but totally
			ripped. He deals extra damage in melee and his keenness allows him to sniff out enemies behind
			closed doors.</p>
			<h3>Harpy</h3>
			<p>The Harpy is much more dangerous than her stats may show. While both very wise and deeply
			charismatic, her ability to paralyze the enemy with her song is literally deadly. Every
			successful attack brings the chance of stopping any monster in its tracks for up to two turns,
			giving her and her companions the chance to strike it down.</p>
			<h3>Young Priest</h3>
			<p>The Young Priest is a rollicking sort, able to deal serious damage with his maul as well as
			act as an on-field medic. His Heal spell is relative short-ranged, but can mean the difference between
			life and death. Like the Fighter, the Young Priest is tenacious and in fact could be considered
			a dual-class character, if you care about that sort of thing.
			<h3>Old Priest</h3>
			<p>The Old Priest, while he still carries a formidable weapon, is more interested in the healing
			arts than straight up beating people to death. His healing spell works on every player character
			within his sight, meaning he doesn't need to be on the frontlines to provide support, and can
			play clean-up for weakened monsters left behind; just don't let him get overwhelmed.</p>
		<h2>Selecting and using weapons<a name="interface"></a></h2>
		<h2>Casting spells</h2>
		<h2>Doing battle</h2>
		<h2>Map features</h2>
		<h3>Walls and doors</h3>
		<h3>Interiors</h3>
		<h3>Exteriors</h3>
		<div id="btn_close_help">Close</div>
	</div>
	
	<!-- Main content -->
	<div id="container">
		<div id="main" role="main"></div>
	</div>
    
    <!-- Welcome dialog -->
    <div class="dialog_content" id="dialog_welcome">
	<p><i>In all four directions my fortune it grows,<br/>
                but over red waves of sand the wind never blows.</i></p>
    	<p><b>Start a new game</b><br/>
	    Click "Play" to go right into your first adventure!</p>
	<p><b>Load a game</b><br/>
		Enter and verify your passcode, then click "Play" to continue your journey!</p>
	<textarea class="enter_passcode"><?php echo $_GET["passcode"]; ?></textarea>
	<br/><a href="javascript:Input.verifypasscode();" class="verify_passcode">Verify passcode</a>
	<p><b>Next adventure</b></p>
	<p class="next_adventure"></p>
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
				<input type="checkbox" id="st_oldpriest" class="select_team_opt" value="Oldpriest" /><label for="st_oldpriest">Old Priest</label>
			</td>
			<td>
				<input type="checkbox" id="st_thief" class="select_team_opt" value="Thief" /><label for="st_thief">Thief</label><br/>
				<input type="checkbox" id="st_wolfman" class="select_team_opt" value="Wolfman" /><label for="st_wolfman">Wolfman</label><br/>
				<input type="checkbox" id="st_harpy" class="select_team_opt" value="Harpy" /><label for="st_harpy">Harpy</label>
				<input type="checkbox" id="st_youngpriest" class="select_team_opt" value="Youngpriest" /><label for="st_youngpriest">Young Priest</label>
			</td>
		</tr>
	</table>
    </div>
    
    <!-- Equip/buy/sell -->
    <div class="dialog_content" id="dialog_equip">
	<div class="equip">
		<p>Drag items to and from the little blanket to equip your players. Drag from the store to buy new things, rich guy.</p>
		
		<ul class="players"></ul>
		
		<table class="itemgroupstmp">
			<tr>
			<td width="33%"><div class="group medicine"><div class="title">Pack</div>
			    <ul class="items">
				<li data-default="Empty"><i>Empty</i></li>
				<li data-default="Empty"><i>Empty</i></li>
				<li data-default="Empty"><i>Empty</i></li>
				<li data-default="Empty"><i>Empty</i></li>
			    </ul>
			</div></td>
		    
			<td width="33%"><div class="group weapon"><div class="title">Weapons</div>
			    <ul class="items">
				<li><i>Head</i></li>
				<li><i>Weapon</i></li>
				<li><i>Alt Weapon</i></li>
				<li><i>Feet</i></li>
			    </ul>
			</div></td>
				
			<td><div class="group armor"><div class="title">Armor</div>
			    <ul class="items">
				<li data-default="Helmet"><i>Helmet</i></li>
				<li data-default="Body armor"><i>Body armor</i></li>
				<li data-default="Shield"><i>Shield</i></li>
				<li data-default="Boots"><i>Boots</i></li>
			    </ul>
			</div></td>
		    </tr>
		</table>
		
		<div class="trash">Trash</div>
		<div class="buy">
			<div class="title">Dave's Strangely Appropriate Emporium <span class="gold">1250GP</span></div>
			<ul class="items"></ul>
		</div>
	</div>
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
    
    <!-- End of game passcode -->
    <div class="dialog_content" id="passcode_addon">
	<p><b>Passcode</b><br/>
	<span id='passcode'><img src="images/ajax-loader.gif"/> Loading...</span></p>
	
	<p><b>Email</b> <span id='emailpasscoderesponse'></span><br/>
	<input type='text' name='emailpasscode' id='emailpasscode'/></p>
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
	<script src="js/classes/Attribute.js"></script>
	<script src="js/classes/Character.js"></script>
	<script src="js/classes/Player.js"></script>
	<script src="js/classes/Monsters.js"></script>
	<script src="js/classes/Battle.js"></script>
	<script src="js/classes/Party.js"></script>
	<!-- Items -->
	<script src="js/classes/Items.js"></script>
	<script src="js/classes/Weapons.js"></script>
	<script src="js/classes/Armor.js"></script>
	<!-- Abilities -->
	<script src="js/classes/Spells.js"></script>
	<script src="js/classes/Skills.js"></script>
	<!-- Reference -->
	<script src="js/libs/ReferenceArrays.js"></script>
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
