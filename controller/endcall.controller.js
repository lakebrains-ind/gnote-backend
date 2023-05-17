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
       const dataa = req.body;
        console.log("data => ",dataa);
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
                        body: JSON.stringify(dataa),
                    }
                )
                    .then((res) => { return res.json() })
                    .then((data) => {
                        console.log("data",data);
                        actionItem = data["'Action Items'"];
                        console.log(actionItem);
                        Conclusion = data.Conclusion;
                        Roadblocks = data.Roadblocks;
                        Summary = data.Summary;
                        subject = data.subject;

                    //     var replacements = {
                    //         Action_Item : actionItem,
                    //         Conclusion:Conclusion?Conclusion:[],
                    //         Roadblocks:Roadblocks?Roadblocks:[],
                    //         Summary:Summary?Summary:[],
                    //         Subject:subject?subject:[],
                    //       // userName: data.name,
                    //       // text_link: data.text_link,
                    //       meetingDate: data.startTime?data.startTime:[],
                    //     };
                    //   console.log("replacements",replacements);
                    //     // Send Mail
                    //     mailer.send({
                    //       to: data1.userEmail,
                    //       subject: data1.subject == data1.meetname ? subject : data1.subject,
                    //       template: "confirmation_mail",
                    //       context: replacements,
                    //     });
                      
                    //     // Send Response
                    //     res.send(`Mail is sended to email`);
                      let mainHead = `<h1 style="color: rgb(105, 105, 105);">
                    Notes
                    </h1>`;
                      let Summary1 =Summary
                        ? Summary.map((el) => {
                            return '<li style="font-size: 16px;">' + el + "</li>";
                          })
                        : null;
                      let actionItem1 = actionItem
                        ? actionItem.map((el) => {
                            return '<li style="font-size: 16px;">' + el + "</li>";
                          })
                        : null;
                      let Roadblocks1 = Roadblocks
                        ? Roadblocks.map((el) => {
                            return '<li style="font-size: 16px;">' + el + "</li>";
                          })
                        : null;
                      let Conclusion1 = Conclusion
                        ? Conclusion.map((el) => {
                            return '<li style="font-size: 16px;">' + el + "</li>";
                          })
                        : null;
            
                      let summarySection = "";
                      if (Summary1) {
                        summarySection =
                          summarySection + `<h2 style="color: gray;">Summary</h2><ul>`;
                        for (let i = 0; i < Summary.length; i++) {
                          const li = Summary[i];
                          summarySection = summarySection + li;
                        }
                        summarySection = summarySection + "</ul>";
                      }
                      let actionItemsSection = "";
                      if (actionItem1) {
                        actionItemsSection =
                          actionItemsSection +
                          `<h2 style="color: gray;">Action Items</h2><ul>`;
                        for (let i = 0; i < actionItem.length; i++) {
                          const li = actionItem[i];
                          actionItemsSection = actionItemsSection + li;
                        }
                        actionItemsSection = actionItemsSection + "</ul>";
                      }
                      let roadblocksSection = "";
                      if (Roadblocks1) {
                        roadblocksSection =
                          roadblocksSection +
                          `<h2 style="color: gray;">Roadblocks</h2><ul>`;
                        for (let i = 0; i < Roadblocks.length; i++) {
                          const li = Roadblocks[i];
                          roadblocksSection = roadblocksSection + li;
                        }
                        roadblocksSection = roadblocksSection + "</ul>";
                      }
                      let conclusionSection = "";
                      if (Conclusion1) {
                        conclusionSection =
                          conclusionSection +
                          `<h2 style="color: gray;">Conclusion</h2><ul>`;
                        for (let i = 0; i < Conclusion.length; i++) {
                          const li = Conclusion[i];
                          conclusionSection = conclusionSection + li;
                        }
                        conclusionSection = conclusionSection + "</ul>";
                      }
                      var html = `<div>
                        ${mainHead ? mainHead : ""}
                        ${summarySection ? summarySection : ""}
                        ${actionItemsSection ? actionItemsSection : ""}
                        ${roadblocksSection ? roadblocksSection : ""}
                        ${conclusionSection ? conclusionSection : ""}
                        </div>`;
                        let today = dataa.startTime;
                        var meetingDate = today.toLocaleString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                            second: "numeric",
                            hour12: false,
                        });
                      // Data to send in Mail
                      var replacements = {
                        userName: dataa.name,
                        notes_text: html,
                        meetingDate: meetingDate,
                      };
            
                      // Send Mail
                      mailer.send({
                              to: dataa.userEmail,
                              subject: dataa.subject == dataa.meetname ? subject : dataa.subject,
                              template: "confirmation_mail",
                              context: replacements,
                            });
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