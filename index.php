<!doctype html>
<!--[if lt IE 7]> <html class="no-js ie6 oldie" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js ie7 oldie" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js ie8 oldie" lang="en"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		
		<title>ORWoS</title>
		<meta name="description" content="">
		<meta name="author" content="">
		
		<!-- Mobile -->
		<meta name="apple-mobile-web-app-capable" content="no" />
		<meta name="apple-mobile-web-app-status-bar-style" content="default" />
		<meta name="viewport" content="user-scalable=no, initial-scale=1.0, maximum-scale=1.0, width=320.1" />
		
		<!-- Home screen icon -->
		<link rel="apple-touch-icon-precomposed" href="images/apple-touch-icon.png"/>
		<link rel="apple-touch-icon-precomposed" sizes="72x72" href="images/apple-touch-icon-72.png" />
		<link rel="apple-touch-icon-precomposed" sizes="114x114" href="images/apple-touch-icon@2x.png" />
		<link rel="apple-touch-icon-precomposed" sizes="144x144" href="images/apple-touch-icon-72@2x.png" />
		
		<!-- Styles -->
		<link rel="stylesheet" href="css/ui-lightness/jquery-ui.css">
		<link rel="stylesheet" href="css/style.css">
		
		<script src="js/libs/modernizr-2.0.6.min.js"></script>
</head>
<body>
	<!-- Fullscreen content -->
	<table id="fullscreen">
		<tr>
			<td class="margin">&nbsp;</td>
			<td class="content">
				<div class="body"></div>
				<div id="btn_close_fullscreen">Close</div>
			</td>
			<td class="margin">&nbsp;</td>
		</tr>
	</table>
	
	<!-- Main content -->
	<div id="container">
		<div id="main" role="main"></div>
	</div>
    
    <!-- Welcome dialog -->
    <div class="dialog_content" id="dialog_welcome">
	<p><i>In all four directions my fortune it grows,<br/>
                and over red waves of sand the wind ever blows.</i></p>
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
    	<p>My goodness, look what has become of you and your three little lackeys. What are you all supposed to be?</p>
	
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
			<div class="title">Dave's Strangely Appropriate Emporium <span class="gold"></span></div>
			<ul class="items"></ul>
		</div>
	</div>
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
	<script src="js/classes/NPC.js"></script>
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
