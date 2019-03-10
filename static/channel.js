let channelList = [];

function updateChannelList(data) {
  channelList = data
  let channelListEl = document.querySelector('#channels ul')
  //clear list
  channelListEl.innerHTML = ''
  //add items
  channelList.forEach(channel => {
    console.log(channel)
    let listItem = document.createElement('li')
    listItem.setAttribute("class", "channel-item")
    listItem.setAttribute("data-channel", channel)
    listItem.innerHTML = channel
    listItem.addEventListener('click', (event) => {
      //set all backgrounds to lightgray and then selected to light green
      document.querySelectorAll('.channel-item').forEach(item => {
        item.style.backgroundColor = "lightgray";
      })
      event.currentTarget.style.backgroundColor = "rgb(240 255 240)"
      selectedChannel = event.currentTarget.dataset.channel;
      document.querySelector('.message-list h2').innerHTML = selectedChannel
      document.querySelector('.message-list h2').style.backgroundColor = "rgb(240 255 240)"
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
      updateChannelList(data)
      document.querySelector('#select-channel').style = "display:block";
      //hide not found
      document.querySelector('#channels-not-found').style = "display:none";
    } else {
      document.querySelector('#select-channel').style = "display:none";
    }
  });

  socket.on('connect', () => {
    socket.emit('fetch channels')
  })

  // create channel
  // process submit


  // listen for channel update from server
  document.querySelector('form#create-channel').onsubmit = function (e) {
    console.group('create channel submit')
    e.preventDefault();
    let newChannel = document.querySelector('#new-channel-input').value
    //check here to see if this channel exists?
    if (channelList.indexOf(newChannel) > -1) {
      // alert(`Channel "${newChannel}" already in list`)
      let channelListItems = document.querySelectorAll('.channel-list li')
      channelListItems.forEach(item => {
        console.log("existing item", item.dataset.channel)
        if (item.dataset.channel === newChannel) {
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
    } else {
      socket.emit('create channel', {
        "newchannel": newChannel
      })
    }
    document.querySelector('#new-channel-input').value = ''
  }


})