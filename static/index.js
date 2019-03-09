document.addEventListener('DOMContentLoaded', () => {
    let displayname = null;
    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // When connected, configure buttons
    socket.on('connect', () => {

        // Each button should emit a "submit vote" event
        // document.querySelectorAll('button').forEach(button => {
        //     button.onclick = () => {
        //         const selection = button.dataset.vote;
        //         socket.emit('submit vote', {'selection': selection});
        //     };
        // });
    });

    // When a new vote is announced, add to the unordered list
    // socket.on('vote totals', data => {
    //     document.querySelector('#yes').innerHTML = data.yes;
    //     document.querySelector('#no').innerHTML = data.no;
    //     document.querySelector('#maybe').innerHTML = data.maybe;
    // });

    // DISPLAY NAME
    // hide create display name input
    document.querySelector("#display-name").setAttribute("style", "display:none;")
    // lookup display name
    if (localStorage.getItem('displayname')) {
        displayname = localStorage.getItem('displayname')
        // set welcome name
        document.querySelector("#show-display-name").innerHTML = displayname
    } else {
        //show the create input #display-name section
        document.querySelector("#display-name").setAttribute("style", "display:block;")
        //disable create display name button until user types something in input
        document.querySelector("#create-display-name-btn").disabled=true
        document.querySelector("#displayname").addEventListener("keyup", () => {
            document.querySelector("#create-display-name-btn").disabled= false

        })
        document.querySelector("#create-display-name-btn").addEventListener("click", () => {
            //set displayname
            displayname = document.querySelector("#displayname").value
            //set local storage with displayname
            localStorage.displayname = displayname
            //set welcome message with displayname
            document.querySelector("#show-display-name").innerHTML = displayname
            //reset form and hide
            //clear  input
            document.querySelector("#displayname").innerHTML = ""
            // disable button
            document.querySelector("#create-display-name-btn").disabled=true
            // hide section
            document.querySelector("#display-name").setAttribute("style", "display:none;")


        })
    }

});