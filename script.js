
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCY0U9wyL5ITaJYfI28uRPSVcnacqGAshc",
    authDomain: "time-table-train.firebaseapp.com",
    databaseURL: "https://time-table-train.firebaseio.com",
    projectId: "time-table-train",
    storageBucket: "time-table-train.appspot.com",
    messagingSenderId: "398053131203"
  };
  firebase.initializeApp(config);

  var trainData = firebase.database();

  // Providing initial data to Firebase database.
  $("#add-train").on("click", function(event){
      event.preventDefault();
      // Grab user input information
      var trainName = $("#train-name").val().trim();
      var trainDest = $("#train-dest").val().trim();
      var firstTrainTime = $("#first-train-time").val().trim();
      var frequency = $("#frequency").val().trim();
      console.log(trainName + " " + trainDest + " " + firstTrainTime + " " + frequency);

    // Creating local object to store train data
    var trnData = {
      trnNm: trainName,
      trnDst: trainDest,
      frsTrnTm: firstTrainTime,
      freq: frequency
    };
   //console.log(trnData);

   trainData.ref().push(trnData);

    // Alert
  alert("Train successfully added");
  });

    //  Creating Firebase event for adding new train to the database and a row in the html when a user adds an entry
    trainData.ref().on("child_added", function(childSnapshot, prevChildKey) {
    console.log(childSnapshot.val());

    var trainName = childSnapshot.val().trnNm;
    var trainDest = childSnapshot.val().trnDst;
    var firstTrainTime = childSnapshot.val().frsTrnTm;
    var frequency = childSnapshot.val().freq;

    console.log(trainName);
    console.log(trainDest);
    console.log(firstTrainTime);
    console.log(frequency);
    
    var timeArr = firstTrainTime.split(":");
    var trainTime = moment().hours(timeArr[0]).minutes(timeArr[1]);
    var maxMoment = moment.max(moment(), trainTime);
    var tMinutes;
    var tArrival;
   
    // If the first train is later than the current time, sent arrival to the first train time
    if (maxMoment === trainTime) {
      tArrival = trainTime.format("hh:mm A");
      tMinutes = trainTime.diff(moment(), "minutes");
    } else {
   
      // Calculating the minutes until arrival using hardcore math
      // To calculate the minutes till arrival, take the current time in unix subtract the FirstTrain time
      // and find the modulus between the difference and the frequency.
      var differenceTimes = moment().diff(trainTime, "minutes");
      var tRemainder = differenceTimes % frequency;
      tMinutes = frequency - tRemainder;
      // To calculate the arrival time, add the tMinutes to the current time
      tArrival = moment().add(tMinutes, "m").format("hh:mm A");
    }
    console.log("tMinutes:", tMinutes);
    console.log("tArrival:", tArrival);
    console.log(moment());

    $("tbody").append("<tr><td>" + trainName + "</td><td>" + trainDest + "</td><td>" +
    firstTrainTime + "</td><td>" + frequency + "</td> <td>" + tMinutes + "</td></tr>");
    });
      
    // To handle the errors
    function errorObject () {
      console.log("Errors handled: " + errorObject.code);
    }