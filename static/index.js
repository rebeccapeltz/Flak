

document.addEventListener('DOMContentLoaded', () => {
    let displayname = null;
    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

   

    // When a new vote is announced, add to the unordered list
    // socket.on('vote totals', data => {
    //     document.querySelector('#yes').innerHTML = data.yes;
    //     document.querySelector('#no').innerHTML = data.no;
    //     document.querySelector('#maybe').innerHTML = data.maybe;
    // });

    // hide error message for init
    document.querySelector(".error").innerHTML = ""
    document.querySelector(".error").setAttribute("style", "display:none;")

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
        document.querySelector("#show-display-name").innerHTML = displayname
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
        } else {
            //report error and leave form
            document.querySelector(".error").innerHTML = data.message
            document.querySelector(".error").setAttribute("style", "display:block;")
        }
    });
});