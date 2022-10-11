class Cropper {
  #element = null;
  #container = null;
  #canvasContainer = null;
  #cropBox = null;
  #canvas = null;
  #context = null;

  constructor(element) {
    if (!element || /img/.test(element.tagName)) {
      throw new Error("이미지 태그를 삽입해주세요.");
    }
    this.#element = element;
    // this.init();
  }

  init() {
    this.createTemplate();
  }

  load(file) {
    const reader = new FileReader();

    reader.addEventListener(
      "load",
      function self(e) {
        const url = e.target.result;
        this.createTemplate();
        this.drawImage(url);
      }.bind(this)
    );
    reader.readAsDataURL(file);
  }

  createTemplate() {
    this.#container = this.#container || this.#element.parentNode;
    this.#canvasContainer =
      this.#canvasContainer || document.createElement("section");
    this.#cropBox = this.#cropBox || document.createElement("section");
    this.#canvas = this.#canvas || document.createElement("canvas");
    this.#context = this.#canvas.getContext("2d");

    this.#cropBox.classList.add("crop-box");
    this.#canvasContainer.classList.add("canvas-container");

    this.#canvasContainer.appendChild(this.#canvas);

    this.#container.appendChild(this.#canvasContainer);
    this.#container.appendChild(this.#cropBox);
  }

  drawImage(url) {
    this.#canvas.width = this.#container.clientWidth;
    this.#canvas.height = this.#container.clientHeight;
    this.#element.setAttribute("src", url);

    const listener = () => {
      const canvasWidth = this.#canvas.width;
      const canvasHeight = this.#canvas.height;
      const imageWidth = this.#element.width;
      const imageHeight = this.#element.height;

      const position = {
        x: canvasWidth / 2 - imageWidth / 2,
        y: canvasHeight / 2 - imageHeight / 2,
      };

      this.#context.drawImage(this.#element, position.x, position.y);
      this.#cropBox.style.width = `${canvasWidth * 0.8}px`;
      this.#cropBox.style.aspectRatio = 1;
      this.#cropBox.style.top = "50%";
      this.#cropBox.style.left = "50%";
      this.#cropBox.style.transform = "translate(-50%, -50%)";
      this.#cropBox.style.boxShadow = "0 0 0 100vw rgb(0 0 0 / 50%)";
      this.#element.removeEventListener("load", listener);
    };

    this.#element.addEventListener("load", listener);
  }

  removeClass(target, className) {
    target.classList.remove(className);
  }
}
