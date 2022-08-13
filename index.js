const boxes = document.querySelectorAll(".grid-item");

const dragged = {
  desktop: {
    doing: false,
    el: null,
    index: null,
  },
  mobile: {
    doing: false,
    el: null,
    index: null,
  },
};
const isMobile = checkDeviceType() === "Mobile";

function checkDeviceType() {
  const userAgent = navigator.userAgent;
  const regex = {
    table: /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i,
    mobile:
      /Mobile|Andorid|IP(hone|od)|IEMobile|BlackBerry|Kindle|Slik-Accelerated|(hpw|web)OS|Opera M(obi|ini)/,
  };

  if (regex.table.test(userAgent) || regex.mobile.test(userAgent)) {
    return "Mobile";
  }
  return "Desktop";
}

boxes.forEach((box, index) => {
  const button = box.querySelector("button");
  button.addEventListener("mousedown", (e) => {
    if (isMobile) return;

    box.setAttribute("draggable", true);
    dragged.desktop.doing = true;
  });
  button.addEventListener("touchstart", (e) => {
    if (!isMobile) return;
    if (e.stopPropagation) {
      e.stopPropagation();
    }

    const currentTarget = e.target.parentNode;
    const index = [].indexOf.call(boxes, currentTarget);

    currentTarget.classList.add("drag--moving");

    dragged.mobile.doing = true;
    dragged.mobile.el = currentTarget;
    dragged.mobile.index = index;
  });

  box.addEventListener("dragstart", handleDragStart);
  box.addEventListener("dragover", handleDragOver);
  box.addEventListener("dragleave", handleDragLeave);
  box.addEventListener("drop", handleDrop);
  box.addEventListener("dragend", handleDragEnd);

  box.addEventListener("touchmove", handleTouchMove);
  box.addEventListener("touchend", handleTouchEnd);
  box.addEventListener("touchleave", handleTouchCancel);
});

function handleDragStart(e) {
  if (!dragged.desktop.doing) return;
  const currentTarget = e.currentTarget;
  const index = [].indexOf.call(boxes, currentTarget);
  currentTarget.classList.add("drag--moving");

  dragged.desktop.el = currentTarget;
  dragged.desktop.index = index;
}

function handleDragOver(e) {
  /*
    1. drop target에서 발생
  */
  if (!dragged.desktop.doing) return;

  e.preventDefault();
  let waiting = false;
  return (function () {
    if (!waiting) {
      waiting = true;

      const currentTarget = e.currentTarget;
      const index = [].indexOf.call(boxes, currentTarget);
      const draggedIndex = dragged.desktop.index;

      if (draggedIndex !== index) {
        currentTarget.classList.add("drag--hover");
      }

      // e.dataTransfer.dropEffect = "move";
      timer = setTimeout(() => {
        waiting = false;
      }, 250);
    }
  })();
}

function handleDragLeave(e) {
  if (!dragged.desktop.doing) return;

  const currentTarget = e.currentTarget;
  const index = [].indexOf.call(boxes, currentTarget);

  if (index > -1) {
    boxes[index].classList.remove("drag--hover");
  }
}

function handleDrop(e) {
  if (!dragged.desktop.doing) return;
  if (e.stopPropagation) e.stopPropagation();

  const currentTarget = e.currentTarget;
  switchElement(dragged.desktop, currentTarget);
}

function handleDragEnd(e) {
  if (!dragged.desktop.doing) return;

  e.preventDefault();
  removeClassNameInBoxes();

  dragged.desktop.doing = false;
}

function handleTouchMove(e) {
  e.preventDefault();

  let waiting = false;

  return (function () {
    if (!waiting) {
      waiting = true;

      if (dragged.mobile.doing) {
        const { clientX, clientY } = e.targetTouches[0];
        const currentTarget = document
          .elementFromPoint(clientX, clientY)
          .closest(".grid-item");

        if (currentTarget) {
          const index = [].indexOf.call(boxes, currentTarget);

          removeClassNameInBoxes((box) => box.classList.remove("drag--hover"));

          if (dragged.mobile.index !== index) {
            currentTarget.classList.add("drag--hover");
          }
        }
      }

      setTimeout(() => {
        waiting = false;
      }, 250);
    }
  })();
}

function handleTouchCancel(e) {
  if (dragged.mobile.doing) return;
  e.preventDefault();

  const { clientX, clientY } = e.targetTouches[0];
  const currentTarget = document
    .elementFromPoint(clientX, clientY)
    .closest(".grid-item");

  if (currentTarget) {
    const index = [].indexOf.call(boxes, currentTarget);

    if (index > -1) {
      boxes[index].classList.remove("drag--hover");
    }
  }
}

function handleTouchEnd(e) {
  e.preventDefault();

  if (dragged.mobile.doing) {
    const { clientX, clientY } = e.changedTouches[0];
    const currentTarget = document
      .elementFromPoint(clientX, clientY)
      .closest(".grid-item");

    switchElement(dragged.mobile, currentTarget);
    removeClassNameInBoxes();

    dragged.mobile.doing = false;
  }
}

function switchElement(dragged, currentTarget) {
  const droppedIndex = [].indexOf.call(boxes, currentTarget);
  const draggedIndex = dragged.index;
  let originalPlace = null;
  let isLast = false;

  if (droppedIndex !== draggedIndex) {
    if (dragged.el.nextSibling) {
      originalPlace = dragged.el.nextSibling;
    } else {
      originalPlace = dragged.el.previousSibling;
      isLast = true;
    }

    if (draggedIndex > droppedIndex) {
      currentTarget.before(dragged.el);
    } else {
      currentTarget.after(dragged.el);
    }

    if (isLast) {
      originalPlace.after(currentTarget);
    } else {
      originalPlace.before(currentTarget);
    }
  }
}

function removeClassNameInBoxes(callback) {
  if (callback) {
    [].forEach.call(boxes, callback);
  } else {
    [].forEach.call(boxes, function (box) {
      box.classList.remove("drag--hover");
      box.classList.remove("drag--moving");
      box.removeAttribute("draggable");
    });
  }
}
