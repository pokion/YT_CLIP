//console.log(slider.noUiSlider.get())
let progressInterval;
let resp;

function progress(){
	let xmlhttp = new XMLHttpRequest();

	xmlhttp.onreadystatechange = function(){
		if(xmlhttp.readyState == XMLHttpRequest.DONE){
			if(xmlhttp.status == 200){
				let response = JSON.parse(xmlhttp.response);
				console.log(response)
				console.log(typeof(response.status.percent))
				if(typeof(response.status.percent) == "object"){
					console.log('no jest')
					console.log(typeof(response.status.percent))
					clearInterval(progressInterval);
					download()
				}
			}else {
				clearInterval(progressInterval)
				let response = JSON.parse(xmlhttp.response);
				loader.classList.toggle('noVisibility');
				alert(response.err)
			}
		}
	};
	let data = JSON.stringify(resp)

	xmlhttp.open("POST", "/progress", true);
	xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xmlhttp.send(data)
}

function download(){
	let xmlhttp = new XMLHttpRequest();
	let url = document.querySelectorAll('input[name="url"]')[0].value;
	let sliderVal = slider.noUiSlider.get();
	let trim = document.querySelectorAll('input[name="trim"]')[0].checked;
	let title = document.querySelectorAll('#title')[0];
	let center1 = document.querySelectorAll('.center')[1];
	let center0 = document.querySelectorAll('.center')[0];
	loader.classList.toggle('noVisibility');

	xmlhttp.onreadystatechange = function(){
		if(xmlhttp.readyState == XMLHttpRequest.DONE){
			if(xmlhttp.status == 200){
				console.log(xmlhttp.response)
				let a = document.createElement('a');
				let url = window.URL.createObjectURL(xmlhttp.response)
				a.href = url;
				a.target = "_blank"
				a.download = title.innerHTML + '.mp4';
	            a.click();
	            a.remove();
	            window.URL.revokeObjectURL(url);
	            loader.classList.toggle('noVisibility');
	            center0.classList.toggle('noVisibility');
				center1.classList.toggle('noVisibility');
				url.value = "";

			}else {
				let response = JSON.parse(xmlhttp.response);
				loader.classList.toggle('noVisibility');
				alert(response.err)
			}
		}
	};
	let data = JSON.stringify(resp)

	xmlhttp.open("POST", "/sendvid", true);
	xmlhttp.responseType = "blob";
	xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xmlhttp.send(data)
}

function sendRequestToDownload(){
	let xmlhttp = new XMLHttpRequest();
	let url = document.querySelectorAll('input[name="url"]')[0].value;
	let sliderVal = slider.noUiSlider.get();
	let trim = document.querySelectorAll('input[name="trim"]')[0].checked;
	let title = document.querySelectorAll('#title')[0];
	let center1 = document.querySelectorAll('.center')[1];
	let center0 = document.querySelectorAll('.center')[0];
	loader.classList.toggle('noVisibility');

	xmlhttp.onreadystatechange = function(){
		if(xmlhttp.readyState == XMLHttpRequest.DONE){
			if(xmlhttp.status == 200){
				resp = JSON.parse(xmlhttp.response);
				progressInterval = setInterval(progress, 1000)

			}else {
				let response = JSON.parse(xmlhttp.response);
				loader.classList.toggle('noVisibility');
				alert(response.err)
			}
		}
	};
	let data = JSON.stringify({
		url,
		sliderVal,
		trim
	})

	xmlhttp.open("POST", "/download", true);
	xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xmlhttp.send(data)
}

function sendURL(){
	let xmlhttp = new XMLHttpRequest();
	let url = document.querySelectorAll('input[name="url"]')[0].value;
	let title = document.querySelectorAll('#title')[0];
	let img = document.querySelectorAll('#img')[0];
	let center1 = document.querySelectorAll('.center')[1];
	let center0 = document.querySelectorAll('.center')[0];
	loader.classList.toggle('noVisibility');

	xmlhttp.onreadystatechange = function(){
		if(xmlhttp.readyState == XMLHttpRequest.DONE){
			if(xmlhttp.status == 200){
				let response = JSON.parse(xmlhttp.response);
				console.log(response.player_response.videoDetails.thumbnail)
				title.innerHTML = response.player_response.videoDetails.title;
				img.src = response.player_response.videoDetails.thumbnail.thumbnails[3].url
				center0.classList.toggle('noVisibility');
				center1.classList.toggle('noVisibility');
				loader.classList.toggle('noVisibility');

				noUiSlider.create(slider, {
				    start: [0, Number(response.player_response.videoDetails.lengthSeconds)],
				    connect: true,
				    tooltips: [true, true],
				    step: 1,
				    range: {
				        'min': 0,
				        'max': Number(response.player_response.videoDetails.lengthSeconds)
				    }
				});

				slider.noUiSlider.on("update", function(values, handle){
					let minutes = Math.floor(values[handle] / 60);
					let seconds = Math.ceil(values[handle] - (minutes * 60)) + "";
					sliderTooltip[handle].innerHTML = (seconds.length < 2) ? minutes + ":" + "0" + seconds : minutes + ":" + seconds;
				})

			}else {
				let response = JSON.parse(xmlhttp.response);
				loader.classList.toggle('noVisibility');
				alert(response.err)
			}
		}
	};
	let data = JSON.stringify({
		url
	})

	xmlhttp.open("POST", "/info", true);
	xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xmlhttp.send(data)
}