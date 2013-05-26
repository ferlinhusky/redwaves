<?php
    class GameData {
        public $players=array();
        public $gold='';
        public $levelcomplete='';
        public $store=array();
    }
    
    class Player {
        public $type='';
        public $gender='';
        public $level='';
        public $inventory=array();
        public $skills=array();
        public $armor=array();
        public $maxhp='';
        public $maxmove='';
        public $spells=array();
        public $weapons=array();
    }

    $pcl = array("A","B","C","D","E","F","G","H","I","J","K","L","M");
    array_push($pcl, "N","O","P","Q","R","S","T","U","V","V","W","X","Y","Z");
    array_push($pcl, "a","b","c","d","e","f","g","h","i","j","k","l","m");
    array_push($pcl, "n","o","p","q","r","s","t","u","v","w","x","y","z");
    array_push($pcl, "0","1","2","3","4","5","6","7","8","9","_","!");
    
    // Get passcode param
    $passcode = urldecode($_GET["passcode"]);
    
    // Convert blanks to "A"s
    $passcodechars = str_split($passcode);
    for($i=0; $i<count($passcodechars); $i++){
        // If a blank is found...
        if($passcodechars[$i]==" "){
            // Look at the next character to see how many "A"s to add
            $acount = array_search($passcodechars[$i+1], $pcl);
            $aarray = array();
            // Replace the blank, and the character after, with the "A"s
            for($j=0; $j<$acount; $j++){
                array_push($aarray, "A");
            }
            array_splice($passcodechars, $i, 2, $aarray);
        }
    }
    
    // Convert passcode array to binary string -> 576 chars
    $pcodebinarystr='';
    foreach($passcodechars as $pchar){
        $pcharval = array_search($pchar, $pcl);
        $pcharbinval = decbin($pcharval);
        $pcodebinarystr.=substr("000000", 0, 6 - strlen($pcharbinval)).$pcharbinval;
    }
    
    // If block isn't exactly 576 chars, return error
    if(strlen($pcodebinarystr) != 630){
        echo json_encode(array("error"=>"Passcode not valid"));
    } else {
        // Split the rest into usable blocks
        /*
            0-11    Player types
            12-15   Genders
            16-47   Player level
            48-143  Inventory
            144-223 Skills
            224-367 Armor
            368-395 Max HP
            396-415 Max Movement
            416-479 Spells
            480-575 Weapons
            576-611 Store
            612-623 Gold
            624-629 Level Complete
        */
        $pcw = $pcodebinarystr;
        
        $playertypes = substr($pcw, 0, 12);
            $ptypes = str_split($playertypes, 4);
        $genders = substr($pcw, 12, 4);
        $playerlevels = substr($pcw, 16, 32);
            $plevels = str_split($playerlevels, 8);
        $inventory = substr($pcw, 48, 96);
            $pinventory = str_split($inventory, 24);
        $skills = substr($pcw, 144, 80);
            $pskills = str_split($skills, 20);
        $armor = substr($pcw, 224, 144);
            $parmor = str_split($armor, 36);
        $maxhp = substr($pcw, 368, 28);
            $pmaxhp = str_split($maxhp, 7);
        $maxmove = substr($pcw, 396, 20);
            $pmaxmove = str_split($maxmove, 5);
        $spells = substr($pcw, 416, 64);
            $pspells = str_split($spells, 16);
        $weapons = substr($pcw, 480, 96);
            $pweapons = str_split($weapons, 24);
        $store = substr($pcw, 576, 36);
            $pstore = str_split($store, 6);
        $gold = bindec(substr($pcw, 612, 12));
        $levelcomplete = bindec(substr($pcw, 624));
        
        // Create Players array
        $Players = array();
        
        // Write data in Player()
        for($i=0; $i<4; $i++){
            $player = new Player();
            
            // Type
            if($i==0){
                $player->type = "hero";
            } else {
                switch ($ptypes[$i-1]) {
                    case "0000": $player->type = "knight";
                        break;
                    case "0001": $player->type = "wizard";
                        break;
                    case "0010": $player->type = "fighter";
                        break;
                    case "0011": $player->type = "wolfman";
                        break;
                    case "0100": $player->type = "lamia";
                        break;
                    case "0101": $player->type = "thief";
                        break;
                    case "0110": $player->type = "emperor";
                        break;
                    case "0111": $player->type = "automoton";
                        break;
                    default: break;
                }
            }
            
            // Gender
            if($genders[$i] == "1"){
                $player->gender = "male";
            } else {
                $player->gender = "female";
            }
            
            // Level
            $player->level = bindec($plevels[$i]);
            
            // Inventory - 4x000000
            $myinventory = str_split($pinventory[$i],6);
            for($j=0; $j<4; $j++){
                array_push($player->inventory, bindec($myinventory[$j]));
            }
            
            // Skills - 4x00000
            $myskills = str_split($pskills[$i],5);
            for($j=0; $j<4; $j++){
                array_push($player->skills, bindec($myskills[$j]));
            }
            
            // Armor - 4x000000
            $myarmor = str_split($parmor[$i],6);
            for($j=0; $j<6; $j++){
                array_push($player->armor, bindec($myarmor[$j]));
            }
            
            // MaxHP - 4x0000000
            $player->maxhp = bindec($pmaxhp[$i]);
            
            // MaxMove - 4x0000000
            $player->maxmove = bindec($pmaxmove[$i]);
            
            // Spells - 4x0000
            $myspells = str_split($pspells[$i],4);
            for($j=0; $j<4; $j++){
                array_push($player->spells, bindec($myspells[$j]));
            }
            
            // Weapons - 4x000000
            $myweapons = str_split($pweapons[$i],6);
            for($j=0; $j<4; $j++){
                array_push($player->weapons, bindec($myweapons[$j]));
            }
            
            // Add to Players array
            array_push($Players, $player);
        }
        
        // Store - 6x000000
        $mystore = array();
        for($j=0; $j<6; $j++){
            array_push($mystore, bindec($pstore[$j]));
        }
        
        // Return JSON data
        $Gamedata = new GameData();
        $Gamedata->players = $Players;
        $Gamedata->gold = $gold;
        $Gamedata->levelcomplete = $levelcomplete;
        $Gamedata->store = $mystore;
        echo json_encode($Gamedata); 
    }
?>