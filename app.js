
// Express code to expose endpoints for file upload and list files
const express = require("express");
const app = express();
const fileUpload = require("express-fileupload");
app.use(fileUpload());

const uploadVideo = require("./uploadVideos");


//upload video to AWS s3
app.post('/upload/videos', async function (req, res) {

    try {
        const videos = await uploadVideo.uploadToS3(req.files.file);
        res.status(200).send({ videos });
    } catch (error) {
        res.status(400).send({ message: 'file formate is not video/mp4, pease upload mp4 file' });
    }
})

//Get Videeos list from AWS 
app.get('/get/videos/url', async function (req, res) {
    try {
        const uploadedVideoList = await uploadVideo.listFilesFromS3();
        res.status(200).send(
            statusCode = 200,
            body = JSON.stringify(uploadedVideoList),
        );
    } catch (error) {
        res.status(400).send(
            statusCode = 500,
            body = JSON.stringify({ error: error.message }),
        );
    }
})



//SERVR
const port = 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});



