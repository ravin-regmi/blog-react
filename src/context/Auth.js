import React, {useState} from 'react';
import Library from '.././library';

const AuthContext = React.createContext();

const library = new Library();

const userUrl = process.env.REACT_APP_API_URL + 'users/';

function AuthProvider(props) {

	const [data, setData] = useState(null);

	const afterSave = data => {
		if (data.userData) {
			setData({user: data.userData});
		}
	};

	const login = (userData, cb) => {
		library
			.fetchPostRequest(userUrl + 'login', userData)
			.then(data => {
				afterSave(data);
				cb(data.userData);
			});
	};

	const register = (userData, cb) => {
		library
			.fetchPostRequest(userUrl, userData)
			.then(data => {
				afterSave(data);
				cb(data.userData);
			});
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