from ctypes import Structure
from HakuCore.Main.translator.translator import *
from typing import Optional,Annotated
from pydantic import BaseModel, Field
from langgraph.graph import START, MessagesState, StateGraph,END
from HakuCore.Main.translator.graph import *
import operator


class softwareState(generalState):
    code:Annotated[str, operator.add]
    file:Annotated[str, operator.add]
    
Agents = {
    "Code Generation to the software application": ["", "deepseek-r1-distill-llama-70b"], # Specializes in writing and analyzing code
    "File Management to the software application": ["files.py", "llama3-70b-8192"],  # Handles file creation and management

}

with open("softwareExamplesTrans.txt", "r", encoding="utf-8") as f:
    psPromt = f.read()
tsModel='llama3-70b-8192'

ts=translator(psfPromt=psPromt,structure=Agents,Tsmodel=tsModel)
ts.createAlphabeth()
promt = '''
Hola. Quiero que desarrolles una pequeña aplicación web en Python usando Flask. La aplicación debe tener dos endpoints:
1. Uno que reciba un nombre y edad por POST y los guarde en una lista temporal en memoria.
2. Otro que retorne todos los nombres almacenados, ordenados alfabéticamente, junto con su edad.

Además, quiero que los endpoints estén definidos en archivos separados:
- Uno para manejar las rutas relacionadas con el ingreso de datos (guardar.py).
- Otro para las rutas de consulta (consultar.py).
Finalmente, crea un archivo principal app.py que importe ambas rutas y corra la aplicación.
'''
ts.translate(promt)
trad=ts.translation.trans
print("✅ La traduccion es: ",trad)

with open("softwareExamplesContext.txt", "r", encoding="utf-8") as f:
    examples = f.read()
            
structure={"q0":{
              0:[["code","","q1"],["code","","q0"]],
              1:[["file","","q1"]]},
           "q1":{
               1:[["","file","End"]],
               0:[["","","q0"]]
               }}
automata=aiAutomata(softwareState,structure,tsModel,examples)
flow=automata.aiAutomataEx(trad)
res=flow.get("responses")
print("✅ Ejecucion: ",res)
print("✅ Lenght",len(res))
