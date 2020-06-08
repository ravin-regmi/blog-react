class Library {

	constructor(url) {
		this.url = url;
	}

	mapKeyAsIdx(obj) {
		if (obj === null || obj === undefined || !obj.length){
			return [];
		}
		let newObj = [];
		obj.forEach(item => {
			if (item !== null && item !== undefined) {
				newObj[item.id] = item;
			}
		});
		return newObj;
	}

	saveDataToFile(saveType, data) {
		let url = null;
		if (saveType === 'comments') {
			url = this.url.comments;
		} else if (saveType === 'tags') {
			url = this.url.tags;
		} else if (saveType === 'posts') {
			url = this.url.posts;
		} else {
			return;
		}
		fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data)
		})
		.then(response => response.json())
		.then(result => { console.log(saveType + 'updated successfully', result) })
		.catch(error => { console.log(saveType + 'update error', error); });
	}

	makeObjToArrList(obj) {
		const arr = [];
		obj.forEach(item => {
			arr[item.id] = item.name;
		});
		return arr;
	}

	async fetchGetRequest(url) {
		const fetchReq = await fetch(url);
		return  await fetchReq.json();
	}

	fetchPostRequest(url, data) {
		return fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data)
		})
		.then(response => response.json())
		.then(result => { return result; })
		.catch(error => { console.log('fetch post error', error); });
	}
}

export default Library;