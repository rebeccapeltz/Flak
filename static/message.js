// Connect to websocket
var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
document.addEventListener('DOMContentLoaded', () => {
  let selectedChannel = null;


  // disable button until mesage text entered
  document.querySelector("#send-message-btn").disabled = true
  document.querySelector("#message-text").addEventListener("keyup", () => {
    document.querySelector("#send-message-btn").disabled = false
  })

  //handle delete all messages for a user
  document.querySelector("#delete-all-messages-for-user").addEventListener('click', function (event) {
    let displayname = localStorage.getItem("displayname")
    socket.emit("delete messages per displayname", {
      'displayname': displayname
    })
  })

  //handle delete all messages for a user
  // document.querySelector("#clear-server-cache").addEventListener('click', function (event) {
  //   console.log("clear cache")
  //   socket.emit("clear server cache")
  // })

  // handlemessage submit
  //handle display form submit
  document.querySelector('#send-message').onsubmit = function (e) {
    e.preventDefault();
    //disable send buuton
    // document.querySelector("#send-message-btn").disabled = true
    // BUG re-disabling submit button only works in debug mode - not sure why?
    // document.getElementById('send-message-btn').setAttribute("disabled", "disabled");

    // get channel
    let selectedchannel = localStorage.getItem('selectedchannel')
    // get displayname
    let displayname = localStorage.getItem('displayname')

    if (!selectedchannel || selectedchannel.length === 0) {
      alert("Click to select a channel before sending a message")
      document.querySelector("#message-text").value =""
      return false
    }

    //set messagetext
    messagetext = document.querySelector("#message-text").value
    console.log("socket to send message", messagetext)
    //create a message using text, user display name and channel
    newmessage = {
      'messagetext': messagetext,
      'displayname': displayname,
      'selectedchannel': selectedchannel
    }
    socket.emit('message create', {
      "newmessage": newmessage
    })





    socket.on('remove messages for displayname', data => {
      // data shold be displayname
      console.log("remove message for ", data)

      //message elements should have data with displayname of user that created the message
      //iterate through displayed message and if name is there remove it
      let messageEls = document.querySelectorAll('.message-list li')
      messageEls.forEach(message => {
        if (message.dataset.displayname === data) {
          message.remove()
        }
      })
    })

    socket.on('error', data => {
      //look at status and data and post to an error field
    })

  }

  socket.on('remove all messages', data => {
    // data shold be displayname
    console.log("remove message")

    //message elements should have data with displayname of user that created the message
    //iterate through displayed message and if name is there remove it
    let messageEls = document.querySelectorAll('.message-list li')
    messageEls.forEach(message => {
        message.remove()
    })
  })
})