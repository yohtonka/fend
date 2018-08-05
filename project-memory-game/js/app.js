/* 
 * Declare variables
 */
const deck = document.querySelector('.deck'); // Deck of cards
const btnRestart = document.querySelector('.fa-repeat'); // Button to restart the game
const time = document.querySelector('.time'); // Timer showing elapsed time
const stars = document.querySelector('.stars'); // Star rating
const modalBox = document.getElementById('modal-dialog-box'); // Modal dialog box
const modalMsg = document.getElementById('message'); // Message inside the modal dialog box 

/* Memory game board : */
let	arrCardSymbols;			// List of all card faces
let card;					// The currently selected card
let openedUnmatchedCards;	// A list of currently open cards that have not been matched yet
let totalMatchedCards;		// Total number of cards with matching pairs
let isCard;					// Flag to denote if a valid card was clicked
let intMoveCount;			// Counter to keep track of total number of moves (or, clicks)
let strMsg;					// Text message to show in the modal dialog box
//let isStartGame;			// Flag to denote if the player wants to start a new game
/* Timer: */
let timer;					// Variable to store the returned ID from setInterval() function
let startTime;				// Time when the game started
let seconds;				// Number of seconds on the game timer
let minutes;				// Number of minutes on the game timer
/* Star rating */
let starRating;				// Player's star rating based on their performance
/* Modal Dialog Box */
let isCardEventListener;	// Flag to denote if the cards in the deck already have an event listener
let isResetButtonEventListener; // Flag to denote if the reset button already has an event listener 


/*
 * Initialize the game when the document is ready 
 * i.e. when the page has finished loading
 */
window.onload = function() {

	// Initialize the card- and reset button event listeners to false
	// to denote that they haven't been added yet
	isCardEventListener = false;
	isResetButtonEventListener = false;


	// Show the intro message box with game instructions and a 'Start' button
	strMsg = '<h1>Memory Game</h1>';
	strMsg += '<p>This well-known game tests how good your memory is!</p>';
	strMsg += '<p>It is played by <strong>clicking on any two cards</strong> to reveal the ';
	strMsg += '<strong>symbols</strong> underneath them. If the cards <strong>match</strong>, ';
	strMsg += 'they remain <strong>open</strong>. Otherwise, they are turned face-down again.</p>';
	strMsg += '<p>You <strong>win the game</strong> by <strong>matching all cards!</strong></p>';
	strMsg += '<h3>Click "Start" to play the game!</h3>';
	strMsg += '<a href="javascript:hideModalBox(\'start\')" class="button">Start</a> ';
	strMsg += '<a href="javascript:hideModalBox(\'cancel\')" class="button">Cancel</a>';
	
	showModalBox(strMsg);
};


/* Function to display the modal dialog box 
 * @param strMsg the message or content of the modal box
 */
function showModalBox(strMsg){

	// Set the message (i.e. content) of the modal box
	modalMsg.innerHTML = strMsg;

	// Show the modal dialog box
	modalBox.style.visibility = 'visible';
}


/* Function to hide the modal dialog box
 * 
 * This function is called when buttons in the modal dialog box are clicked
 * For e.g. there are buttons to start or to restart a game, and to cancel the modal box
 *
 * Based on the button that was clicked, a parameter is also passed in the function, and
 * based on the parameter, event listeners are added to the cards and the reset button
*/
function hideModalBox(strAction){

	// Hide the modal dialog box
	modalBox.style.visibility = 'hidden';

	// Add the game's event listeners by passing the 
	addGameEventListeners(strAction);
}

/* Function to add event listeners to the game elements
 * E.g. All cards in the deck and the reset button have 'click' event listeners
 *
 * This fuction is called from within the hideModalBox(arg) function above
 */
function addGameEventListeners(strAction) {

	// For debugging purpose:
	console.log("Player action = " + strAction);

	// Check if any button other than the Cancel button was clicked
	if (strAction !== 'cancel' && strAction !== undefined && strAction !== '') {

		// No, the Cancel button was not pressed
		// i.e. either the 'Start' or 'Restart' button was pressed
		// Then, iniitialize the game
		initializeMemoryGame();


		// Check if the Start button on the welcome screen was clicked, or
		// if the cards don't have a click event listener yet (i.e. isCardEventListener = false)
		if (strAction == 'start' || !isCardEventListener) {

			// Add the 'click' event listener to the cards
			addCardEventListener();

			// Set the flag to true to denote that it has been added
			isCardEventListener = true;

			console.log('Adding the card event listener')
		}
	} 

	// Check if the reset button event listener has already been added
	if (!isResetButtonEventListener) {

		// No, it has not been added yet
		// Then, add the 'click' event listener to the reset button
		addResetButtonEventListener();

		// Set the flag to true to denote that it has been added
		isResetButtonEventListener = true;

		console.log('Adding the reset button event listener')
	}
}

