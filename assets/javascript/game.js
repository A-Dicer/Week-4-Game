$(document).ready(function() {

	var game = {
		hlth: [100, 90, 120, 140],
		hlthPrc: ["100%", "100%", "100%", "100%"],
		attack: [50, 40, 60, 80],
		pwr: null,
		counter: null,
		firstChoice: "",
		firstValue: null,
		firstHlth: null,
		secondChoice: "",
		secondValue: null,
		secondHlth: null,
		opponents:[],
		idSound: document.getElementById("sound"),

		start: function(){
			setTimeout(this.delay , 2000);
			document.getElementById("theme").src = "assets/sounds/theme.mp3";
			document.getElementById("theme").play();
			document.getElementById("theme").volume = 0.08
		},

		cardHover: function(a){
			$(a).hover(
				
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

		sound: function(a,b){
			this.idSound.src = "assets/sounds/" + a;
			this.idSound.play();
			this.idSound.volume = b;
		},
		
		delay: function(){
			$(".card").show("slow");
			$("#select").fadeIn("slow");
			$("#focus").animate({ "opacity" : ".4"}, "slow");
 
		},

		selectFirst: function() {

			this.cardHover("#cardOne, #cardTwo, #cardThree, #cardFour");
			
			$(".card").on( 'click', function(){
				
				game.sound("click.mp3", .1);

				$(this).animate({ 
					"width" : "100px", 
					"height" : "133px", 
					"left" : "5%",
					"top" : "28%",
					"font-size" : "10px"
				});

				game.firstChoice = $(this).attr("id");
				game.firstValue = $(this).attr("value");
				game.firstHlth = game.hlth[game.firstValue];

				console.log("You: " + game.firstChoice);
				console.log(game.firstValue)

				if (game.firstChoice === "cardTwo"){
					$("#cardOne").animate({"left" : "30%"})
					game.opponents = ["#cardOne", "#cardThree", "#cardFour"];
				}

				else if (game.firstChoice === "cardThree"){
					$("#cardOne").animate({"left" : "30%"})
					$("#cardTwo").animate({"left" : "52%"})
					game.opponents = ["#cardOne", "#cardTwo", "#cardFour"];
				}

				else if (game.firstChoice === "cardFour"){
					$("#cardOne").animate({"left" : "30%"})
					$("#cardTwo").animate({"left" : "52%"})
					$("#cardThree").animate({"left" : "74%"})
					game.opponents = ["#cardOne", "#cardTwo", "#cardThree"];
				}

				else {
					game.opponents = ["#cardTwo", "#cardThree", "#cardFour"];
				}

				$("h1").html("Choose Your First Opponent");

				game.selectSecond();
			})
		},

		selectSecond: function(){
			
			$(".card").off();
			$("#" + game.firstChoice).css( {"border" : "solid #000 1px" })

			this.cardHover(game.opponents.join(", "));
			
			$(game.opponents.join(", ")).on( 'click', function(){
				
				game.sound("click.mp3", .1);

				game.secondChoice = $(this).attr("id");
				game.secondValue = $(this).attr("value");
				game.secondHlth = game.hlth[game.secondValue];

				for (var i = 0; i < game.opponents.length; i++){
					if (game.opponents[i] === "#" + game.secondChoice){
						game.opponents.splice(i, 1);
					}
				}
				
				$(game.opponents.join(", ") + ", #select").fadeOut("slow");
				
				$("#focus").animate({"opacity" : "1"}, "slow");
				
				$(this).animate({ 
					"width" : "200px", 
					"height" : "267px", 
					"left" : "72%",
					"top" : "15%",
					"font-size" : "20px",
					"border" : "solid #000 1px"
				});

				$("#" + game.firstChoice).animate({
					"width" : "200px", 
					"height" : "267px", 
					"left" : "3%",
					"top" : "15%",
					"font-size" : "20px",
				});

				$(".card").off();
				console.log("Opponent: " + game.secondChoice);
				game.roundOne();	
			})
		},

		roundOne: function(){
			$("#" + game.secondChoice).css( { "border" : "solid #000 1px" });
			$("#vs").fadeIn("slow");
			game.pwr = game.pwr + game.attack[game.firstValue];
			$("button").on("click", function(){
				
				//player attack
				$("#" + game.firstChoice).animate({ "left" : "50%" }, 200);
				$("#" + game.firstChoice).animate({ "left" : "3%" }, 200);
				console.log(game.attack[game.firstValue]);
				game.sound("punch.mp3", .1)
				game.secondHlth = game.secondHlth - game.pwr;
				console.log(game.pwr);

				$("#atk" + game.secondValue).html(game.secondHlth);

				game.hlthPrc = game.secondHlth / game.hlth[game.secondValue]  *100 ;
				game.hlthPrc = game.hlthPrc.toFixed()
				$("#hlth" + game.secondValue).animate({ "width" : game.hlthPrc + "%"});
				game.pwr = game.pwr + game.attack[game.firstValue];
				
				
				setTimeout(counter, 600);

				function counter(){
				//counter attack
				$("#" + game.secondChoice).animate({ "left" : "26%" }, 200);
				$("#" + game.secondChoice).animate({ "left" : "72%" }, 200);
				game.sound("slap.mp3", .1)

				game.firstHlth = game.firstHlth - game.attack[game.secondValue]
				console.log(game.firstHlth);
				$("#atk" + game.firstValue).html(game.firstHlth);

				game.hlthPrc = game.firstHlth / game.hlth[game.firstValue]  *100 ;
				game.hlthPrc = game.hlthPrc.toFixed()
				$("#hlth" + game.firstValue).animate({ "width" : game.hlthPrc + "%"})
				
				if (game.firstHlth <= 0){console.log("you lost")}
				if (game.secondHlth <= 0){console.log("they lost")}
				}
				
			})

		},
	}

//calls for the game

game.start();	
game.selectFirst();	


});