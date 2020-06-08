import React, {useState} from 'react';
import {
	Link,
	Redirect,
	Route,
} from 'react-router-dom';

import {useAuth} from './context/Auth';

function AuthRoute({props,children}) {
	const authUser = useAuth();
	return (
		<Route render={
			({location}) => authUser.data ? (children) : <Redirect to='/login' />
		} />
	);
}

const errorEffects = e => {
	e.current.focus();
	e.current.classList.add('border-danger');
}
const removeErrorEffects = e => {
	e.current.classList.remove('border-danger');
}

function Login(props) {
	const [usernameText, setUsername] = useState('');
	const [passwordText, setPassword] = useState('');
	const [isLoggedIn, setLoggedIn] = useState(false);
	const [usernameErrMsg, setUsernameErrMsg] = useState('');
	const [passwordErrMsg, setPasswordErrMsg] = useState('');
	const [invalidErrMsg, setInvalidErrMsg] = useState('');
	const [loadingDisplay, setLoadingDisplay] = useState('d-none');
	const authUser = useAuth();
	const referer = props.location.state ? props.location.state.referer : '/';
	if (authUser.data) {
		return <Redirect to={referer} />;
	}

	document.title = "Demo Blog Login";

	// let loadingDisplay = 'd-none';

	const usernameValueChange = e => {
		setUsername(e.target.value);
	}
	const passwordValueChange = e => {
		setPassword(e.target.value);
	}

	const usernameFieldRef = React.createRef();
	const passwordFieldRef = React.createRef();

	const validateNotEmtpy = e => {

		let valid = true;

		if (e.password === '') {
			errorEffects(passwordFieldRef);
			setPasswordErrMsg("Password cannot be empty");
			valid = false;
		} else {
			removeErrorEffects(passwordFieldRef);
			setPasswordErrMsg('');
		}
		if (e.username === '') {
			errorEffects(usernameFieldRef);
			setUsernameErrMsg("Username cannot be empty");
			valid = false;
		} else {
			removeErrorEffects(usernameFieldRef);
			setUsernameErrMsg("");
		}

		return valid;
	}

	function postLogin(e) {
		e.preventDefault();
		setLoadingDisplay('');
		const userData = {
			username: usernameText.trim(),
			password: passwordText
		};
		const cb = (data) => {
			if (!data) {
				if (usernameFieldRef.current)	usernameFieldRef.current.focus();
				setInvalidErrMsg("Username or Password invalid");
				setPassword('');
				setLoadingDisplay('d-none');
			}
		};
		if (validateNotEmtpy(userData)) {
			authUser.login(userData, cb);
		} else {
			setLoadingDisplay('d-none');
		}
	}

	const usernameErrEle = usernameErrMsg ? <span className="text-danger">{usernameErrMsg}</span> : null;
	const passwordErrEle = passwordErrMsg ? <span className="text-danger">{passwordErrMsg}</span> : null;
	const invalidErrEle = invalidErrMsg ? <span className="text-danger">{invalidErrMsg}</span> : null;

	return (
		<div className="">
			<h2>Login Page</h2>
			<div className="col-md-3">
				<form className="form" onSubmit={postLogin}>
					{invalidErrEle}
					<div className="form-group">
						<input className="form-control" placeholder="Enter Username"
							onChange={usernameValueChange} value={usernameText} ref={usernameFieldRef} />
						{usernameErrEle}
					</div>
					<div className="form-group">
						<input className="form-control" placeholder="Enter Password" type="password" 
							onChange={passwordValueChange} value={passwordText} ref={passwordFieldRef} />
						{passwordErrEle}
					</div>
					<div className="post-submit">
						<button type="submit" className="btn btn-primary">Login</button>
						&nbsp;<span className={`text-info ${loadingDisplay}`}>Loading...</span>
					</div>
				</form>
			</div>
			<p className="p-2">
				<Link to="/register"> New User? Create New Account </Link>
			</p>
		</div>
	);
}

function Logout(props) {
	const authUser = useAuth();
	authUser.logout();
	return <Redirect to='/login' />
}

