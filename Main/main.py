
'''
This is the file where the main promt is executed, this promt identified the funcion to 
execute, chose the promt and the respective funcion to the promt.
'''
import os
from groq import Groq
from Promts.promtManager import charge_promts
from json_helpers import extract_json
from actions.files.main_files import main_files

promts_list=charge_promts()

main=promts_list["mainPromt.txt"]

client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)
chat_completion = client.chat.completions.create(
    messages=[
        {
            "role": "system",
            "content": main
        },
        {
            "role": "user",
            "content": "Crea un archivo de texto con un poema adentro"
        }
    ],
    model="llama3-8b-8192",
)
response=chat_completion.choices[0].message.content
print(response)
json_function = extract_json(response)

if json_function:
    is_action = json_function[0]['is_action']
    choosed_action = json_function[0]['choosed_action']
    promt_agent = json_function[0]['promt_agent']
    if is_action=="True":
        if choosed_action=="Files":
            main_files(promts_list["AdministrarArchivos.txt"],promt_agent)        
else:
    print("Something went wrong")
