import React from 'react';
import {Link} from 'react-router-dom';

export default function TagItem(props) {
	if (props.tag && props.tag.id) {
		let tagClassName = 'badge-info';
		if (props.tag.id === +props.tagId) {
			tagClassName = 'badge-danger';
		}
		return (
			<Link to={`/tag/${props.tag.id}`} className={`badge Post-tag ${tagClassName}`} title="Click to filter posts">{props.tag.name}</Link>
		);
	} else {
		return null;
	}
}