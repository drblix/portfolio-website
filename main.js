const GALATIGOO = 'galatigoo';
const GALATIGOO_MEDIA = 3;

const FNAJ = 'fnaj';
const FNAJ_MEDIA = 3;

let galatigooIndex = 1;
let fnajIndex = 1;

window.addEventListener('load', function(event) {
    this.document.querySelector("body").className = "loaded";
});

/**
 * Links all child elements of detail elements to perform a "fade-in" animation when revealed
 */
document.addEventListener('DOMContentLoaded', function() {
    const detailsElements = document.querySelectorAll('details');

    detailsElements.forEach(function(details) {
        details.addEventListener('toggle', function() {
            for (let i = 0; i < details.children.length; i++) {
                const content = details.children[i];

                // summary button area should not be animated
                if (content.nodeName.toLowerCase() === "summary") {
                    continue;
                }

                if (details.open) {
                    // remove the class first to reset animation
                    content.classList.remove('fade-in');
                    // add the class to start the animation
                    content.classList.add('fade-in');
                } else {
                    // handle the hiding animation
                    content.classList.remove('fade-in');
                }
            }
        });
    });
});

/**
 * Scrolls forwards and backwards thru a specified gallery
 * @param {Element} imgElement The gallery image element to modify
 * @param {string} galleryName The name of the gallery the method is being called from
 * @param {number} change Whether to move to the next image (1) or the previous image (-1)
 */
function galleryButtonPressed(imgElement, galleryName, change) {
    galleryName = galleryName.toLowerCase();

    if (galleryName == GALATIGOO) {
        galatigooIndex = wrap(galatigooIndex + change, 1, GALATIGOO_MEDIA);
        imgElement.setAttribute("src", "images/" + galleryName + "_" + galatigooIndex + ".jpg");
    }
    else if (galleryName == FNAJ) {
        fnajIndex = wrap(fnajIndex + change, 1, FNAJ_MEDIA);
        imgElement.setAttribute("src", "images/" + galleryName + "_" + fnajIndex + ".jpg")
    }
}

/**
 * Wraps a number around the specified parameters. For example, wrap(3, 5, 14) = 12
 * @param {number} num The number to wrap
 * @param {number} min The minimum number to wrap around
 * @param {number} max The maximum number to wrap around
 * @returns 
 */
function wrap(num, min, max) {
    if (max < min){
        return num;
    }

    const rangeSize = max - min + 1;

    if (num < min) {
        return max - (min - num - 1) % rangeSize;
    }

    if (num > max) {
        return min + (num - max - 1) % rangeSize;
    }

    return num;
}