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
        public $str='';
        public $con='';
        public $dex='';
        public $int_='';
        public $wis='';
        public $cha='';
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
    
    // Convert dash to "A"s
    $passcodechars = str_split($passcode);
    for($i=0; $i<count($passcodechars); $i++){
        // If a dash is found...
        if($passcodechars[$i]=="-"){
            // Look at the next character to see how many "A"s to add
            $acount = array_search($passcodechars[$i+1], $pcl);
            $aarray = array();
            // Replace the dash, and the character after, with the "A"s
            for($j=0; $j<$acount; $j++){
                array_push($aarray, "A");
            }
            array_splice($passcodechars, $i, 2, $aarray);
        }
    }
    
    // Convert passcode array to binary string -> 750 chars
    $pcodebinarystr='';
    foreach($passcodechars as $pchar){
        $pcharval = array_search($pchar, $pcl);
        $pcharbinval = decbin($pcharval);
        $pcodebinarystr.=substr("000000", 0, 6 - strlen($pcharbinval)).$pcharbinval;
    }
    
    // If block isn't exactly 750 chars, return error
    if(strlen($pcodebinarystr) != 750){
        echo json_encode(array("error"=>"Passcode not valid"));
    } else {
        // Split the rest into usable blocks
        /*
            0-11    Player types    12
            12-15   Genders         4
            16-47   Player level    32
            48-75   STR             28
            76-103  CON             28
            104-131 DEX             28
            132-159 INT             28
            160-187 WIS             28
            188-215 CHA             28
            216-311 Inventory       96
            312-391 Skills          80
            392-535 Armor           144
            536-599 Spells          64
            600-695 Weapons         96
            696-731 Store           36
            732-743 Gold            12
            744-749 Level Complete  6
        */
        $pcw = $pcodebinarystr;
        
        $playertypes = substr($pcw, 0, 12);
            $ptypes = str_split($playertypes, 4);
        $genders = substr($pcw, 12, 4);
        $playerlevels = substr($pcw, 16, 32);
            $plevels = str_split($playerlevels, 8);
        $str = substr($pcw, 48, 28);
            $pstr = str_split($str, 7);
        $con = substr($pcw, 76, 28);
            $pcon = str_split($con, 7);
        $dex = substr($pcw, 104, 28);
            $pdex = str_split($dex, 7);
        $int = substr($pcw, 132, 28);
            $pint = str_split($int, 7);
        $wis = substr($pcw, 160, 28);
            $pwis = str_split($wis, 7);
        $cha = substr($pcw, 188, 28);
            $pcha = str_split($cha, 7);
        $inventory = substr($pcw, 216, 96);
            $pinventory = str_split($inventory, 24);
        $skills = substr($pcw, 312, 80);
            $pskills = str_split($skills, 20);
        $armor = substr($pcw, 392, 144);
            $parmor = str_split($armor, 36);
        $spells = substr($pcw, 536, 64);
            $pspells = str_split($spells, 16);
        $weapons = substr($pcw, 600, 96);
            $pweapons = str_split($weapons, 24);
        $store = substr($pcw, 696, 36);
            $pstore = str_split($store, 6);
        $gold = bindec(substr($pcw, 732, 12));
        $levelcomplete = bindec(substr($pcw, 744));
        
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
            
            // Attributes
            $player->str = bindec($pstr[$i]);
            $player->con = bindec($pcon[$i]);
            $player->dex = bindec($pdex[$i]);
            $player->wis = bindec($pwis[$i]);
            $player->int_ = bindec($pint[$i]);
            $player->cha = bindec($pcha[$i]);
            
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
