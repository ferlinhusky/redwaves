<?php
    class Player {
        public $type='';
        public $gender='';
        public $level='';
        public $inventory='';
        public $skills='';
        public $armor='';
        public $maxhp='';
        public $maxmove='';
        public $spells='';
        public $weapons='';
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
    if(strlen($pcodebinarystr) != 576){
        echo json_encode(array("error"=>"Passcode not valid"));
    } else {
        // Split the rest into usable blocks
        /*
            0-11     Player types
            12-15    Genders
            16-47   Player level
            48-143  Inventory
            144-223 Skills
            224-367 Armor
            368-395 Max HP
            396-415 Max Movement
            416-479 Spells
            480-575 Weapons
        */
        $playertypes = substr($pcw, 0, 8);
        $genders = substr($pcw, 12, 4);
        $playerlevels = substr($pcw, 16, 32);
        $inventory = substr($pcw, 48, 96);
        $skills = substr($pcw, 144, 80);
        $armor = substr($pcw, 224, 144);
        $maxhp = substr($pcw, 368, 28);
        $maxmove = substr($pcw, 396, 20);
        $spells = substr($pcw, 416, 64);
        $weapons = substr($pcw, 480);
        
        // Write data in Player()
        
        // Write JSON data
        
        // Return JSON   
    }
?>