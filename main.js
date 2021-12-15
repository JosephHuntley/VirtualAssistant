// UI comp
const startBtn = document.createElement("button");
startBtn.innerHTML = "Start listening";
const result = document.createElement("div");
const processing = document.createElement("p");
document.write("<body><h1>My Siri</h1><p>Give it a try with 'hello', 'how are you', 'what's your name', 'what time is it', 'stop', ... </p></body>");
document.body.append(startBtn);
document.body.append(result);
document.body.append(processing);

// speech to text
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let toggleBtn = null;
if (typeof SpeechRecognition === "undefined") {
	startBtn.remove();
	result.innerHTML = "<b>Browser does not support Speech API. Please download latest chrome.<b>";
} else {
	const recognition = new SpeechRecognition();
	recognition.continuous = true;
	recognition.interimResults = true;
	recognition.onresult = event => {
        console.log(event)
		const last = event.results.length - 1;
		const res = event.results[last];
		const text = res[0].transcript;
		if (res.isFinal) {
			processing.innerHTML = "processing ....";

			const response = process(text);
			const p = document.createElement("p");
			p.innerHTML = `You said: ${text} </br>Siri said: ${response}`;
			processing.innerHTML = "";
			result.appendChild(p);

			// text to speech
			speechSynthesis.speak(new SpeechSynthesisUtterance(response));
		} else {
			processing.innerHTML = `listening: ${text}`;
		}
	}
	let listening = false;
	toggleBtn = () => {
		if (listening) {
			recognition.stop();
			startBtn.textContent = "Start listening";
		} else {
			recognition.start();
			startBtn.textContent = "Stop listening";
		}
		listening = !listening;
	};
	startBtn.addEventListener("click", toggleBtn);

}
//Process the text and performs the action.
function process(rawText){
    //let text = rawText.replace(/\s/g, "");
    let text = rawText.toLowerCase();
    var response = null;

    if (text.replace(/\s/g, "") == "stop" || text.replace(/\s/g, "") == "quit" || text.replace(/\s/g, "") == "bye"){
        response = "Bye!!!";
		window.close();
    }else if(text.includes("what time is it")){
        response = new Date().toLocaleTimeString([],{hour: '2-digit', minute: '2-digit' });
    }else if(text.includes("weather")) {
		response = fetch("http://api.weatherapi.com/v1/current.json?key=61f7e164893c46879ba02838211312&q=27606&aqi=yes").then(
			value => { 
				value.json().then(weather => {
				const {temp_f : temp, feelslike_f : feelsLike} =  weather.current
				const {name : city, region} =  weather.location
				return `The current tempature in ${city}, ${region} is ${temp}, but it feels like ${feelsLike}.`
			})	
		})
	}else if (text.includes("hello")){
        response = "Hi, how are you doing?"
    }else {
        window.open(`http://google.com/search?q=${rawText.replace("search", "")}`, "_blank");
        response = `I found some information for ${rawText}`;
    }
	toggleBtn();
    return response
}