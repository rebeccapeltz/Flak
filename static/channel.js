document.addEventListener('DOMContentLoaded', () => {
  let channels = null;
  let selectedChannel = null;
  // Connect to websocket
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

  // When connected, configure channels
  socket.on('channel list', (data) => {
    channels = data
    let channelList = document.querySelector('#channels ul')
    channels.forEach(channel=>{
      console.log(channel)
      let listItem = document.createElement('li')
      listItem.setAttribute("class","channel-item")
      listItem.setAttribute("data-channel",channel)
      listItem.innerHTML = channel
      listItem.addEventListener('click',(event)=>{
        //set all backgrounds to lightgray and then selected to light green
        document.querySelectorAll('.channel-item').forEach(item=>{
          item.style.backgroundColor = "lightgray";
        })
        event.currentTarget.style.backgroundColor = "rgb(240 255 240)"
        selectedChannel = event.currentTarget.dataset.channel;
        document.querySelector('.message-list h2').innerHTML = selectedChannel
        document.querySelector('.message-list h2').style.backgroundColor= "rgb(240 255 240)"
      })
      channelList.appendChild(listItem)

    })
  });
})