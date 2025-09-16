// global variables
let time = 30 //initializing the timer
let score = parseInt(window.localStorage.getItem("score")) || 0 // retrieve score from local storage or set to 0
let target = 5 //initializing how many target the player should hit for winning the game
let strikes = parseInt(window.localStorage.getItem("strikes")) || 0 // retrieve score from local storage or set to 0

// connecting html elements
const timeElement = document.querySelector("#time")
const scoreElement = document.querySelector("#score")
const targetElement = document.querySelector("#target")
const resultElement = document.querySelector("#result")
const strikesElement = document.querySelector("#strikes")
const squares = document.querySelectorAll(".smallSquare")
const restartButton = document.querySelector(".restartButton")
const nextLevel = document.querySelector(".levelTwo")
const resetGame = document.querySelector(".resetLevelsButton")
const gameResultBlock = document.querySelector(".gameResult")
const instructions = document.querySelector(".instructions")
const cursor = document.querySelector(".cursor img")

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
    //when the timer begins to count down then we get the item to show from the local storage
    scoreElement.innerText = window.localStorage.getItem("score")
    strikesElement.innerText = window.localStorage.getItem("strikes")
    time-- //the counter goes down by a second
    timeElement.innerText = time //each second that counts down will be overwritten

    //if the timer reaches zero it will call the end game function and the game will be over
    if (time <= 0) {
      endGame(false) //when the time runs out it should print the losing text
      gameResultBlock.style.opacity = 1
      restartButton.style.opacity = 1
      nextLevel.style.display = "none"
    }
  }, 1000)

  // Show animal any animal every second
  animalTimer = setInterval(showAnimal, 1000)
}

// show a random animal
const showAnimal = () => {
  // clear all squares first, this makes sure the board or all the squares has nothing inside it before a new animal item appear, otherwise old animals or old click events could remain and cause bugs and issues like double scoring or showing up two cats in one square.
  squares.forEach((sq) => {
    sq.textContent = "" // remove any text or image inside the square
    sq.onclick = null // remove any old click event from the square

    //cursor whacking
    sq.addEventListener("mouseenter", () => {
      cursor.style.display = "block" // Show the cursor image when entering the square
    })
    sq.addEventListener("mouseleave", () => {
      cursor.style.display = "none" //
      cursor.style.cursor = "auto" // Revert to normal cursor when leaving
    })
    sq.addEventListener("mousemove", (e) => {
      cursor.style.top = e.pageY + "px"
      cursor.style.left = e.pageX + "px"
    })
    sq.addEventListener("click", () => {
      cursor.style.animation = "hit 100s ease"
      setTimeout(() => {
        cursor.style.removeProperty("animation")
      }, 100)
    })
  })

  //animal showing up randomly at any squares
  //math.random(): gives a random number between 0 and 1, and squares.length = 9 squares in the board, so multiplying the two together gives the number range between 0 to 9 but it is not a whole number, so I use math.floor which then rounds it down to an integer whole number 0 to 8, which matches the indexes of the squares array (arrays start at 0). This means randomIndex will point to a random square in the grid where we can show an animal, ensuring that each square has an equal chance of being chosen each time the function runs.
  let randomIndex = Math.floor(Math.random() * squares.length)
  let randomSquare = squares[randomIndex]

  // check the probability of the animal showing randomly on each square
  let randomNumber = Math.random() //random between 0 to 1
  let animal = "goose" //default is goose
  if (randomNumber < 0.7) {
    animal // 70% chance
  } else {
    animal = "cat" // 30% chance
  }

  // show the animal image
  const img = document.createElement("img")
  if (animal === "goose") {
    img.setAttribute("src", "images/goose.png")
    img.setAttribute("alt", "goose")
  } else {
    img.setAttribute("src", "images/cat.png")
    img.setAttribute("alt", "cat")
  }
  randomSquare.appendChild(img) // put the image inside the randomly chosen square so the player sees it

  //I used the onclick event instead of addEventListener because addEventListener keeps adding new listeners every time the square is updated. That means if I don’t remove them properly, a single click could trigger multiple functions and increase the score or strikes more than once or even two items like two cats showing up in one square. Using onclick is simpler here because it automatically overwrites the old click handler, so each square only responds once at a time.
  //https://www.geeksforgeeks.org/javascript/difference-between-addeventlistener-and-onclick-in-javascript/
  randomSquare.onclick = () => {
    if (animal === "goose") {
      score++
      //setting a name for the item that I want to store in the local storage and every time the score increase it prints out the score that gets from the local storage
      window.localStorage.setItem("score", score)
      scoreElement.innerText = window.localStorage.getItem("score")
      checkWin()
    } else {
      strikes++
      //setting a name for the strike var that I want to store in the local storage and every time the strikes increase it prints out the strike points that gets from the local storage
      window.localStorage.setItem("strikes", strikes)
      strikesElement.innerText = window.localStorage.getItem("strikes")
      if (strikes >= 3) {
        endGame(false) //if the player not wins then print otu the losing text
        gameResultBlock.style.opacity = 1
        restartButton.style.opacity = 1
        nextLevel.style.display = "none"
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
    gameResultBlock.style.opacity = 1
    nextLevel.style.opacity = 1
    nextLevel.style.display = "block"
    restartButton.style.display = "none"
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
    resultElement.innerText = "You Won!"
  } else {
    resultElement.innerText = "Game Over!"
  }
}

// restart button click event with addEventListener
restartButton.addEventListener("click", () => {
  time = 30
  score = 0
  strikes = 0
  timeElement.innerText = time
  scoreElement.innerText = score
  strikesElement.innerText = strikes
  resultElement.innerText = ""
  restartButton.style.opacity = 0
  gameResultBlock.style.opacity = 0
  nextLevel.style.opacity = 0
  nextLevel.style.display = "none"
  localStorage.clear()
  startGame()
})

resetGame.addEventListener("click", () => {
  localStorage.clear()
})

nextLevel.addEventListener("click", () => {
  localStorage.clear()
})

//when the player hits on the strat game button from the index page then the first thing that the levelOne page will show is the instructions then the actual game begins
const showInstructions = () => {
  instructions.style.opacity = 1 // show instructions page first
  scoreElement.innerText = window.localStorage.getItem("score")
  strikesElement.innerText = window.localStorage.getItem("strikes")
  // when the player clicks anywhere on the page then it will start the game
  instructions.addEventListener("click", () => {
    instructions.style.opacity = 0 // hide instructions
    instructions.style.display = "none" //and remove the instructions so that the player can play
    startGame() // start the game
  })
}

// call the instructions section first before starting the game
showInstructions()
