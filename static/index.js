

document.addEventListener('DOMContentLoaded', () => {
    let displayname = null;
    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // hide error message for init
    document.querySelector(".error").innerHTML = ""
    document.querySelector(".error").setAttribute("style", "display:none;")
    // hide channels for init
    document.querySelector("#channels").style = "display:none"


    // DISPLAY NAME
    // hide create display name input
    document.querySelector("#display-name").setAttribute("style", "display:none;")
    // lookup display name
    if (localStorage.getItem('displayname')) {
        displayname = localStorage.getItem('displayname')
        //register with server
        socket.emit('register with server', {
            'displayname': displayname
        })        // set welcome name
        //socket.emit('fetch channels')
        document.querySelector("#show-display-name").innerHTML = displayname
        document.querySelector("#channels").style = "display:block"
    } else {
        //show the create input #display-name section
        document.querySelector("#display-name").setAttribute("style", "display:block;")
        //disable create display name button until user types something in input
        document.querySelector("#create-display-name-btn").disabled = true
        document.querySelector("#displayname").addEventListener("keyup", () => {
            document.querySelector("#create-display-name-btn").disabled = false
        })
        //handle display form submit
        document.querySelector('#displayname-form').onsubmit = function(e) {
            e.preventDefault();
            //set displayname
            displayname = document.querySelector("#displayname").value
            console.log("socket to display name create",displayname)
            socket.emit('display name create', {
                'displayname': displayname
            })
        }
    }
    // attempted create display name handler
    socket.on('create display name results', data => {
        if (data.status === "success") {
            // clear any error messages
            document.querySelector(".error").style = "display:none"
            //welcome and hide form        
            //set local storage with displayname
            localStorage.displayname = displayname
            //set welcome message with displayname
            document.querySelector("#show-display-name").innerHTML = displayname
            //reset form and hide
            //clear  input
            document.querySelector("#displayname").innerHTML = ""
            // disable button
            document.querySelector("#create-display-name-btn").disabled = true
            // hide section
            document.querySelector("#display-name").setAttribute("style", "display:none;")
            // show channels section
            document.querySelector("#channels").style = "display:block"
            // get the channels
            emit('fetch channels')
        } else {
            //report error and leave form
            document.querySelector(".error").innerHTML = data.message
            document.querySelector(".error").setAttribute("style", "display:block;")
        }
    });
});