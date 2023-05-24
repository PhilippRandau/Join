<?php

########### CONFIG ###############

$recipient = 'davide.n2@gmx.de'; //password: erdiedas123
#$redirect = 'forgotPassword.html';

########### CONFIG END ###########



########### Intruction ###########   
#
#   This script has been created to send an email to the $recipient
#   
#  1) Upload this file to your FTP Server
#  2) Send a POST rewquest to this file, including
#     [name] The name of the sender (Absender)
#     [message] Message that should be send to you
#
##################################



###############################
#
#        DON'T CHANGE ANYTHING FROM HERE!
#
#        Ab hier nichts mehr ändern!
#
###############################

switch ($_SERVER['REQUEST_METHOD']) {
    case ("OPTIONS"): //Allow preflighting to take place.
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: POST");
        header("Access-Control-Allow-Headers: content-type");
        exit;
    case ("POST"): //Send the email;
        header("Access-Control-Allow-Origin: *");

        $email = $_POST['email'];

        $message = "Hello,\n
        \nFollow this link to reset yout JOIN password for yor" . $email . " account.\n
        \nhttps://gruppe-446.developerakademie.net/html/changePassword.html?email=" . $email . "\n
        \nif you didn't ask to ewawr your password, you can ignore this email. \n
        \nThanks,\n
        \nYour Join team\n";
        
        $recipient = $email;
        $subject = "Reset your email for JOIN App";
        $headers = "From:  noreply@https://gruppe-446.developerakademie.net/Join";

        $result = mail($recipient, $subject, $message, $headers);
        print($result);
        #header("Location: " . $redirect); 

        break;
    default: //Reject any non POST or OPTIONS requests.
        header("Allow: POST", true, 405);
        exit;
}