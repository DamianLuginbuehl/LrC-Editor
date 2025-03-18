
function init() {
    getAllGalleries();

    centerLoadingWindow();

    const cursor = document.querySelector('#custom-cursor');

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;

    });

    document.addEventListener("mouseenter", () => {
        cursor.style.display = 'block'
    });

    document.addEventListener("mouseleave", () => {

        cursor.style.display = 'none'
    });

}

document.addEventListener('contextmenu', event => event.preventDefault());

async function getAllGalleries() {
    const galleries = await window.electronAPI.getAllGalleries();

    let buttonList = ''

    for (let i = 0; i < galleries.length; i++) {
        buttonList += `<button class="gallery-button retroborder" data-gallery-name="${galleries[i]}" onclick="selectGallery('${galleries[i]}')" onmouseenter="setCursor('pointer')" onmouseleave="setCursor()">
                <p class="gallery-name">${galleries[i].slice(9)}</p>
                <p class="gallery-date">${galleries[i].slice(0, 4)}/${galleries[i].slice(4, 6)}/${galleries[i].slice(6, 8)}</p>
            </button>`
    }

    document.querySelector('#gallery-list').innerHTML = buttonList;
}


/** loading window */
function centerLoadingWindow() {
    let loadingWindow = document.querySelector('#loadingwindow');
    let loadingWindowParent = document.querySelector('#content');
    loadingWindow.style.top = loadingWindowParent.offsetTop + (loadingWindowParent.offsetHeight / 2) - (loadingWindow.offsetHeight / 2) + 'px';
    loadingWindow.style.left = loadingWindowParent.offsetLeft + (loadingWindowParent.offsetWidth / 2) - (loadingWindow.offsetWidth / 2) + 'px';
}


/** Progress bars */


function initProgressBar(element, progressBarHeight = '54px') {
    let progrssBarContainer = document.querySelector(element + ' .progress-bar');
    let numberOfElements = Number(progrssBarContainer.getAttribute('data-progress-count'));
    let progressBarWidth = String((20 * numberOfElements) + 8) + 'px';
    progrssBarContainer.style.width = progressBarWidth;
    progrssBarContainer.style.height = progressBarHeight;
}

function setProgressBar(element, percentage = 0) {
    if (percentage > 100) {
        percentage = 100
    }

    if (percentage < 0) {
        percentage = 0
    }
    let progrssBarContainer = document.querySelector(element + ' .progress-bar');
    let numberOfTotalElements = Number(progrssBarContainer.getAttribute('data-progress-count'));

    let numberOfShownElements = numberOfTotalElements / 100 * percentage;
    if (numberOfShownElements == numberOfTotalElements && percentage < 96) {
        numberOfShownElements = numberOfTotalElements - 1
    }

    let progressBarElements = ""


    for (let i = 0; i < numberOfShownElements; i++) {
        progressBarElements += `<div class="progress-bar-element" style="display: block;"></div>`
    }

    progrssBarContainer.innerHTML = progressBarElements
}


/** gallery selection */















function setCursor(type = 'default') {
    const cursor = document.querySelector('#custom-cursor');
    switch (type) {
        case 'pointer':
            cursor.setAttribute('data-cursor', 'pointer')
            break;

        default:
            cursor.setAttribute('data-cursor', 'default')
            break;
    }
}


function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "-toolbar")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "-toolbar").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX - elmnt.offsetLeft;
        pos4 = e.clientY - elmnt.offsetTop;
        document.onmouseup = () => { closeDragElement(elmnt) };
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:

        pos1 = e.clientX - pos3;
        pos2 = e.clientY - pos4;
        // set the element's new position:
        elmnt.style.top = (pos2) + "px";
        elmnt.style.left = (pos1) + "px";

        moveWindowsInbound()


    }

    function closeDragElement(elmnt) {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}


window.addEventListener('resize', (e) => {
    moveWindowsInbound()

    /** external function */
    centerLoadingWindow()
})
