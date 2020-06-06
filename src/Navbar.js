import React from 'react';
import {Link} from 'react-router-dom';

export default function Navbar(props) {
	// <a href="/"> Reload Page </a>
	// <Link to="/register" className="btn btn-primary"> Home! </Link>
	// <Link to="/logout" className="btn btn-danger"> Logout </Link>

	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-light">
		  <a className="navbar-brand" href="/">Reload Page</a>
		  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
		    <span className="navbar-toggler-icon"></span>
		  </button>
		  <div className="collapse navbar-collapse" id="navbarNav">
		    <ul className="navbar-nav">
		      <li className="nav-item active">
		        <Link className="nav-link" to="/">Home <span className="sr-only">(current)</span></Link>
		      </li>
		      <li className="nav-item">
		        <Link className="nav-link" to="/logout">Logout</Link>
		      </li>
		    </ul>
		  </div>
		  <p className="font-weight-bold" style={{margin:0}}>
		  	<img style={{width:'30px'}} src="https://i.pinimg.com/236x/ba/84/1c/ba841cc07934b508458a7faea62141a8--film-industry-nepal.jpg" />
		  	Hello {props.user.name}!
		  </p>
		</nav>
	);
}