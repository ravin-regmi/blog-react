import React from 'react';
import { 
	useParams,
	Redirect
} from 'react-router-dom';

import CreatePost from './create-post';
import PostItem from './post-item';
import CommentForm from './CommentForm';
import Library from './library';

const newPost = {id: null, postText: null};
const library = new Library();

export default class PostList extends React.Component {

	componentDidMount() {
		// const { match: { params } } = this.props;
	}

	componentDidUpdate() {
		//
	}

	render() {
		const tagsArr = library.makeObjToArrList(this.props.tags);
		const posts = this.props.posts.map(post => {
			let postLoop = false;
			if (post.display) {
				postLoop = true;
				if (this.props.filters.tagId) {
					if ((post.tags.length > 0) && post.tags.indexOf(+this.props.filters.tagId) > -1) {
						postLoop = true;
					} else {
						postLoop = false;
					}
				} else if (this.props.filters.userId) {
					if (post.username === this.props.filters.userId) {
						postLoop = true;
					} else {
						postLoop = false;
					}
				}
			}
			if (postLoop) {
				const commentForm = (<CommentForm saveComment={this.props.saveComment} postId={post.id} />);
				return ( <PostItem key={post.id} post={post} tags={tagsArr} tagId={this.props.filters.tagId} 
							comments={this.props.comments} deletePost={this.props.deletePost} 
							commentForm={commentForm} deleteComment={this.props.deleteComment} /> );
			}
		});
		
		const postFormType = this.props.filters.postId ? "edit" : "create";

		return (
			<React.Fragment>
				<div className="row container">
		            <div className="col-md-12">
		            	<PostForm savePost={this.props.savePost} posts={this.props.posts} postId={+this.props.filters.postId} 
		            		postFormType={postFormType} tags={tagsArr} />
		            </div>
				</div>
				<hr />
				<div className="row">
					<div className="col-md-12">
						<div className="container">
							{posts.reverse()}
						</div>
		            </div>
	          	</div>
			</React.Fragment>
		);
	}
}

function PostForm(props) {
	if (props.postFormType === "edit" && props.postId) {
		const post = props.posts.filter(post => { if(post && post.id===parseInt(props.postId))	return post; });
		if (post && post[0]) {
			{/* return (<CreatePost savePost={props.savePost} postText={post[0].postText} editId={props.postId} />); */}
			return (<CreatePost savePost={props.savePost} post={post[0]} tags={props.tags} />);
		} else {
			return (props.posts.length > 0) ?  (<Redirect to="/" />) : null;
		}
	} else {
		return (<CreatePost savePost={props.savePost} post={newPost} tags={props.tags} />);
	}
}