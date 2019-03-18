var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

function displaySelectedChannelInMessageArea(selectedChannel) {
  document.querySelector('.message-list h2').innerHTML = selectedChannel
  document.querySelector('.message-list h2').style.backgroundColor = "rgb(240 255 240)"

  //enable text once a channel is selected
  // document.querySelector("#message-text").disabled = true
 

}


function updateChannelList(data) {
  let channelListEl = document.querySelector('#channels ul')
  //clear list
  channelListEl.innerHTML = ''
  //add items
  // let channels = JSON.parse(data)
  data.forEach(channel => {
    console.log(channel)
    let listItem = document.createElement('li')
    listItem.setAttribute("class", "channel-item")
    listItem.setAttribute("data-channel", channel)
    listItem.innerHTML = channel
    listItem.addEventListener('click', (event) => {
      //deal with user selecting a channel
      //set all backgrounds to lightgray and then selected to light green
      document.querySelectorAll('.channel-item').forEach(item => {
        item.style.backgroundColor = "lightgray"
        item.style.color = "black"
      })
      event.currentTarget.style.backgroundColor = "blue"//"rgb(240 255 240)"
      event.currentTarget.style.color = "white"
      selectedChannel = event.currentTarget.dataset.channel
      localStorage.setItem("selectedchannel", selectedChannel)
      // //////////??socket.emit('fetch channels')

      //clear message list
      document.querySelector('.message-list ul').innerHTML = ''

      displaySelectedChannelInMessageArea(selectedChannel)
      enableMessageInput()
      // document.querySelector('.message-list h2').innerHTML = selectedChannel
      // document.querySelector('.message-list h2').style.backgroundColor = "rgb(240 255 240)"
      socket.emit('fetch messages per channel',selectedChannel)
    })
    channelListEl.appendChild(listItem)

  })
}
document.addEventListener('DOMContentLoaded', () => {
  let selectedChannel = null;
  // Connect to websocket
  // var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

  document.querySelector("#create-channel-btn").disabled = true
  document.querySelector("#new-channel-input").addEventListener("keyup", () => {
    document.querySelector("#create-channel-btn").disabled = false
  })

  // hide not found message by default
  document.querySelector('#channels-not-found').style = "display:none";


  // channel list
  socket.on('channel list', (data) => {
    console.log("channel list")
    if (data.length > 0) {
      //render channel list
      updateChannelList(data)
      //show select channel
      document.querySelector('#select-channel').style = "display:block";
     

      // check if there is a channel in ls - if there is and it's in the channel list 
      // then put selected channel in the message area
      // REMEMBERING channel
      if (localStorage.getItem('selectedchannel')) {
        let selectedChannel = localStorage.getItem('selectedchannel')
        if (data.indexOf(selectedChannel) > -1) {
          //show channel in message
          displaySelectedChannelInMessageArea(selectedChannel)

          //find in selected channel in channel list and color background blue
          document.querySelectorAll('.channel-list li').forEach(channel=>{
            if (channel.dataset.channel === selectedChannel){
              channel.style.backgroundColor="blue"
              channel.style.color = "white"
            } 
          })

          console.log("emitting fetch messages per channel")
          socket.emit("fetch messages per channel", selectedChannel)
        } else {
          //delete from local storage because not in server channel list
          localStorage.removeItem('selectedChannel')
        }
      }

      //hide not found
      document.querySelector('#channels-not-found').style = "display:none";
    } else {
      //show no channels found
      document.querySelector('#select-channel').style = "display:none";
      // sow not found
      document.querySelector('#channels-not-found').style = "display:block";

    }
  });



  // listen for channel update from server
  document.querySelector('form#create-channel').onsubmit = function (e) {
    console.group('create channel submit')

    e.preventDefault();

    //disapble create button
    document.querySelector("#create-channel-btn").disabled = true
    let newChannel = document.querySelector('#new-channel-input').value
    //check here to see if this channel exists?
    let channelExists = false;
    let channelListItems = document.querySelectorAll('.channel-list li')
    channelListItems.forEach(item => {
      console.log("existing item", item.dataset.channel)
      if (item.dataset.channel === newChannel) {
        channelExists = true
        let origColor = item.style.color
        let origFontWeight = item.style.fontWeight
        item.style.color = 'red'
        item.style.fontWeight = 'bold'
        setTimeout(function () {
          item.style.color = origColor
          item.style.fontWeight = origFontWeight
        }, 3000);
      }
    })
    if (!channelExists) {
      socket.emit('create channel', {
        "newchannel": newChannel
      })
    }
    document.querySelector('#new-channel-input').value = ''
  }
})