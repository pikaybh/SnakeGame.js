// Import the functions you need from the SDKs you need
// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";  // 9.0
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-analytics.js";  // 9.0
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCn98Yl2ziys3etfIHRwYD7eFDfA-S49cI",
    authDomain: "snake-game-6df1b.firebaseapp.com",
    projectId: "snake-game-6df1b",
    storageBucket: "snake-game-6df1b.appspot.com",
    messagingSenderId: "326688580859",
    appId: "1:326688580859:web:11477310bc9723dd32fc5e",
    measurementId: "G-CHYDDTZJGN"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const db = firebase.firestore();
const score = db.collection('score');

/*
var score = db.collection('score').data('score');
score.get().then((res) => {
    res.forEach((doc) => {
        console.log(doc.data());
    })
})
*/

// Sign-In
$('#register').click(function () {

    var email = $('#email-new').val();
    var pw = $('#pw-new').val();

    firebase.auth().createUserWithEmailAndPassword(email, pw).then((result) => {
        console.log(result.user)
    }).catch((err) => { console.log(err.message) });
})

// 로그인
function login(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            // ...
        })
        .catch((error) => {
            var err_msg = "[" + error.code + "] error: " + error.message;
            console.log(err_msg);
            // alert(err_msg);
        });
};