<?php
    date_default_timezone_set('America/New_York');
    
    // Validate email address
    $email = $_GET["email"];
    $passcode = urldecode($_GET["passcode"]);
    $adventure = urldecode($_GET["adventure"]);
    
    if(!filter_var($email, FILTER_VALIDATE_EMAIL))
    {
        echo "'".$email."' is not a valid address.";
    }
    else
    {
        $to = $email;
        $subject = "Over red waves of sand: Saved Game ".date("Y-m-d");
        $message = "<p><b>".$adventure."</b> - Completed</p>".
            "<p>Click the passcode below to get right back in it.</p>".
            "<p><a href='http://www.artsick.com/redwaves/index.php?passcode=".$passcode."'>".$passcode."</a></p>".
            "<p>Or, if you don't trust email links, copy the passcode and paste it into the box when prompted.</p>".
            "<p><b>".$passcode."</b></p>".
            "<p>Thanks for playing!<br/>Graham</p>";
        $from = "ORWoS@artsick.com";
        
        $headers = "From: ".$from."\r\n";
        $headers .= "Reply-To: graham@artsick.com\r\n";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
        
        mail($to,$subject,$message,$headers);
        
        echo "Success";
    }
    
?>