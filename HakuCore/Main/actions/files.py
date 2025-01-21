'''
This is a class to manage files, it is a function of the agent
'''

import os 


route="C:/Users/SANTIAGO/Documents/Haku_Files"

def create_file(name,ext):
    """Create a new file in the specified route"""
    try: 
        file_route=route+"/"+name+"."+ext
        file = open(file_route, "w")
        file=file
        return "Archivo creado correctamente"
    except:
        return "Algo fallo al crear el archivo"
    

def write_file(content,name):
    """write the content into the specified route"""
    try:       
        file_route=route+"/"+name     
        file = open(file_route, "w")
        file.write(content)
        return True
    except:
        return False


'''
def open_file(self):
    try: 
        file_route=self.route+"/"+self.name+"."+self.ext
        file = open(file_route, "r")
        self.file=file
        return True
    except:
        return False
        
def read_file(self):
    try:             
        content=self.file.read()
        return True,content
    except:
        return False,None
def upload_file(self):
    return 0
'''
