/** Request gallery data (Replaces WebSocket `client.to.server`) */
async function selectGallery(name) {
    window.electronAPI.sendMessage({
        type: 'galleryRequest',
        name: name
    });
}

window.electronAPI.onMessage((data) => {
    processSocketMessage(data)
});


function processSocketMessage(data) {
    if (data.type == 'galleryRequestResponse') {
        if (data.response == `galleryFolderFound`) {
            let allGalleryButtons = document.querySelectorAll('.gallery-button');
            for (let i = 0; i < allGalleryButtons.length; i++) {
                allGalleryButtons[i].classList.remove('selected')
                allGalleryButtons[i].classList.add('deactivated')
            }
            setProgressBar('#loadingwindow', 0)
            document.querySelector('#loadingwindow .windowtitle').innerHTML = 'Checking Gallery Integrity...'
            document.querySelector('#loadingwindow').style.display = 'block'
            centerLoadingWindow();
        }
        else if (data.response == `galleryLoadingFinished`) {
            document.querySelector(`.gallery-button[data-gallery-name="${data.galleryName}"]`).classList.add('selected')
            document.querySelector('#loadingwindow').style.display = 'none'
            let allGalleryButtons = document.querySelectorAll('.gallery-button');
            for (let i = 0; i < allGalleryButtons.length; i++) {
                allGalleryButtons[i].classList.remove('deactivated')
            }
        }
        else if (data.response == `galleryCheckingContents`) {
            setProgressBar('#loadingwindow', 0)
            document.querySelector('#loadingwindow .windowtitle').innerHTML = 'Loading Content...'
        }
    }
    else if (data.type == 'loadingWindowPercentage') {
        setProgressBar('#loadingwindow', Number(data.percentage))
    }
}