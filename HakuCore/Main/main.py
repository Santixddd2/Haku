from HakuCore.Main.mainModel.hakuClass import Haku

def agentConnection(promt):
    model=Haku()
    memory=model.instance_haku_memoryTools()
    answer,a=model.main_funcion(promt,memory,0)
    return answer,a
    
class HakuController:
    def __init__(self):
        return 0        
    def HakuClients(self):
        return 0
    def HakuBoss(self):
        return 0
    
#Test

