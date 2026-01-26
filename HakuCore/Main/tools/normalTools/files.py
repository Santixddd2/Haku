'''
This is a class to manage files, it is a function of the agent
'''

#import os 
import requests
from HakuCore.Main.tools.toolChargerAi.functionsManager import no_tool
#from langchain_core.tools import tool
from HakuCore.Conf.conf import main_route
import shutil

url = "http://192.168.80.18:5000/read" 
route="C:/Users/SANTIAGO/Documents/Haku_Files"

def create_file(name,ext):
    """ use this if the user ask for create a new file in the specified route"""
    try: 
        file_route=route+"/"+name+"."+ext
        file = open(file_route, "w")
        file=file
        return "Archivo creado correctamente"
    except:
         raise ValueError("Algo fallo al crear el archivo")
    

def write_file(content,name):
    """Use this if the user ask form write the content into the specified route"""
    try:       
        file_route=route+"/"+name     
        file = open(file_route, "w")
        file.write(content)
        return True
    except Exception as e:
         raise ValueError(f"El archivo no existe en la carpeta de asistente, informa al usuario del error {e}")
     
def read_file(name):
    """Use this if the user ask for read a file to get the content and get an answer from it"""
    file_route=route+"/"+name     
    try:             
        with open(file_route, 'r', encoding='utf-8') as file:
            content = file.read()
        return content
    except:
        raise ValueError("El archivo no existe en la carpeta de asistente, informa al usuario")


def move_file(destiny, name_route):
    """Use this if the user ask for move a file to other directory, 
    take all the route no just the file."""
    try:  
       shutil.move(main_route + "/" + name_route,main_route + "/"+destiny) 
       return "Archivo movido"

    except:
         raise ValueError("Hubo un error con la ruta, no sigas intentando e informa al usuario")
        

'''
def upload_file(self):
    return 0     
def read_file(name,question=""):
    """Read a file to get the content and get an answer from it"""
    file_route=route+"/"+name     
    try:             
        with open(file_route, 'r', encoding='utf-8') as file:
            content = file.read()
            #answer=send_content(content)
        url = "http://192.168.80.18:5000/read" 
        if content!=None or content!="":
            data = {
            "order": content+question,
             "nPetition": 0  }
            response = requests.post(url, json=data)
            if response.status_code == 200:
                answer = response.json()
                return answer
            else:
                print(f"Error: {response.status_code}, {response.text}")
                return "Hubo un error al responder"
    except:
        return "El archivo no existe en la carpeta de asistente"   
@no_tool
def send_content(content,question):
    if content!=None or content!="":
        data = {
        "order": content+question,
        "nPetition": 0  }
        response = requests.post(url, json=data)
        if response.status_code == 200:
            answer = response.json()
            return answer
        else:
            print(f"Error: {response.status_code}, {response.text}")
            raise ValueError("Hubo un error al responder")
    

'''
