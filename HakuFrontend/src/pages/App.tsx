import NavBar,{Options,SubNav,SubNavOptions}  from '../components/NavBar/NavBar';
import { useState,useEffect } from "react";
import Chat,{Messagges,SpaceHolder}  from '../components/Chat';
import { send_order } from '../utils/send';



function App() {
  const [messagges, setMessagges] = useState<string[]>([]);
  const [nPetition, setnPetition] = useState<number>(1);
  useEffect(() => {
    setnPetition(0); 
  }, []);
  
  const handleSendMessage = async (message: string) => {
    setMessagges((prevMessages) => {
      const updatedMessages = [...prevMessages, message];
      send_order(message,nPetition).then(({answer,nPetit}) => {
        setMessagges((prevMessages) => [...prevMessages, answer]);
        setnPetition(nPetit)
      });
      return updatedMessages; 
    });
  };

  return (
    <>
      <NavBar>
    <Options>
      <SubNav>
        <SubNavOptions />
      </SubNav>
    </Options>
  </NavBar>
     <Chat>
       < Messagges messagges={messagges}/>
       < SpaceHolder onSend={ handleSendMessage } />
     </Chat>
    
    </>

  );
}

export default App;
