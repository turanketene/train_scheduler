var firebaseConfig = {
    apiKey: "AIzaSyCdnO9-no_RT-o8DGBwxc32CEW2V1ExmEc",
    authDomain: "trainscheduler-d593e.firebaseapp.com",
    databaseURL: "https://trainscheduler-d593e.firebaseio.com",
    projectId: "trainscheduler-d593e",
    storageBucket: "",
    messagingSenderId: "697540447507",
    appId: "1:697540447507:web:146dd91a010fb4758f9ee6"
  };
// Initialize Firebase
  firebase.initializeApp(firebaseConfig);
// Variable to reference database 
  var database = firebase.database();
// Initial variables
  var trainName = "";
  var destination = "";
  var firstTrain = "";
  var frequency = 0;
// Setting up onclick
$("#submit").on("click", function(event){
    // Dont refresh the page
    event.preventDefault();

    trainName = $("#train-name").val().trim();
    destination = $("#train-destination").val().trim();
    firstTrain = $("#train-time").val().trim();
    frequency = $("#time-freq").val().trim();

    $(".form-control").val("");

    database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    })
});

database.ref().on("child_added", function(childSnapshot) {
    var startTimeConverted = moment(childSnapshot.val().firstTrain, "hh:mm").subtract(1, "years");
    var timeDiff = moment().diff(moment(startTimeConverted), "minutes");
    var timeRemain = timeDiff % childSnapshot.val().frequency;
    var minToArrival = childSnapshot.val().frequency - timeRemain;
    var nextTrain = moment().add(minToArrival, "minutes");
  
    var newrow = $("<tr>");
    newrow.append($("<td>" + childSnapshot.val().trainName + "</td>"));
    newrow.append($("<td>" + childSnapshot.val().destination + "</td>"));
    newrow.append($("<td class='text-center'>" + childSnapshot.val().frequency + "</td>"));
    newrow.append($("<td class='text-center'>" + moment(nextTrain).format("LT") + "</td>"));
    newrow.append($("<td class='text-center'>" + minToArrival + "</td>"));

    $("#train-table-rows").append(newrow);

});