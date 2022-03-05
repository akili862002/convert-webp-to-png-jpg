/**
 * @Copyright Dung Nguyen - Surtin
 *
 * @using
 *  - yarn dev <YOUR_FOLDER_DIR> <EXT_OUTPUT>
 *
 * @example: yarn dev /Users/surtin/Documents/Images/MyWebpImage .png
 */
const webp = require('webp-converter');
const fs = require('fs');
const path = require("path");
webp.grant_permission();

const folderPath = process.argv[2];
const extOut = process.argv[3] || ".jpg";

console.log("[INIT]");
console.log("  |--> Folder path      : ", folderPath);
console.log("  |--> Extention convert: .webp -> ", extOut);


const getAllFileNamesOfFolder = (path: string) =>
    new Promise<string[]>((resolve, reject) => {
        fs.readdir(path, (err: any, files: string[]) => {
            if (err) reject(err);
            resolve(files)
        });

    });

type IFile = {
    name: string;
    children?: IFile[];
}

const convertImage = (currPath: string) =>
    new Promise((resolve, reject) => {
        const imageFileName = path.basename(currPath);

        const inputPath = currPath;
        const outputPath = currPath.replace(".webp", extOut);
        const result = webp.cwebp(inputPath, outputPath, "-q 100");
        result.then(() => {
            console.log(` |-> CONVERTED: ${inputPath.replace(folderPath, "")}`)
            fs.unlinkSync(currPath);
            resolve(true);
        }).catch(reject);
    })

let webpPaths: string[] = []
const getAllWebpPaths = async (currPath: string): Promise<string[]> => {
    const filenames = await getAllFileNamesOfFolder(currPath);
    for (let filename of filenames) {
        if (filename.includes(".webp")) {
            webpPaths.push(path.join(currPath, filename));
        }
        if (!filename.includes(".")) {
            await getAllWebpPaths(path.join(currPath, filename))
        }
    }
    return webpPaths;
}

const main = async () => {
    try {
        console.log("------------------");
        console.log("START CONVERTING");
        console.log("------------------");
        const webpPaths = await getAllWebpPaths(folderPath);
        for (let path of webpPaths) {
            convertImage(path);
        }
    } catch (err) {
        console.error(err);
    }
}

main();
