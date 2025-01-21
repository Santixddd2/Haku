
'''
This is the file where the main promt is executed, this promt identified the funcion to 
execute, chose the promt and the respective funcion to the promt.
'''

from json import tool
from langgraph.prebuilt import ToolNode
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import START, MessagesState, StateGraph,END
from langchain_core.messages import HumanMessage
from langchain_groq import ChatGroq
from HakuCore.Main.functionsManager import charge_functions
from HakuCore.Conf.conf import groq_api_key,model_name
from langchain_core.tools import tool
import whisper


class Haku():
    def __init__(self):
        self.api_key=groq_api_key
        self.functions_list=charge_functions()
        self.model=ChatGroq(model=model_name).bind_tools(self.functions_list)
        self.workflow=StateGraph(state_schema=MessagesState)
        self.trans_model=whisper.load_model("small")
        self.state="free"
        self.tool_node = ToolNode(self.functions_list)
        
    def instance_haku_memoryTools(self):
        self.workflow.add_node("agent", self.call_model)
        self.workflow.add_node("tools", self.tool_node)
        self.workflow.add_edge(START, "agent")
        self.workflow.add_conditional_edges("agent", self.should_continue)
        self.workflow.add_edge("tools", "agent")
        memory = MemorySaver()
        return memory
        
    def main_funcion(self,promt,memory,nPetition):
            client = self.workflow.compile(checkpointer=memory)
            ans=client.invoke(
            {"messages": [HumanMessage(content=promt)]},
            config={"configurable": {"thread_id": "1"}})    
            response=ans['messages']
            answer=response[-1].content
            return answer,0
                
            
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
        #system_prompt = self.main
        #messages = [SystemMessage(content=system_prompt)] + state["messages"]
        messages = state["messages"]
        response = self.model.invoke(messages)
        return {"messages": response}
    def should_continue(self,state: MessagesState):
        messages = state["messages"] 
        last_message = messages[-1]
        if last_message.tool_calls:
           return "tools"
        return END
        
    def queue(self,petition):
        return 0

    def add_function(self):
        return 0
            
