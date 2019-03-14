document.addEventListener('DOMContentLoaded', () => {
  let selectedChannel = null;
  // Connect to websocket
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

  // disable button until mesage text entered
  document.querySelector("#send-message-btn").disabled = true
  document.querySelector("#message-text").addEventListener("keyup", () => {
    document.querySelector("#send-message-btn").disabled = false
  })
  // hnadle message submit
  //handle display form submit
  document.querySelector('#send-message').onsubmit = function (e) {
    e.preventDefault();
    // get channel
    let selectedchannel = document.querySelector('.message-list h2').innerHTML
    // get displayname
    let displayname = document.querySelector("#show-display-name").textContent

    //set messagetext
    messagetext = document.querySelector("#message-text").value
    console.log("socket to send message", messagetext)
    //create a message using text, user display name and channel
    socket.emit('message create', {
      'messagetext': messagetext,
      'displayname': displayname,
      'selectedchannel': selectedchannel
    })
   
    // attempted message create handler
    // if successful returns all message for this channel
    socket.on('messages to render', data => {
      // data should be list of messages
      //check for error?
      //if no error render all  messages to message list

    })

    socket.on('remove messages for displayname', data => {
      // data shold be displayname
      //iterate through message and if there messages listed
      //with this username remove them from display 

    })

    socket.on ('error',data=>{
      //look at status and data and post to an error field
    })

  }

})

// form#send-message
// input #message-text
// submit "send-message-btn"

// message is li in .channel-list