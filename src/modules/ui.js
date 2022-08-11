import { fetchMovies, fetchLikes, postLikes } from './fetch.js';

const displayMovies = async () => {
  const display = await fetchMovies();
  const domDisplay = document.querySelector('.movielist');
  for (let entry = 27; entry < 58; entry += 1) {
    domDisplay.innerHTML += `
    <div id='${display[entry].id}' class="movie-items">
        <img src=${display[entry].image.original} alt=${display[entry].name}>
        <p>${display[entry].name}<span><i class="fa fa-heart"></i><i class="likes-display"></i></span></p>
        <div>
        <button type="button" class="comments-button">Comments</button>
        <button type="button" class="reserve">Reservations</button>
        </div>
    </div>
        `;
  }
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
};
export default displayMovies;