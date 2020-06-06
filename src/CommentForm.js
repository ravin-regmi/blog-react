import React from 'react';

export default class CommentForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = { commentText: '' };
		this.commentValueChange = this.commentValueChange.bind(this);
		this.submitComment = this.submitComment.bind(this);
	}

	commentValueChange(e) {
		this.setState( { commentText: e.target.value } );
	}

	submitComment(e) {
		e.preventDefault();
		this.props.saveComment({commentText: this.state.commentText, post_id: this.props.postId});
		this.setState({commentText: ''});
	}

	render() {
		return (
			<div className="comment-form-wrapper">
				<form className="form" onSubmit={this.submitComment}>
					<div className="form-group post-input">
						<input type="text" className="form-control" placeholder="Enter comment" 
						onChange={this.commentValueChange} value={this.state.commentText} />
					</div>
				 </form>
			</div>
		);
	}
}