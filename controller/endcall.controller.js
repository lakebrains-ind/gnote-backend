var { google } = require('googleapis')
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// Imports the Google Cloud client library
exports.endcall = async (req, res) => {
    let audience =
    "https://asia-south1-transcript-extension-lb.cloudfunctions.net/notes_capture";
    let jwtClient = new google.auth.JWT(
        process.env.CLIENT_EMAIL,
        null,
        process.env.PRIVATE_KEY,
        audience
    );
    try{
       const data = req.body;
        console.log("data => ",data);
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
                        body: JSON.stringify(data),
                    }
                )
                    .then((res) => { return res.json() })
                    .then((data) => {
                        console.log("data",data);
                    });
            }
        });
    }
    catch (error) {
        // Send Response
        res.send(error);
      }
}