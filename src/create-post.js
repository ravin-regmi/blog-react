import React from 'react';

const postDefaultObj = {
			editId: null,
			postText: '',
			tagText: '',
			tags: [],
			allTags: []
		};

export default class CreatePost extends React.Component {
	constructor(props) {
		super(props);
		this.state = postDefaultObj;
		this.postValueChange = this.postValueChange.bind(this);
		this.tagValueChange = this.tagValueChange.bind(this);
		this.tagKeyup = this.tagKeyup.bind(this);
		this.postSubmit = this.postSubmit.bind(this);
		this.formKeyDown = this.formKeyDown.bind(this);

		this.postTextArea = React.createRef();
		this.tagTextField = React.createRef();

		this.suggestTags = [];
	}

	componentDidMount() {
		this.setState({
			editId: this.props.post.id ?? null,
			postText: this.props.post.postText ?? '',
			tags: this.tagValues(this.props.post.tags),
			allTags: this.props.tags,
		});
	}

	componentDidUpdate(prevProps, prevState) {
		if ((this.props.post.id !== this.state.editId) && !(prevState.editId !== null && this.state.editId === null)) {
			this.setState({
				editId: this.props.post.id,
				postText: this.props.post.postText ?? '',
				tags: this.tagValues(this.props.post.tags),
				allTags: this.props.tags
			});
			this.focusTextArea('focus');
		}
	}

	tagValues(obj) {
		return obj ? obj.map(tag => { return this.props.tags[tag]; }) : [];
	}

	focusTextArea(type) {
		if (this.postTextArea.current) {
			if (type === 'focus') {
				this.postTextArea.current.focus();
			} else {
				this.postTextArea.current.blur();
			}
		}
	}

	resetState() {
		this.setState(postDefaultObj);
	}

	postValueChange(e) {
		this.setState({
			editId: this.state.editId,
			postText: e.target.value
		});
	}

	postSubmit(e) {
		e.preventDefault();
		if (this.state.postText === "") {
			return;
		}
		this.props.savePost({
			postText: this.state.postText,
			editId: this.state.editId,
			tags: this.state.tags
		});
		this.resetState();
	}

	formKeyDown(e) {
		if (e.which === 13) {
			e.preventDefault();
		}
	}

	focusTagField() {
		if (this.tagTextField.current) {
			this.tagTextField.current.focus();
		}
	}

	tagValueChange(e) {
		this.setState({
			tagText: e.target.value
		});
		this.getSuggestTags(e.target.value);
	}

	tagKeyup(e) {
		if (e.which === 13) {
			this.submitTag();
		}
	}

	clickTag (tagId, e) {
		e.preventDefault();
		delete this.state.tags[this.state.tags.indexOf(tagId)];
		const tags = this.state.tags.filter(item => { return item !== undefined; })
		this.setState({tags: tags});
	}

	selectSuggestedTag(tag) {
		if (this.props.tags.indexOf(tag) > -1 && this.state.tags.indexOf(tag) < 0) {
			this.setState({
				tags: [...this.state.tags, tag],
				tagText: ''
			});
		}
		this.suggestTags = [];
	}

	submitTag() {
		if (this.state.tagText.trim() !== '' && this.state.tags.indexOf(this.state.tagText.trim()) < 0) {
			this.setState({
				tags: [...this.state.tags, this.state.tagText.trim()],
				tagText: ''
			});
		} else {
			this.setState({tagText: ''});
		}
		this.suggestTags = [];
	}

	getSuggestTags(text) {
		this.suggestTags = this.props.tags.filter(tag => {
			if (tag.indexOf(text.trim()) > -1 && this.state.tags.indexOf(tag) < 0) {
				return tag;
			}
		});
	}

	render() {
		const btnText = this.state.editId ? 'Update Post' : 'Save New Post';
		// if (Number.isInteger(parseInt(this.state.editId)) || Number.isInteger(parseInt(this.props.post.id))) {
		// 	this.focusTextArea('focus');
		// } else {
		// 	if (this.state.postText === "")
		// 		this.focusTextArea();
		// }
		const tagsHtml = this.state.tags.map((tag) => {
			return (<span className="badge badge-info Post-tag" key={tag} 
					onClick={this.clickTag.bind(this, tag)} title="Click to remove tag">{tag}</span>);
		});
		return (
			<div className="post-wrapper">
				<form className="form" onSubmit={this.postSubmit} onKeyDown={this.formKeyDown}>
					<div className="form-group post-input">
						<textarea className="form-control" placeholder="Write New Post" 
							onChange={this.postValueChange} value={this.state.postText}
							ref={this.postTextArea} />
					</div>
					<div className="form-group tag-input">
						<input className="form-control" placeholder="Type to add tag"
							onChange={this.tagValueChange} onKeyUp={this.tagKeyup} value={this.state.tagText} 
							ref={this.tagTextField} />
						<TagSuggestWrapper tags={this.suggestTags} selectSuggestedTag={this.selectSuggestedTag.bind(this)} />
						{tagsHtml}
					</div>
					<div className="post-submit">
						<button type="submit" className="btn btn-primary float-right">{btnText}</button>
					</div>
				</form>
			</div>
		);
	}
}

function TagSuggestWrapper(props) {
	if (props.tags.length < 1) {
		return null;
	}
	return (
		<div className="tag-suggest-wrapper">
			{
				props.tags.map(tag => {
					return (<TagSuggest {...props} tag={tag} key={tag} />);
				})
			}
		</div>
	);
}

function TagSuggest(props) {
	function clickTag(tag) {
		props.selectSuggestedTag(tag);
	}
	return (
		<span className="badge badge-primary Post-tag" onClick={clickTag.bind(this, props.tag)}>{props.tag}</span>
	);
}