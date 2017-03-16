export const REQUEST_POSTS = 'REQUEST_POSTS'
export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export const SELECT_REDDIT = 'SELECT_REDDIT'
export const INVALIDATE_REDDIT = 'INVALIDATE_REDDIT'
////////////////////////////////////////////////////////
export const ADD_TOKEN = 'ADD_TOKEN'
export const DELETE_TOKEN = 'DELETE_TOKEN'
export const ASKING_TOKEN = 'ASKING_TOKEN'
export const ASKING_TOKEN_FAIL = 'ASKING_TOKEN_FAIL'

export const askingTokenFail = () => ({
  type: ASKING_TOKEN_FAIL
})

export const askingToken = () => ({
  type: ASKING_TOKEN
})

export const addToken = token => ({
  type: ADD_TOKEN,
  token
})

export const deleteToken = () => ({
  type: DELETE_TOKEN
})

export const askToken = (username, password) => dispatch => {
  dispatch(askingToken)
  ///*
  return fetch(`https://api.robinhood.com/api-token-auth/`, {
    method: 'POST',
    headers: new Headers({'content-type': 'application/json', 'Accept': 'application/json'}),

    body: JSON.stringify({username: username, password: password})
  })
    .then(response => {console.log(response)})
    .catch(function(reason) {
      console.log(reason);
    });
    /*
    .then(json => {
      console.log(json)
    } ) //dispatch(addToken(json)

    */
    //*/
}

//////////////////////////////////////////////////////
export const selectReddit = reddit => ({
  type: SELECT_REDDIT,
  reddit
})

export const invalidateReddit = reddit => ({
  type: INVALIDATE_REDDIT,
  reddit
})

export const requestPosts = reddit => ({
  type: REQUEST_POSTS,
  reddit
})

export const receivePosts = (reddit, json) => ({
  type: RECEIVE_POSTS,
  reddit,
  posts: json.data.children.map(child => child.data),
  receivedAt: Date.now()
})

const fetchPosts = reddit => dispatch => {
  dispatch(requestPosts(reddit))
  return fetch(`https://www.reddit.com/r/${reddit}.json`)
    .then(response => response.json())
    .then(json => dispatch(receivePosts(reddit, json)))
}

const shouldFetchPosts = (state, reddit) => {
  const posts = state.postsByReddit[reddit]
  if (!posts) {
    return true
  }
  if (posts.isFetching) {
    return false
  }
  return posts.didInvalidate
}

export const fetchPostsIfNeeded = reddit => (dispatch, getState) => {
  if (shouldFetchPosts(getState(), reddit)) {
    return dispatch(fetchPosts(reddit))
  }
}
