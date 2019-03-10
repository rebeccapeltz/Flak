 document.addEventListener('DOMContentLoaded', () => {
   let channels = null;
   // Connect to websocket
   var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

   // When connected, configure channels
   socket.on('connect', () => {

     // Each button should emit a "submit vote" event
     // document.querySelectorAll('button').forEach(button => {
     //     button.onclick = () => {
     //         const selection = button.dataset.vote;
     //         socket.emit('submit vote', {'selection': selection});
     //     };
     // });
   });
 })