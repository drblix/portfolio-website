"use strict";
const galleryElement = document.getElementById("galatigoo-gallery");
const modalElement = document.getElementById("galatigoo-modal");
const modalImage = modalElement.querySelector(".modal-content");
const closeModal = modalElement.querySelector(".close");
console.log(closeModal);
const imageUrls = [
    "./game_images/galatigoo-1.webp",
    "./game_images/galatigoo-2.webp",
    "./game_images/galatigoo-3.webp"
];
function populateGallery(urls) {
    urls.forEach(url => {
        const img = document.createElement("img");
        img.src = url;
        img.addEventListener("click", () => openModal(url));
        galleryElement.appendChild(img);
    });
}
function openModal(imageUrl) {
    modalImage.src = imageUrl;
    modalElement.classList.remove("hidden");
}
function closeModalHandler() {
    modalElement.classList.add("hidden");
    modalImage.src = "";
}
closeModal.addEventListener("click", closeModalHandler);
populateGallery(imageUrls);
