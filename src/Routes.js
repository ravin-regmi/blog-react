import React from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
} from 'react-router-dom';

import App from './App';
import {AuthRoute, Login, Register, Logout} from './Auth';
import {AuthProvider} from './context/Auth';

export default function Routes(props) {
	return (
		<AuthProvider>
		<Router>
			<Switch>
				<Route path="/login" component={Login} />
				<Route path="/register" component={Register} />
        		<AuthRoute>
	        		<Route exact path="/" component={App} />
	        		<Route path="/tag/:tagId" component={App} />
	        		<Route path="/post/:postId" component={App} />
	        		<Route path="/user/:userId" component={App} />
	        		<Route path="/logout" component={Logout} />
        		</AuthRoute>
        	</Switch>
    	</Router>
    	</AuthProvider>
	);
}

