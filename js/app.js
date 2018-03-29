// VARIABLES TO BE USED ACCROSS THE GAME

let symbols = ['anchor', 'anchor', 'bicycle', 'bicycle', 'bolt', 'bolt', 'bomb', 'bomb', 'cube', 'cube', 'diamond', 'diamond', 'leaf', 'leaf', 'paper-plane-o', 'paper-plane-o'];
let	openedCards = [];
let	matchingCards = 0;
let	movesCount = 0;
let	delay = 400;
let	chronometer;
let	second = 0;
let	$timer = $('.timer');
let	totalCard = symbols.length / 2;

//FUNCTIONS TO BE USED ACCROSS THE GAME

// Shuffling method already provided https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
// && https://github.com/coolaj86/knuth-shuffle
function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;
	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

//Manage time with Window setInterval() Method

function startChronometer() {
		chronometer = setInterval(function () {
		second++
		$timer.text(`${second}`)
	}, 1000);
}

function resetChronometer($timer) {
	if ($timer) {
		clearInterval($timer);
	}
}

// GAME ELEMENTS

// Game starter and restarter
function lauchGame() {
	let cards = shuffle(symbols);
	$('.deck').empty();
	matchingCards = 0;
	movesCount = 0;
	$('.moves').text('0');
	$('section ul li').hide();
	$('section ul').append('<li><i class="fa fa-star"></i></li>');
	$('section ul').append('<li><i class="fa fa-star"></i></li>');
	$('section ul').append('<li><i class="fa fa-star"></i></li>');
	for (let i = 0; i < cards.length; i++) {$('.deck').append($('<li class="card"><i class="fa fa-' + cards[i] + '"></i></li>'))}
	cardControl();
	resetChronometer(chronometer);
	second = 0;
	$timer.text(`${second}`)
	startChronometer();
};

// Score setting
function setRating(movesCount) {
	let rating = 3;
	if (movesCount > 10 && movesCount <= 16) {
		rating = 2;
	} else if (movesCount > 16 && movesCount <= 20) {
		$('section ul li').hide();
		$('section ul').append('<li><i class="fa fa-star"></i></li>');
		$('section ul').append('<li><i class="fa fa-star"></i></li>');
		rating = 1;
	} else if (movesCount > 20) {
		$('section ul li').hide();
		rating = 0;
	}
	return { score: rating };
};


// End Game
function endGame(movesCount, score) {
	swal({
		allowEscapeKey: false,
		allowOutsideClick: false,
		title: 'Congratulations! You Made It!',
		text: 'In ' + movesCount + ' Moves and ' + score + ' Stars in ' + second + ' Seconds!',
		type: 'success',
		confirmButtonColor: '#EE82EE',
		confirmButtonText: 'Play again!'
	}).then(function (isConfirm) {
		if (isConfirm) {
			lauchGame();
		}
	})
}

// Restart Game
$('.restart').on('click', function () {
	swal({
		allowEscapeKey: false,
		allowOutsideClick: false,
		title: "Are you sure?",
		text: "Your progress will be Lost!",
		type: "warning",
		showCancelButton: true,
		confirmButtonColor: '#02ccba',
		cancelButtonColor: '#f95c3c',
		confirmButtonText: "Yes, Restart Game!"
	}).then(function (isConfirm) {
		if (isConfirm) {
			lauchGame();
		}
	})
});


// GAME HEART
var cardControl = function () {

	// Card flip
	$('.deck').find('.card').on('click', function () {

		if ($(this).hasClass('show') || $(this).hasClass('match')) { return true; }

		var card = $(this).context.innerHTML;

		$(this).addClass('open show');
		openedCards.push(card);

		// Compare with opened card
		if (openedCards.length > 1) {
			if (card === openedCards[0]) {
				$('.deck').find('.open').addClass('match animated infinite rubberBand');
				setTimeout(function () {
					$('.deck').find('.match').removeClass('open show animated infinite rubberBand');
				}, delay);
				matchingCards++;
			} else {
				$('.deck').find('.open').addClass('notmatch animated infinite wobble');
				setTimeout(function () {
					$('.deck').find('.open').removeClass('animated infinite wobble');
				}, delay / 1.5);
				setTimeout(function () {
					$('.deck').find('.open').removeClass('open show notmatch animated infinite wobble');
				}, delay);
			}
			openedCards = [];
			movesCount++;
			setRating(movesCount);
			$('.moves').html(movesCount);
		}

		// End Game if match all cards
		if (totalCard === matchingCards) {
			setRating(movesCount);
			var score = setRating(movesCount).score;
			setTimeout(function () {
				endGame(movesCount, score);
			}, 500);
		}
	});
};

lauchGame();
