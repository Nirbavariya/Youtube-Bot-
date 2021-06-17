const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended:true}));
const api_key = "AIzaSyAXjgnBusuNsmhqKhHnV70qlSvq8FzWeFs" ;


app.get("/",function(req,res){
    res.sendFile(__dirname + "./public/index.html");
});
app.post("/",function(req,res){
    const query = JSON.stringify(req.body.query);
    const url = 'https://www.googleapis.com/youtube/v3/search?key=' + api_key + '&type=video&part=snippet&maxResults=1&q=' + query ;
    //res.send("Successfully received your request.");
    //console.log(req.body.query);
    https.get(url,function(response){
        console.log(response.statusCode);
        var content = '';
        response.on("data",function(data){
           //console.log(data);hexadecimal nos
           /*const realData = JSON.parse(data.toString());
           console.log(realData);*/
           content+= data.toString();
        });//there were buffer instance of data , so JSON did not parse the space and stuff so stopped at middle without entrire data so we use "end"
        response.on("end",function(){
            const realData = JSON.parse(content);
            //console.log(realData.items[0].snippet.title);
            const vidTitle = realData.items[0].snippet.title;
            const channelTitle = realData.items[0].snippet.channelTitle;
            const thumbnail = realData.items[0].snippet.thumbnails.medium.url;
            const videoID = realData.items[0].id.videoID;
            const videoURL = "https://www.youtube.com/embed/" + videoID;
            res.write('<body style="background-color:#6b80b1;margin:20px;color:powderblue;text-align:center"></body>');
            res.write("<h1>" + vidTitle + "</h1>");
            res.write("<h2>" + channelTitle + "</h2>");
            res.write("<img src=" + thumbnail + " /><br><br>");
            res.write("<iframe src=" + videoURL + " width='420' height='315'>Your browser is not supporting this video</iframe>");
            res.send();
        });
        
        
        
    });
        
    
});
const port = process.env.PORT;
app.listen(3000 || port,function(){
    console.log("Server started on port 3000!");
});


