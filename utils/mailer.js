// file: utils/mailer.js
var _ = require("lodash");
var nodemailer = require("nodemailer");
var hbs = require("nodemailer-express-handlebars");
var config = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "support@lakebrains.in",
    pass: "zzibowbvcfsfbckx",
  },
  tls: {
    rejectUnauthorized: false,
  },
};
const path = require("path");
var transporter = nodemailer.createTransport(config);

transporter.use(
  "compile",
  hbs({
    viewEngine: {
      extname: ".hbs",
      partialsDir: "mail_template/partials",
      layoutsDir: "mail_template",
      defaultLayout: 'confirmation_mail',
    },
    viewPath: "mail_template",
    extName: ".hbs",
  })
);

var defaultMail = {
  from: "Lakebrains <contact@lakebrains.com>",
  text: "Interact",
};

exports.send = function (mail) {
  // use default setting
  mail = _.merge({}, defaultMail, mail);

  // send email
  transporter.sendMail(mail, function (error, info) {
    if (error) return console.log(error);
    console.log("mail sent:", info.response);
  });
};
