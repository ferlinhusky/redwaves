<?php
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
            $aarray = '';
            // Replace the blank, and the character after, with the "A"s
            for($j=0; $j<$acount; $j++){
                $aarray.="A";
            }
            array_splice($passcodechars, $i, 2, array($aarray));
        }
    }
    
    // Convert passcode array to binary string -> 576 chars
    $pcodebinarystr='';
    foreach($passcodechars as $pchar){
        $pcharval = array_search($pchar, $pcl);
        $pcharbinval = decbin($pcharval);
        $pcodebinarystr.=substr("000000", 0, 6 - strlen($pcharbinval)).$pcharbinval.'+';
    }
    
    echo $pcodebinarystr;
    
    // If block isn't exactly 576 chars, return error
    
    
    // Discard first 4 chars -> 572
    
    // Split the rest into usable blocks
    
    /*
        0-7     Player types
        8-11    Genders
        12-43   Player level
        44-139  Inventory
        140-219 Skills
        220-363 Armor
        364-391 Max HP
        392-411 Max Movement
        412-475 Spells
        476-571 Weapons
    */
    
    // Write JSON data
    
    // Return JSON
?>