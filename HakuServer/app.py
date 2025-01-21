
from flask import Flask, request, jsonify,render_template
from flask_cors import CORS
import os
import io
#from HakuCore.Main.main import Haku
from HakuCore.Main.main import Haku
from pydub import AudioSegment


app=Flask(__name__)

CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

temp_audios = os.getenv("TEMP_AUDIOS")
global_haku=Haku()
haku_memory=global_haku.instance_haku_memoryTools()
    
@app.route('/')

def index():
    return render_template('index.html')


@app.route('/listen',methods=['POST'])
def listen():
    while global_haku.state=="busy":
        print("Haku is busy")
        pass
    audio=request.files['audio']
    audio_bytes=audio.read()
    audio_filename = 'temp.ogg'  
    audio_path = os.path.join(temp_audios, audio_filename)
    audio_segment = AudioSegment.from_file(io.BytesIO(audio_bytes))
    audio_segment = audio_segment.set_channels(1)
    audio_segment.export(audio_path, format='ogg')
    answer=global_haku.transcript(audio_path)
    return jsonify({'response': answer,'audio_path':audio_path})


@app.route('/read',methods=['POST'])
def read():
    petition = request.json
    order = petition.get('order')
    nPetition = petition.get('nPetition')
    answer,nPetition=global_haku.main_funcion(order,haku_memory,nPetition)
    print(answer)
    return jsonify({'answer': answer,'nPetition': nPetition})
    
if __name__ == '__main__':
    app.run(host='0.0.0.0',port=5000,debug=True)
