//TODO on connect get all messages rendered

document.addEventListener('DOMContentLoaded', () => {
  let selectedChannel = null;
  // Connect to websocket
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

  // disable button until mesage text entered
  // document.querySelector("#send-message-btn").disabled = true
  document.getElementById('send-message-btn').setAttribute("disabled", "disabled");
  document.querySelector("#message-text").addEventListener("keyup", () => {
    // document.querySelector("#send-message-btn").disabled = false
    document.getElementById('send-message-btn').removeAttribute("disabled")
  })
  // hnadle message submit
  //handle display form submit
  document.querySelector('#send-message').onsubmit = function (e) {
    e.preventDefault();
    //disable send buuton
    // document.querySelector("#send-message-btn").disabled = true
    // BUG re-disabling submit button only works in debug mode - not sure why?
    document.getElementById('send-message-btn').setAttribute("disabled", "disabled");

    // get channel
    let selectedchannel = localStorage.getItem('selectedchannel')
    // get displayname
    let displayname = localStorage.getItem('displayname')

    //set messagetext
    messagetext = document.querySelector("#message-text").value
    console.log("socket to send message", messagetext)
    //create a message using text, user display name and channel
    newmessage = {
      'messagetext': messagetext,
      'displayname': displayname,
      'selectedchannel': selectedchannel
    }
    socket.emit('message create', {"newmessage":newmessage})

    


    socket.on('remove messages for displayname', data => {
      // data shold be displayname
      //iterate through message and if there messages listed
      //with this username remove them from display 

    })

    socket.on('error', data => {
      //look at status and data and post to an error field
    })

  }

})

// form#send-message
// input #message-text
// submit "send-message-btn"

// message is li in .channel-list
//