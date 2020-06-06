import React, {Suspense} from 'react';
import {Redirect} from 'react-router-dom';
import './App.css';

import Navbar from './Navbar';
import PostList from './post-list';
import TagList from './tag-list';
import Library from './library';
import {AuthContext} from './context/Auth';

const Users = React.lazy(() => import('./Users'));

const url = {
	posts: process.env.REACT_APP_API_URL + 'posts',
	comments: process.env.REACT_APP_API_URL + 'comments',
	tags: process.env.REACT_APP_API_URL + 'tags',
	users: process.env.REACT_APP_API_URL + 'users',
};

const library = new Library(url);

class App extends React.Component {

	static contextType = AuthContext;

	constructor(props) {
		super(props);
		this.state = {posts: [], comments: [], tags: [], users: [], filters: []};
		this.savePost = this.savePost.bind(this);
		this.saveComment = this.saveComment.bind(this);
		this.deletePost = this.deletePost.bind(this);
		this.deleteComment = this.deleteComment.bind(this);
		this.redirect = null;
		document.title = "Demo Blog App";
	}

	async componentDidMount() {
		//implement single function to fetch posts and comments and assign in state

	 //    fetch(url.posts)
	 //    .then(response => response.json() )
	 //    .then(result => { this.setState({posts: result}); })
	 //    .catch(error => { console.log('error in post fetch = ', error) });

		const postsFetch = await fetch(url.posts);
		const posts = await postsFetch.json();

		const commentsFetch = await fetch(url.comments);
		const comments = await commentsFetch.json();

		const tagsFetch = await fetch(url.tags);
		const tags = await tagsFetch.json();

		const usersFetch = await fetch(url.users);
		const users = await usersFetch.json();

		this.setState({
			posts: library.mapKeyAsIdx(posts), 
			comments: library.mapKeyAsIdx(comments), 
			tags: library.mapKeyAsIdx(tags),
			users: users,
			filters: this.props.match.params
		});
	}

	componentDidUpdate(prevProps, prevState) {
		const params = this.props.match.params;
		const prevParams = prevProps.match.params;
		const tagChange = (params.tagId && !prevParams.tagId) || (!params.tagId && prevParams.tagId) || (params.tagId !== prevParams.tagId);
		const postChange = (params.postId && !prevParams.postId) || (!params.postId && prevParams.postId) || (params.postId !== prevParams.postId);
		const userChange = (params.userId && !prevParams.userId) || (!params.userId && prevParams.userId) || (params.userId !== prevParams.userId);
		if (tagChange || postChange || userChange) {
			this.setState({filters: this.props.match.params});
		}
	}

	// findPost(postId) {
	// 	const post = this.state.posts.filter(post => { if(post.id===parseInt(postId))	return post; });
	// 	return post[0] ? post[0] : null;
	// }

	findUpdatePost(input) {
		let post;
		if (post = this.state.posts[parseInt(input.editId)]) {
			const tagIds = this.findUpdateTag(input.tags);
			this.state.posts[post.id].postText = input.postText;
			this.state.posts[post.id].tags = tagIds;
		}

		// if (let post = this.findPost(input.editId)) {
		// 	const tagIds = this.findUpdateTag(input.tags);
		// 	post.postText = input.postText;
		// 	post.tags = tagIds;
		// }
	}

	findUpdatePostDisplayStatus(postId) {
		let post;
		if (post = this.state.posts[parseInt(postId)]) {
			this.state.posts[parseInt(postId)].display = !post.display;
		}
	}

	savePost(post) {
		post.username = post.username ? post.username : this.context.data.user.username;
    if (post.editId) {
    	const findPost = this.findUpdatePost(post);
    	this.redirect = '/';
    	this.setState({
    		posts: this.state.posts, 
    		tags: this.state.tags
    	}, () => {
    		library.saveDataToFile('posts', this.state.posts);
    		library.saveDataToFile('tags', this.state.tags);
    	});
    } else {
	    post.id = this.state.posts.length ? this.state.posts.length + 1 : 1;
	    post.display = true;
	    post.tags = this.findUpdateTag(post.tags);
	    this.state.posts[post.id] = post;
	    this.setState({
	    	posts: this.state.posts
	    }, () => {
    		library.saveDataToFile('posts', this.state.posts);
    		library.saveDataToFile('tags', this.state.tags);
    	});
		}
	}

