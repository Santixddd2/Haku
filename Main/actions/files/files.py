'''
This is a class to manage files, it is a function of the agent
'''

import os 

class filesH():
    def __init__(self,name,route,ext):
        self.name=name
        self.route=route
        self.ext=ext
        self.file=None
    def create_file(self):
        try: 
            file_route=self.route+self.name+"."+self.ext
            file = open(file_route, "w")
            self.file=file
            return True
        except:
            return False
    def open_file(self):
        try: 
            file_route=self.route+"/"+self.name+"."+self.ext
            file = open(file_route, "r")
            self.file=file
            return True
        except:
            return False
    def write_file(self,content):
        try:            
           self.file.write(content)
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
