
import './TopBar.css';
import {Link} from 'react-router-dom';

const TopBar = ({active}) => {
    return (
        <div className="top-bar">
        <Link to={{pathname:'/'}}><h1>A<span>Gen</span>T</h1></Link>
        <div className="pages-links">
            <div className="page-links-container">
            <Link className={active=='Tasks'? 'link active' : 'link'} to={{pathname:'/Tasks'}}>Tasks</Link>
            <Link className={active=='Agents'? 'link active' : 'link'} to={{pathname:'/Agents'}}>Agents</Link>
            <Link className={active=='Tools'? 'link active' : 'link'} to={{pathname:'/Tools'}}>Tools</Link>
            </div>
        </div>
        </div>
    );
    };

export default TopBar;