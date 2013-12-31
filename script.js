// JavaScript Document

	function removeLoadingIcon() {
		$("#loadingIcon").fadeOut(2000, function(){
			$("#initiate").fadeIn(2000);										 
		});	
	}

	$(window).bind("load", function() {
   		removeLoadingIcon();
	});

var $boundingBox = $("#boundingBox"),
	$featured = $("#featured"),
	$fade = $("#fade"),
	$button = $("#button"),
	fullscreen = document.getElementById("fullscreen"),
	buttonDisplay = true,
	slideTrigger = false,
	fadeTrigger = false,
	increaseInitialize = Math.PI / 5,
	increase = Math.PI / 10000,
	wordVar = 0,
	angle = 0,
	animateStop = false,
	stormSongComplete = false,
	storiesComplete = [false, false, false],
	q = 110, // variable for keeping track of "rotate" words in the Storm Song section
	a = 0, // variable for keeping track of audio loops
	i = 0, // variable for keeping track of slides
	m = 0, // variable for keeping track of methods
	p = 0, // variable for keepint track of images
	t = 0, // variable for keeping track of text
	y = 0, // variable for keeping track of slide order
	j = 0, // variable for keeping track of miscellaneous functions
	e = 0, // variable for keeping track of ending
	l = 0; // variable for keeping track of lightning

	(function($, name) {
	/* jQuery typewriter plugin
		2012-11-15
		https://github.com/bergus */
		$[name+"Defaults"] = {
			framerate: 1000/60,
			group: /.{0,2}/g // 2: Number of chars per frame
		};
		$.fn[name] = function(options, callback) {
			if (typeof options != 'object') callback=options, options={};
			
			return this.each(function() {
				var el = $(this),
					conf = $.extend({}, $[name+"Defaults"], options);
				el.queue("fx", function(next) {
					animateNode(this, conf, typeof callback == 'function'
					  ? function() { callback.call(el[0]); next(); }
					  : next
					);
					el.show();
				});
			});
		};
		function chunk(text, conf) {
			// splitting the text into parts (http://stackoverflow.com/a/11657799/1048572)
			return text.match(conf.group);
		}
		function timeout(callback, conf) {
			// set up the timeout
			// want to randomize? Have a look at http://jsfiddle.net/pZb8W/2/ for possible implementation
			setTimeout(callback, conf.framerate);
		}
		function animateNode(element, conf, callback) {
			var pieces = [];
			if (element.nodeType==1 && element.hasChildNodes()) {
				while (element.hasChildNodes())
					pieces.push(element.removeChild(element.firstChild));
				(function childStep() {
					if (pieces.length) {
						var piece = pieces.shift();
						animateNode(piece, conf, childStep);
						element.appendChild(piece);
					} else
						callback();
				})();
			} else if (element.nodeType==3) {
				pieces = chunk(element.data, conf);
				element.data = "";
				(function addText(){
					element.data += pieces.shift();
					timeout(pieces.length ? addText : callback, conf);
				})();
			} else // empty or special (comment etc) node
				timeout(callback, conf);
		}
		
	})(jQuery, "typewriter");
	
	function animateWordsInitiate() {
		if(q < 119) {
			$("#"+q).addClass("clickable").animate({
				color: "#996600"}, 200, function(){
					q++;
					animateWordsInitiate();
				}
			)
		}
		else {
			$("#"+q).addClass("clickable").animate({
				color: "#996600"}, 200, function(){
					animateWords();
					animateWordsClick();
					q = 110;
				}
			)
		}
	}

	function animateWords() {
		if(!animateStop) {
			$(".rotate").each(function() {
				var text = this;
				var xCircle = 36 * Math.cos(angle + wordVar) + 43.5;
				var yCircle = 43 * Math.sin(angle + wordVar) + 45;
				$(this).css({
					"left": xCircle + "%",
					"top": yCircle + "%",
					"z-index": "1"
				})
				wordVar += ((2 * Math.PI) / 10);
				angle += increase;
			})
			angle += .01;	
			setTimeout(function(){
					animateWords();
			}, 60);
		}
	}
	
	function animateWordsClick() {
		$(".rotate").click(function(){
			if (i === 65 || i === 64) {
				i = 61;
				showSlide(i,y);
				i++;
			}
			else {
				showSlide(i,y);
				i++
			}
		})	
	}
	
	function createWordLoop() {
		if(q < 120) {
			createWord(true);
			q++;
			createWordLoop();
		}
		else {
			q = 110;	
		}
	}
	
	function createWord(loop) {
		$boundingBox.append("<p id="+q+"></p>");
		var $textProps = $("#"+q);
		$textProps.addClass("rotate");
		var xpos = 36 * Math.cos(angle) + 43.5;
		var ypos = 43 * Math.sin(angle) + 45;
		$textProps.css({
			fontSize: "1.1em",
			display: "none",
			left: xpos + "%",
			top: ypos + "%",
			opacity: Math.floor((Math.random() * 6) + 5)
		});
		var xml = retrieveXML("text");
		var xsl = retrieveXML("xsl_template");
		if (window.ActiveXObject) {
			var resultDocument = xml.transformNode(xsl);
			var textNode = resultDocument.childNodes[q];
		}
		else {
			var xsltProcessor=new XSLTProcessor();
			xsltProcessor.importStylesheet(xsl);
			var resultDocument = xsltProcessor.transformToFragment(xml,document);
			var textNode = resultDocument.childNodes[q];
		}
		document.getElementById(q).appendChild(textNode);
		$textProps.fadeIn(3000).css("display", "inline");
		angle += increaseInitialize;
		if(!loop) {
			q++;
			if(q >= 120) {
				q = 110;	
			}
		}
	}
	
	function animatePoem() {
		$(".poem").animate({
			color: "#996600"
			}, 2000, function(){
				$(this).click(function(){
					if (document.getElementById("text50x0")) {
						$("#text50x0").fadeOut(1000, function(){
							$(this).remove();
						})
					};
					var imgCurrentOpacity = document.getElementById("img60x0").style.opacity;
					var imgNewOpacity = (Number(imgCurrentOpacity) + .1);
					$("#img60x0").animate({
						opacity: imgNewOpacity
					}, 2000);
					showSlide(i,y);
					i++
				})
		})
	}

	function lightning(target, callback) {
		var callback = callback;
		l++;
		if(l < 50) {
			$("#"+target).animate({opacity: Math.random()},
				((Math.random() * 25) + 1), function(){
					lightning(target, callback);
				})
		}
		else {
			l=0;
			$("#"+target).css("opacity", 0);
			if(callback === "callback") {
				retrieveSlide(141);
				for(g=0; g<slideDatabase["slide141"].textArray.length; g++) {
					placeText(slideDatabase["slide141"].textArray[g]);
				}
				buttonDisplay = true;
				$button.css("display", "block");
			}
		}
	}

