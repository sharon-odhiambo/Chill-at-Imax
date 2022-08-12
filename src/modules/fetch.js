const movieApiUrl = 'https://api.tvmaze.com/shows';
const likesUrl = 'https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/mSLrzI04H4x2wsHv1BBd/likes';

const fetchMovies = async () => {
  const response = await fetch(movieApiUrl);
  try {
    const results = await response.json();
    return results;
  } catch (error) {
    return error;
  }
};
const fetchLikes = async () => {
  const response = await fetch(likesUrl);
  try {
    const likesresults = await response.json();
    return likesresults;
  } catch (error) {
    return error;
  }
};
const postLikes = async (id) => {
  const response = await fetch(likesUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ item_id: `${id}` }),
  });
  try {
    const postedLikes = await response.json();
    return postedLikes;
  } catch (error) {
    return error;
  }
};
const postComments = async (id, name, usercomment) => {
  const response = await fetch('https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/mSLrzI04H4x2wsHv1BBd/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ item_id: id, username: name, comment: usercomment }),
  });
  try {
    const postedComments = await response.json();
    return postedComments;
  } catch (error) {
    return error;
  }
};
const fetchComments = async (id) => {
  const response = await fetch(`https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/mSLrzI04H4x2wsHv1BBd/comments?item_id=${id}`);
  try {
    const commentsresults = await response.json();
    return commentsresults;
  } catch (error) {
    return error;
  }
};

export {
  fetchMovies, fetchLikes, postLikes, postComments, fetchComments,
};