/* Initialize the memory card board with randomly placed cards
 * Shuffle the card symbols (faces/suits) randomly, and set them to the cards in the deck 
 */
function initializeMemoryGame() {
	
	/*
	 * Initialize variables
	 */
	/* Memory game board: */
	arrCardSymbols = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-anchor', 'fa-leaf', 'fa-bicycle', 'fa-diamond', 'fa-bomb', 'fa-leaf', 'fa-bomb', 'fa-bolt', 'fa-bicycle', 'fa-paper-plane-o', 'fa-cube'];
	openedUnmatchedCards = initializeArray(openedUnmatchedCards);
	totalMatchedCards = 0;
	intMoveCount = 0;
	starRating = 3;	// When the game starts, the player receives 3 star ratings (highest rating)

	/* 
	 * Reset the memory game board with randomly placed cards
	 */
	shuffleCards();
	
	/* 
	 * Set/reset the moves (clicks) made by the player
	 */
	setMoveCount(intMoveCount);

	/* 
	 * Set/reset the timer
	 */
	setTimer();

	/* 
	 * Initialize the star rating
	 */
	initializeStarRating();
}


/* Initialize an array variable 
 * If the variable is undefined, initialize it as a blank array
 * If it has already been initialized as an array, empty it
 */
function initializeArray(arr) {

	// Check if the passed variable is an instance of the Array object
	if (arr instanceof Array) {

		// The variable has already been initialized as an array
		// Empty the array
		if (arr.length > 0) {
			arr.splice(0, arr.length);
		}

	} else {

		// The variable hasn't been initialized as an array. i.e. it is 'undefined'.
		// Initialize it as an array
		arr = [];
	}

	// Return the array
	return arr;
}


/* Function to shuffle cards in the memory game board
 * Assigns randomly shuffled symbols to the cards in the deck
 */
function shuffleCards() {
	
	// Shuffle the card symbols
	arrCardSymbols = shuffle(arrCardSymbols);

	// Set the cards with randomized symbols
	for(let i = 0; i < deck.children.length; i++) {
		deck.children[i].innerHTML = '<i class="fa '+ arrCardSymbols[i] +'"></i>';

		//For Debugging purpose
		console.log(deck.children[i]);

		/* Turn the card face-down, if it is facing up */
		// Remove the 'match' class in the card, if it exists
		if (containsClass(deck.children[i], 'match')) {
			toggleCardWithClass(deck.children[i], 'match');
		}

		// Remove the 'open' class in the card, if it exists
		if (containsClass(deck.children[i], 'open')) {
			toggleCardWithClass(deck.children[i], 'open');
		}

		// Remove the 'show' class in the card, if it exists
		if (containsClass(deck.children[i], 'show')) {
			toggleCardWithClass(deck.children[i], 'show');
		}
	}

	// Display a success message in the console
	console.log('Finished shuffling the cards');
}


/*
 * Shuffle function from http://stackoverflow.com/a/2450976
 */
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/* Function to check if a card (<li> element) contains a css class	
 * This is a polyfill for IE 9 and earlier
 * Source: https://www.w3schools.com/jsref/prop_element_classlist.asp
 */
function containsClass(currentCard, cssClass) {

	// Check if the browser supports <Element>.classList property
	if (currentCard.classList) {

		// Yes, it is supported. Call the 'contains' function on classList
		return currentCard.classList.contains(cssClass);
	} else {

		// No, it is not supported. Use a regex to check for the className instead
		return /\bcssClass\b/g.test(currentCard.className);
	}
}


/* Function to toggle (show or hide) a card
 * Calls another function that does the actual toggling
 */
function toggleCard(currentCard) {

	// The 'open' and 'show' classes, in combination, display or hide a card
	// depending on whether it is already open or hidden 
	toggleCardWithClass(currentCard, 'open');
	toggleCardWithClass(currentCard, 'show');
}


/* The main toggle function
 * Includes polyfill to support IE9 and earlier browsers
 *
 * Source: https://www.w3schools.com/jsref/prop_element_classlist.asp
 */
function toggleCardWithClass(currentCard, cssClass) {
	
	let arrClasses, intIndex;

	// Check if the browser supports <element>.classList property
	if (currentCard.classList) {
		
		// Yes, it is supported. Call the 'toggle' function on classList
		currentCard.classList.toggle(cssClass);

	} else {

		// No, it is not supported.
		// Check if the card already contains the class
		arrClasses = currentCard.className.split(" ");
		intIndex = arrClasses.indexOf(cssClass);

		if (intIndex >= 0) {
			// The card contains the class. So, remove it
			arrClasses.splice(intIndex, 1);
		} else { 
			// The card does not contain the class. So, add it
			arrClasses.push(cssClass);
		}
		
		// Regenerate the card's classes
		currentCard.className = arrClasses.join(' ');
	}
}


