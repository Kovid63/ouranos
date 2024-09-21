<?php 
 
// Update the path below to your autoload.php, 
// see https://getcomposer.org/doc/01-basic-usage.md 
require_once '/path/to/vendor/autoload.php'; 
 
use Twilio\Rest\Client; 
 
$sid    = "sid"; 
$token  = "token"; 
$twilio = new Client($sid, $token); 
 
$message = $twilio->messages 
                  ->create("mobileNum", // to 
                           array(  
                               "messagingServiceSid" => "sid",      
                               "body" => "s" 
                           ) 
                  ); 
 
print($message->sid);