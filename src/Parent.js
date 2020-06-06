import React from 'react';

export default class Parent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {posts: [], post: newPost, comments: [], redirect: null};
    	this.redirect = null;
	}

	async componentDidMount() {
		//implement single function to fetch posts and comments and assign in state

	 //    fetch(postUrl)
	 //    .then(response => response.json() )
	 //    .then(result => { this.setState({posts: result}); })
	 //    .catch(error => { console.log('error in post fetch = ', error) });

		const postsFetch = await fetch(postUrl);
		const posts = await postsFetch.json();

		const commentsFetch = await fetch(commentsUrl);
		const comments = await commentsFetch.json();

		this.setState({posts: posts, comments: comments});
		// this.focusTextArea();
	}

	saveDataToFile(saveType) {
		const url = saveType === 'comments' ? commentsUrl : postUrl;
		fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(this.state[saveType])
		})
		.then(response => response.json())
		.then(result => { console.log(saveType + 'updated successfully', result) })
		.catch(error => { console.log(saveType + 'update error', error); });
	}

	deletePost(postId) {
		this.findUpdatePostDisplayStatus(postId);
		this.setState({
			posts: this.state.posts
		}, this.saveDataToFile('posts'));
	}

	deleteComment(commentId) {
		this.findUpdateCommentDisplayStatus(commentId);
		this.setState({
			comments: this.state.comments
		}, this.saveDataToFile('comments'));
	}
}