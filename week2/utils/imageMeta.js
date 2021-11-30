'use strict';
const ExifImage = require('exif').ExifImage;

const getCoordinates = (imgFile) => {
    return new Promise((resolve, reject) => {
        try {
            new ExifImage({ image: imgFile }, (error, exifData) => {
                if (error) {
                    reject(error);
                } else {
                    console.log('get coordinates', exifData);
                    if (!exifData.gps.GPSLatitude) {
                        resolve([24.74, 60.24]);
                        return;
                    }
                    const lat = gpsToDecimal(
                        exifData.gps.GPSLatitude,
                        exifData.gps.GPSLatitudeRef
                    );
                    const lon = gpsToDecimal(
                        exifData.gps.GPSLongitude,
                        exifData.gps.GPSLongitudeRef
                    );
                    const coordinates = [lon, lat];
                    resolve(coordinates);
                }
            });
        } catch (error) {
            reject(error);
        }
    });
};

const gpsToDecimal = (gpsData, hem) => {
    let d =
        parseFloat(gpsData[0]) +
        parseFloat(gpsData[1] / 60) +
        parseFloat(gpsData[2] / 3600);
    return hem === 'S' || hem === 'W' ? (d *= -1) : d;
};

module.exports = {
    getCoordinates,
};
