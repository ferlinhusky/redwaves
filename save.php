<?php

    /*
        1. receive Player objects (JSON) and email address from app
        2. convert data to password
        3. send 100 char value to email address
    */

    $saveobj = $_POST["saveobj"];
    $email = $_POST["email"];
    
    /*
        Players 00000000
        Gender  0000
        Level   00000000
        Item    000000
        Skill   00000
        Armor   000000
        HP      0000000
        Move    00000
        Spells  0000
        Weapons 000000
    */
    
    $pcl = array("A","B","C","D","E","F","G","H","I","J","K","L","M");
    array_push($pcl, "N","O","P","Q","R","S","T","U","V","V","W","X","Y","Z");
    array_push($pcl, "a","b","c","d","e","f","g","h","i","j","k","l","m");
    array_push($pcl, "n","o","p","q","r","s","t","u","v","w","x","y","z");
    array_push($pcl, "0","1","2","3","4","5","6","7","8","9","_","!");

    // Player data
    $playerdata = stripslashes($_POST["playerdata"]);
    $playeroutput = json_decode($playerdata, true);
    
    $type = '00000000';
    $gender = '';
    $level = '';
    $inven = '';
    $skills = '';
    $armor = '';
    $hp = '';
    $movement = '';
    $spells = '';
    $weapons = '';
    
    foreach($playeroutput as $p){
        // Type - 8 bits
        switch($p["type"]){
            case "knight": $type = substr_replace($type, '1', 0, 1);
                break;
            case "wizard": $type = substr_replace($type, '1', 1, 1);
                break;
            case "fighter": $type = substr_replace($type, '1', 2, 1);
                break;
            case "wolfman": $type = substr_replace($type, '1', 3, 1);
                break;
            case "lamia": $type = substr_replace($type, '1', 4, 1);
                break;
            case "thief": $type = substr_replace($type, '1', 5, 1);
                break;
            case "emperor": $type = substr_replace($type, '1', 6, 1);
                break;
            case "automoton": $type = substr_replace($type, '1', 7, 1);
                break;
            default: break;
        }
        // Gender - 4 bits
        switch($p["gender"]){
            case "male": $gender.="1"; break;
            default: $gender.="0"; break;
        }
        
        // Level - 32 bits (4x8)
        $templevel = decbin($p["level"]);
        $level.=substr("00000000", 0, 8 - strlen($templevel)).$templevel;
        
        // Inventory - 96 bits (4x24)
        $invenarray = array($p["inven"][0], $p["inven"][1], $p["inven"][2], $p["inven"][3]);
        foreach($invenarray as $pin){
            if($pin != NULL){
                $tempinven = decbin($pin["refID"]);
                $inven.=substr("000000", 0, 6 - strlen($tempinven)).$tempinven;
            } else {
                $inven.='000000';
            }
        }
        
        // Skill - 80 bits (4x20)
        $skillarray = array($p["skills"][0], $p["skills"][1], $p["skills"][2], $p["skills"][3]);
        foreach($skillarray as $psk){
            if($psk != NULL){
                $tempskill = decbin($psk["refID"]);
                $skills.=substr("00000", 0, 5 - strlen($tempskill)).$tempskill;
            } else {
                $skills.='00000';
            }
        }
        
        // Armor - 144 bits (4x36)
        $armorarray = array($p["wears"][0], $p["wears"][1], $p["wears"][2], $p["wears"][3], $p["wears"][4], $p["wears"][5]);
        foreach($armorarray as $par){
            if($par != NULL){
                $temparmor = decbin($par["refID"]);
                $armor.=substr("000000", 0, 6 - strlen($temparmor)).$temparmor;
            } else {
                $armor.='000000';
            }
        }
        
        // HP - 28 bits (4x7)
        $temphp = decbin($p["hp"]);
        $hp.=substr("0000000", 0, 7 - strlen($temphp)).$temphp;
        
        // Movement - 20 bits (4x5)
        $tempmov = decbin($p["move"]);
        $movement.=substr("00000", 0, 5 - strlen($tempmov)).$tempmov;
        
        // Spells - 64 bits (4x16)
        $spellarray = array($p["spells"][0], $p["spells"][1], $p["spells"][2], $p["spells"][3]);
        foreach($spellarray as $psp){
            if($psp != NULL){
                $tempspell = decbin($psp["refID"]);
                $spells.=substr("0000", 0, 4 - strlen($tempspell)).$tempspell;
            } else {
                $spells.='0000';
            }
        }
        
        // Weapons - 96 bits (4x24)
        $wpnarray = array($p["weapons"][0], $p["weapons"][1], $p["weapons"][2], $p["weapons"][3]);
        foreach($wpnarray as $pwpn){
            if($pwpn != NULL){
                $tempwpn = decbin($pwpn["refID"]);
                $weapons.=substr("000000", 0, 6 - strlen($tempwpn)).$tempwpn;
            } else {
                $weapons.='000000';
            }
        }
    }
    
    // Party items
    
    // Meta data
    
    // Split full data string into 6 bit strings
    // 572 bytes total...need 576 to be even, hence the random 4 digit binary
    // Don't forget to lop it off when reading back in
    $rand = rand(0, 15);
    $randbin = decbin($rand);
    $randbinfmt = substr("0000", 0, 4 - strlen($randbin)).$randbin;
    
    $binarydata = $randbinfmt.$type.$gender.$level.$inven.$skills.$armor.$hp.$movement.$spells.$weapons;
    $raw = str_split($binarydata, 6);
    $passcode = '';
    
    // Convert binary strings into passcode value
    foreach($raw as $r){
        $passcode.=$pcl[bindec($r)];
    }
    
    // Convert repeating "A"s (blocks of 000000) into blanks followed by the count of consecutive "A"s
    $passcodefmt='';
    $passcodechars = str_split($passcode);
    $acount = 0;
    for($i=0; $i<count($passcodechars); $i++){
        if($passcodechars[$i]=="A"){
            $acount++;
            if($i == count($passcodechars)-1){
                // If last char is "A", do final concat
                $passcodefmt.=" ".$pcl[$acount];
            }
        } else {
            if($acount>0){
                $passcodefmt.=" ".$pcl[$acount]; // append a blank to indicate series of "A" + "A" count for that block
                $acount=0; // reset "A" count
            }
            $passcodefmt.=$passcodechars[$i];
        }
    }
    
    echo $passcodefmt;
    
    // Validate email address
    /*if(!filter_var($email, FILTER_VALIDATE_EMAIL))
    {
        echo $email." is not a valid address.";
    }
    else
    {
        $to = $email;
        $subject = "Over red waves of sand > Saved Game > ".date("Y-m-d");
        $message = $hash;
        $from = "orwos@artsick.com";
        
        $headers = "From:" . $from;
        mail($to,$subject,$message,$headers);
        
        echo "Save has been sent to ".$email;
    }*/
?>