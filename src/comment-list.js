import React from 'react';

import Author from './Author';
import AuthWrapper from './AuthWrapper';

export default class CommentList extends React.Component {
	constructor(props) {
		super(props);
		this.state = { comments: [] };
	}

	componentDidMount() {
		//
	}

	render() {
		const comments = [];
		this.props.comments.forEach((comment) => {
			if (comment.display && this.props.postId === comment.post_id) {
				comments.push( <CommentItem key={'com-'+this.props.postId+'-'+comment.id} 
									comment={comment} postId={this.props.postId} 
									deleteComment={this.props.deleteComment} /> );
			}
		});
		return (
			<div className="comments-parent-wrapper container">
				{this.props.commentForm}
			{/*this.props.children */}
				<div className="comments-wrapper container">
					{comments.length > 0 ? comments : (<p className="font-italic">No comments</p>)}		
				</div>
			</div>
		);
	}
}

class CommentItem extends React.Component {
	constructor(props) {
		super(props);
		this.deleteClick = this.deleteClick.bind(this);
	}

	deleteClick(e) {
		e.preventDefault();
		const commentId = e.target.getAttribute('data-id');
		this.props.deleteComment(parseInt(commentId));
	}
	
	render() {
		return (
			<React.Fragment>
				<div className="comment-parent-wrapper">
					<div className="comment-wrapper inline-display">
						<label className="font-weight-bold text-muted">{this.props.comment.commentText}</label>
						<AuthWrapper username={this.props.comment.username}>
							<span className="action-wrapper">
								<a href="#" data-id={this.props.comment.id} post-id={this.props.postId} 
									onClick={this.deleteClick}>Delete</a>
							</span>
						</AuthWrapper>
						<Author username={this.props.comment.username} parent="comment" />
					</div>
				</div>
				<hr />
			</React.Fragment>
		);
	}
}