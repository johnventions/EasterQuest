<?php

namespace EasterQuest;

use \Mailjet\Resources;
use \Mailjet\Client;

class EmailService
{
    private $mj;

    public function __construct() {
        $this->mj = new Client($_ENV['MAILJET_API_KEY'], $_ENV['MAILJET_API_SECRET'], true, ['version' => 'v3.1']);
    }

    public function sendMail($toEmail, $subject, array $variables = []) {
        $templateId = 6896590;
        $body = [
            'Messages' => [
                [
                    'From' => [
                        'Email' => $_ENV['MAILJET_FROM_EMAIL'],
                        'Name'  => $_ENV['MAILJET_FROM_NAME']
                    ],
                    'To' => [
                        [
                            'Email' => $toEmail,
                            'Name'  => $toEmail
                        ]
                    ],
                    'Subject'          => $subject,
                    'TemplateID'       => (int)$templateId,
                    'TemplateLanguage' => true,
                    'CustomID'         => 'EasterQuestTemplateSend'
                ]
            ]
        ];

        try {
            $response = $this->mj->post(Resources::$Email, ['body' => $body]);
            if ($response->success()) {
                return true;
            }
            return false;
        } catch (Exception $e) {
            return false;
        }
    }
}