	deletePost(postId) {
		this.findUpdatePostDisplayStatus(postId);
		this.redirect = '/';
		this.setState({
			posts: this.state.posts
		}, library.saveDataToFile('posts', this.state.posts));
	}

	findUpdateCommentDisplayStatus(commentId) {
		let comment;
		if (comment = this.state.comments[parseInt(commentId)]) {
			this.state.comments[parseInt(commentId)].display = !comment.display;
		}
	}

	saveComment(comment) {
		comment.username = comment.username ? comment.username : this.context.data.user.username;
		comment.id = this.state.comments.length ? this.state.comments.length + 1 : 1;
		comment.display = true;
		this.state.comments[comment.id] = comment;
		this.setState({
			comments: this.state.comments
		}, library.saveDataToFile('comments', this.state.comments));
	}

	deleteComment(commentId) {
		this.findUpdateCommentDisplayStatus(commentId);
		this.setState({
			comments: this.state.comments
		}, library.saveDataToFile('comments', this.state.comments));
	}

	findUpdateTag(inputTags) {
		const tagIds = [];
		const tagsArr = library.makeObjToArrList(this.state.tags);
		let currentIndex = tagsArr.length;
		inputTags.forEach(tag => {
			let index = tagsArr.indexOf(tag);
			if (index < 0) {
				this.state.tags[++currentIndex] = {id: currentIndex, name: tag};
			}
			tagIds.push(index > -1 ? index : currentIndex);
		});
		return tagIds;
	}

	removeTagFromPost(tagId, postId) {
		this.state.posts[3].tags.forEach(tag => { if (tag === tagId) { delete this.state.posts.tags[tagId]; return false;} });
		this.setState({
			posts: this.state.posts
		}, library.saveDataToFile('posts', this.state.comments));
	}

	render() {
		let redirection = null;
		if (this.redirect) {
			const redirectPath = this.redirect;
			this.redirect = null;
			return ( <Redirect to={redirectPath} /> );
		}

		const postsMap = library.mapKeyAsIdx(this.state.posts);

		//find post from post-id, if post.username!==context.data.username: redirect to home (try use history.push)
		const noPostOrNotMy = (!postsMap[this.state.filters.postId] || postsMap[this.state.filters.postId].username !== this.context.data.user.username);
		if (this.state.filters.postId && noPostOrNotMy) {
			return <Redirect to="/" />;
		}

		const propsObj = {
			posts: postsMap,
			comments: library.mapKeyAsIdx(this.state.comments),
			tags: this.state.tags,
			savePost: this.savePost,
			saveComment: this.saveComment,
			deletePost: this.deletePost,
			deleteComment: this.deleteComment,
			filters: this.state.filters
		}
		return (
			<div className="panel panel-default">
				<div className="panel-heading">
					<Navbar user={this.context.data.user} />
				</div>
				<div className="panel-body bg-light">
					<div className="row container">
						<div className="col-md-8">
							<PostList {...propsObj} />
						</div>
						<div className="col-md-4">
							<div className="row">
								<div className="col-md-12">
									<TagList tags={this.state.tags} tagId={this.state.filters.tagId} />
								</div>
							</div>
							<hr />
							<div className="row">
								<div className="col-md-12">
									<Suspense fallback={<p>Loading Users...</p>}>
										<Users users={this.state.users} userId={this.state.filters.userId} />
									</Suspense>
								</div>
							</div>
							<hr />
							<div className="row">
								<div className="col-md-12">
									<p className="font-weight-bold">Available Post Dates</p>
									<ul className="lists">
										<li>Date One</li>
										<li>Date Two</li>
										<li>Date Three</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default App;
