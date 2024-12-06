
'''
This is the file where the main promt is executed, this promt identified the funcion to 
execute, chose the promt and the respective funcion to the promt.
'''

from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import START, MessagesState, StateGraph
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_groq import ChatGroq
from HakuCore.Promts.promtManager import charge_promts,charge_functions
from HakuCore.Main.json_helpers import extract_json
from HakuCore.Conf.conf import groq_api_key,model_name
import whisper

class Haku():
    def __init__(self,main_promt):
        self.api_key=groq_api_key
        self.promts_list=charge_promts()
        self.main=self.promts_list[main_promt]
        self.functions=charge_functions()
        self.model=ChatGroq(model=model_name)
        self.workflow=StateGraph(state_schema=MessagesState)
        self.trans_model=whisper.load_model("small")
        self.state="free"
        
    def instance_haku_memory(self):
        self.workflow.add_node("model", self.call_model)
        self.workflow.add_edge(START, "model")
        memory = MemorySaver()
        return memory
        
    def main_funcion(self,promt,memory,nPetition):
        cont=0
        while True:
            print("Iteration: ",cont)
            cont=cont+1
            client = self.workflow.compile(checkpointer=memory)
            ans=client.invoke(
            {"messages": [HumanMessage(content=promt)]},
            config={"configurable": {"thread_id": "1"}},)     
            response=ans['messages']
            if nPetition==0:
                nPetition=nPetition+1
            answer=response[nPetition].content
            json_function = extract_json(answer)
            band,message,nPetition=self.choose_action(json_function,nPetition)
            if band:
                return message,nPetition
                
            
    def transcript(self,audio):
        #try:            
            petition=self.trans_model.transcribe(audio)
            petition=petition['text']
            print("Audio_path: ",audio)
            print("Petition: ",petition)
            if len(petition)<=1:
                return "Peticion vacia, señor"
            else: 
                answer=self.main_funcion(petition)
                return answer
        #except:
            #return "Hubo un problema con la peticion, señor"
        
    def call_model(self,state: MessagesState):
        system_prompt = self.main
        messages = [SystemMessage(content=system_prompt)] + state["messages"]
        response = self.model.invoke(messages)
        return {"messages": response}
    
    def choose_action(self,json_function,nPetition):
        if json_function:
            is_action = json_function[0]['is_action']
            choosed_action = json_function[0]['choosed_action']
            promt_agent = json_function[0]['promt_agent']
            if is_action=="True":
                try:
                    key=choosed_action
                    role=self.promts_list[key+".txt"]
                    message=self.functions[key].main(promt_agent,role)
                    nPetition=nPetition+2
                    return True,message,nPetition
                    
                except:
                    nPetition=nPetition+2
                    return False,None,nPetition
        else:
            nPetition=nPetition+2
            return False,None,nPetition
        
        

    def queue(self,petition):
        return 0

            
