
from flask import Flask, request, jsonify,render_template
import os
import io
from Main.main import Haku
from pydub import AudioSegment


app=Flask(__name__)

temp_audios = os.getenv("TEMP_AUDIOS")
global_haku=Haku("mainPromt.txt")
    
@app.route('/')

def index():
    return render_template('index.html')


@app.route('/listen',methods=['POST'])
def listen():
    audio=request.files['audio']
    audio_bytes=audio.read()
    audio_filename = 'temp.ogg'  
    audio_path = os.path.join(temp_audios, audio_filename)
    audio_segment = AudioSegment.from_file(io.BytesIO(audio_bytes))
    audio_segment = audio_segment.set_channels(1)
    audio_segment.export(audio_path, format='ogg')
    answer=global_haku.transcript(audio_path)
    os.remove(audio_path)
    return jsonify({'response': answer})

if __name__ == '__main__':
    app.run(debug=True)