function Register(props) {
	const [nameText, setName] = useState('');
	const [usernameText, setUsername] = useState('');
	const [passwordText, setPassword] = useState('');
	const [isLoggedIn, setLoggedIn] = useState(false);
	const [loadingDisplay, setLoadingDisplay] = useState('d-none');

	const [nameErrMsg, setNameErrMsg] = useState('');
	const [usernameErrMsg, setUsernameErrMsg] = useState('');
	const [passwordErrMsg, setPasswordErrMsg] = useState('');

	const authUser = useAuth();
	const referer = props.location.state ? props.location.state.referer : '/';
	if (authUser.data) {
		return <Redirect to={referer} />
	}

	document.title = "Demo Blog Register";

	const nameValueChange = e => {
		setName(e.target.value);
	}
	const usernameValueChange = e => {
		setUsername(e.target.value);
	}
	const passwordValueChange = e => {
		setPassword(e.target.value);
	}

	const nameFieldRef = React.createRef();
	const usernameFieldRef = React.createRef();
	const passwordFieldRef = React.createRef();

	const validateNotEmtpy = e => {

		let valid = true;

		if (e.password === '') {
			errorEffects(passwordFieldRef);
			setPasswordErrMsg("Password cannot be empty");
			valid = false;
		} else {
			removeErrorEffects(passwordFieldRef);
			setPasswordErrMsg("");
		}
		if (e.username === '') {
			errorEffects(usernameFieldRef);
			setUsernameErrMsg("Username cannot be empty");
			valid = false;
		} else {
			removeErrorEffects(usernameFieldRef);
			setUsernameErrMsg("");
		}
		if (e.name === '') {
			errorEffects(nameFieldRef);
			setNameErrMsg("Name cannot be empty");
			valid = false;
		} else {
			removeErrorEffects(nameFieldRef);
			setNameErrMsg("");
		}

		return valid;
	}

	function registerSubmit(e) {
		e.preventDefault();
		setLoadingDisplay('');
		const userData = {
			name: nameText.trim(),
			username: usernameText.trim(),
			password: passwordText
		}
		const cb = (data) => {
			if (!data) {
				if (usernameFieldRef.current)	usernameFieldRef.current.focus();
				setUsernameErrMsg("Username already exist, try another username");
				setPassword('');
				setLoadingDisplay('d-none');
			}
		}
		if (validateNotEmtpy(userData)) {
			authUser.register(userData, cb);
		} else {
			setLoadingDisplay('d-none');
		}
	}

	const nameErrEle = nameErrMsg ? <span className="text-danger">{nameErrMsg}</span> : null;
	const usernameErrEle = usernameErrMsg ? <span className="text-danger">{usernameErrMsg}</span> : null;
	const passwordErrEle = passwordErrMsg ? <span className="text-danger">{passwordErrMsg}</span> : null;

	return (
		<div className="">
			<h2>Register Page</h2>
			<div className="col-md-3">
				<form className="form" onSubmit={registerSubmit}>
					<div className="form-group">
						<input className="form-control" placeholder="Enter Name"
							onChange={nameValueChange} value={nameText} ref={nameFieldRef} />
						{nameErrEle}
					</div>
					<div className="form-group">
						<input className="form-control" placeholder="Enter Username"
							onChange={usernameValueChange} value={usernameText} ref={usernameFieldRef} />
						{usernameErrEle}
					</div>
					<div className="form-group">
						<input className="form-control" placeholder="Enter Password" type="password" 
							onChange={passwordValueChange} value={passwordText} ref={passwordFieldRef} />
						{passwordErrEle}
					</div>
					<div className="post-submit">
						<button type="submit" className="btn btn-primary">Register</button>
						&nbsp;<span className={`text-info ${loadingDisplay}`}>Loading...</span>
					</div>
				</form>
			</div>
			<p className="p-2">
				<Link to="/login"> Existing User! Login </Link>
			</p>
		</div>
	);
}

export {AuthRoute, Login, Register, Logout}