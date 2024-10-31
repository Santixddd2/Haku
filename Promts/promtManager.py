'''
This is the promt manager, here the promts are chargen on a list, all this promts
correspond to a unique function
'''

import os

promts_list={}
promts_rote=os.environ.get("PROMTS_ROUTE")

def charge_promts():
    for file_name in os.listdir(promts_rote):
        route = os.path.join(promts_rote, file_name)
        if os.path.isfile(route):
            with open(route, "r") as archivo:
               content = archivo.read()
               promts_list[file_name]=content
    return promts_list

def add_promts():
    return 0