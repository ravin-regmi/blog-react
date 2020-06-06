import React, {Suspense} from 'react';
import { Link } from 'react-router-dom';

import TagItem from './TagItem';
import AuthWrapper from './AuthWrapper';
// import {AuthProvider} from './context/Auth';

// import CommentList from './comment-list';
const CommentList = React.lazy(() => import('./comment-list'));
const Author = React.lazy(() => import('./Author'));

export default class PostItem extends React.Component {

	deleteClick (postId, e) {
		e.preventDefault();
		this.props.deletePost(parseInt(postId));
	};

	render() {
		const tagsHtml = this.props.tags.map((tag, i) => {
			if (this.props.post.tags && this.props.post.tags.indexOf(i) > -1) {
				return (<TagItem key={i} tag={{id: i, name: tag}} tagId={this.props.tagId} />);
			}
		});
		return (
			<div className="post-parent-wrapper bg-white">
				<div className="post-wrapper form-inline">
					<div className="post">
						<h3>{this.props.post.postText}</h3>
					</div>
					<AuthWrapper username={this.props.post.username}>
						<span className="action-wrapper">
						
							<Link to={`/post/${this.props.post.id}`} key={'edit-'+this.props.post.id}
							 onClick={this.props.focusTextArea} >Edit</Link>
							{/*
							<a href={`/post/${this.props.post.id}`} key={this.props.post.id} >Edit</a>
						*/}

						</span>
						|
						<span className="action-wrapper">
							
							<a href="#" onClick={this.deleteClick.bind(this, this.props.post.id)} >Delete</a>
							
						</span>
					</AuthWrapper>
				</div>
				<div className="tags-wrapper">
					{tagsHtml}
				</div>
				<Suspense fallback="Loading user">
					<div className="post-author inline-display">
						<Author username={this.props.post.username} />
					</div>
				</Suspense>
				<Suspense fallback={<div>Loading comments...</div>} >
				<CommentList postId={this.props.post.id} comments={this.props.comments} commentForm={this.props.commentForm}
				deleteComment={this.props.deleteComment} />
				{/*this.props.commentForm*/}
			{/* </CommentList> */}
				</Suspense>
			</div>
		);
	}
}