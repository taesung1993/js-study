const container = document.querySelector(".image-container");
const startButton = document.querySelector(".start-button");
const gameText = document.querySelector(".game-text");
const playTime = document.querySelector(".play-time");

const tileCount = 16;
const dragged = {
  el: null,
  class: null,
  index: null,
};
let isPlaying = false;
let timeInterval = null;
let time = 0;

setGame();

// functions

function setGame() {
  container.innerHTML = "";
  gameText.style.display = "none";
  time = 0;
  playTime.innerText = time;

  clearInterval(timeInterval);

  const tiles = createImageTiles();
  tiles.forEach((tile) => {
    container.appendChild(tile);
  });

  setTimeout(() => {
    container.innerHTML = "";
    shuffle(tiles).forEach((tile) => {
      container.appendChild(tile);
      isPlaying = true;
    });
    timeInterval = setInterval(() => {
      time += 1;
      playTime.innerText = time;
    }, 1000);
  }, 2000);
}

function createImageTiles() {
  const tempArray = [];
  Array(tileCount)
    .fill()
    .forEach((_, index) => {
      const li = document.createElement("li");
      li.setAttribute("draggable", true);
      li.setAttribute("data-index", index);
      li.classList.add(`list${index + 1}`);
      tempArray.push(li);
    });
  return tempArray;
}

function shuffle(array) {
  const last = array.length - 1;
  for (let i = last; i >= 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
  }
  return array;
}

function checkStatus() {
  const currentList = [...container.children];
  const isFinished = currentList.every((child, index) => {
    return Number(child.getAttribute("data-index")) === index;
  });

  if (isFinished) {
    gameText.style.display = "block";
    isPlaying = false;
    clearInterval(timeInterval);
  }
}

// events
container.addEventListener("dragstart", (e) => {
  if (!isPlaying) return;
  const target = e.target;
  dragged.el = target;
  dragged.class = target.className;
  dragged.index = [...target.parentNode.children].indexOf(e.target);
});

container.addEventListener("dragover", (e) => {
  e.preventDefault();
  // console.log("dragover");
  // console.log(e.target);
});

container.addEventListener("drop", (e) => {
  if (!isPlaying) return;

  const target = e.target;

  if (target.className !== dragged.class) {
    let originPlace;
    let isLast = false;

    if (dragged.el.nextSibling) {
      originPlace = dragged.el.nextSibling;
    } else {
      originPlace = dragged.el.previousSibling;
      isLast = true;
    }
    console.log(originPlace);

    const droppedIndex = [...target.parentNode.children].indexOf(target);
    dragged.index > droppedIndex
      ? target.before(dragged.el)
      : target.after(dragged.el);
    isLast ? originPlace.after(target) : originPlace.before(target);
  }
  checkStatus();
});

startButton.addEventListener("click", () => {
  setGame();
});
