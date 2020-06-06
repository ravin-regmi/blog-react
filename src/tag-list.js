import React from 'react';

import TagItem from './TagItem';

export default class TagList extends React.Component {
	render() {
		const tagListHtml = this.props.tags.map(tag => {
			return (<TagItem key={tag.id} tag={tag} tagId={this.props.tagId} />);
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
}