/* Function to set two cards as 'matched'
 */
function setMatchedCards(card1, card2) {

		// Remove the 'open' and 'show' classes from card 1
		toggleCard(card1);
		// Add the 'match' class to card 1
		toggleCardWithClass(card1, 'match');

		// Remove the 'open' and 'show' classes from card 2
		toggleCard(card2);
		// Add the 'match' class to card 2
		toggleCardWithClass(card2, 'match');
}


/*
 * Player Moves (or, Clicks)
 */
/* Function to set the player's total move count */
function setMoveCount(intCount) {
	document.querySelector('.moves').textContent = intCount;
}


/* Function to get the total move count */
function getMoveCount() {
	return intMoveCount;
}


/* 
 * Timer 
 */
/* Function to set the timer when the game initializes */
function setTimer() {

	startTime = new Date();

	// Call the actual (main) set time function every 1 second
	timer = setInterval(setTime, 1000);
}


/* The main function to set the timer */
function setTime() {

	// Get the current date
	let now = new Date();

	// Get the total number of seconds elapsed since the start of the game
	seconds = Math.floor((now - startTime)/1000);

	// Convert seconds into minutes and seconds, and store only the minutes value
	minutes = Math.floor(seconds/60);

	// Convert seconds into minutes and seconds, and store only the seconds value
	seconds %= 60;

	// Display the time elapsed since the start of the game as 'Minutes:Seconds' pair
	time.innerHTML = addZeroPrefix(minutes) + ':' + addZeroPrefix(seconds);
}


/* Function to add a zero infront of a number if it is less than 0 */
function addZeroPrefix(intTime) {
	return (intTime < 10) ? ('0' + intTime) : intTime;
}


/* Function to get the total time taken by the player to complete the game
 * E.g. if the time is 00:35, the output becomes "35 seconds"
 * 		if the time is 01:00, the output becomes "1 minute"
 *		if the time is 01:02, the output becomes "1 minute and 2 seconds"
 */
function getTime() {

	// Output message
	let msg = '';

	// 'minutes' is a global variable, so its value is accessible here
	// if the player took more than a minute, to complete the game,
	// 	generate the output message accordingly
	if (minutes > 0) {
		msg += minutes + ' minute';
		msg += (minutes > 1) ? 's' : '';
		msg += (seconds > 0) ? ' and ' : '';
	}

	// 'seconds' is also a global variable
	/* Repeating code: similar to the check for minutes 
	 * Could be made into a function, but it's not necessary for this case
	 */
	if (seconds > 0) {
		msg += seconds + ' second';
		msg += (seconds > 1) ? 's' : '';
	}

	// return the final output message
	return msg;
}


/*
 * Stars Rating
 */
/* Function to initialize the player's stars rating
 * Remove all the stars
 */
function initializeStarRating() {

	// Remove all the stars, if they exist
	while(stars.hasChildNodes()) {
		stars.removeChild(stars.firstChild)
	}

	// Create three stars
	for (let i = 1; i <= 3; i++) {

		// Create a star
		star = document.createElement('LI')
		star.innerHTML = '<i class="fa fa-star"></i>';
		
		// Add the star to the score board
		stars.appendChild(star);
	}
}


/* Function to remove a star from the star rating in the score board */
function removeStar() {
	// Decrease the player's star by 1 
	// starRating is a global variable
	starRating--;

	// Revove a star from the score board
	// ToDo: Instead of removing the stars entirely, replace them with stars with an outline
	stars.removeChild(stars.lastChild);
}


/* Function to get the player's star rating as a string output */
function getStarRating() {

	// Output message
	let msg = starRating;

	// Append the string 'star' or 'stars' depending on the number of stars
	msg += (starRating == 1) ?  ' star' : ' stars';

	// return the output string
	return msg;
}


/* 
 * Functions to add event listeners to the memory game elements 
 */
/* 1. Add a click event listener to the deck of cards
 * --------------------------------------------------
 *	When a card is clicked, it is flipped around to reveal the card face (symbol)
 *		If the card face matches that of another card that is already open, 
 *			they are marked as 'matched', and remain open
 *		If the card faces do not match, both the cards are turned face-down again
 *	When all cards have been matched, the game is won.
 */
