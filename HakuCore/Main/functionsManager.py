from genericpath import isdir
import os
import zipfile
from HakuCore.Conf.conf import functions,func_route,promts_route,temp_route,files_route
from HakuCore.Main.actions import *
import importlib.util
import shutil
import inspect
from langchain_core.tools import tool

class functionsManager():
    
    def __init__(self,name):
        self.fileRoute=temp_route+name
        self.name=name
        self.functions_list={}
        
    def descompress(self,fileRoute):
        if not os.path.exists(fileRoute):
            raise FileNotFoundError(f"The file {fileRoute} doesn't exist.")
        if not fileRoute.endswith('.zip'):
            raise ValueError("File is not a zip file.")
        try:
           with zipfile.ZipFile(fileRoute, 'r') as zf:
               path=temp_route+"/temp_func"
               zf.extractall(path)
               return path
        except Exception as e:
            print(f"Error descompressing: {e}")
            return False
        
    def checkLenght(self):
        route=self.descompress(self.fileRoute)
        elements=os.listdir(route)
        if len(elements)>=3 and len(elements)<=5:
            return True,elements,route
        else:
            return False,None
    
    def checkStructure(self,elementRoute,element,checkList):
        if os.path.isfile(elementRoute):
            if element.endswith('.py'):
                checkList["Func"]=elementRoute
                checkList["FuncName"]=element
                #shutil.move(elementRoute,func_route)
                return checkList
            elif element.endswith('txt') and element=="MainPromt.txt":
                checkList["MainPromt"]=elementRoute
                #shutil.move(elementRoute,promts_route)
                return checkList
            elif element.endswith('txt'):
                checkList["Promt"]=elementRoute
                #shutil.move(elementRoute,promts_route)
                return checkList
            else:
                return checkList
        elif os.path.isdir(elementRoute):
            checkList["Files"]=elementRoute
            #shutil.move(elementRoute,files_route)
            return checkList

    def set_function(self):
        band,elements,route=self.checkLenght()
        checkList={}
        if band:           
            for element in elements:
                elementRoute=os.path.join(route,element)
                checkList=self.checkStructure(elementRoute,element,checkList)
        if len(checkList)>=3 and len(checkList)<=5:
            shutil.move(checkList["Files"],files_route)
            shutil.move(checkList["Promt"],promts_route)
            shutil.move(checkList["Func"],func_route)
            self.selt_in_main(checkList["MainPromt"])
        else:
            raise ValueError("The file structure is wrong.")
        functions[self.name]=checkList["FuncName"]
            
    def selt_in_main(self,MainPromt):
        with open(MainPromt, 'r', encoding='utf-8') as MainPromt:
                content = MainPromt.read()
        with open(promts_route+"/Main.txt", 'a', encoding='utf-8') as Main:
                Main.write(content + "\n")  
        
        
def charge_functions():
    functions_list=[]
    modules_list=[]
    for key, value in functions.items():
        spec = importlib.util.spec_from_file_location(key, func_route+"/"+value)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        for name, obj in inspect.getmembers(module):
            if inspect.isfunction(obj):
                decorated_func = tool(obj)  
                functions_list.append(decorated_func)  
    return functions_list
        
