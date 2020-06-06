import React, {useState} from 'react';
import Library from '.././library';

const AuthContext = React.createContext();

const library = new Library();

const userUrl = process.env.REACT_APP_API_URL + 'users/';

function AuthProvider(props) {

	const [data, setData] = useState(null);

	const afterSave = data => {
		console.log('after save')
		if (!data.userData) {
			return 'false';
		} else {
			setData({user: data.userData});
			return 'true';
		}
	};

	const login = (userData) => {
		console.log('start login')
		library.fetchPostRequest(userUrl + 'login', userData, afterSave);
		console.log('end login')
	};

	const register = (userData) => {
		library.fetchPostRequest(userUrl, userData, afterSave);
	};

	const logout = () => {
		setData(null);
	};

	return (
		<AuthContext.Provider value={{data, login, logout, register}} {...props} />
	);
}

const useAuth = () => React.useContext(AuthContext);

export {AuthContext, AuthProvider, useAuth}