const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "miniprojectmu@gmail.com", //aliasger102002
        pass: "hhze xpwd knhu lrbu",//kiplgmwjakimbghp
    },
});

const mailOptions = {
    from: "miniprojectmu@gmail.com",
    to: "cricheros123456@gmail.com",
    subject: "Hi",
    text: `Hello`,
};

module.exports = {
    transporter,
    mailOptions
};