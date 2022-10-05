class Cropper {
  #element = null;
  #container = null;
  #canvas = null;
  #context = null;

  constructor(element) {
    if (!element || /img/.test(element.tagName)) {
      throw new Error("이미지 태그를 삽입해주세요.");
    }
    this.element = element;
    this.init();
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
        this.drawImage(url);
      }.bind(this)
    );
    reader.readAsDataURL(file);
  }

  createTemplate() {
    this.container = this.container || this.element.parentNode;
    this.canvas = this.canvas || document.createElement("canvas");
    this.context = this.canvas.getContext("2d");

    this.canvas.appendChild(this.element);
    this.container.appendChild(this.canvas);
  }

  drawImage(url) {
    this.canvas.width = this.container.clientWidth;
    this.canvas.height = this.container.clientHeight;
    this.element.setAttribute("src", url);

    const listener = () => {
      const canvasWidth = this.canvas.width;
      const canvasHeight = this.canvas.height;
      const imageWidth = this.element.width;
      const imageHeight = this.element.height;

      const position = {
        x: canvasWidth / 2 - imageWidth / 2,
        y: canvasHeight / 2 - imageHeight / 2,
      };

      this.canvas.appendChild(this.element);
      this.container.appendChild(this.canvas);
      this.context.drawImage(this.element, position.x, position.y);
      this.element.removeEventListener("load", listener);
    };

    this.element.addEventListener("load", listener);
  }

  removeClass(target, className) {
    target.classList.remove(className);
  }
}
