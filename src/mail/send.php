<?php
$sendto = "bulat_al82@mail.ru, teos.nl@gmail.com";
$phone = nl2br($_POST['phone']);
$name = nl2br($_POST['name']);
$email = nl2br($_POST['email']);
$adress = nl2br($_POST['adress']);
$content = "Заявка с сайта PROДЫМ";

// Формирование заголовка письма
$subject  = $content;
$headers  = "From: no-reply@no-reply.ru" . "\r\n";
$headers .= "Reply-To: Без ответа". "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html;charset=utf-8 \r\n";

// Формирование тела письма
$msg  = "<html><body style='font-family:Arial,sans-serif;'5>";
$msg .= "<h2 style='font-weight:bold;border-bottom:1px dotted #ccc;'>Письмо с сайта PROДЫМ";
$msg .= "</h2>\r\n";
$msg .= "<p><strong>Телефон:</strong> ".$phone."</p>\r\n";
$msg .= "<p><strong>ФИО:</strong> ".$name."</p>\r\n";
$msg .= "<p><strong>Адрес:</strong> ".$adress."</p>\r\n";
$msg .= "</body></html>";
mail($sendto, $subject, $msg, $headers);
//mail($email, $subject, $wemsg, $headers);
?>