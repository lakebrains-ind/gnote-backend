const User = require("../models/user.models");
// const mailer = require("../utils/mailer");
// const passport = require("passport");
const jwt = require("jsonwebtoken");

// Sign In/Up Function
exports.userCreate = async (req, res, next) => {
  try {
    // Get data from body
    const data = req.body;
    console.log("data000",data);

    // Find user data
    const [user] = await User.find({ email: data.email });

    // Check user data
    if (!data.username || !data.email) {

      // Send Response
      res.send({ status: 404, error: "Credencials are missing" });
    } else {
      if (!user) {

        // Create User if not there
        const createdData = await User.create({
          username: data.username,
          email: data.email,
          used_time: 0,
        });

        // Create JWT Token
        const token = jwt.sign({ _id: createdData._id }, "lakebrains", { expiresIn: 365 * 24 * 60 * 60 });

        // Send Response
        res.send({ status: 200, data: createdData, token: token });
      } else {

        // Create JWT Token
        const token = jwt.sign({ _id: user._id }, "lakebrains", { expiresIn: 365 * 24 * 60 * 60 });

        // Send Response
        res.send({ status: 200, data: user, token: token });
      }
    }
  } catch (error) {

    // Send Response
    res.send(error);
  }
};

// Send mail Function
exports.userMail = async (req, res, next) => {

  // Get data from body
  const data = req.body;

  // Data to send in Mail
  var replacements = {
    // userName: data.name,
    // text_link: data.text_link,
    notes_text: data.notes,
    // meetingDate: data.meetingDate,
  };

  // Send Mail
  mailer.send({
    to: data.email,
    subject: data.subject,
    template: "confirmation_mail",
    context: replacements,
  });

  // Send Response
  res.send(`Mail is sended to email`);
};
