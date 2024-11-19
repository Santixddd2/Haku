'''
This is the configuration document, here you can define your new functions :D

The first variables is a dic that have the file and the main module for the task that you wnat to do
'''
import os


#Routes
func_route='C:/Users/SANTIAGO/Documents/Haku/Haku/Main/actions/mainPet'
promts_route=os.environ.get("PROMTS_ROUTE")

#Api keys
groq_api_key=os.environ.get("GROQ_API_KEY")

#Functions
functions={"FilesM":"main_files.py","Answer":"answer.py"}

#Model options

