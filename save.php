<?php

    /*
        1. receive Player objects (JSON) and email address from app
        2. convert data to password
        3. send 100 char value to email address
    */

    $saveobj = $_GET["saveobj"];
    $email = $_GET["email"];
    
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

    echo var_dump(json_decode($saveobj));
?>