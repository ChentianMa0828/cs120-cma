var oLRC = {
  ms: [
    { t: "6.0", c: "Come gather round, children" },
    { t: "8.0", c: "It's high time ye learned" },
    { t: "11.0", c: "Bout a hero named Homer" },
    { t: "13.0", c: "And a devil named Burns" },

    { t: "17.0", c: "We'll march 'till we drop" },
    { t: "19.0", c: "The girls and the fellas" },
    { t: "21.0", c: "We'll fight 'till the death" },
    { t: "23.0", c: "Or else fold like umbrellas" },


    { t: "38.0", c: "So we'll march day and night" },
    { t: "40.5", c: "By the big cooling tower" },
    { t: "43.0", c: "They have the plant" },
    { t: "45.0", c: "But we have the power" },

    { t: "53.0", c: "Now do 'Classical Gas!'" },
    { t: "73.0", c: "So we'll march day and night" },
    { t: "75.0", c: "By the big cooling tower" },
    { t: "77.0", c: "They have the plant" },
    { t: "79.5", c: "But we have the power" },

    { t: "82.0", c: "So we'll march day and night" },
    { t: "84.0", c: "By the big cooling tower" },
    { t: "87.0", c: "They have the plant" },
    { t: "89.0", c: "But we have the power" },

  ],
}
// Complete this section and create a CSS file named style.css
var lineNo = 0; //The current line
var C_pos = 6
var offset = -20 //Roll distance (should be equal to row height)
var audio = document.getElementById("butwehavethepower");//player
var ul = document.getElementById("lyric"); //Lyric container list

//Highlight the current line of the lyrics and text scroll control. The line number is lineNo
function lineHigh() {
  var lis = ul.getElementsByTagName("li");//The lyrics array
  if (lineNo > 0) {
    lis[lineNo - 1].removeAttribute("class");//Remove the highlight from the previous line
  }
  lis[lineNo].className = "lineHigh";//Highlight the current row

  //Text scrolling
  if (lineNo > C_pos) {
    ul.style.transform = "translateY(" + (lineNo - C_pos) * offset + "px)"; //Scroll up one row as a whole
  }
}

//Roll back to the beginning for the end of the play
function goBack() {
  document.querySelector("#lyric .lineHigh").removeAttribute("class");
  ul.style.transform = "translateY(0)";
  lineNo = 0;
}

//Listen to the timeupdate event of the player to realize the synchronization of text and audio playback
audio.ontimeupdate = function () {
  if (lineNo == oLRC.ms.length)
    return;
  var curTime = audio.currentTime; //Player time
  if (parseFloat(oLRC.ms[lineNo].t) <= curTime) {
    lineHigh();//Highlight the current line
    lineNo++;
  }
};

//Listen for a ended event in the player to roll back lyrics when play ends
audio.onended = function () {
  goBack(); //Roll back the words
};