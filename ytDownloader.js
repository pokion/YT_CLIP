const fs = require('fs');
const ytdl = require('ytdl-core');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
const Downloader = require('nodejs-file-downloader');

function ytHelper(){


	this.download = (info) => {

		/*
			do tej funkcji trzeba przekazać parametry takie jak
			{
				url: link do yt *string
				directory: gdzie mają się pobrać pliki *string
				download: ile procent filmiku ma się pobrać albo procentowo np ("1:03" albo "30") <- 30 jest brana jako 30 sekund jeżeli nie ma parametru true w isPrecentage *string
				isPrecentage: tutaj dodajemy parametr TRUE jeżeli chcemy wyżej wpisać procenty *boolean
				progress: tutaj możemy dać funkcję jeśli chcemy otrzymać ile procent pobrało filmiku *function
				onEnd: tutaj możemy dać funkcję jeśli chcemy coś zrobić po pobraniu pliku i jego zapisaniu  *function
			}
		*/


		if (!info) throw new Error('You need to pass info about file');
		if (!info.url) throw new Error("You need to pass url");

		let howMuchToDownload = (info.download.split(':').length < 2) ? info.download : Number(info.download.split(':')[0]) * 60 + Number(info.download.split(':')[1]); 

		ytdl.getInfo(info.url).then(val => {

			let directory = info.directory || './';
			let fileName = info.fileName || val.player_response.videoDetails.videoId;
			let extension = info.extension || val.formats[0].container;
			let progress = info.progress || null;
			let url = val.formats[0].url;


			let percentageVideoToDownload = (info.isPrecentage) ? Number(howMuchToDownload) : (Math.ceil((Number(howMuchToDownload) / Number(val.player_response.videoDetails.lengthSeconds)) * 100)) + 5;

			const downloader = new Downloader({
				url: url,
				directory: directory,
				filename: fileName + '.' + extension,
				onProgress: async (percentage,chunk,remainingSize) => {
					if (progress){ progress(percentage,chunk,remainingSize);}

					if(percentage >= percentageVideoToDownload){
						
						fs.rename(directory+ fileName + '.' + extension +'.download', directory+ fileName + '.' + extension, err => {
           					if (err) console.log(err)
           				})

           				downloader.cancel();
					}
				}
			})


			async function downloadInitial(){
				try{
					await downloader.download();
				}catch(err){
		
					if(err.code === 'ERR_REQUEST_CANCELLED'){

						info.onEnd({
							downloadLength: howMuchToDownload,
							path: directory,
							fileName,
							extension
						})
					}else{
						console.log(err)
					}
				}
			}

			downloadInitial();
		})
	}
	
	this.trim = (path, start, end, output, onEnd) => {

		let begin = (start.split(":").length < 2) ? Number(start) : Number(start.split(":")[0]) * 60 + Number(start.split(":")[1]);
		let stop = (end.split(":").length < 2) ? Number(end) : ((Number(end.split(":")[0]) * 60 + Number(end.split(":")[1])) - begin);
		console.log(begin,stop,"trim")
		ffmpeg(path)
  			.setStartTime(begin)
  			.setDuration(stop)
  			.output(output)
  			.on('end', function(err) {
  			  if(!err) { console.log('conversion Done') }
  			})
  			.on('error', function(err){
  			  console.log('error: ', err)
  			}).on('end', ()=>{
  				onEnd()
  			}).run()
	}

	this.info = (infoUrl, grabInfo) => {
		ytdl.getInfo(infoUrl).then(val =>{
			grabInfo(val)
		})
	}

}


module.exports = ytHelper;