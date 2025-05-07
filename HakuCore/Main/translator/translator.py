from HakuCore.Main.mainModel.hakuClass import *
from HakuCore.Main.tools.toolChargerAi.functionsManager import charge_functions
from HakuCore.Conf.conf import func_route_do
from pydantic import BaseModel,Field
from langchain.tools import Tool
from langchain.tools import StructuredTool
from langgraph.checkpoint.memory import InMemorySaver



class translation(BaseModel):
    plan:dict
    trans:list


class aiChar(BaseModel):
    char:int
    promt:str
    model:Haku
    memory:InMemorySaver
    
    class Config:
        arbitrary_types_allowed = True
class PlanInput(BaseModel):
    plan: dict = Field(..., description="Diccionario {subtarea: categoria}")



class translator:
    def __init__(self,psfPromt: str,structure: dict[str,list],Tsmodel:str):
        self.translation = translation(plan={}, trans=[])
        self.Tsmodel=Tsmodel
        self.psfPromt=psfPromt
        self.structure=structure
        self.alphabeth={}
        
    def _tasksToString(self):
        return ", ".join(self.structure.keys())

    #Create a numerical alphabeth
    def createAlphabeth(self):
        for i,key in enumerate(self.structure.keys()):
            self.alphabeth[key]=i
    
    def _createPlan(self,promt):
        tool=self._getToolPlan()
        model,memory=self._createAgentProcess([tool],self.Tsmodel)
        tasks=self._tasksToString()
        order=f'''Porfavor haz uso de la herramienta toolPlan para elegir en que tareas dividir. Solamente tienes las siguientes subtareas, 
        pero puedes usarlas las veces que desees:
        {tasks}
        La siguiente tarea general 
        {promt}
        '''
        ans,n=model.main_funcion(order,memory,1)
        #print("ans: ",ans)

    def _getToolPlan(self):
        return StructuredTool.from_function(
        name="toolPlan",
        description=self.psfPromt,
        func=self._toolPlan,      
        args_schema=PlanInput
    )
        
    def _toolPlan(self,plan:dict):
        #print("✅ toolPlan recibió:", plan)
        self.translation.plan = plan

    def translate(self,promt):
        self._createPlan(promt)
        self._instanceAgentsProcess(self.translation.plan)
    
    def _createAgentProcess(self,tools,modelName):
        model=Haku(model=modelName,tools=tools)
        memory=model.instance_haku_memoryTools()
        return model,memory    

    def _instanceAgentsProcess(self,plan):
        string=[]
        for promt,agent in plan.items():
            category=self.structure[agent]
            key=self.alphabeth[agent]
            if category[0]!="":
                tools=charge_functions(func_route_do,{f"Module {promt}":category[0]})
            else:
                tools=[]
            model,memory=self._createAgentProcess(tools,category[1])
            string.append(aiChar(char=key,promt=promt,model=model,memory=memory))
        self.translation.trans=string


    