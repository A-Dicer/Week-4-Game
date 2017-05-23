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

				//have to find out the value of the last opponent selected				
				if (game.sChoice === "mulder"){game.sValue = 0; }
				else if (game.sChoice === "scully"){game.sValue = 1; }
				else if (game.sChoice === "skinner"){game.sValue = 2; }
				else {game.sValue = 3;} 
				
				//changes the elements on the page
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

				//starts last round of fighting
				game.round();
			}
			
			// when you click on a card 
			$("#" + game.opponents.join(", #")).on( 'click', function(){
				
				//for first selection process only
				if (a === 1){					
					//stores id, value, health, and power of your pick
					game.fChoice = $(this).attr("id");
					game.fValue = $(this).attr("value");
					game.fHlth = game.hlth[game.fValue];
					
					//grabs the left position of what is clicked
					var width = $(this).css("left");

					//gives mulder that position so he swaps positions with selected
					$("#mulder").animate({ "left" : width, }, "slow");
					$(this).animate({"left" : "8%"}, "slow");

					//removes chosen from opponents array
					game.opponents.splice(game.fValue, 1);

					//changes elements on the screen
					$(this).css({"opacity" : ".5"})

					//logs the first pick
					console.log("You chose: " + $(this).attr("id"));
					console.log("Health " + game.fHlth);
					
					//adds 1 to selection
					game.selection ++;

					//starts second selection
					game.select(game.selection);
				}

				//for second and third selection process
				if (a === 2 || a === 3){

					//stores id, value, and health of opponent pick
					game.sChoice = $(this).attr("id");
					game.sValue = $(this).attr("value");
					game.sHlth = game.hlth[game.sValue];

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
					$("button").fadeIn("slow");

					//log opponent picked					
					console.log("Opponent: " + game.sChoice);
					console.log("health: " + game.sHlth);				
					
					 //starts first round of fighting
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
			$("button").off();
			$(".card").off();

			//shows the vs and button on screen
			$("#vs").fadeIn("slow");

			//starts the attack method		
			$("button").on("click", function(){		
				game.atk(game.fChoice, 1, game.sValue);
			})
		},

		atk: function(a, b, c,){
			//removes button from page
			$("button").fadeOut("fast");				
			
			//for your charecters attacks 
			if (b === 1) {
				//animates the "attack"
				$("#" + a ).animate({ "left" : "50%" }, 200);
				$("#" + a ).animate({ "left" : "3%" }, 200);
				game.sound("punch.mp3", .1)

				//adds your attack damage every time through
				game.pwr = game.pwr + game.attack[game.fValue];

				//updates opponents health
				game.sHlth = game.sHlth - game.pwr;

				//gets the opponents health percent
				game.hlthPrc = game.sHlth / game.hlth[c] *100;
				
				//updates the elements on screen
				$("#atk" + c ).html(game.sHlth);
				$("#atkPts" + c ).html("-" + game.pwr);	
			}
			
			//for your opponents attacks
			if (b === 2) {
				
				//animates the "attack"
				$("#" + a ).animate({ "left" : "26%" }, 200); 
				$("#" + a ).animate({ "left" : "72%" }, 200);
				game.sound("slap.mp3", .1)
				
				//updates your health
				game.fHlth = game.fHlth - game.attack[game.sValue]
				
				//gets your health percent
				game.hlthPrc = game.fHlth / game.hlth[c] *100 ;
				
				//updates the elements on screen
				$("#atk" + c ).html(game.fHlth);
				$("#atkPts" + c ).html("-" + game.attack[game.sValue])
			}

			//shows what is being attacked 
			$("#atkPts" + c ).fadeIn("fast");		
			$("#atkPts" + c ).fadeOut("fast");

			//changes health percent to have no decimals
			game.hlthPrc = game.hlthPrc.toFixed()
			
			//animates the health bar
			$("#hlth" + c ).animate({ "width" : game.hlthPrc + "%"});
			
			//if first time throuh the attack
			if ( b === 1){

				//delay for second attack
				setTimeout(delay , 1000);
				function delay(){
					
					// if you have defeated your enemy
					if (game.sHlth <= 0){
						
						//if its the last round of attacks
						if (game.selection === 4){console.log("you win")}					
						else {
						
						//add 1 to selection 
						game.selection ++;
						
						//starts next selection
						game.select(game.selection);
						}
					}

					//starts opponents attack
					else {game.atk(game.sChoice, 2, game.fValue)}
				}
			}
			
			//if second time through attack
			if ( b === 2){
				
				//delay for next attack
				setTimeout(delay2 , 1000);
				function delay2(){
					
					// if your health falls below 0
					if (game.fHlth <= 0){console.log("you lost")}
					
					//restarts the attack method
					else {game.atk(game.fChoice, 1, game.sValue)}
				}
			}
		},
	}
	
	//calls for the game to start
	game.start();
});