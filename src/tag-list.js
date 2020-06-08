import React, {useState} from 'react';

import TagItem from './TagItem';

export default function TagList(props) {
	const tagListHtml = props.tags.map(tag => {
		return (<TagItem key={tag.id} tag={tag} tagId={props.tagId} />);
	});
	return (
		<div className="bg-white">
			<p className="font-weight-bold text-center">Available Tags</p>
			<div className="form-inline tag-wrapper">
				{tagListHtml}
			</div>
		</div>
	);
}