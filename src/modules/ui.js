import {
  fetchMovies, fetchLikes, postLikes, postComments, fetchComments,
  postReservations, fetchReservations,
} from './fetch.js';

// Displaying Movies from API to DOM
const displayMovies = async () => {
  const display = await fetchMovies();
  const domDisplay = document.querySelector('.movielist');
  for (let entry = 158; entry < 190; entry += 1) {
    domDisplay.innerHTML += `
    <div id='${display[entry].id}' class="movie-items">
        <img src=${display[entry].image.original} alt=${display[entry].name}>
        <p>${display[entry].name}<span><i class="fa fa-heart"></i><i class="likes-display" id="Likes${display[entry].id}"></i></span></p>
        <div class="btn">
        <button type="button" class="comments-button">Comments</button>
        <button type="button" class="reserve">Reservations</button>
        </div>
    </div>
        `;
  }
  // Displaying Likes on Movie Items
  const displayLikes = (index) => {
    const addedLikes = document.getElementById(`${index}`);
    let refreshedLikes = +addedLikes.childNodes[3].childNodes[1].childNodes[1].innerHTML;
    refreshedLikes += 1;
    addedLikes.childNodes[3].childNodes[1].childNodes[1].innerHTML = refreshedLikes;
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
    <button type="button" class="close-btn"><span>X</span></button>
    <div>
      <img src="${comments.image.medium}" alt="${comments.name}">
      <h2>${comments.name}</h2>
      <p><span>${comments.genres}</span></p>
      <p><span>${comments.premiered}</span><span>${comments.rating.average}</span></p>
    </div>
    <div>
      <h3><span>Comments</span></h3>
      <ul></ul>
      <h4>Add a new comment</h4>
      <form action="#" id=${id}>
      <input type="text" placeholder="Your Name" required>
      <textarea type="text" placeholder="Your Comment" required></textarea>
      <button type="submit">Comment</button>
      </form>
      </div>
      `;
    body.append(commentsDisplay);

    const closeButton = document.querySelector('.close-btn');
    closeButton.addEventListener('click', () => {
      body.removeChild(body.lastElementChild);
      domDisplay.style.filter = 'blur(0)';
    });

    const fetchedComments = async () => {
      const updateComments = document.querySelector('.popup ul');
      const commentResults = await fetchComments(id);
      commentResults.forEach((comment) => {
        updateComments.innerHTML += `<li>${comment.creation_date} ${comment.username}: ${comment.comment}</li>`;
      });
    };
    fetchedComments();
    const popupForm = document.querySelector('form');
    popupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const userName = document.querySelector('form input').value.trim();
      const userComment = document.querySelector('form textarea').value.trim();
      const updateComments = document.querySelector('.popup ul');
      updateComments.innerHTML += `<li>${userName}: ${userComment}</li>`;
      const { id } = popupForm;
      postComments(id, userName, userComment);
      popupForm.reset();
    });
  };
    // Display Reservations Popup
  const displayReservations = async (id) => {
    const response = await fetch(`https://api.tvmaze.com/shows/${id}`);
    const reserves = await response.json();
    const body = document.querySelector('body');
    const reservesDisplay = document.createElement('div');
    reservesDisplay.classList.add('popup');
    reservesDisplay.innerHTML = `
    <button type="button" class="close-btn"><span>X</span></button>
    <div>
        <img src="${reserves.image.medium}" alt="${reserves.name}">
        <h2>${reserves.name}</h2>
        <p><span>${reserves.genres}</span></p>
        <p><span>${reserves.premiered}</span><span>${reserves.rating.average}</span></p>
      </div>
      <div>
        <h3><span>Reservations</span>
        </h3>
        <ul></ul>
        <h4>Add a new reservation</h4>
        <form action="#" id=${id}>
        <input type="text" class="name" placeholder="Your Name" required>
        <input onfocus="(this.type='date')" onblur="(this.type='text')" class="start" placeholder="Start Date" required>
        <input onfocus="(this.type='date')" onblur="(this.type='text')" class="end" placeholder="End Date" required>
        <button type="submit">Reserve</button>
        </form>
      <div>
        `;
    body.append(reservesDisplay);

    const closeButton = document.querySelector('.close-btn');
    closeButton.addEventListener('click', () => {
      body.removeChild(body.lastElementChild);
      domDisplay.style.filter = 'blur(0)';
    });

    const fetchedReserves = async () => {
      const updateReservations = document.querySelector('.popup ul');
      const reserveResults = await fetchReservations(id);
      reserveResults.forEach((reserve) => {
        updateReservations.innerHTML += `<li>${reserve.date_start} - ${reserve.date_end} by ${reserve.username}</li>`;
      });
    };
    fetchedReserves();
    const popupForm = document.querySelector('form');
    popupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const userName = document.querySelector('.name').value.trim();
      const userStartDate = document.querySelector('.start').value.trim();
      const userEndDate = document.querySelector('.end').value.trim();
      const updateReserves = document.querySelector('.popup ul');
      updateReserves.innerHTML += `<li>${userStartDate} - ${userEndDate} by ${userName}</li>`;
      const { id } = popupForm;
      postReservations(id, userName, userStartDate, userEndDate);
      popupForm.reset();
    });
  };
  const addedComments = document.querySelectorAll('.comments-button');
  addedComments.forEach((button) => {
    button.addEventListener('click', (e) => {
      displayComments(+e.target.parentNode.parentNode.id);
      domDisplay.style.filter = 'blur(3px)';
    });
  });
  const addedReservations = document.querySelectorAll('.reserve');
  addedReservations.forEach((button) => {
    button.addEventListener('click', (e) => {
      displayReservations(+e.target.parentNode.parentNode.id);
      domDisplay.style.filter = 'blur(3px)';
    });
  });
};

export default displayMovies;