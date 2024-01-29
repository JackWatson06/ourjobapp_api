# Notify Service
The notification service allows us to send messages out of the application through email or SMS.

### Email
Our application sends out emails using the _Node Mailer_ library. When we are in production we send
emails through Google's SMTP servers. During development we use _Mailhog_ to test emails.
- [Node Mailer Documentation](https://nodemailer.com/)
- [MailHog GitHub](https://github.com/mailhog/MailHog)

### Message Bird
We use Message Bird to deliver text messages for user verification. When running in development mode 
you can view the responses from the Message Bird SDK by viewing the _unijobapp\_api\_node_ docker 
container log output. This will let you know the verification code so you can verify the new 
account.
- [Message Bird Developer Documents](https://developers.messagebird.com)