// global variables
let time = 20 //initializing the timer
let score = 0 //initializing the score
let target = 5 //initializing how many target the player should hit for winning the game
let strikes = 0 //initializing the number of strikes when the player hits the mouse

// connecting html elements
const timeElement = document.querySelector("#time")
const scoreElement = document.querySelector("#score")
const targetElement = document.querySelector("#target")
const resultElement = document.querySelector("#result")
const strikesElement = document.querySelector("#strikes")
const squares = document.querySelectorAll(".smallSquare")

//showing the values of each variable right away after starting the game
timeElement.innerText = time
scoreElement.innerText = score
targetElement.innerText = target
strikesElement.innerText = strikes

// these variables will store the interval ids so we can stop them later
let gameTimer //used for counting down the time and clearing the time
let animalTimer //used for showing a new animal every second and stop showing the animals

// a function that start the game
const startGame = () => {
  //I saw this way of counting down the timer from a reddit comment from this post: https://www.reddit.com/r/learnjavascript/comments/ql9yes/how_to_set_up_a_timer_in_javascript/
  //and I understood more about set intervals and how to clear them from w3schools https://www.w3schools.com/jsref/met_win_setinterval.asp and https://www.w3schools.com/js/js_timing.asp
  //so in this function the timer goes down each second (1000) and for each second it will be shown on the website and if the timer reached zero or less then it is game over.

  gameTimer = setInterval(() => {
    time -= 1 //the counter goes down by a second
    timeElement.innerText = time //each second that counts down will be overwritten

    //if the timer reaches zero it will call the end game function and the game will be over
    if (time <= 0) {
      endGame(false) //when the time runs out it should print the losing text
    }
  }, 1000)

  // Show animal any animal every second
  animalTimer = setInterval(showAnimal, 1000)
}

// show a random animal
const showAnimal = () => {
  // clear all squares first
  squares.forEach((sq) => {
    sq.textContent = ""
    sq.onclick = null
  })

  // player can pick any random square
  let randomIndex = Math.floor(Math.random() * squares.length)
  let randomSquare = squares[randomIndex]

  // check the probability of the animal showing randomly on each square
  let randomNumber = Math.random()
  let animal = "cat"
  if (randomNumber < 0.7) {
    animal // 70% chance
  } else {
    animal = "mouse" // 30% chance
  }

  // show the animal image
  const img = document.createElement("img")
  if (animal === "cat") {
    img.src = "images/cat.png"
    img.alt = "cat"
  } else {
    img.src = "images/mouse.png"
    img.alt = "mouse"
  }
  randomSquare.appendChild(img)

  //I used the onclick event instead of addEventListener because addEventListener keeps adding new listeners every time the square is updated. That means if I don’t remove them properly, a single click could trigger multiple functions and increase the score or strikes more than once. Using onclick is simpler here because it automatically overwrites the old click handler, so each square only responds once at a time.
  //https://www.geeksforgeeks.org/javascript/difference-between-addeventlistener-and-onclick-in-javascript/
  randomSquare.onclick = () => {
    if (animal === "cat") {
      score++
      scoreElement.innerText = score
      checkWin()
    } else {
      strikes++
      strikesElement.innerText = strikes
      if (strikes >= 3) {
        endGame(false) //if the player not wins then print otu the losing text
      }
    }

    // immediately clear the square after click which prevents double scoring
    randomSquare.innerText = ""
    randomSquare.onclick = null
  }
}

// Check if player won
const checkWin = () => {
  if (score >= target) {
    endGame(true) //if the player wins is true then print out the text result "you won!"
  }
}

const endGame = (playerWins) => {
  //stop the counter and stop showing animals
  clearInterval(gameTimer)
  clearInterval(animalTimer)

  // Clear the board and make sure that after ending the game when the player clicks on any of the squares it is really empty and the score or strike number does not increase that is why all the squares when the game ends should be empty and null
  squares.forEach((sq) => {
    sq.innerText = ""
    sq.onclick = null
  })

  //i added a paramater/argument to the end game function that if the player wins is true then print out the winning message and if the player wins is false then print out the game over message
  if (playerWins === true) {
    resultElement.innerText = "you wonnn!!!!!!!!!!"
  } else {
    resultElement.innerText = "you loooose!!!!!!!!!!!11"
  }
}
// Start immediately
startGame()
