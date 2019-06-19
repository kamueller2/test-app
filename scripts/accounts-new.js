var firebaseConfig = {
    apiKey: "AIzaSyBN7LY1mgo8xNyiqviHoMbxTnrT4whKLXM",
    authDomain: "project-1-b691a.firebaseapp.com",
    databaseURL: "https://project-1-b691a.firebaseio.com",
    projectId: "project-1-b691a",
    storageBucket: "project-1-b691a.appspot.com",
    messagingSenderId: "904494310957",
    appId: "1:904494310957:web:f844b97c354d9a11",

    clientId: "904494310957-snk9h5ndi37tl0h4emhho96llkpm10v7.apps.googleusercontent.com",
    API_KEY: 'AIzaSyBkCA6UT776r0tRv_oynJX5g4T8xZd7PIE',

    scopes: ["email", "profile",
        "https://www.googleapis.com/auth/calendar"
    ],

    discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();
var uid;
var user;


//sign up on click
$("#signUp").on("click", function() {
    var email = $("#email").val();
    var password = $("#password").val();
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        alert("Failed to sign up...");
    });
});

$("#signIn").on("click", function() {
    var email = $("#email").val();
    var password = $("#password").val();
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        alert("Failed to sign in. Please check credentials or sign up!");
    });
});

$("#signOut").on("click", function() {
    firebase.auth().signOut().catch(function(error) {
        alert("failed to sign out")
    });

});

//DONT TOUCH THIS FUNCTION, ITS BUILT ON STICKS T^T
var trueOnce = false;
firebase.auth().onAuthStateChanged(person => {
    console.log(window.location);
    //SIGN UP AND AUTO LOG IN
    if (person && window.location.href.includes("signUp")) {
        var call = false;
        if ($('#callChecked').is(':checked')) {
            call = true;
        }
        var pref = $("#preferredTime").val();
        if (pref === '')
            pref = 15
        database.ref('users/').push({
            uid: person.uid,
            name: $("#name").val(),
            number: $("#number").val(),
            email: $("#email").val(),
            password: $("#password").val(),
            prefT: pref,
            text: true,
            call: call
                //insert google calender stuff to save
        });
        window.location = 'innerPage.html';
    }
    //STOP INFINITE LOOP
    else if (window.location.href.includes("signUp")) {
        return;
    }
    //SIGNED IN AND ON INNER PAGE
    else if (person && !window.location.href.includes("innerPage")) {
        window.location = 'innerPage.html';
    }
    //POPULATE DATA HERE
    else if (person && !trueOnce) {
        trueOnce = true;
        user = person
        uid = person.uid

    }
    //STOP SIGN OUT INFINITE LOOP
    else if (!window.location.href.includes("signIn")) {
        window.location = 'signIn.html'
    }
});

const firebaseAuthObj = firebase.auth;

// firebase.initializeApp(firebaseConfig);

const ui = new firebaseui.auth.AuthUI(firebase.auth());

var gSignIn = document.getElementById('my-signin');

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

function initClient() {
    gapi.client.init({
        apiKey: firebaseConfig.API_KEY,
        clientId: firebaseConfig.clientId,
        discoveryDocs: firebaseConfig.discoveryDocs,
        scope: firebaseConfig.scopes
    }).then(function() {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        gSignIn.onclick = handleAuthClick;
        // signoutButton.onclick = handleSignoutClick;
    }, function(error) {
        appendPre(JSON.stringify(error, null, 2));
    });
}

function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        gSignIn.style.display = 'none';
        // signoutButton.style.display = 'block';
        listUpcomingEvents();
    } else {
        gSignIn.style.display = 'block';
        // signoutButton.style.display = 'none';
    }
}

//  Sign in the user upon button click.

function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}


//   Append a pre element to the body containing the given message
//   as its text node. Used to display the results of the API call.

// @param {string} message Text to be placed in pre element.

function appendPre(message) {
    var pre = document.getElementById('firebaseui-auth-container');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}


// Print the summary and start datetime/date of the next ten events in
//  the authorized user's calendar. If no events are found an
//  appropriate message is printed.

function listUpcomingEvents() {
    gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime'
    }).then(function(response) {
        var events = response.result.items;
        appendPre('Upcoming events:');

        if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
                var event = events[i];
                var when = event.start.dateTime;
                if (!when) {
                    when = event.start.date;
                }
                appendPre(event.summary + ' (' + when + ')')
            }
        } else {
            appendPre('No upcoming events found.');
        }
    });
}