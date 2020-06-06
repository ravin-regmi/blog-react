import React from 'react';
import {Link} from 'react-router-dom';

export default function Users(props) {
	return (
		<div className="post-parent-wrapper bg-white">
			<p className="font-weight-bold text-center">Users List</p>
			<div className="list-group">
			{
				props.users.map(user => {
					const listColor = user.username === props.userId ? 'list-group-item-danger' : 'list-group-item-info';
					return (<Link to={`/user/${user.username}`} key={user.username} 
						className={`list-group-item list-group-item-action ${listColor}`}>{user.name}</Link>)
				})
			}
			</div>
		</div>
	);
}