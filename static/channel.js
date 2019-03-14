function displaySelectedChannelInMessageArea(selectedChannel) {
  document.querySelector('.message-list h2').innerHTML = selectedChannel
  document.querySelector('.message-list h2').style.backgroundColor = "rgb(240 255 240)"
}

function updateChannelList(data) {
  let channelListEl = document.querySelector('#channels ul')
  //clear list
  channelListEl.innerHTML = ''
  //add items
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
        item.style.backgroundColor = "lightgray";
      })
      event.currentTarget.style.backgroundColor = "rgb(240 255 240)"
      selectedChannel = event.currentTarget.dataset.channel
      localStorage.setItem("selectedchannel",selectedChannel)
      displaySelectedChannelInMessageArea(selectedChannel)
      // document.querySelector('.message-list h2').innerHTML = selectedChannel
      // document.querySelector('.message-list h2').style.backgroundColor = "rgb(240 255 240)"
    })
    channelListEl.appendChild(listItem)

  })
}
document.addEventListener('DOMContentLoaded', () => {
  let selectedChannel = null;
  // Connect to websocket
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

  // channel list
  socket.on('channel list', (data) => {

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
          displaySelectedChannelInMessageArea(selectedChannel)
          socket.emit("fetch messages per channel")
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
    }
  });

  socket.on('connect', () => {
    socket.emit('fetch channels')
  })



  // listen for channel update from server
  document.querySelector('form#create-channel').onsubmit = function (e) {
    console.group('create channel submit')
    e.preventDefault();
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