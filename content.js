var gradeNumerator = 0;
var gradeDenominator = 0;
var ownerGrades = {};
var gradePattern = /\d{1,3}(.\d{1,2})?\/\d{1,3}(.\d{1,2})?/
var ownerPattern = /"metadata">(\w+ \w+( \w+)*)/
window.onload = run();

function updateGraderData(owner, num, denum) {
  // Updates grader data for error checking
  if (owner in ownerGrades){
    ownerGrades[owner][0] += num;
    ownerGrades[owner][1] += denum;
  } else {
    ownerGrades[owner] = [num, denum];
  }
}

function getGraderData() {
  return "Total calculated: " +
         gradeNumerator + "/" + gradeDenominator + "\n" +
         JSON.stringify(ownerGrades, null, 2);
}

function run() {
  var comments = document.getElementsByClassName("annotation")
  if (comments === undefined) {
    return;
  }
  for (var i = 0; i < comments.length; i++) {
    var innerhtml = comments[i].innerHTML;
    var gradeRatio = innerhtml.match(gradePattern);
    if (gradeRatio === null) {
      continue;
    }
    var owners = innerhtml.match(ownerPattern);
    var gradeSplit = gradeRatio[0].split("/");
    gradeNumerator += parseFloat(gradeSplit[0]);
    gradeDenominator += parseFloat(gradeSplit[1]);
    updateGraderData(owners[1], parseFloat(gradeSplit[0]), parseFloat(gradeSplit[1]));
  }
  var header = document.getElementsByClassName('header')[0];
  var span = header.getElementsByTagName("span")[0];
  // Display totals
  span.innerHTML += " (" + gradeNumerator + "/" + gradeDenominator + ")";
  // Display details on click
  span.addEventListener("click", function() {
    alert(getGraderData());
  });
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if("displayGraderData" in request) {
      sendResponse(getGraderData());
    }
  });
}
