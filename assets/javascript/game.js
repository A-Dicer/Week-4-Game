$(document).ready(function() {
	var game = {
		opponents:["mulder", "scully", "skinner", "smokingMan"],	
		hlthPrc: ["100%", "100%", "100%", "100%"],
		hlth: [100, 90, 120, 140],
		attack: [12, 8, 6, 25],
		pwr: 0,
		fChoice: "",
		fValue: null,
		fHlth: null,
		sChoice: "",
		sValue: null,
		sHlth: null,
		selection: 1,
		idSound: document.getElementById("sound"),

		// This happens of first load of the game. 
		start: function(){			
			$("#focus").animate({ "opacity" : ".4"}, 5000);
			// a small dely before showing info page for selection
			setTimeout(this.showInfo , 1000);
			// starts the back ground music xfiles theme... may take out if annoying/add mute button
			document.getElementById("theme").src = "assets/sounds/theme.mp3";
			document.getElementById("theme").play();
			document.getElementById("theme").volume = 0.08
			game.select(1);
		},

		showInfo: function(){
			$(".card").show("slow");
			$("#select").fadeIn("slow");
		},

		// sets the actions for the hover method. a: the id/class to target
		cardHover: function(a){			
				$( a ).hover(				
				//what happens when you hover the card
				function(){ 
					$(this).css("border", "solid #f00 2px");	
				},
				//what happens when you stop hovering the card
				function(){ 
					$(this).css("border", "solid #000 1px")
				}
			)
		},	

		// method for playing sound a: file name - b: volume level
		sound: function(a,b){
			this.idSound.src = "assets/sounds/" + a;
			this.idSound.play();
			this.idSound.volume = b;
		},
		
		select: function(a) {			
			$(".card").off();
			// hover each card
			game.cardHover("#" + game.opponents.join(", #"));			
			if (a === 2 || a === 3 ){
				//changes text on screen 
				$("#select").fadeIn("slow")
				$("h1").html("Choose Your Opponent");
				$("#focus").animate({"opacity" : ".4"});
			}
			if (a === 3){
				$("#vs").fadeOut("slow");
				$("#" + game.sChoice).fadeOut("slow");
				$("#" + game.opponents.join(", #")).show("slow");
			}			
			if (a === 4){
				$("#" + game.sChoice).fadeOut("slow");
				game.sChoice = game.opponents[0];				
				if (game.sChoice === "mulder"){game.sValue = 0; }
				else if (game.sChoice === "scully"){game.sValue = 1; }
				else if (game.sChoice === "skinner"){game.sValue = 2; }
				else {game.sValue = 3;} 
				$("#" + game.sChoice).fadeIn("slow");
				$("button").fadeIn("slow")	
				$("#" + game.sChoice).animate({ 
						"width" : "200px", 
						"height" : "267px", 
						"left" : "72%",
						"top" : "15%",
						"font-size" : "20px",
						"border" : "solid #000 1px"
					});
				game.round();
			}
			// when you click on a card 
			$("#" + game.opponents.join(", #")).on( 'click', function(){
				if (a === 1){					
					//stores id, value, health, and power of the first card picked
					game.fChoice = $(this).attr("id");
					game.fValue = $(this).attr("value");
					game.fHlth = game.hlth[game.fValue];
					var width = $(this).css("left");
					$("#mulder").animate({ "left" : width, }, "slow");
					$(this).animate({"left" : "8%"}, "slow");
					game.opponents.splice(game.fValue, 1);
					$(this).css({"opacity" : ".5"})
					console.log("You chose: " + $(this).attr("id"));
					console.log("Health " + game.fHlth);
					game.selection ++;
					game.select(game.selection);
				}
				if (a === 2 || a === 3){
					//stores id, value, and health of opponent pick
					game.sChoice = $(this).attr("id");
					game.sValue = $(this).attr("value");
					game.sHlth = game.hlth[game.sValue];
					for (var i = 0; i < game.opponents.length; i++){
						if (game.opponents[i] === game.sChoice){
							game.opponents.splice(i, 1);
						}
					}
					$(this).animate({ 
						"width" : "200px", 
						"height" : "267px", 
						"left" : "72%",
						"top" : "15%",
						"font-size" : "20px",
						"border" : "solid #000 1px"
					});
					$("#" + game.fChoice).animate({
						"width" : "200px", 
						"height" : "267px", 
						"left" : "3%",
						"top" : "15%",
						"font-size" : "20px",
					});
					//remove unpicked from the screen
					$("#" + game.opponents.join(", #") + ", #select").fadeOut("slow");				
					$("#focus").animate({"opacity" : "1"}, "slow");
					$("#" + game.fChoice).css({"opacity" : "1"});
					$("button").fadeIn("slow");					
					console.log("Opponent: " + game.sChoice);
					console.log("health: " + game.sHlth);				
					//starts second selection
					game.round();
				}					
				//play click sound
				game.sound("click.mp3", .1);
				$(this).css({"border" : "solid #000 1px"})
			})
		},
		
		round: function(a){
			$("button").off();
			$(".card").off();
			$("#vs").fadeIn("slow");		
			$("button").on("click", function(){		
				game.atk(game.fChoice, 1, game.sValue);
			})
		},

		atk: function(a, b, c,){
			$("button").fadeOut("fast");				
			if (b === 1) {
				//player attack
				$("#" + a ).animate({ "left" : "50%" }, 200);
				$("#" + a ).animate({ "left" : "3%" }, 200);
				game.sound("punch.mp3", .1)
				game.pwr = game.pwr + game.attack[game.fValue];
				game.sHlth = game.sHlth - game.pwr;
				game.hlthPrc = game.sHlth / game.hlth[c] *100;
				$("#atk" + c ).html(game.sHlth);
				$("#atkPts" + c ).html("-" + game.pwr);	
			}
			if (b === 2) {
				//counter attack
				$("#" + a ).animate({ "left" : "26%" }, 200); 
				$("#" + a ).animate({ "left" : "72%" }, 200);
				game.sound("slap.mp3", .1)
				game.fHlth = game.fHlth - game.attack[game.sValue]
				game.hlthPrc = game.fHlth / game.hlth[c] *100 ;
				$("#atk" + c ).html(game.fHlth);
				$("#atkPts" + c ).html("-" + game.attack[game.sValue])
			}			
			$("#atkPts" + c ).fadeIn("fast");		
			$("#atkPts" + c ).fadeOut("fast");
			game.hlthPrc = game.hlthPrc.toFixed()
			$("#hlth" + c ).animate({ "width" : game.hlthPrc + "%"});
			if ( b === 1){
				setTimeout(delay , 1000);
				function delay(){
					if (game.sHlth <= 0){
						if (game.selection === 4){console.log("you win")}					
						else {
						game.selection ++;
						game.select(game.selection);
						}
					}
					else {game.atk(game.sChoice, 2, game.fValue)}
				}
			}
			if ( b === 2){
				setTimeout(delay2 , 1000);
				function delay2(){
					if (game.fHlth <= 0){console.log("you lost")}
					else {game.atk(game.fChoice, 1, game.sValue)}
				}
			}
		},
	}
	//calls for the game
	game.start();
});