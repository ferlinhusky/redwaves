<?php

    /*
        1. receive Player objects (JSON) and email address from app
        2. md5 hash the JSON
        3. send hash value to email address
    */

    $saveobj = $_GET["saveobj"];
    $email = $_GET["email"];
    
    // Validate email address
    if(!filter_var($email, FILTER_VALIDATE_EMAIL))
    {
        echo $email." is not a valid address.";
    }
    else
    {
        $hash = md5($saveobj);
        
        $to = $email;
        $subject = "Over red waves of sand > Saved Game > ".date("Y-m-d");
        $message = $hash;
        $from = "orwos@artsick.com";
        
        $headers = "From:" . $from;
        mail($to,$subject,$message,$headers);
        
        echo "Save has been sent to ".$email;
    }

?>