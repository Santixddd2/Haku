'''
This is the configuration document, here you can define your new functions :D

The first variables is a dic that have the file and the main module for the task that you wnat to do
'''
import os


#Routes

func_route='Functions absolute route '
files_route='Files absolute route to upload'
temp_route='Temp route to audio files'

#Api keys
groq_api_key=os.environ.get("GROQ_API_KEY")

#Functions
functions={"FilesM":"files.py"}

#Model options

model_name='llama3-70b-8192'

