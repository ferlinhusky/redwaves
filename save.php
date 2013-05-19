<?php

    /*
        1. receive Player objects (JSON) and email address from app
        2. convert data to password
        3. send 100 char value to email address
    */

    $saveobj = $_POST["saveobj"];
    $email = $_POST["email"];
    
    /*
        Skills          0000
        Spells          0000
        Inventory item  00000
        Weapons         000000
        Armor           000000
        Store item      000000
        Level Complete  000000
        Movement        000000
        HP              0000000
    */
    
    //$bin = decbin(26);
    //$bin = substr("00000000", 0, 8 - strlen($bin)).$bin;
    
    $pcl = array("A","B","C","D","E","F","G","H","I","J","K","L","M");
    array_push($pcl, "N","O","P","Q","R","S","T","U","V","V","W","X","Y","Z");
    array_push($pcl, "a","b","c","d","e","f","g","h","i","j","k","l","m");
    array_push($pcl, "n","o","p","q","r","s","t","u","v","w","x","y","z");
    array_push($pcl, "0","1","2","3","4","5","6","7","8","9","_","!");

    $json = stripslashes($_POST["saveobj"]);
    $output = json_decode($json, true);
    
    $type = '00000000';
    $gender = '';
    foreach($output as $p){
        // Type
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
        // Gender
        switch($p["gender"]){
            case "male": $gender.="1"; break;
            default: $gender.="0"; break;
        }
    }
    
    $raw = str_split($type.$gender, 6);
    $passcode = '';
    
    foreach($raw as $r){
        $passcode.=$pcl[bindec($r)];
    }
    
    echo $passcode;
    
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