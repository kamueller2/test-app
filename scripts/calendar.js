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
// firebase.initializeApp(firebaseConfig);



// var uiConfig = {
//     signInSuccessUrl: "localhost:5000",
//     signInOptions: [{
//         provider: firebase.auth.GoogleAuthProvider(),
//         scopes: firebaseConfig.scopes
//     }],
//     // Terms of service url.
//     // tosUrl: “ < your - tos - url > ”
// };

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
// The start method will wait until the DOM is loaded.
ui.start("#firebaseui-auth-container", uiConfig);

// This function will trigger when there is a login event
firebase.auth().onAuthStateChanged(function(user) {
    console.log(user)
        // Make sure there is a valid user object
    if (user) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://apis.google.com/js/api.js";


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