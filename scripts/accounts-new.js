var firebaseConfig = {
    apiKey: "AIzaSyBN7LY1mgo8xNyiqviHoMbxTnrT4whKLXM",
    authDomain: "project-1-b691a.firebaseapp.com",
    databaseURL: "https://project-1-b691a.firebaseio.com",
    projectId: "project-1-b691a",
    storageBucket: "project-1-b691a.appspot.com",
    messagingSenderId: "904494310957",
    appId: "1:904494310957:web:f844b97c354d9a11",

    clientId: "904494310957-snk9h5ndi37tl0h4emhho96llkpm10v7.apps.googleusercontent.com",

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


var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function(authResult, redirectUrl) {
            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            return true;
        },
        uiShown: function() {
            // The widget is rendered.
            // Hide the loader.
            document.getElementById('loader').style.display = 'none';
        }
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInSuccessUrl: 'https://kamueller2.github.io/test-app/pages/signUp.html',
    signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
    // Terms of service url.
    tosUrl: '<your-tos-url>',
    // Privacy policy url.
    privacyPolicyUrl: '<your-privacy-policy-url>'
};
ui.start('#firebaseui-auth-container', uiConfig);
// This function will trigger when there is a login event
firebase.auth().onAuthStateChanged(function(user) {
    // console.log(user)
    // Make sure there is a valid user object
    if (user) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://apis.google.com/js/api.js";
        script.src = "https://apis.google.com/js/platform.js?onload=init"


        // Once the Google API Client is loaded, you can run your code
        script.onload = function(e) {
            // Initialize the Google API Client with the config object
            gapi.client
                .init({
                    apiKey: firebaseConfig.apiKey,
                    clientId: firebaseConfig.clientID,
                    discoveryDocs: firebaseConfig.discoveryDocs,
                    scope: firebaseConfig.scopes.join(" ")
                })
                // Loading is finished, so start the app
                .then(function() {
                    // Make sure the Google API Client is properly signed in
                    if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
                        startApp(user);
                    } else {
                        firebase.auth().signOut(); // Something went wrong, sign out
                    }
                });
        };
        // Add to the document
        document.getElementsByTagName("head")[0].appendChild(script);
    }
});

function startApp(user) {
    console.log(user);

    // Make sure to refresh the Auth Token in case it expires!
    firebase.auth().currentUser.getToken()
        .then(function() {
            return gapi.client.calendar.events
                .list({
                    calendarId: "primary",
                    timeMin: new Date().toISOString(),
                    showDeleted: false,
                    singleEvents: true,
                    maxResults: 10,
                    orderBy: "startTime"
                })
        })
        .then(function(response) {
            console.log(response);
        });
}