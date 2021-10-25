let slider = document.getElementById('slider');
let sliderTooltip = document.getElementsByClassName('noUi-tooltip');
let Handle = document.getElementsByClassName('noUi-touch-area');
let trim = document.querySelectorAll('input[name="trim"]')[0];
let buttonDownload = document.getElementsByTagName('button')[1];
let buttonInfo = document.getElementsByTagName('button')[0];
let loader = document.querySelectorAll('#loader')[0];
let arrow = document.querySelectorAll('.arrow')[0];

trim.addEventListener("change", function(){
	slider.classList.toggle('disabled');
}, true)

buttonDownload.addEventListener("click", function(){
	sendRequestToDownload()
}, true)

buttonInfo.addEventListener("click", function(){
    sendURL()
}, true)

arrow.addEventListener("click", function(){
    let center1 = document.querySelectorAll('.center')[1];
	let center0 = document.querySelectorAll('.center')[0];
	center0.classList.toggle('noVisibility');
	center1.classList.toggle('noVisibility');
}, true)