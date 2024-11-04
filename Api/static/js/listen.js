
let chunks = [];
let recorder = null;
var text=null;
const recognition= new webkitSpeechRecognition();
recognition.lang='es-ES';
recognition.continuous=true;
//let audio_response=null;

function start_recognition(){
    console.log("Starting...")

    recognition.onstart=()=>{
        console.log("recording");
        recorder.start();
    }

    recognition.onresult=event=>{
        for(const i of event.results){
            text=i[0].transcript;
            console.log(text)
        }
        recognition.stop();
    
    }

    recognition.addEventListener('end',()=>{
        console.log("end recognition")
        recorder.stop();
        recognition.start();
    })

    
    recognition.start();
}


function SetupAudio(){
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
        navigator.mediaDevices.getUserMedia
        ({
            audio: true
        }).then(setupStream)
        .catch(err => {
            console.err(err)
        });
    }
}

function setupStream(stream){
    console.log("Up set")
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = e =>{
        chunks.push(e.data);
    }
    recorder.onstop = e =>{
        const blob = new Blob(chunks,{type: "audio/ogg; codecs=opus"});
        chunks = [];
        if (text.includes('haku') || text.includes('jaku') || text.includes('jacu') || 
        text.includes('Jacob') || text.includes('Jack')){
            send_order(blob)
            console.log("sent")
            recognition.start();
    }
    }

}

function send_order(blob){
    console.log("sending...")
    const formData = new FormData();
    formData.append('audio', blob, 'recording.ogg');
    $.ajax({
        type: "POST",
        url: "/listen",
        data: formData,
        processData: false, 
        contentType: false, 
        success: function(result) {
            const audio_response = result['response'];
            speech_answer(audio_response);
        },
        error: function(xhr, status, error) {
            console.error("Error:", error);
        }
    });

}

function speech_answer(audio_response){
    let speech=new SpeechSynthesisUtterance();
    let voices=window.speechSynthesis.getVoices();
    speech.voice=voices[1]
    speech.text=audio_response;
    console.log("model: ",audio_response)
    window.speechSynthesis.speak(speech);
}


SetupAudio();
start_recognition();