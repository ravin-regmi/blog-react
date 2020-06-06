import React from 'react';

import {useAuth} from './context/Auth';

export default function AuthWrapper(props) {
	const authUser = useAuth();
	return (authUser.data.user.username && authUser.data.user.username === props.username) ? (props.children) : null; 
}