// Fades in the "fade" div, empties the bounding box, then fades the "fade" div back out
	function clearStage (fade, callback, contentId, total) {
		if(contentId) {
			for(k=0; k<=total;k++) {
				var number = k;
				$("#"+contentId+String(number)).fadeOut(fade, function(){
					$(this).remove();
					if(number === total && fadeTrigger === false) {
						fadeTrigger = true;
						callback();	
					}
				})
			}
		}
		else {
			$fade.fadeIn(fade, function() {
			$boundingBox.empty();
			$fade.css("display", "none");
				if(callback) {
						callback();	
				}
			})
		}
	}
	
	// Fades audio out, then sets that audio back to full volume so the next track can be played
	function fadeAudioOut(audio, callback) {
		var audio = document.getElementById(audio);
		var vol = 1;
		var interval = 20;
		if(!(audio.paused)) {	
			var fadeOut = setInterval(function(){
				if(audio.volume > 0){
					vol -= .01;
					audio.volume = vol;
						if(vol < .01){
							vol = 0;
							audio.volume = vol;
							audio.pause();
							audio.currentTime = 0;
						}
				}
			
				else {
					clearInterval(fadeOut);
					audio.volume = 1;
					if(callback) {
						callback();
					}
				}
			}, interval)
		}
	}
	
	function fadeAudioIn(audio, callback) {
		var audio = audio;
		var vol = 0;
		var interval = 20;
		var fadeIn = setInterval(function(){
			if(audio.volume < 1){
				vol += .01;
				audio.volume = vol;
					if(vol > .99) {
						vol = 1;
						audio.volume = vol;
					}
			}
			
			else {
				clearInterval(fadeIn);
				if(callback) {
					callback();	
				}
			}
		
		}, interval)
	}
	
	function replaceAudio(target, newAudio) {
		document.getElementById(target+"Mp3").setAttribute("src", newAudio+'.mp3');
		document.getElementById(target+"Ogg").setAttribute("src", newAudio+'.ogg');
		var audio = document.getElementById(target);
		audio.load();
		audio.volume = 1;
		audio.play();
	}
	
	// Launches the click functions for the initial screen after the credits
	function launchMenu() {
		flashImg("img12x", 2);
		$(".dark").hover(
			function(){
				$(this).css("opacity", "1")
			},
			function(){
				$(this).css("opacity", ".5");
			}
		)
		$("#img12x0").click(function(){
			i=30;
			showSlide(i, y);
			i++;
		})
		$("#img12x1").click(function(){
			i=80;
			showSlide(i, y);
			i++;
		})
		$("#img12x2").click(function(){
			i=100;
			showSlide(i, y);
			i++;
		})
	}
	
	function flashImg(target, amount) {
		if(j <= amount) {
			$("#"+target+j).animate({
				opacity: 1
			}, 300).animate({
				opacity: .5
			}, 300, function(){
				j++;
				flashImg(target, amount);
			})
		}
		else {
			j=0;	
		}
	}
	
	function portalToStormSong() {
		$("#portal2").fadeOut(1500, function(){
				$(this).html("friend is in Manhattan.").css("color", "#996600");						 
				$(this).click(function(){
					storiesComplete[0] = true;
					fadeAudioOut("car");
					document.getElementById("rain").play();
					if(stormSongComplete) {
						animateStop = false;
						i=64;
						showSlide(i, y);
						i++;
					}
					else {
						animateStop = false;
						i=50;
						showSlide(i, y);
						i++;
					}
				})
		}).fadeIn(1000);
	}
	
	function portalToStormSong2() {
		$("#textContent2").fadeOut(1500, function(){
			$(this).html("storm like it is a part of me;").fadeIn(1000);
		})
		$("#portal1").animate({
			color: "#996600"				  
		}, 2000, function(){
			$(this).click(function(){
				storiesComplete[1] = true;
				if(stormSongComplete) {
					animateStop = false;
					i=64;
					showSlide(i, y);
					i++;
				}
				else {
					animateStop = false;
					i=50;
					showSlide(i, y);
					i++;
				}
			})
		})
	}
	
	function portalToStormSong3() {
		$("#portal2").animate({
			color: "#996600"				  
		}, 2000, function(){
			$(this).click(function(){
				storiesComplete[2] = true;
				if(stormSongComplete) {
					animateStop = false;
					i=64;
					showSlide(i, y);
					i++;
				}
				else {
					i=50;
					showSlide(i, y);
					i++;
				}
			})
		})
	}
	
	function launchStormLinks() {
		if(!(document.getElementById("imgStormLink0"))) {
			for(g=0; g<=2; g++) {
				retrieveSlide(65);
				placeImg(slideDatabase["slide65"].imgArray[g]);
			}
			$("#imgStormLink0").click(function(){
				i=30;
				showSlide(i, y);
				i++;
				animateStop = true;
				fadeAudioOut("love_this_storm");
				fadeAudioOut("rain");
				document.getElementById("car").play();
			});
			$("#imgStormLink1").click(function(){
				i=100;
				showSlide(i, y);
				i++;
				animateStop = true;
			})
			$("#imgStormLink2").click(function(){
				i=80;
				showSlide(i, y);
				i++;
				animateStop = true;
			})
		}
	}
	
	function createFashionLink() {
		$("#portal2").html("<a id='portal' href='http://fashionblog.muzzine.com' target='_blank'>publish </a>")
	}
	
	function portalToStormSisters() {
		if(storiesComplete[0] && storiesComplete[1] && storiesComplete[2]) {
			$("#img60x0").fadeOut(1500, function() {
				$(this).remove();
				retrieveSlide(66);
				placeImg(slideDatabase["slide66"].imgArray[0], function(){
					flashImg("imgStormSistersLink", 0);
					$("#imgStormSistersLink0").hover(
						function(){
							$(this).css("opacity", "1");
						},
						function(){
							$(this).css("opacity", ".5");
						}
					).click(function(){
						i=130;
						showSlide(i, y);
						i++;
						animateStop = true;
					})
				});
			})	
		}
	}
	
	function createFeedback() {
		$("#portal1").html("<a id='feedback' href='http://www.muzzine.com/contact-us' target='_blank'>Submit some feedback</a>");
		$("#feedback").animate({
			color: "#996600"
		}, 2000)
	}
	
	function creditsMusic() {
		var audio = document.getElementById("background");
		if(audio.paused) {
			 replaceAudio("background", "love_this_storm");
		}
	}

