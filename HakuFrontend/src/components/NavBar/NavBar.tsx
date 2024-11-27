import { Fragment, ReactNode} from "react";

interface PropsNav{
    children: ReactNode;
}
function NavBar(props: PropsNav){ 
    const { children }=props;
    return (<div >
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
  <div className="container-fluid">
    <a className="navbar-brand" href="#">Haku</a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    {children}
  </div>
</nav>
    </div>
  );
};

interface PropsOpt{
    children: ReactNode;
}

export function Options(props: PropsOpt){
    const { children }=props;
    return ( 
    <Fragment>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link active" aria-current="page" href="#">Chat</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">Functions</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">Configuration</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">About</a>
        </li>
      </ul>
      {children}
    </div>

    </Fragment>
    );
};

interface PropsSub{
    children: ReactNode;
}

export function SubNav(props: PropsSub){
    const { children }=props;
    return ( 
    <Fragment>
        <ul className="navbar-nav ms-auto">
        <li className="nav-item dropdown ">
          <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          <i className="bi bi-person-circle fs-2"></i>
          </a>
          {children}
        </li>
        </ul>

    </Fragment>
    );
};

export function SubNavOptions(){
    return ( 
    <Fragment>
          <ul className="dropdown-menu dropdown-menu-end">
            <li><a className="dropdown-item" href="#">About me</a></li>
            <li><a className="dropdown-item" href="#">History</a></li>
          </ul>
    </Fragment>
    );
};



export default NavBar;
