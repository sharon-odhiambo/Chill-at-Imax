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
export { fetchMovies, fetchLikes, postLikes };