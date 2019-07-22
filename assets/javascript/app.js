//firebase configuration to TrainScheduler 
const firebaseConfig = {
    apiKey: "AIzaSyCM7bG3_xRnaB8MOVIiFwvzxVcMHiVc9a4",
    authDomain: "trainscheduler-2f5f9.firebaseapp.com",
    databaseURL: "https://trainscheduler-2f5f9.firebaseio.com",
    projectId: "trainscheduler-2f5f9",
    storageBucket: "",
    messagingSenderId: "238738233986",
    appId: "1:238738233986:web:8fe4372a17018011"
};

//initiallizing firebase
firebase.initializeApp(firebaseConfig);
//variable for firebase.database()
var database = firebase.database();

//global variables - keep updating
var nextTrainTime;
var frequency = 0;
var timeChange = [];

//create a variable for moment()
var time = moment().format('HH:mm:ss');
$(".application").hide();
$(".currentTime").text(time);

//if click on train image thaen show application
$("#train").on("click", function () {
    $(".application").show();
});

function currentTime() {
    var current = moment().format('LT');
    $("#currentTime").html(current);
    setTimeout(currentTime, 1000);
};




//when click submit button hide application
$("#submitBtn").on("click", function () {
    $(".application").hide();


    //collect input values by the user for following
    var name = $("#userName").val().trim();
    var destination = $("#userDestination").val().trim();
    var firstTrainTime = moment($("#userArrival").val().trim(), "HH:mm").subtract(10, "years").format("X");
    frequency = $("#userFrequency").val().trim();
    //create a new variable for time
    var nextTrainTime;

    console.log(firstTrainTime);
    
    //if user leaves all fields blank then close application. 
    if (name === "" || destination === "" || firstTrainTime === "" || frequency === "") {
        alert("Information invalid. Please re-enter results.");

    }
    else {
        //consistency with page to uppercase
        name = name.toUpperCase();
        destination = destination.toUpperCase();
        frequency = frequency.toUpperCase();
        
        
        //now find first train appearance from user input, make sure that it is after current time.
        var formatTime = moment().min(moment(firstTrainTime, "HH:mm"));
        console.log(formatTime.format("HH:mm"));
        if (firstTrainTime < moment("HH:mm") || firstTrainTime === moment("HH:mm")) {
            firstTrainTime = firstTrainTime + frequency;
            firstTrainTime = nextTrainTime;
        }
        
        //push information to the database
        database.ref().push({
            trainName: name,
            trainDestination: destination,
            trainArrival: arrival,
            trainFrequency: frequency,
        });
        
        //clear value for new users
        $("#userName").val("");
        $("#userDestination").val("");
        $("#userArrival").val("");
        $("#userFrequency").val("");

        return false;
    }
});

database.ref().on("child_added", function(snapshot){
    var name = snapshot.val().name;
    var destination = snapshot.val().destination;
    var frequency = snapshot.val().frequency;
    var firstTrainTime = snapshot.val().firstTrainTime;

    var remainder = moment().diff(moment.unix(firstTrainTime), "minutes")%frequency;
    var minutes = frequency - remainder;
    var arrival = moment().add(minutes, "m").format("hh:mm A");

    //append following information to new row in table
    newDiv = $("tbody").append("<tr>");
    newDiv.append("<td id='name'>" + name + "</td>");
    newDiv.append("<td id='destination'>" + destination + "</td>");
    newDiv.append("<td id='arrival'>" + arrival + "</td>");
    newDiv.append("<td id='frequency'>" + frequency + "</td>");
})




//opt out of completing application, information will not be saved
$("#btnClose").on("click", function () {
    $("#userName").val("");
    $("#userDestination").val("");
    $("#userArrival").val("");
    $("#userFrequency").val("");
    $(".application").hide();
});