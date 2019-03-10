document.addEventListener('DOMContentLoaded', () => {
  let channels = null;
  // Connect to websocket
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

  // When connected, configure channels
  socket.on('channel list', (data) => {
    let channelList = document.querySelector('#channels ul')
    data.forEach(channel=>{
      console.log(channel)
      let listItem = document.createElement('li');
      listItem.setAttribute("class","channel-item")
      listItem.innerHTML = channel
      channelList.appendChild(listItem)
    })
  });
})