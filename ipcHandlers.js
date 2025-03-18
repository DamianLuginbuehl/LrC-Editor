import Store from "electron-store";
import { ipcMain } from "electron";
import * as fs from "fs";
import * as path from "path";

const store = new Store();



console.log(store.get('baseFolderPath'))
const baseFolderPath = '/Users/damian.luginbuehl/Pictures/LrC';

function getFolders(folderPath) {
    return new Promise((resolve, reject) => {
        fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
            if (err) return reject(err);

            const folders = files
                .filter(file => file.isDirectory())
                .map(file => file.name);

            resolve(folders);
        });
    });
}



async function getGalleryData(event, name) {
    try {
        if (!fs.existsSync(`${baseFolderPath}/${name}`)) {
            return;
        }
    } catch (err) {
        //console.error(err);
        return;
    }
    event.sender.send('receive-message', {
        type: `galleryRequestResponse`,
        response: `galleryFolderFound`
    });

    let percentage = 0

    let exportFolder = false;
    let rawFolder = false;

    await new Promise(r => setTimeout(r, 500));
    try {
        if (fs.existsSync(`${baseFolderPath}/${name}/f_raw`)) {


            event.sender.send('receive-message', {
                type: `loadingWindowPercentage`,
                percentage: percentage + 33
            });
            rawFolder = true;
        }
        percentage += 33

        await new Promise(r => setTimeout(r, 300));

        if (fs.existsSync(`${baseFolderPath}/${name}/f_export`)) {

            event.sender.send('receive-message', {
                type: `loadingWindowPercentage`,
                percentage: percentage + 33
            });
            exportFolder = true
        }


        percentage += 33



        await new Promise(r => setTimeout(r, 300));

        const files = fs.readdirSync(`${baseFolderPath}/${name}`);

        // Check if any file ends with .lrdata
        if (files.some(file => file.endsWith('.lrdata'))) {
            event.sender.send('receive-message', {
                type: `loadingWindowPercentage`,
                percentage: percentage + 8
            });
        }
        percentage += 8;

        await new Promise(r => setTimeout(r, 80));

        if (files.some(file => file.endsWith('.lrcat'))) {
            event.sender.send('receive-message', {
                type: `loadingWindowPercentage`,
                percentage: percentage + 8
            });
        }
        percentage += 8

        await new Promise(r => setTimeout(r, 80));

        if (files.some(file => file.endsWith('.lrcat-data'))) {
            event.sender.send('receive-message', {
                type: `loadingWindowPercentage`,
                percentage: percentage + 8
            });
        }
        percentage += 8

        await new Promise(r => setTimeout(r, 80));

        if (files.some(file => file.endsWith('.lrdata'))) {
            event.sender.send('receive-message', {
                type: `loadingWindowPercentage`,
                percentage: percentage + 8
            });
        }
        percentage += 8

        await new Promise(r => setTimeout(r, 80));

    } catch (err) {
        //console.error(err);
        return;
    }


    await new Promise(r => setTimeout(r, 100));

    event.sender.send('receive-message', {
        type: `loadingWindowPercentage`,
        percentage: 100
    });




    event.sender.send('receive-message', {
        type: `galleryRequestResponse`,
        response: `galleryCheckingContents`
    });

    let numberOfElems = 0;
    let numberRaws = [];
    let numberExports = [];
    percentage = 0

    await fs.readdir(`${baseFolderPath}/${name}/f_raw`, (err, folders) => {
        if (err) return //console.error("Error getting folders:", err);

        numberOfElems += folders.length;
        numberRaws = folders;

        // Any code dependent on numberOfElems should go here!
    });
    await fs.readdir(`${baseFolderPath}/${name}/f_export`, (err, folders) => {
        if (err) return //console.error("Error getting folders:", err);

        numberOfElems += folders.length;
        numberExports = folders;

        // Any code dependent on numberOfElems should go here!
    });

    await new Promise(r => setTimeout(r, 1000));


    let percentageIncrease = 100 / numberOfElems






    for (let i = 0; i < numberRaws.length; i++) {
        let stats = fs.statSync(`${baseFolderPath}/${name}/f_raw/${numberRaws[i]}`)
        let fileSizeInBytes = stats.size;
        // Convert the file size to megabytes (optional)
        let fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);


        event.sender.send('receive-message', {
            type: `loadingWindowPercentage`,
            percentage: percentage + percentageIncrease
        });

        percentage += percentageIncrease

        await new Promise(r => setTimeout(r, 10));

    }



    for (let i = 0; i < numberExports.length; i++) {
        let stats = fs.statSync(`${baseFolderPath}/${name}/f_export/${numberExports[i]}`)
        let fileSizeInBytes = stats.size;
        // Convert the file size to megabytes (optional)
        let fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);

        event.sender.send('receive-message', {
            type: `loadingWindowPercentage`,
            percentage: percentage + percentageIncrease
        });
        percentage += percentageIncrease

        await new Promise(r => setTimeout(r, 10));

    }

    await new Promise(r => setTimeout(r, 500));

    event.sender.send('receive-message', {
        type: `galleryRequestResponse`,
        response: `galleryLoadingFinished`,
        galleryName: name,
        data: {},
    });

}



ipcMain.on('send-message', (event, msg) => {
    //let data = JSON.parse(msg)
    let data = msg

    if (data.type == `galleryRequest`) {
        getGalleryData(event, data.name);
    }

    // Send a reply back to the renderer
    event.sender.send('receive-message', `Echo: ${msg}`);
});



// Function to Read Files
ipcMain.handle('get-all-galleries', async (event) => {
    try {
        const folders = await getFolders(baseFolderPath);

        const foldersToDrop = ['_renamer', 'Desktop_Backgrounds']; // Folders to exclude
        const filteredFolders = folders.filter(folder => !foldersToDrop.includes(folder));

        return filteredFolders; // ✅ Now this will properly return to the frontend
    } catch (error) {
        console.error("Error getting folders:", error);
        return [];
    }
});