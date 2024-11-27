'''
This is the promt manager, here the promts are chargen on a list, all this promts
correspond to a unique function
'''

import os
from HakuCore.Main.actions import *
from HakuCore.Conf.conf import func_route,promts_route,functions
import sys
import importlib.util

promts_list={}
functions_list={}

def charge_promts():
    for file_name in os.listdir(promts_route):
        route = os.path.join(promts_route, file_name)
        if os.path.isfile(route):
            with open(route, "r") as archivo:
               content = archivo.read()
               promts_list[file_name]=content
    return promts_list

def charge_functions():
    for key, value in functions.items():
        spec = importlib.util.spec_from_file_location(key, func_route+"/"+value)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        functions_list[key]=module
    return functions_list


def add_promts():
    return 0
