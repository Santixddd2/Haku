'''
This is the configuration document, here you can define your new functions :D

The first variables is a dic that have the file and the main module for the task that you wnat to do
'''
import os


#Routes
func_route='C:/Users/SANTIAGO/Documents/Haku/Haku/HakuCore/Main/actions'
files_route='C:/Users/SANTIAGO/Documents/Haku/Haku/HakuCore/Main/actions'
temp_route='C:/users/santiago/Documents/Haku/Haku/HakuServer/temp'

#Api keys
groq_api_key=os.environ.get("GROQ_API_KEY")

#Functions
functions={"FilesM":"files.py"}

#Model options

model_name='llama3-70b-8192'

