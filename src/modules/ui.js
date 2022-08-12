import {
  fetchMovies, fetchLikes, postLikes, postComments, fetchComments,
} from './fetch.js';

// Displaying Movies from API to DOM
const displayMovies = async () => {
  const display = await fetchMovies();
  const domDisplay = document.querySelector('.movielist');
  for (let entry = 27; entry < 58; entry += 1) {
    domDisplay.innerHTML += `
    <div id='${display[entry].id}' class="movie-items">
        <img src=${display[entry].image.original} alt=${display[entry].name}>
        <p>${display[entry].name}<span><i class="fa fa-heart"></i><i class="likes-display" id="Likes${display[entry].id}"></i></span></p>
        <div>
        <button type="button" class="comments-button">Comments</button>
        <button type="button" class="reserve">Reservations</button>
        </div>
    </div>
        `;
  }
  // Displaying Likes on Movie Items
  const displayLikes = async (index) => {
    const fetchedLikes = await fetchLikes();
    const addedLikes = document.getElementById(`${index}`);
    const newLikes = fetchedLikes.find((like) => +like.item_id === index);
    addedLikes.childNodes[3].childNodes[1].childNodes[1].innerHTML = `${newLikes.likes}`;
  };
  const heartIcon = document.querySelectorAll('.fa-heart');
  heartIcon.forEach((button) => {
    button.addEventListener('click', (e) => {
      postLikes(e.target.parentNode.parentNode.parentNode.id);
      displayLikes(+e.target.parentNode.parentNode.parentNode.id);
    });
  });
  const showLikes = async () => {
    const fetchedLikes = await fetchLikes();
    const likesField = document.querySelectorAll('.likes-display');
    likesField.forEach((field) => {
      let { id } = field;
      const addedLikes = document.getElementById(`${id}`);
      id = id.replace(/Likes/, '');
      const newLikes = fetchedLikes.find((like) => +like.item_id === +id);
      if (newLikes.likes === undefined) {
        addedLikes.innerHTML = '';
      } addedLikes.innerHTML = newLikes.likes;
      // displayLikes(id);
    });
  };
  showLikes();
  // Display Comments Popup
  const displayComments = async (id) => {
    const response = await fetch(`https://api.tvmaze.com/shows/${id}`);
    const comments = await response.json();
    const body = document.querySelector('body');
    const commentsDisplay = document.createElement('div');
    commentsDisplay.classList.add('popup');
    commentsDisplay.innerHTML = `
      <button type="button">x</button>
      <img src="${comments.image.medium}" alt="${comments.name}">
      <h2>${comments.name}</h2>
      <p><span>${comments.genres}</span></p>
      <p><span>${comments.premiered}</span><span>${comments.rating.average}</span></p>
      <h3>Comments</h3>
      <ul></ul>
      <h4>Add a new comment</h4>
      <form action="#" id=${id}>
      <input type="text" placeholder="Your Name" required>
      <textarea type="text" placeholder="Your Comment" required></textarea>
      <button type="submit">Comment</button>
      </form>
      `;
    body.append(commentsDisplay);

    const fetchedComments = async () => {
      const updateComments = document.querySelector('.popup ul');
      const commentResults = await fetchComments(id);
      commentResults.forEach((comment) => {
        updateComments.innerHTML += `<li>${comment.creation_date}: ${comment.username}${comment.comment}</li>`;
      });
    };
    fetchedComments();
    const popupForm = document.querySelector('form');
    popupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const userName = document.querySelector('form input').value.trim();
      const userComment = document.querySelector('form textarea').value.trim();
      const updateComments = document.querySelector('.popup ul');
      updateComments.innerHTML += `<li>${userName} ${userComment}</li>`;
      const { id } = popupForm;
      postComments(id, userName, userComment);
      popupForm.clear();
    });
  };
  const addedComments = document.querySelectorAll('.comments-button');
  addedComments.forEach((button) => {
    button.addEventListener('click', (e) => {
      displayComments(+e.target.parentNode.parentNode.id);
    });
  });
};
export default displayMovies;