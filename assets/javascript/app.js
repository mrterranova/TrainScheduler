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
var nextTrainTime = 0;
var frequency = 0;
var name = "";
var destination="";
var frequency = 0;

//create a variable for moment()
var time = moment().format('HH:mm');
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
    name = $("#userName").val().trim();
    destination = $("#userDestination").val().trim();
    firstTrainTime = moment($("#userArrival").val().trim(), "HH:mm").subtract(10, "years").format("X");
    frequency = $("#userFrequency").val().trim();
    //create a new variable for time
    nextTrainTime;

    console.log(firstTrainTime);
    
    //if user leaves all fields blank then close application. 
    if (name === "" || destination === "" || firstTrainTime === "" || frequency === "") {
        alert("Information invalid. You're train can not be scheduled at this time.");

    }
    else {
        //consistency with page to uppercase
        name = name.toUpperCase();
        destination = destination.toUpperCase();
        frequency = frequency.toUpperCase();
        
        console.log(name);



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
            trainArrival: firstTrainTime,
            trainFrequency: frequency,
        });

        
        
        //clear value for new users
        $("#userName").val("");
        $("#userDestination").val("");
        $("#userArrival").val("");
        $("#userFrequency").val("");
        
        return false;
        console.log(name)
    }
});

database.ref().on("child_added", function(snapshot){
    var name = snapshot.val().trainName;
    var destination = snapshot.val().trainDestination;
    var frequency = snapshot.val().trainFrequency;
    var trainTime = snapshot.val().trainArrival;

    console.log("train",trainTime);

    var remainder = moment().diff(moment().unix(trainTime), "minutes") % frequency;
    var minutes = frequency - remainder;
    var arrival = moment().add(minutes, "m").format("HH:mm");
    
    if (minutes ===1){
        alert("Final Boarding Call for "+ name);
    }
    //append following information to new row in table
    newDiv = $("tbody").append("<tr>");
    newDiv.append("<td id='name'>" + name + "</td>");
    newDiv.append("<td id='destination'>" + destination + "</td>");
    newDiv.append("<td id='frequency'>" + frequency + "</td>");
    newDiv.append("<td id='arrival'>" + arrival + "</td>");
    newDiv.append("<td id='minutes'>"+ minutes + "</td>");

})


currentTime();

setInterval(function() {
  window.location.reload();
}, 60000);


//opt out of completing application, information will not be saved
$("#btnClose").on("click", function () {
    $("#userName").val("");
    $("#userDestination").val("");
    $("#userArrival").val("");
    $("#userFrequency").val("");
    $(".application").hide();
});