function addCardEventListener() {

	// Add the event listener
	deck.addEventListener('click', function(e) {
		
		/* 
		 * Check if a valid card (i.e. an <li> element) inside the deck was clicked 
		 */
		if (e.target.parentNode.nodeName == 'LI') {
			
			// A card symbol inside a card (and not the card itself) was clicked!
			// Assign the parent node (i.e. the <li> element) of the symbol as the 'clicked' card
			card = e.target.parentNode;
			isCard = true;

		} else if (e.target.nodeName == 'UL') {
			
			// The space between and around the cards was clicked
			// So, it is an invalid click
			isCard = false;

		} else {
			
			// An actual card (<li> element) inside the deck was clicked
			// Assign it as the currently selected (clicked) card
			card = e.target;
			isCard = true;
		}
		

		/* Check if a valid card was clicked, and if it has not already been marked as 'matched'
		 * If it is not a valid card, do nothing, and wait for the player to click another card.
		 */
		if (isCard && !containsClass(card, 'match')) {

			// A valid card was clicked!

			/* Move Counter: 
			 * Increase the move counter and update the score board
			 */
			intMoveCount++;
			setMoveCount(intMoveCount);

			/* Star Rating:
			 * If the player makes more than 30 moves (clicks), remove a star
			 * If the player makes more than 45 moves (clicks), remove another star
			 */
			(intMoveCount == 31) ? removeStar() : '';
			(intMoveCount == 46) ? removeStar() : '';


			// Check if any card is already open that has not yet been matched
			if (openedUnmatchedCards.length < 1) {

				// No other card is open that has not yet been matched
				// Then, show the card
				toggleCard(card);

				// Add it to the list of opened and unmatched cards	
				openedUnmatchedCards.push(card);

				//alert("Count opened cards: " + openedUnmatchedCards.length);
			} else {

				// Yes, there is another open card that hasn't been matched yet
				// Then, check if the player clicked on the same exact open card
				if (card === openedUnmatchedCards[0]) {

					// Yes, it is the same exact card!
					// Then, simply hide it
					toggleCard(card);
					
					// Remove the card from the list of opened (unmatched) cards
					openedUnmatchedCards.pop();

				} else {
					
					// No, it is a different card
					// Then, show the card
					toggleCard(card);

					// Check if the two cards match
					if (card.innerHTML != openedUnmatchedCards[0].innerHTML) {
						
						// No, they do not match
						// Then, hide both the cards
						/* ToDo: parameters in setTimeout() function is not supported in IE9
						 * and earlier versions. Need to find another way to do the same.
						 */
						setTimeout(toggleCard, 500, card);
						setTimeout(toggleCard, 500, openedUnmatchedCards[0]);

						// Remove the other opened card from the list
						openedUnmatchedCards.pop();

					} else {

						// Yes, the two cards match!
						// Mark them as matched
						setMatchedCards(card, openedUnmatchedCards[0]);

						// Remove the previous card from the list of opened cards
						openedUnmatchedCards.pop();

						// Increase the count of total matched cards
						totalMatchedCards += 2;

						// Are all the cards matched?
						if (totalMatchedCards == 16) {

							// Yes! We have a winner!
							// Then, stop the timer
							clearInterval(timer);

							//Show a box with congratulatory msg, and an option to start a new game
							// ToDo: put this in a function!
							strMsg = '<h1>Congratulations!</h1>';
							strMsg += 'You completed the game in <strong>' + getTime() + '</strong>.<br />';
							strMsg += 'It took you <strong>' + getMoveCount() + ' moves</strong>, and you received <strong>' + getStarRating() + '</strong>!<br /><br />';
							strMsg += '<h3>Do you want to start a new game?</h3>';
							strMsg += '<a href="javascript:hideModalBox(\'restart\')" class="button">Yes</a> ';
							strMsg += '<a href="javascript:hideModalBox()" class="button">No</a>';

							// Display the modal dialog box with the message
							showModalBox(strMsg);
						}
					}
				}
			} 
		}
	});
}


/* 2. Add a click event listener to the reset button
 * -------------------------------------------------
 *	When the reset button is clicked, a pop-up message is displayed 
 *		asking the player if they want to reset the game.
 *	If they chose to reset the game, a new game is initialized.
 */
 function addResetButtonEventListener() {

 	// Add the event listener
	btnRestart.addEventListener('click', function() {

		strMsg = '<h3>Are you sure you want to restart the game?</h3>';
		strMsg += '<a href="javascript:hideModalBox(\'restart\')" class="button">Yes, please!</a> ';
		strMsg += '<a href="javascript:hideModalBox()" class="button">No, thanks!</a>';
		
		showModalBox(strMsg)		
	});
}


/* ToDo:
 -------
3. ToDos inside the code itself. Check the comments
4. Optional additional features (see the project rubric on course website)

Bugs:
-----
1. Can open multiple cards when clicked quickly. 
	- The player should be able to open only two cards at any time, no matter how quicklky they click multiple cards!
 */