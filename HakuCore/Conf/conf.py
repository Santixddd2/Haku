'''
This is the configuration document, here you can define your new functions :D

The first variables is a dic that have the file and the main module for the task that you wnat to do
'''
import os

'''General options'''
#Routes
func_route_do='C:/Users/SANTIAGO/Documents/Haku/Haku/HakuCore/Main/tools/normalTools'
files_route='C:/Users/SANTIAGO/Documents/Haku/Haku/HakuCore/Main/tools/normalTools'
temp_route='C:/users/santiago/Documents/Haku/Haku/HakuServer/temp'

#Api keys
groq_api_key=os.environ.get("GROQ_API_KEY")

#Do Functions

functions={"FilesM":"files.py"}

#Structured agents
'''
Agents = {
    "File Management Tools and Model": ["files.py", "llama3-70b-8192"],  # Handles file creation and management
    "Code Generation Tools and Model": ["", "qwen-2.5-coder-32b"],  # Specializes in writing and analyzing code
    "Natural Language Processing Tools": ["", "deepseek-r1-distill-llama-70b"]  # Generates and processes human-like text
}
'''

Agents = {
    "File Management to the software application": ["files.py", "llama3-70b-8192"],  # Handles file creation and management
    "Code Generation to the software application": ["", "qwen-2.5-coder-32b"],  # Specializes in writing and analyzing code
}



#Model options

#model_name='deepseek-r1-distill-qwen-32b'
main_model_name='llama3-70b-8192'

init_promt='''Eres Haku. Un asistente virtual que me ayuda en mis proyectos de matematicas y software. 
Te refieres a mi como señor. Primero crea un orden de ejecucion para la tarea que se te asigne '''

'''Specific options'''

#File options

main_route='C:/UsersSANTIAGO'



