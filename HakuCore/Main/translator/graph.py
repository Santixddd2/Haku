from ast import Dict
from distutils.cmd import Command
from turtle import update
from typing import Type,Dict,Annotated
from pydantic import BaseModel
from langgraph.graph import START, StateGraph,END
from HakuCore.Main.mainModel.hakuClass import Haku
from langgraph.types import Command
import operator


#Prototype(El grafo compila dependiendo del string para mayor eficiencia)

class generalState(BaseModel):
    translation:list
    responses:Annotated[list, operator.add]

class aiAutomata():
    def __init__(self,graphState: Type[generalState] ,structure: Dict[int,list],contextModel:str,contextExamples:str):
        self.graphState=graphState
        self.structure=structure
        self.contextModel=contextModel
        self.contextExamples=contextExamples

    def aiAutomataEx(self,translation):
        builder = StateGraph(state_schema=self.graphState)
        model,memory=self._createContextModel()
        level={"q0":self.structure["q0"]}
        for aChar in translation:
            aux={}
            for j,node in enumerate(list(level.keys())):  
                mapa=level[node]
                ch=aChar.char
                paths=mapa[ch]     
                del level[node]
                for i,pNode in enumerate(paths):
                    if mapa=="End":
                        break
                    stateTchange=pNode[0]
                    stateTuse=pNode[1]
                    nextState=pNode[2]
                    nodeFunc=self._createNode(aChar,stateTchange,stateTuse,model,memory)
                    nodeName=f"{node}{i}{j}"
                    print("Node: ",node)
                    if node=="q0":
                        builder.add_node(nodeName,nodeFunc)
                        builder.add_edge(START,nodeName)
                        aux[nodeName]=self.structure[nextState]
                    elif nextState=="End":
                        builder.add_node(nodeName,nodeFunc)
                        builder.add_edge(nodeName,END)
                        aux[nodeName]="End"
                    else:
                        builder.add_node(nodeName,nodeFunc)
                        builder.add_edge(node,nodeName)
                        aux[nodeName]=self.structure[nextState]            
            level=aux
        
        compiler=builder.compile()
        ans=compiler.invoke({"translation":translation,"responses":[]})
        return ans
    
                                            
    def _createNode(self,aiChar,stateTchange,stateTuse,model,memory):
        '''Esta funcion recibe el estado que se desea cambiar y devuelve una funcion general'''
        #Usar mas de un nodo, es decir para cada paralelizacion crear nodos distintos. 
        def node(state):
            aux=state.responses
            aMemory=aiChar.memory
            agent=aiChar.model
            prompt=""
            try: 
                prompt=aiChar.promt
                prompt=self._executeCtxModel(model,memory,prompt,getattr(state, stateTuse))
            except:
                prompt=aiChar.promt
                prompt=self._executeCtxModel(model,memory,prompt,"")
            ans,a=agent.main_funcion(prompt,aMemory,0)
            aux.append(ans)
            return Command(
                update={stateTchange:ans,"responses":aux},
            )     
        return node

                            
    def _createContextModel(self):
        cntxModel=Haku(model=self.contextModel)
        memory=cntxModel.instance_haku_memoryTools()
        return cntxModel,memory
    
    def _executeCtxModel(self,model,memory,promt,vari):
        promt=f'''Porfavor concatena este prompt: {promt} con este resultado: {vari} para volverlos un solo prompt con sentido:
        {self.contextExamples}
        '''
        ans,a=model.main_funcion(promt,memory,0)
        return ans
    
    