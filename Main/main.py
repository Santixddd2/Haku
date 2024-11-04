
'''
This is the file where the main promt is executed, this promt identified the funcion to 
execute, chose the promt and the respective funcion to the promt.
'''

import os
from groq import Groq
from Promts.promtManager import charge_promts
from Main.json_helpers import extract_json
from Main.actions.files.main_files import main_files
from Main.actions.answer.answer import answer_model
import whisper

class Haku():
    def __init__(self,main_promt):
        self.api_key=os.environ.get("GROQ_API_KEY")
        self.promts_list=charge_promts()
        self.main=self.promts_list[main_promt]
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
                    "role": "system",
                    "content": self.main
                },
                {
                    "role": "user",
                    "content": promt,
                }
            ],
            model="llama3-8b-8192",
            )
            response=chat_completion.choices[0].message.content
            json_function = extract_json(response)

            if json_function:
                is_action = json_function[0]['is_action']
                choosed_action = json_function[0]['choosed_action']
                promt_agent = json_function[0]['promt_agent']
                if is_action=="True":
                    if choosed_action=="Files":
                        message=main_files(self.promts_list["AdministrarArchivos.txt"],promt_agent)   
                        self.state="free"    
                        return message 
                    if choosed_action=="Answer":
                        response=answer_model(promt_agent,self.promts_list["Contestar.txt"])
                        self.state="free"    
                        return response
            else:
                pass
            
    def transcript(self,audio):
        if self.state=="busy":
            print("On queque")
        else:
            petition=self.trans_model.transcribe(audio)
            petition=petition['text']
            print("p",petition)
            if len(petition)<=1:
                return "Peticion vacia, señor"
            else: 
               answer=self.main_funcion(petition)
               return answer
            





