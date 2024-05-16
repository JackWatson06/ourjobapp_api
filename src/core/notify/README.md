# Notify Service
The notification service allows us to send messages out of the application through email or SMS.

## Email
Our application sends out emails using the _Node Mailer_ library. When we are in production we send
emails through Google's SMTP servers. During development, we use the software _Mailhog_ to test 
emails.
- [Node Mailer Documentation](https://nodemailer.com/)
- [Node Mailer GMail Documentation](https://nodemailer.com/usage/using-gmail/)
- [MailHog GitHub](https://github.com/mailhog/MailHog)

### Environment Settings
- **MAIL_HOST**: The host we use to send out emails.
- **MAIL_PORT**: The port we are sending emails to.
- **MAIL_FROM_ADDRESS**: The address we are sending from.
- **MAIL_FROM_NAME**: The name we are sending from.

Production only settings:
- **MAIL_USERNAME**: Username for the SMTP server.
- **MAIL_PASSWORD**: Password for the SMTP server.

## SMS
We use _Message Bird_ to deliver text messages for user verification. When running in development 
mode you can view the responses from the Message Bird SDK by viewing the _ourjobapp\_api\_node_ 
docker container log output. This will let you know the verification code so you can verify the new 
account on signup.
- [Message Bird Login Page](https://dashboard.messagebird.com/en-us/login)
- [Message Bird Developer Documents](https://developers.messagebird.com)

### Environment Settings
- **SMS_NUMBER**: The number we are sending texts from.
- **SMS_SECRET**: The secret used by _Message Bird_