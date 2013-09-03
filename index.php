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
	<table id="help"><tr><td class="margin">&nbsp;</td><td class="content">
		<h1>How to play</h1>
		
		<h2>Overview</h2>
		<p><b>Over red waves of sand</b> is a single-player adventure game in a semi-ASCII style. If
		you've every played D&D or any adventure game of any sort you're probably familiar with
		the player types and stats being used here. If not, isn't learning all about discovery?</p>
		
		<p>The long and short of it is that you and your companions are going on a series of
		@dventures&trade; wherein you kill all manner of monster. Why? Does the caged bird know
		why it sings? Exactly. Nobody does. Except you, and that is why you must fight.</p>
		
		<h3>Attention mobile users</h3>
		<p>I've tested this for the iPhone 4/5, iPad, iPad mini and various Android tablets (thanks,
		Target demo models!) and it works pretty well on all of those. The only weird one is Chrome for iOS, so
		if you're using that right now, you may want to switch.</p>
		
		<h2>Player stats and skills</h2>
		<p>All characters have the following attributes: Strength, Dexterity, Constitution, Intelligence,
		Wisdom, and Charisma. In addition, all characters have hit points (HP), action points (AP),
		experience points (XP), an armor class (AC), and a character level (Lvl).</p>
		
		<h3>In summation</h3>
		<p>You lose HP when you get hit; zero hit points means your character is dead. But don't fret,
		they'll be back for the next @dventure&trade;, they just won't gain any XP at the end of the
		level. Action points determine how much you can do during your turn (moving, fighting, spellcasting).
		Experience points are gained at the end of each @dventure&trade; for a variety of reasons. Gain
		enough XP and your character will gain levels.</p>
		
		<p>Gaining levels means raising your attribute scores, which in turn raises your HP, AP, along
		with all kinds of other nice advantages. Armor class is lowered (lower is better) by
		wearing stronger armor and having high Dexterity. It's basically a measure of how hard it is
		(or isn't) to hit you. It is so hard to not hit you right now.</p>
			
		<h2>Player character (PC) types</h2>
		<p>There are 8 available player types: Fighter, Knight, Wizard, Thief, Wolfman, Harpy, Young
		Priest, and Old Priest. In the descriptions I'll be mixing him/her/he/she/etc. but for all
		characters (except for the Wolfman and Harpy) genders are randomly assigned in the game.</p>
		
		<p>Individual skills are highlighted in white. You probably don't know what they do, but I
		bet you can guess in an educated way.</p>
		<h3>Fighter</h3>
		<p>The Fighter, as you may have guessed, likes to fight. He comes equipped with a long sword
		and a crossbow. He is both a <span class="skill">marksman</span> and <span class="skill">tenacious</span>.
		Marksmanship gives the
		fighter a better chance of hitting his target with any ranged weapon; tenacity allows the
		Fighter to overcome certain death (50% of the time) and regain hit points after what would have
		been a fatal blow.</p>
		<h3>Knight</h3>
		<p>The Knight is a walking, talking (always talking) medieval tank. She wears the heaviest armor
		and carries the biggest swords. She's a <span class="skill">swordsman</span> by nature, giving her a better chance to hit
		as well as more damage with sword attacks than any other. Her strong starting armor class is more
		than enough to recommend her.</p>
		<h3>Wizard</h3>
		<p>The Wizard is, as always, a total weakling physically but devastating with his spells. He
		begins with four spells (fireball, freeze, lightning, earthquake) and a badass wooden staff. So
		badass. He's super-smart and pretty dextrous, which makes him somewhat hard to hit. He also takes
		half spell damage due to his knowledge of <span class="skill">necromancy</span>, which must be nice.</p>
		<h3>Thief</h3>
		<p>The Thief, you know, she's pretty quick. She's likely going to be the fastest and hardest
		to hit of any character at the start. Her dual daggers offer a nice amount of finishing power and
		her <span class="skill">stealthy</span> ways mean monsters can't find her once she's out of sight.</p>
		<h3>Wolfman</h3>
		<p>For being a Wolfman, he's almost never a man. He's more like a really smart wolf who looks
		kind of mannish. Smart compared to an actual wolf, that is. He's still pretty dumb, but totally
		ripped. He deals extra damage in melee and his <span class="skill">keenness</span> allows him to sniff out enemies behind
		closed doors.</p>
		<h3>Harpy</h3>
		<p>The Harpy is much more dangerous than her stats may show. While both very wise and deeply
		charismatic, her ability to <span class="skill">paralyze</span> the enemy with her song is literally deadly. Every
		successful attack brings the chance of stopping any monster in its tracks for up to two turns,
		giving her and her companions the chance to strike it down.</p>
		<h3>Young Priest</h3>
		<p>The Young Priest is a rollicking sort, able to deal serious damage with his maul as well as
		act as an on-field medic. His Heal spell is relative short-ranged, but can mean the difference between
		life and death. Like the Fighter, the Young Priest is <span class="skill">tenacious</span> and in fact could be considered
		a dual-class character, if you care about that sort of thing.
		<h3>Old Priest</h3>
		<p>The Old Priest, while he still carries a formidable weapon, is more interested in the healing
		and magical arts than straight up beating people to death. His healing spell works on every player character
		within his sight, meaning he doesn't need to be on the frontlines to provide support, and can
		play clean-up for weakened monsters left behind; just don't let him get overwhelmed. Like the Wizard,
		the Old Priest only takes half spell damage due to his knowledge of <span class="skill">necromancy</span>.</p>
		
		<h2>A word about Action Points</h2>
		<p>Every character in the game receives a number of action points per turn which they may use to
		perform certain actions. This number is reflected in the character table which sits above the map,
		under the "Act" column.</p>
		
		<p>The cost breakdown is as follows:</p>
		
		<ul>
			<li>0 points: opening/closing a door, picking up an item, switching weapons, selecting
			a spell</li>
			<li>1 point: moving cardinally</li>
			<li>1.5 points: moving diagonally</li>
			<li>2 points: casting a spell, doing battle, attacking with a ranged weapon</li>
		</ul>
			
		<h2>The toolbar</h2>
			<p>Down in the toolbar, below the map, sits all the action buttons. Here you'll find buttons for
			Help (obvs), opening and closing doors, picking up items, selecting weapons to wield, spells to
			cast, and items to use, along with the button to end your turn (hint: it will
			blink when your turn is over).</p>
		<h2>Movement</h2>
			<p>Movement is available in 8 directions. Use the up/down/left/right arrow keys
			to move your active character around the map in the four cardinal directions. To move
			diagonally, hold down a combination of an up/down and left/right arrow key to move in that
			direction. E.g. up+right = northeast, down+left = southwest.</p>
			
			<p>If you're on a mobile device, tap the screen in the
			general direction you want to go and I think you'll be pleasantly surprised. You cannot move
			through other players or monsters.</p>
		<h2>Doing battle</h2>
			<p>Initiate close combat with a monster by attempting to move into the monster's square from any
			surrounding square. As long as you have 2 Action Points to spare, you will attack the
			monster with your active weapon. You can keep attacking until you're down to less than 2 Action
			Points. If things aren't going well, feel free to run away.</p>
			
			<p>If, for some strange reason, you would like to the types of monsters you're dealing with, hover
			your mouse over the monster tile and its name will appear in a tooltip.</p>
		<h2>Selecting and using weapons</h2>
			<p>Your active weapon shows as the text of the weapon button. Click the small arrow to the right
			of the button to see a list of all available weapons. Most characters begin with only one weapon
			so there isn't much to do. The Knight, for example, begins with a broad sword and that's it.</p>
			
			<p>The Fighter, on the other hand, begins with a long sword and a crossbow. In the Fighter's
			weapon list, for this example, you woud click "Crossbow" to set that as your active weapon. To
			use a close combat weapon (e.g. a sword) you don't need to do anything special to attack with it.
			It will be used automatically to attack and defend during battle.</p>
			
			<p>The crossbow (and all ranged weapons for that matter) must be activated in order to use them.
			To activate a ranged weapon, click the weapon button (not the little arrow) and you will see a
			range appear around your character on the map. Any monsters which sit within this range may be
			fired upon. To fire upon a monster, simply click on it.</p>
			
			<p>Feel free to move about with the range activated, that's my gift to you. Also, there is no
			counterattacking a ranged weapon, so fire away!</p>
		<h2>Casting spells</h2>
			<p>Casting spells works the same as firing a ranged weapon. That is, choose a spell by clicking
			the small arrow to the right of the spell button, select the spell you would like to cast, and then
			click the spell button itself to bring up the range on the map.</p>
			
			<p>There are three types of spells: attacking, healing, and physical. Attack spells are used in
			the same manner as a ranged weapon; that is, by clicking on a monster within range to cast the
			spell at them.</p>
			
			<p>Healing spells work much the same except you must click on a player character, at which point a
			certain amount of HP will be regained by some or all of your characters, depending on
			the spell.</p>
			
			<p>Physical spells do all kinds of things and may be activated by clicking on any square within
			range. Who knows what might happen?! (I do. I know.)</p>
		<h2>Items</h2>
			<p>Using items works pretty much like selecting a spell or weapon. Click the little arrow beside
			the item button, select the item you would like to queue up and then click the item button itself
			to use the item. Most items help regain hit points or give you extra attacks in battle. Nothing
			nasty (yet).</p>
			
		<h2>Picking up and dropping</h2>
			<p>To pick up an item/weapon/piece of armor, move your character over top of the item on the map and then click the
			"Pick up" button (with the arrow swooping up). The "Pick up" button is only enabled when you're over top of an item, so you'll
			know what's up. When you click the button, a list will appear which contains all of the items on
			that square. Click the item in the list to pick it up.</p>
			
			<h3>Picking up armor</h3>
			<p>Picking up armor will cause your player to put it on and drop whatever armor
			s/he is wearing of the same type. So if you pick up a helmet, whatever helmet you happen to be
			wearing will be swapped for the new one and dropped on the ground.</p>
			
			<p>To drop an item, click the "Drop" button (with the arrown swooping down). As with the "Pick up"
			button, a list will appear which contains all of the items you may drop.</p>
			
			<h3>Dropping weapons</h3>
			<p>If you drop the weapon you're wielding, the next availabe weapon in your stash will be
			wielded. If you drop all of your weapons, it's just you and your tiny hands against the world.</p>
			
			<h3>Identifying items</h3>
			<p>You might wonder how to tell the difference between an item and a monster; it's
			quite simple: all items appear on white tiles.</p>
		<h2>Completing an @dventure&trade;</h2>
			<p>After successfully completing an @dventure&trade;, you will be presented with a win screen
			which details how great you are and how much treasure you've taken as a reward. It also lists
			out the XP each character has gained from completing the @dventure&trade;. Any characters who
			died during the outing receive no XP.</p>
		<h2>Saving your game</h2>	
			<p>On the win screen you will see a passcode below the text which you can use to save your
			characters and their advancement in the game. You can have this code sent to you by entering
			your email address (which I don't save in any way, shape, or form) or just by cutting/pasting
			it yourself into someplace safe. That's it; no user names, no passwords, no accounts. Just a
			passcode.</p>
		<h2>Loading your game</h2>
			<p>You can load a saved game by either pasting your passcode into the passcode box on the home
			screen or by clicking the link in the passcode email you sent yourself from the win screen. In
			both cases you must click the "Verify passcode" button below the input box in order to load up
			your game. After that, just click "Play" to get on with your next @dventure&trade;</p>
		<h2>Map features</h2>
			<p>For the most part the maps feature items you'll be readily familiar with from real life: walls,
			doors, water, etc. If you happen to live in a landlocked region and are perplexed upon seeing a large area
			of blue tile, that is a lake. Or a river perhaps. Water is a fickle mistress.</p>
		<h3>Walls and doors</h3>
			<p>You cannot move through a wall unless there is door built into it. Closed doors are indicated by little
			"plus" (+) signs, while open doors use little "minus" (-) signs. To open and close doors, click the
			"Door" button in the toolbar. Because I'm so cool, it's only clickable when there's a door
			to open or close. Now that's service!</p>
			
			<p>NB: if a monster sees you through
			an open door, closing the door won't stop the monster opening it and chasing you down. Can you lock
			a door? Why would you have a key? You aren't even friends with the owner!</p>
		<h2>What else is there to say?</h2>
			<p>I don't think I forgot anything, but I quite likely did. Feel free to contact me through Twitter
			<a href="https://twitter.com/HuskyFerlin">@HuskyFerlin</a> with any questions or comments.</p>
		<div id="btn_close_help">Close</div>
	</td><td class="margin">&nbsp;</td></tr></table>
	
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
