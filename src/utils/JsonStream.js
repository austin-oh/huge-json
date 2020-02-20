const fs = window.require('fs');
const JSONStream = window.require('JSONStream');
const es = window.require('event-stream');

export function readJSONStream(path, fieldName) {
    return new Promise((resolve, reject) => {
        try {
            console.log('[Start to read file]');
            const readStream = fs.createReadStream(path);
            const parseStream = JSONStream.parse(fieldName);

            const timeFrom = Date.now();

            return readStream
                .pipe(parseStream)
                .pipe(es.mapSync(function(data) {
                    const timeTo = Date.now();
                    resolve({
                        data: data,
                        executeTime: timeTo - timeFrom
                    });
                }))            
        } catch(e) {
            reject(e);
        }

    });

}