// Object constructor to store all information presented on the slide
	function slide(fade, imgArray, textArray, methodArray, slideOrder) {
		this.fade = fade;
		this.imgArray = imgArray;
		this.textArray = textArray;
		this.methodArray = methodArray;
		this.slideOrder = slideOrder;
	}
	
	// Object constructor to store images and their properties
	function img(layer, id, cssClass, src, left, top, display, z, opacity, fade, width) {
		this.layer = layer;
		this.id = id;
		this.cssClass = cssClass;
		this.src = src;
		this.left = left;
		this.top = top;
		this.display = display;
		this.z = z;
		this.opacity = opacity;
		this.fade = fade;
		this.width = width;
	}
	
	// Object constructor to store text elements and their properties
	function text(layer, id, cssClass, location, typewriter, fontSize, left, top, display, opacity, fadeIn) {
		this.layer = layer;
		this.id = id;
		this.cssClass = cssClass;
		this.location = location;
		this.typewriter = typewriter;
		this.fontSize = fontSize;
		this.left = left;
		this.top = top;
		this.display = display;
		this.opacity = opacity;
		this.fadeIn = fadeIn;
	}
	
	// **All of the slides and their information**
	
	// For the introduction
	var slide0 = new slide();
	var slide1 = new slide();
	var slide2 = new slide();
	var slide3 = new slide();
	var slide4 = new slide();
	var slide5 = new slide();
	var slide6 = new slide();
	var slide7 = new slide();
	var slide8 = new slide();
	var slide9 = new slide();
	var slide10 = new slide();
	var slide11 = new slide();

	// Slides for 'Before the Hurricane'
	var slide30 = new slide();
	var slide31 = new slide();
	var slide32 = new slide();
	var slide33 = new slide();
	var slide34 = new slide();
	var slide35 = new slide();
	var slide36 = new slide();
	var slide37 = new slide();
	
	// Slides for the 'Storm Song Interlude'
	var slide50 = new slide();
	var slide51 = new slide();
	var slide52 = new slide();
	var slide53 = new slide();
	var slide54 = new slide();
	var slide55 = new slide();
	var slide56 = new slide();
	var slide57 = new slide();
	var slide58 = new slide();
	var slide59 = new slide();
	var slide60 = new slide();
	var slide61 = new slide();
	var slide62 = new slide();
	var slide63 = new slide();
	var slide64 = new slide();
	var slide65 = new slide();
	var slide66 = new slide();
	
	// Slides for 'Love This Storm'
	var slide80 = new slide();
	var slide81 = new slide();
	var slide82 = new slide();
	var slide83 = new slide();
	var slide84 = new slide();
	var slide85 = new slide();
	var slide86 = new slide();
	var slide87 = new slide();
	var slide88 = new slide();
	
	// Slides for 'What Not to Wear'
	var slide100 = new slide();
	var slide101 = new slide();
	var slide102 = new slide();
	var slide103 = new slide();
	var slide104 = new slide();
	var slide105 = new slide();
	var slide106 = new slide();
	var slide107 = new slide();
	var slide108 = new slide();
	var slide109 = new slide();
	var slide110 = new slide();
	var slide111 = new slide();
	var slide112 = new slide();
	var slide113 = new slide();
	var slide114 = new slide();
	var slide115 = new slide();
	var slide116 = new slide();
	var slide117 = new slide();
	var slide118 = new slide();
	var slide119 = new slide();
	var slide120 = new slide();
	
	// Slides for 'Storm Sisters'
	var slide130 = new slide();
	var slide131 = new slide();
	var slide132 = new slide();
	var slide133 = new slide();
	var slide134 = new slide();
	var slide135 = new slide();
	var slide136 = new slide();
	var slide137 = new slide();
	var slide138 = new slide();
	var slide139 = new slide();
	var slide140 = new slide();
	var slide141 = new slide();
	
	var slideDatabase = new Object();
	slideDatabase["slide0"] = slide0;
	slideDatabase["slide1"] = slide1;
	slideDatabase["slide2"] = slide2;
	slideDatabase["slide3"] = slide3;
	slideDatabase["slide4"] = slide4;
	slideDatabase["slide5"] = slide5;
	slideDatabase["slide6"] = slide6;
	slideDatabase["slide7"] = slide7;
	slideDatabase["slide8"] = slide8;
	slideDatabase["slide9"] = slide9;
	slideDatabase["slide10"] = slide10;
	slideDatabase["slide11"] = slide11;
	slideDatabase["slide30"] = slide30;
	slideDatabase["slide31"] = slide31;
	slideDatabase["slide32"] = slide32;
	slideDatabase["slide33"] = slide33;
	slideDatabase["slide34"] = slide34;
	slideDatabase["slide35"] = slide35;
	slideDatabase["slide36"] = slide36;
	slideDatabase["slide37"] = slide37;
	slideDatabase["slide50"] = slide50;
	slideDatabase["slide51"] = slide51;
	slideDatabase["slide52"] = slide52;
	slideDatabase["slide53"] = slide53;
	slideDatabase["slide54"] = slide54;
	slideDatabase["slide55"] = slide55;
	slideDatabase["slide56"] = slide56;
	slideDatabase["slide57"] = slide57;
	slideDatabase["slide58"] = slide58;
	slideDatabase["slide59"] = slide59;
	slideDatabase["slide60"] = slide60;
	slideDatabase["slide61"] = slide61;
	slideDatabase["slide62"] = slide62;
	slideDatabase["slide63"] = slide63;
	slideDatabase["slide64"] = slide64;
	slideDatabase["slide65"] = slide65;
	slideDatabase["slide66"] = slide66;
	slideDatabase["slide80"] = slide80;
	slideDatabase["slide81"] = slide81;
	slideDatabase["slide82"] = slide82;
	slideDatabase["slide83"] = slide83;
	slideDatabase["slide84"] = slide84;
	slideDatabase["slide85"] = slide85;
	slideDatabase["slide86"] = slide86;
	slideDatabase["slide87"] = slide87;
	slideDatabase["slide88"] = slide88;
	slideDatabase["slide100"] = slide100;
	slideDatabase["slide101"] = slide101;
	slideDatabase["slide102"] = slide102;
	slideDatabase["slide103"] = slide103;
	slideDatabase["slide104"] = slide104;
	slideDatabase["slide105"] = slide105;
	slideDatabase["slide106"] = slide106;
	slideDatabase["slide107"] = slide107;
	slideDatabase["slide108"] = slide108;
	slideDatabase["slide109"] = slide109;
	slideDatabase["slide110"] = slide110;
	slideDatabase["slide111"] = slide111;
	slideDatabase["slide112"] = slide112;
	slideDatabase["slide113"] = slide113;
	slideDatabase["slide114"] = slide114;
	slideDatabase["slide115"] = slide115;
	slideDatabase["slide116"] = slide116;
	slideDatabase["slide117"] = slide117;
	slideDatabase["slide118"] = slide118;
	slideDatabase["slide119"] = slide119;
	slideDatabase["slide120"] = slide120;
	slideDatabase["slide130"] = slide130;
	slideDatabase["slide131"] = slide131;
	slideDatabase["slide132"] = slide132;
	slideDatabase["slide133"] = slide133;
	slideDatabase["slide134"] = slide134;
	slideDatabase["slide135"] = slide135;
	slideDatabase["slide136"] = slide136;
	slideDatabase["slide137"] = slide137;
	slideDatabase["slide138"] = slide138;
	slideDatabase["slide139"] = slide139;
	slideDatabase["slide140"] = slide140;
	slideDatabase["slide141"] = slide141;
	
	// Function for placing images into the presentation
	function placeImg(img, callback) {
		$('#'+img.layer).append("<img id="+img.id+"></img>");
		var $imgProps = $('#'+img.id);
		$imgProps.attr('src', img.src);
		$imgProps.addClass(img.cssClass);
		$imgProps.css({
			left: img.left,
			top: img.top,
			display: img.display,
			zIndex: img.z,
			opacity: img.opacity,
			position: 'absolute',
			height: "auto",
			width: img.width
		}).fadeIn(img.fade, function(){
			if(callback) {
				callback();
			}
		})
	}
	
	function retrieveXML(location) {
		if (window.XMLHttpRequest) {
			// code for IE7+, Firefox, Chrome, Opera, Safari
			var xmlhttp=new XMLHttpRequest();
		}
		else {
			// code for IE6, IE5
			var xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		}
		xmlhttp.open("GET",""+location+".xml",false);
		xmlhttp.send("");
		return xmlhttp.responseXML;
	}

	// Function for placing text into the presentation
	function placeText(text, callback) {
		$('#'+text.layer).append("<p id="+text.id+"></p>");
		var $textProps = $('#'+text.id);
		$textProps.addClass(text.cssClass);
		$textProps.css({
			fontSize: text.fontSize,
			left: text.left,
			top: text.top,
			display: text.display,
			opacity: text.opacity
		})
		var xml = retrieveXML("text");
		var xsl = retrieveXML("xsl_template");
		
		if (window.ActiveXObject) {
			var resultDocument = xml.transformNode(xsl);
			var textNode = resultDocument.childNodes[text.location];
		}
		else {
			var xsltProcessor=new XSLTProcessor();
			xsltProcessor.importStylesheet(xsl);
			var resultDocument = xsltProcessor.transformToFragment(xml,document);
			var textNode = resultDocument.childNodes[text.location];
		}
		if(text.display === "block") {
			if(callback) {
				callback();	
			}
		}
		else if(text.typewriter)  {
			document.getElementById(text.id).appendChild(textNode);
			$textProps.typewriter({framerate:text.fadeIn}, function() {
				if(callback) {
					callback();
				}	
			})
		}
		else {
			document.getElementById(text.id).appendChild(textNode);
			$textProps.fadeIn(text.fadeIn, function(){
				if(callback) {
					callback();
				}							 
			}).css("display", "inline");
		}
	}

	function retrieveSlide(number) {
		if (window.XMLHttpRequest) {
			// code for IE7+, Firefox, Chrome, Opera, Safari
			var xmlhttp=new XMLHttpRequest();
		}
		else {
			// code for IE6, IE5
			var xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		}
		xmlhttp.open("GET","slides.xml",false);
		xmlhttp.send();
		xmlDoc=xmlhttp.responseXML;
		var xml = xmlDoc.getElementsByTagName("slide"+number)[0].childNodes;
			var fade = new Array();
				for(c=0; c<xml[1].getElementsByTagName("content").length; c++) {
					var fadeLocation = xml[1].getElementsByTagName("content")[c];
					if(!(c === 2)) {
						var fadeInfo = eval(fadeLocation.childNodes[0].nodeValue);
					}
					else {
						var fadeInfo = fadeLocation.childNodes[0].nodeValue;
					}
					fade.push(fadeInfo);
				}
				slideDatabase["slide"+number].fade = fade;
			var imgArray = new Array();
				for(c=0; c<xml[3].getElementsByTagName("content").length; c++) {
					var imgLocation = xml[3].getElementsByTagName("content")[c];
					var imgInfo = eval(imgLocation.childNodes[0].nodeValue);
					imgArray.push(imgInfo);
				}
				slideDatabase["slide"+number].imgArray = imgArray;
			var textArray = new Array();
				for(c=0; c<xml[5].getElementsByTagName("content").length; c++) {
					var textLocation = xml[5].getElementsByTagName("content")[c];
					var textInfo = eval(textLocation.childNodes[0].nodeValue);
					textArray.push(textInfo);
				}
				slideDatabase["slide"+number].textArray = textArray;
			var methodArray = new Array();
				for(c=0; c<xml[7].getElementsByTagName("content").length; c++) {
					var methodLocation = xml[7].getElementsByTagName("content")[c];
					var methodInfo = new Function(methodLocation.childNodes[0].nodeValue);
					methodArray.push(methodInfo);
				}
				slideDatabase["slide"+number].methodArray = methodArray;
			var slideOrder = new Array();
				for(c=0; c<xml[9].getElementsByTagName("content").length; c++) {
					var orderLocation = xml[9].getElementsByTagName("content")[c];
					var orderInfo = orderLocation.childNodes[0].nodeValue;
					slideOrder.push(orderInfo);
				}
				slideDatabase["slide"+number].slideOrder = slideOrder;
	}
	
	// Function that iterates through the s=lide object's "slide order", placing correspondent images or text
	function showSlide(i, y) {
		if(slideTrigger === false) {
			retrieveSlide(i);
			slideTrigger = true;
			showSlide(i, y);
		}
		else if (slideDatabase["slide"+i].slideOrder[y] === "fade") {
			var slideFade = slideDatabase["slide"+i];
			slideFade.fade[0](slideFade.fade[1], function(){
				y++;
				showSlide(i, y);
			}, slideFade.fade[2], slideFade.fade[3]);
		}
		else if (slideDatabase["slide"+i].slideOrder[y] === "simultaneous") {
			while(p<slideDatabase["slide"+i].imgArray.length) {
				placeImg(slideDatabase["slide"+i].imgArray[p]);
				p++;
			}
			while(t<slideDatabase["slide"+i].textArray.length) {
				placeText(slideDatabase["slide"+i].textArray[t]);
				t++;
			}
			y++;
			showSlide(i, y);
		}
		else if (slideDatabase["slide"+i].slideOrder[y] === "img") {
			placeImg(slideDatabase["slide"+i].imgArray[p], function(){
				p++;
				y++;
				showSlide(i, y);
			})
		}
		else if (slideDatabase["slide"+i].slideOrder[y] === "text") {
			placeText(slideDatabase["slide"+i].textArray[t], function(){
				t++;
				y++;
				showSlide(i, y);
			})
		}
		else if (slideDatabase["slide"+i].slideOrder[y] === "method") {
			slideDatabase["slide"+i].methodArray[m]();
			m++;
			y++;
			showSlide(i, y);
		}
		else {
			if (buttonDisplay === true) {
				$button.css("display", "block");
			}
			m=0;
			p=0;
			t=0;
			y=0;
			fadeTrigger = false;
			slideTrigger = false;
		}
	}

