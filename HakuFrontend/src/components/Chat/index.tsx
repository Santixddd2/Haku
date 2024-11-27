import { Fragment, ReactNode,useState } from "react";
import styles from "./Chat.module.css"

interface PropsChat{
  children: ReactNode;
}

function Chat(props: PropsChat){ 
  const {  children }=props;
    return (<div >
        <div className="d-flex flex-column justify-content-center align-items-center min-vh-50">
  <div className="p-2 mt-3" style={{fontWeight: 'bold'}}>
    Haku
  </div>
  <div className="image-container p-2 mt-3">
    <img src="/images/HakuFace2.jpg" alt="Logo" className="img-fluid" style={{ maxWidth: '200px' }} />
  </div>
  { children }
</div>

    </div>
  );
};

interface PropsMsg{
  messagges: string[]
}

export function Messagges({messagges}:PropsMsg){
  
  return (
    <Fragment> 
    <div className={ styles.messagesContainer}>
    <div className=" d-flex flex-column justify-content-center align-items-center min-vh-50 " style={{ paddingTop: '1px', fontWeight: 'bold' }}>
    Chat with me 
    </div>
    <div className={`message `} style={{ paddingTop: '10px'}}>
    {messagges.map((elemento, i) => (
    <div key={i}  className={`message ${i % 2 === 0 ? styles.textRight : styles.textDivLeft}`}>
      <p className={styles.textLeft}>
      {elemento}
      </p>
    </div>))}
    </div>
  </div>
  </Fragment>
  )

}

interface PropsSph{
  onSend: (order: string)=> void;
}

export function SpaceHolder({onSend}: PropsSph){
  const [order, setOrder] = useState(""); 
  const handleClick= ( )=>{
    onSend(order);
    setOrder("")
  }
  const handleChange = () => {
    setOrder((document.getElementById("txtOrder") as HTMLInputElement).value);
  };

  return (
    <Fragment >
    <div  className="d-flex flex-row justify-content-center align-items-center min-vh-50"  style={{
        marginTop: '10px', 
      }}>
    <textarea
        className="form-control me-2"
        placeholder="Send something to Haku..."
        style={{width: '400px',  }}
        id="txtOrder"
        onChange={handleChange}
        value={order}
      />
          <button className="btn btn-primary" onClick={()=> handleClick()}>
        Send
      </button>
    </div>
    </Fragment>
  )

}


export default Chat;
