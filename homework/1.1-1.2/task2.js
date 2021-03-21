const csv = require('csvtojson');
const fs = require('fs');
const { pipeline } = require('stream');

const csvFilePath = './csv/nodejs-hw1-ex1.csv';
const txtFileOutput = './nodejs-hw1-ex2.txt';
const txtFileOutputReadLineByLine = './nodejs-hw1-ex2-line-by-line.txt';

const loadCsvToRam = async () => {
    return await csv().fromFile(csvFilePath);
}

const formatJsonArray = (jsonArray) => {
    return jsonArray.map((value) => {
        return {
            'book': value.Book,
            'author': value.Author,
            'price': value.Price,
        }
    });
}

const createBufferFromArray = (fileArray) => {
    let serializedData = fileArray.map((e) => {
        return JSON.stringify(e);
    });

    let buffer = Buffer.from(serializedData.join("\n"));

    return buffer;
}

const createTxtFile = async (buffer) => {
    await fs.writeFile(txtFileOutput, buffer, 'utf8', (error) => {
        console.log(`File has been written - Error message ${error}`);
    });
}

(async () => {
    //Task 1 - load to CSV to memory and then write to file
    let jsonArray = await loadCsvToRam();
    let formattedJsonArray = formatJsonArray(jsonArray)
    let buffer = createBufferFromArray(formattedJsonArray);
    await createTxtFile(buffer);

    //Task 2 - Read/write using pipeline
    await pipeline(
        fs.createReadStream(csvFilePath),
        fs.createWriteStream(txtFileOutputReadLineByLine),
        (err) => {
            if (err) {
                console.error('Pipeline failed.', err);
            } else {
                console.log('Pipeline succeeded.');
            }
        }
    )

})();
