'''
This is the configuration document, here you can define your new functions :D

The first variables is a dic that have the file and the main module for the task that you wnat to do
'''
import os


#Routes
func_route='Functions absolute route (mainPet)'
promts_route='Promts absolute route (promtsTxt)'

#Api keys
groq_api_key=os.environ.get("GROQ_API_KEY")

#Functions
functions={"FilesM":"main_files.py","Answer":"answer.py"}

#Model options

model_name='llama-3.1-70b-versatile'

