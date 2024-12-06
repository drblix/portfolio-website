const galleryElement: HTMLElement = document.getElementById("galatigoo-gallery") as HTMLElement;
const modalElement: HTMLElement = document.getElementById("galatigoo-modal") as HTMLElement;
const modalImage: HTMLImageElement = modalElement.querySelector(".modal-content") as HTMLImageElement;
const closeModal: HTMLElement = modalElement.querySelector(".close") as HTMLElement;
console.log(closeModal);

const imageUrls: string[] = [
    "./game_images/galatigoo-1.webp",
    "./game_images/galatigoo-2.webp",
    "./game_images/galatigoo-3.webp"
];

function populateGallery(urls: string[]) {
    urls.forEach(url => {
        const img: HTMLImageElement = document.createElement("img");

        img.src = url;
        img.addEventListener("click", () => openModal(url));

        galleryElement.appendChild(img);
    });
}

function openModal(imageUrl: string) {
    modalImage.src = imageUrl;
    modalElement.classList.remove("hidden");
}

function closeModalHandler() {
    modalElement.classList.add("hidden");
    modalImage.src = "";
}

closeModal.addEventListener("click", closeModalHandler);

populateGallery(imageUrls);
