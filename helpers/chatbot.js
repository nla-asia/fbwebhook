
module.exports = function handleMessage(sender_psid, received_message) {
    let response;
    
    // Checks if the message contains text
    if (received_message.text) {    
      // Create the payload for a basic text message, which
      // will be added to the body of our request to the Send API
      response = {
        "text": `You sent the message: "${received_message.text}". Now send me an attachment!`
      }
    } else if (received_message.attachments) {
      // Get the URL of the message attachment
      let attachment_url = received_message.attachments[0].payload.url;
      response = {
        "attachment": {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": [{
              "title": "Is this the right picture?",
              "subtitle": "Tap a button to answer.",
              "image_url": attachment_url,
              "buttons": [
                {
                  "type": "postback",
                  "title": "Yes!",
                  "payload": "yes",
                },
                {
                  "type": "postback",
                  "title": "No!",
                  "payload": "no",
                }
              ],
            }]
          }
        }
      }

    } 
    
    // Send the response message
    callSendAPI(sender_psid, response);    
  }
  
  
  module.exports = function handlePostback(sender_psid, received_postback) {
   // console.log('ok')
     let response;
    // Get the payload for the postback
    let payload = received_postback.payload;
     
      // Set the response based on the postback payload
    switch(payload){
        case "GET_STARTED":
            // show welcome message + set persistent menu
                response = { "text": "Mingalarpar . Welcome to The Assistant Bot.I am the automatic chatbot and I am here to assist you with anything you would like to know about ...."}
            break;
        case "HOME":
                response = {
                    "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type":"button",
                        "text":"This is sample home menu text.",
                        "buttons":[{
                                      "type": "postback",
                                      "title": "Option 1",
                                      "payload": "OPTION_1",
                                   },
                                   {
                                    "type": "postback",
                                    "title": "Option 2",
                                    "payload": "OPTION_2",
                                   }]
                      }
                    }
                }
            break;
        case "yes":
                response = { "text": "Thanks!" }
            break;
        case "no":
                response = { "text": "Oops, try sending another image." }
            break;
        default:
                response = { "text": "Sorry, I don't get it." }
        break;
    }
  
    // Send the message to acknowledge the postback
    callSendAPI(sender_psid, response);
  }
  
  
  module.exports = function callSendAPI(sender_psid, response) {
    // Construct the message body
    let request_body = {
      "recipient": {
        "id": sender_psid
      },
      "message": response
    }
  
    // Send the HTTP request to the Messenger Platform
    request({
      "uri": "https://graph.facebook.com/v2.6/me/messages",
      "qs": { "access_token": PAGE_ACCESS_TOKEN },
      "method": "POST",
      "json": request_body
    }, (err, res, body) => {
      if (!err) {
        console.log('message sent!')
      } else {
        console.error("Unable to send message:" + err);
      }
    }); 
  }

