const mailer = require("../utils/mailer");
var { google } = require('googleapis')
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// Imports the Google Cloud client library
exports.endcall = async (req, res) => {
    let actionItem;
    let Conclusion;
    let Roadblocks;
    let Summary;
    let subject;
    let audience =
    "https://asia-south1-transcript-extension-lb.cloudfunctions.net/notes_capture";
    let jwtClient = new google.auth.JWT(
        process.env.CLIENT_EMAIL,
        null,
        process.env.PRIVATE_KEY,
        audience
    );
    try{
       const data1 = req.body;
        console.log("data => ",data1);
        jwtClient.authorize(function (err, _token) {
            console.log("jwtClient",_token);
            if (err) {
                console.log(err);
                return err;
            } else {
                fetch(
                    "https://asia-south1-transcript-extension-lb.cloudfunctions.net/notes_capture",
                    {
                        method: "POST",
                        headers: {
                            "Authorization": `bearer ${_token.id_token}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(data1),
                    }
                )
                    .then((res) => { return res.json() })
                    .then((data) => {
                        console.log("data",data);
                        actionItem = data["'Action Items'"];
                        Conclusion = data.Conclusion;
                        Roadblocks = data.Roadblocks;
                        Summary = data.Summary;
                        subject = data.subject;

                        var replacements = {
                            Action_Item : actionItem,
                            Conclusion:Conclusion?Conclusion:[],
                            Roadblocks:Roadblocks?Roadblocks:[],
                            Summary:Summary?Summary:[],
                            Subject:subject?subject:[],
                          // userName: data.name,
                          // text_link: data.text_link,
                          meetingDate: data.startTime?data.startTime:[],
                        };
                      console.log("replacements",replacements);
                        // Send Mail
                        mailer.send({
                          to: data1.userEmail,
                          subject: data1.subject == data1.meetname ? subject : data1.subject,
                          template: "confirmation_mail",
                          context: replacements,
                        });
                      
                        // Send Response
                        res.send(`Mail is sended to email`);
                    });

            }
        });
        // Data to send in Mail
       
    }
    catch (error) {
        // Send Response
        res.send(error);
      }
}