$(document).ready(function(){

$("#screen").fitText(6);
	
	function preloadImgs(imgs) {
    	$(imgs).each(function(){
        	$('<img/>')[0].src = this;
	    });
	}
	
	preloadImgs ([
		'button.gif',
		'hound_large.png',
		'hound2_large.png',
		'treesMenu.jpg',
		'boatsMenu.jpg',
		'fashionMenu.jpg',
		'car0.jpg',
		'loveStorm.jpg',
		'stormSong0.jpg',
		'stormSong1.jpg',
		'stormSong2.jpg',
		'treesStorm.jpg',
		'fashionStorm.jpg',
		'boatsStorm.jpg',
		'stormSisters.jpg'
	])
	
	function preloadText() {
		$.ajax({
			type: "GET",
			url: "text.xml",
			dataType: "xml"
		})
	}
	
	preloadText()
	
	// Displays the information box above the presentation
	$('#infoContainer').hover(
		function(){
			$('#hidden').slideDown("fast");
		},										   
		function() {
			$('#hidden').slideUp("fast");
		}
	)
	
		
	$('#initiate').click(function() {
		$(".absolute").fadeOut(2000, function(){
			$(this).remove();
		})
		$(this).fadeOut(2000, function(){
			$(this).remove();
			showSlide(i, y);
			i++;							   
		})
	})
	
	$button.click(function() {
		$(this).css("display", "none")
		showSlide(i, y);		
		i++;
	})

})