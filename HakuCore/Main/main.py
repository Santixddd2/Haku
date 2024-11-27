
'''
This is the file where the main promt is executed, this promt identified the funcion to 
execute, chose the promt and the respective funcion to the promt.
'''

import os
from groq import Groq
from HakuCore.Promts.promtManager import charge_promts,charge_functions
from HakuCore.Main.json_helpers import extract_json
from HakuCore.Conf.conf import groq_api_key
import whisper

class Haku():
    def __init__(self,main_promt):
        self.api_key=groq_api_key
        self.promts_list=charge_promts()
        self.main=self.promts_list[main_promt]
        self.functions=charge_functions()
        self.trans_model=whisper.load_model("small")
        self.state="free"
        
    def main_funcion(self,promt):
        iter=0
        while True:
            iter=iter+1
            print("iterations: ",iter)
            client = Groq(
            api_key=self.api_key,
            )
            chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "assistant",
                    "content": self.main
                },
                {
                    "role": "user",
                    "content": promt,
                }
            ],
            model="llama-3.1-70b-versatile",
            )
            response=chat_completion.choices[0].message.content
            json_function = extract_json(response)

            if json_function:
                is_action = json_function[0]['is_action']
                choosed_action = json_function[0]['choosed_action']
                promt_agent = json_function[0]['promt_agent']
                if is_action=="True":
                    try:
                        key=choosed_action
                        role=self.promts_list[key+".txt"]
                        message=self.functions[key].main(promt_agent,role)
                        return message
                    except:
                        pass  
            else:
                pass
            
    def transcript(self,audio):
        #try:            
            petition=self.trans_model.transcribe(audio)
            petition=petition['text']
            print("Audio_path: ",audio)
            print("Petition: ",petition)
            if len(petition)<=1:
                return "Peticion vacia, señor"
            else: 
                answer=self.main_funcion(petition)
                return answer
        #except:
            #return "Hubo un problema con la peticion, señor"

    def queue(self,petition):
        return 0

            





