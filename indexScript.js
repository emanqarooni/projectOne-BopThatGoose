const startGameButton = document.querySelector(".startGameBtn")

startGameButton.addEventListener("click", () => {
  window.localStorage.clear() // Clear local storage
})
