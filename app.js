const fs = require('fs');
const ytDownloader = require('./ytDownloader.js');
let bodyParser = require('body-parser')
const express = require('express');
const path = require('path');
const app = express();
const port = 8080;
let jsonParser = bodyParser.json()
let YT = new ytDownloader;
let downloading = [];

app.use(express.static('static'))
app.use(jsonParser)

app.get('/', (req, res)=>{
	res.sendFile(path.join(__dirname, '/index.html'));
})

app.post('/sendvid', (req, res)=>{
	let vidId = req.body.id
	let index = req.body.index

	if(downloading[index].percent.stage == "done"){
		res.download(downloading[index].percent.path, vidId,(err)=>{
			console.log(err)
		})
	}else{
		res.status(404).send({
			err: "Wrong request"
		})
	}
	
})

app.post('/progress', (req, res)=>{
	let vidId = req.body.id
	let index = req.body.index

	if(downloading[index].id == vidId){
		res.send({
			status: downloading[index]
		})
	}else{
		res.send({
			err: "Bad id video"
		})
	}
})

app.post('/download', (req, res)=>{

	if(req.body.url.split("https://www.youtube.com/watch?v=").length > 1 || req.body.url.split("https://youtu.be/").length > 1){

		YT.info(req.body.url, (val)=>{

			if(val.player_response.videoDetails.lengthSeconds <= 600){
					let o = (req.body.trim) ? req.body.sliderVal[1] + "" : 100

					let id = val.videoDetails.videoId
					downloading.push({id, percent:0})
					let place = 0;
					downloading.forEach((el,index)=>{
						if(el.id == id){
							place = index
							console.log(el,index)
						}
					})
					res.send({
						id,
						index: place
					})
					console.log(downloading)
					YT.download({
						url: req.body.url,
						directory: "./download/",
						download: Math.floor(o) + "",
						isPrecentage: !req.body.trim,
						progress: (val)=>{console.log(val)
							downloading[place].percent = val
						},
						onEnd: (val) => {
							console.log('koniec',val);
							let start = Math.floor(req.body.sliderVal[0]);
							let duration = Math.abs(start - Math.floor(req.body.sliderVal[1]))
							console.log(start, duration, "onEnd")

							YT.trim(val.path + val.fileName + "." + val.extension, start+"", duration+"", `./${val.fileName}.${val.extension}`, ()=>{
								downloading[place].percent = {stage: "done", path: `./${val.fileName}.${val.extension}`};

							})
						}
					})
			}else{
				res.status(418).send({
					err: "video is too long max 10 minutes"
				})
			}

		})
		
	}else {
		res.status(406).send({
			err: "Bad url"
		})
	}
})

app.post('/info', (req, res)=>{

	if(req.body.url.split("https://www.youtube.com/watch?v=").length > 1 || req.body.url.split("https://youtu.be/").length > 1){
		YT.info(req.body.url, (val)=>{

			if(val.player_response.videoDetails.lengthSeconds <= 600){
				res.send(val)
			}else{
				res.status(418).send({
					err: "video is too long max 10 minutes"
				})
			}

		})
	}else {
		res.status(406).send({
			err: "Bad url"
		})
	}

})

app.listen(port);