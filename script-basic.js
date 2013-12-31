// JavaScript Document
var changeColor;

var delay = 2000;
var running = false;

var audio = new mp3Audio("cymbal.mp3", false, "audio");

// In case Canvas is not supported. WIP
//var useCanvas = true;
//var bursts = Array("6df62a.gif", "6e346c.gif", "39ac98.gif", "72b45e.gif", "5951c4.gif", "a4a328.gif", "d02c2c.gif", "f09a29.gif");

$(document).ready(function(){

var $cover = $("#cover"), // The white div element that shows at the beginning and end of the presentation
$intro = $(".intro"), // The text on top of the "cover" div at the beginning of the presentation 
$boundingBox = $("#boundingBox"), // The div element that holds the drawing board, the creature image, and the poetry
drawingBoard = document.getElementById("drawingBoard"), // The canvas element where the zig-zag bubble is drawn around the creature
context = drawingBoard.getContext("2d"), // The variable needed to initiate an HTML canvas
$toggleSound = $("#toggleSound"), // The button that allows the user to turn the sound on or off
initialize = false, // Used for determining whether or not the cymbal loop has started yet
i=0; // A global variable for keeping track of 


// This function toggles the sound
$toggleSound.click(function(){
	audio.toggleMute();
	document.getElementById("audio").innerHTML = "";
})

// This draws the zig-zag bubble on the HTML canvas
context.beginPath();
context.moveTo(480, 425);
context.lineTo(80, 425);
context.lineTo(285, 382);
context.lineTo(110, 240);
context.lineTo(331, 340);
context.lineTo(240, 130);
context.lineTo(350, 250);
context.lineTo(310, 80);
context.lineTo(390, 220);
context.lineTo(355, 43);
context.lineTo(420, 120);
context.lineTo(500, 50);
context.lineTo(535, 210);
context.lineTo(860, 80);
context.lineTo(580, 267);
context.lineTo(870, 210);
context.lineTo(600, 365);
context.lineTo(867, 425);
context.lineTo(450, 425);
context.lineWidth = 13;
var initialColor = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6)
context.fillStyle = initialColor;
context.fill();	
context.stroke();

// Preloads the text of our noise poem
function preloadText() {
	$.ajax({
		type: "GET",
		url: "http://www.muzzine.com/libraryContent/noise/text.xml",
		dataType: "xml"
	})
}

preloadText();

// A function for changing the color of the zig-zag bubble
changeColor = function() {
  
	//if(useCanvas)
	//{
		var randomColor = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6)
		context.fillStyle = randomColor;
		context.fill();	
	//}
	//else
	//{
	//	var selection = (Math.random()*bursts.length) - 1;
	//	document.getElementById("burst").src = "bursts/"+bursts[selection];;
	//}
}

// This function loops the sound
loopSound = function() {
	cymbal();
	setTimeout("cymbal();", delay/2);
	setTimeout("loopSound();", delay);
}

$intro.click(function(){ // Starts the whole process
	$intro.fadeOut(2000, function(){
		$(this).remove();
		$toggleSound.css("display", "block");
		$cover.css("display", "none");
		
		// Ensure it can't be triggered twice
		if(running == false)
		{
		    running = true;
		    loopSound();
		}
	})
})

$boundingBox.click(function(){ // Retrieves our noise poem and updates the text on each click
	if(i < 30) {
		i++;
		$.ajax({
			type: "GET",
			url: "http://www.muzzine.com/libraryContent/noise/text.xml",
			dataType: "xml",
			success: function(xml) {
				document.getElementById("poetry").innerHTML = $(xml).find("text"+i).text();	
			}
		})
	}
	else { 
		$cover.fadeIn(500, function(){ // Initiates the end of the presentation
			i=0;
			$.ajax({
				type: "GET",
				url: "http://www.muzzine.com/libraryContent/noise/text.xml",
				dataType: "xml",
				success: function(xml) {
					document.getElementById("poetry").innerHTML = $(xml).find("text"+i).text();	
					$cover.append("<p class='paragraph'>"+$(xml).find("text31").text()+"</p>");
					$cover.append("<p class='paragraph'>"+$(xml).find("text32").text()+"</p>");
					$cover.append("<p id='initiate'>play again</p>");
					restart();
				}
			})
		})
	}
})

function restart() { // Restarts the presentation
	$("#initiate").click(function(){
		$cover.fadeOut(2000).empty();
	})	
}

})


// Non-HTML5 audio playback, using Quicktime, Realplayer, and Windows Media Player plugins and MP3 audio
function cymbal()
{  
  audio.play();
  changeColor();
}