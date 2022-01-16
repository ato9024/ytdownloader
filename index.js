var express = require("express");
var app = express();
var ytdl = require("ytdl-core");
var path = require("path");
var url = require('url');
var ejs = require('ejs');
var port = process.env.port || 3000;

// Built in middleware
const staticPath = path.join(__dirname, "/public")

app.use(express.static(staticPath));

app.set("view engine", "ejs");

// Create a new route \ to serve this index.ejs in your index.js
app.get("/", (req, res) => {
    return res.render("index");
});

app.get("*", (req, res) => {
    res.render("404page");
})
// Create a \download Route 
// Create a route that will pass the parameter url to download view.
// YT Music Downloader
app.get('/ytMusic', async (req, res) => {
    var VideoURL = req.query.url;     
    if(VideoURL.indexOf("https://www.youtube.com/watch?v=") != -1){
        const v_id = VideoURL.split('v=')[1];
        const info = await ytdl.getInfo(req.query.url);
        return res.render("ytMusic", {
            originalUrl : VideoURL,
            url: "https://www.youtube.com/embed/" + v_id,
            videoID : v_id,
            info: info.formats.sort(),
            infoDetail : info.videoDetails,
        });
    }else if(VideoURL.indexOf("https://youtu.be/") != -1){
        const v_id = VideoURL.split('v=')[1];
        const info = await ytdl.getInfo(req.query.url);
        return res.render("ytMusic", {
            originalUrl : VideoURL,
            url: "https://www.youtube.com/embed/" + v_id,
            videoID : v_id,
            info: info.formats.sort(),
            infoDetail : info.videoDetails,
        });
    }

});
// YT Video Downloader
app.get('/ytVideo', async (req, res) => {
    var VideoURL = req.query.url;     
    if(VideoURL.indexOf("https://www.youtube.com/watch?v=") != -1){
        const v_id = VideoURL.split('v=')[1];
        const info = await ytdl.getInfo(req.query.url);
        return res.render("ytVideo", {
            originalUrl : VideoURL,
            url: "https://www.youtube.com/embed/" + v_id,
            videoID : v_id,
            info: info.formats.sort((a, b) => {
                return a.itag < b.itag;
            }),
            infoDetail : info.videoDetails,
        });
    }else if(VideoURL.indexOf("https://youtu.be/") != -1){
        const v_id = VideoURL.split('v=')[1];
        const info = await ytdl.getInfo(req.query.url);
        return res.render("ytVideo", {
            originalUrl : VideoURL,
            url: "https://www.youtube.com/embed/" + v_id,
            videoID : v_id,
            info: info.formats.sort((a, b) => {
                return a.itag < b.itag;
            }),
            infoDetail : info.videoDetails,
        });
    }

});

// get request from download
app.get('/start', async (req, res) => {

    const originalurl  = req.query.originalURL;
    const fileName  = req.query.vidName;
    var iTag = url.parse(req.query.formatTag, true);
    iTag = iTag.query.itag;
 
    if(iTag == 251 || iTag == 140 || iTag == 258 || iTag == 256 || iTag == 250 || iTag == 249){
        res.header("Content-Disposition",`attachment; filename="alltool.online_${fileName}.mp3"`);
    }else{
        res.header("Content-Disposition",`attachment; filename="alltool.online_${fileName}.mp4"`);
    }

    ytdl(originalurl, {filter: format => format.itag == iTag}).pipe(res);
});


    
// OUR ROUTES WILL GO HERE
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
    

