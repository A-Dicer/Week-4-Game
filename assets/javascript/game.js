$(document).ready(function() {
	var game = {
			
		mulder :   	{ hlth: 100, newHlth: null, atk: 12, atkC: 21, value: 0, },
		scully :   	{ hlth: 117, newHlth: null, atk: 10, atkC: 22, value: 1, },
		skinner:   	{ hlth: 115, newHlth: null, atk: 11,  atkC: 18, value: 2, },
		smokingMan: { hlth: 120, newHlth: null, atk: 8, atkC: 23, value: 3, },
		opponents:["mulder", "scully", "skinner", "smokingMan"],	
		fChoice: "",
		sChoice: "",
		selection: 1,
		idSound: document.getElementById("sound"),

		//resets everything.... i mean everything. Probably be easier to just reload the page
		reset: function(){
			$("#end").fadeOut("slow");
			this.opponents = ["mulder", "scully", "skinner", "smokingMan"];
			this.selection = 1;
			this.pwr = 0;
			game.mulder.atkC = 21;
			game.scully.atkC = 22;
			game.skinner.atkC = 18;
			game.smokingMan.atkC = 23;
			$("#atk0").html("100");
			$("#atk1").html("117");
			$("#atk2").html("115");
			$("#atk3").html("120");
			$(".hlthPrc").css({"width": "100%"})
			$(".card").css({"width" : "150px", "height" : "200px", "font-size" : "18px"})
			$("#mulder").css({"left" : "8%"})
			$("#scully").css({"left" : "30%"})
			$("#skinner").css({"left" : "52%"})
			$("#smokingMan").css({"left" : "74%"})
			$(".card").show("slow");
			$("#select").fadeIn("slow");
			$("h1").html("Select Your Character");
			game.select(game.selection);
		},

		//displays the end info
		end: function(a){
			$("button").fadeIn("slow");
			$("h5").html(a);
			$(".card").hide("slow");
			$("#vs").fadeOut("slow");
			$("#focus").animate({"opacity" : ".4"});
			$("#end").fadeIn("slow");
			$("button").on("click", function(){
				game.reset()
			});
		},

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
		//for the start of 
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
		
		// method for  the selection process
		select: function(a) {				
			//turns "off" any attributes to class cards
			$(".card").off();			
			// hover cards that are able to be picked
			game.cardHover("#" + game.opponents.join(", #"));
			//changes the looks divs for second and third selection process only			
			if (a === 2 || a === 3 ){
				$("#select").fadeIn("slow")
				$("h1").html("Choose Your Opponent");
				$("#focus").animate({"opacity" : ".4"});
			}
			//changes the divs for the third selection process only
			if (a === 3){
				$("#vs").fadeOut("slow");
				$("#" + game.sChoice).fadeOut("slow");
				$("#" + game.opponents.join(", #")).show("slow");
				$("#" + game.opponents[0]).css({"left" : "52%"});
				$("#" + game.opponents[1]).css({"left" : "74%"});
			}
			//for the fourth selction process only			
			if (a === 4){
				$("#" + game.sChoice).fadeOut("slow");
				game.sChoice = game.opponents[0];
				game[game.sChoice].newHlth = game[game.sChoice].hlth;
				//changes the elements on the page
				$("#" + game.sChoice).fadeIn("slow");
				$("#playBtn").fadeIn("slow")	
				$("#" + game.sChoice).animate({ 
						"width" : "200px", 
						"height" : "267px", 
						"left" : "72%",
						"top" : "15%",
						"font-size" : "20px",
						"border" : "solid #000 1px"
					});
				//starts last round of fighting
				game.round();
			}
			// when you click on a card 
			$("#" + game.opponents.join(", #")).on( 'click', function(){
				
				//for first selection process only
				if (a === 1){					
					//stores id, health, and power of your pick
					game.fChoice = $(this).attr("id");
					game[$(this).attr("id")].newHlth = game[game.fChoice].hlth;
					game[$(this).attr("id")].atkC = 0;
					//grabs the left position of what is clicked
					var width = $(this).css("left");
					//gives mulder that position so he swaps positions with selected
					$("#mulder").animate({ "left" : width, }, "slow");
					$(this).animate({"left" : "8%"}, "slow");
					//removes chosen from opponents array
					game.opponents.splice(game[game.fChoice].value, 1);
					//changes elements on the screen
					$(this).css({"opacity" : ".5"})
					//adds 1 to selection
					game.selection ++;
					//starts second selection
					game.select(game.selection);
				}

				//for second and third selection process
				if (a === 2 || a === 3){
					//stores id and health of opponent pick
					game.sChoice = $(this).attr("id");
					game[game.sChoice].newHlth = game[game.sChoice].hlth;;
					//loop to remove chosesn from opponents array
					for (var i = 0; i < game.opponents.length; i++){
						if (game.opponents[i] === game.sChoice){
							game.opponents.splice(i, 1);
						}
					}
					//changes size and moves selected into place on page
					$(this).animate({ 
						"width" : "200px", 
						"height" : "267px", 
						"left" : "72%",
						"top" : "15%",
						"font-size" : "20px",
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
					//changes elements on page
					$("#focus").animate({"opacity" : "1"}, "slow");
					$("#" + game.fChoice).css({"opacity" : "1"});
					$("#playBtn").fadeIn("slow");
					//starts round of fighting
					game.round();
				}					
				//play click sound
				game.sound("click.mp3", .1);
				//fixes the border back to what we want
				$(this).css({"border" : "solid #000 1px"})
			})
		},
		
		round: function(a){
			//turns "off" previous attributes for button and class card
			$("#playBtn").off();
			$(".card").off();
			//shows the vs and button on screen
			$("#vs").fadeIn("slow");
			//starts the attack method		
			$("#playBtn").on("click", function(){
			game.atk(game.fChoice, game.sChoice, 1);
			})
		},

		atk: function(a, b, c,){
			//removes button from page
			$("button").fadeOut("fast");							
			//for your charecters attacks 
			if (c === 1) {
				//animates the "attack"
				$("#" + a ).animate({ "left" : "50%" }, 200);
				$("#" + a ).animate({ "left" : "3%" }, 200);
				game.sound("punch.mp3", .1)
				//adds your attack damage every time through
				game[a].atkC = game[a].atkC + game[a].atk;
			}
			//for your opponents attacks
			if (c === 2) {	
				//animates the "attack"
				$("#" + a ).animate({ "left" : "26%" }, 200); 
				$("#" + a ).animate({ "left" : "72%" }, 200);
				game.sound("slap.mp3", .1)
			}
			//updates health
			game[b].newHlth = game[b].newHlth - game[a].atkC;
			//gets the health percent
			game.hlthPrc = game[b].newHlth / game[b].hlth *100;
			//changes health percent to have no decimals
			game.hlthPrc = game.hlthPrc.toFixed()
			//animates the health bar
			$("#hlth" + game[b].value ).animate({ "width" : game.hlthPrc + "%"});
			//updates the elements on screen
			$("#atk" + game[b].value ).html(game[b].newHlth);
			$("#atkPts" + game[b].value).html("-" + game[a].atkC);	
			//shows what is being attacked 
			$("#atkPts" + game[b].value ).fadeIn("fast");		
			$("#atkPts" + game[b].value ).fadeOut("fast");		
			//if first time throuh the attack
			if ( c === 1){
				//delay for second attack
				setTimeout(delay , 500);
				function delay(){			
					// if you have defeated your enemy
					if (game[game.sChoice].newHlth <= 0){	
						//if its the last round of attacks
						if (game.selection === 4){game.end("You Won!")}					
						else {
						//add 1 to selection 
						game.selection ++;
						//starts next selection
						game.select(game.selection);
						}
					}
					//starts opponents attack
					else {game.atk(game.sChoice, game.fChoice, 2)}
				}	
			}			
			//if second time through attack
			if ( c === 2){	
				//delay for next attack
				setTimeout(delay2 , 500);
				function delay2(){	
					// if your health falls below 0
					if (game[game.fChoice].newHlth <= 0){game.end("Sorry, you lost.")}
					//restarts the attack method
					else {game.atk(game.fChoice, game.sChoice, 1)}
				}
			}
		},
	}
	//calls for the game to start
	game.start();
});