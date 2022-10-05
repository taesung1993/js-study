const imageInput = document.getElementById("upload");
const uploadBtn = document.querySelector(".upload-btn");
const image = document.querySelector(".image-workspace img");
const cropper = new Cropper(image);

uploadBtn.addEventListener("click", (e) => {
  imageInput.value = "";
  imageInput.click();
});

imageInput.addEventListener("change", (e) => {
  const files = e.target.files;
  if (files && files.length) {
    const file = files[0];
    cropper.load(file);
  }
});
