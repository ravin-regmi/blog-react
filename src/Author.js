import React from 'react';
import {Link} from 'react-router-dom';

import {useAuth} from './context/Auth';

export default function Author(props) {
	const authUser = useAuth();
	let displayName = 'Anonymous User';
	if (props.username) {
		if (authUser.data.user.username === props.username) {
			displayName = 'You';
		} else {
			displayName = props.username;
		}
	}
	return (
		<div className="font-weight-bold text-success author-name">
			By - 
			{
				props.parent !== 'comment' 
					? (<Link to={`/user/${props.username}`}> {displayName} </Link>)
					: (<span> {displayName} </span>)
			}!
		</div>
	);
}