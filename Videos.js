require("dotenv").config()

const AWS = require("aws-sdk");
AWS.config.update({
    secretAccessKey: process.env.ACCESS_SECRET,
    accessKeyId: process.env.ACCESS_KEY,
    region: process.env.REGION,
});

const s3 = new AWS.S3();

// Function to upload file to S3
exports.uploadToS3 = (file) => {
    return new Promise((resolve, reject) => {
        if (file.mimetype === "video/mp4") {
            const params = {
                Bucket: process.env.BUCKET_NAME,
                Key: file.name,
                Body: file.data,
                ContentType: file.mimetype,
            };

            s3.upload(params, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        } else if (file.mimetype === "application/json") {
            console.log(file);
            resolve(file);
        } else {
            reject(new Error("Unsupported file type"));
        }
    })


};


// Function to list files from S3
exports.listFilesFromS3 = async (req, res) => {

    const params = {
        Bucket: process.env.BUCKET_NAME
    };

    const s3Data = await s3.listObjectsV2(params).promise();
    const videos = s3Data.Contents.map((video) => {
        return {
            link: `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/${video.Key}`,
            metadata: video.Metadata,
        };
    });
    return (videos)


};
