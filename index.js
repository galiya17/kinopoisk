const API_KEY = "defdc102";

async function fetchData(title) {
    const response = await fetch(`https://www.omdbapi.com/?i=tt3896198&apikey=${API_KEY}&t=${title}`);
    const data = await response.json();
    return data;
}

const searchInputElement = document.querySelector('#movie-search-input');
const searchButtonElement = document.querySelector('#movie-search-button');
const searchResultsContainer = document.querySelector('.search-results');
const spinnerElement = document.querySelector('#spinner');
const errorToastElement = document.getElementById('errorToast'); // Элемент тостера
const toast = new bootstrap.Toast(errorToastElement); // Инициализация тостера

let movieTitleValue = '';
let addedMovie = null;

searchButtonElement.addEventListener('click', async () => {
    movieTitleValue = searchInputElement.value;

    if (!movieTitleValue) {
        alert("Введите название фильма!");
        return;
    }

    spinnerElement.classList.remove('d-none');

    try {
        const movie = await fetchData(movieTitleValue);

        if (movie.Response === "False") {
            toast.show(); 
            return;
        }

        if (addedMovie && addedMovie.Title.toLowerCase().includes(movieTitleValue.toLowerCase())) return;

        console.log(movie);

        const cardElementTemplate = `
        <div class="card" style="width: 18rem">
            <img
            src="${movie.Poster}"
            class="card-img-top"
            alt="${movie.Title} movie poster"
            />
            <div class="card-body">
                <h5 class="card-title">${movie.Title}</h5>
                <p class="card-text">${movie.Plot}</p>
                <div class="d-flex">
                <button
                    type="button"
                    class="btn btn-primary more-info-btn"
                    data-poster="${movie.Poster}"
                    data-title="${movie.Title}"
                    data-plot="${movie.Plot}"
                    data-runtime="${movie.Runtime}"
                    data-director="${movie.Director}"
                    data-country="${movie.Country}"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal">
                    More
                </button>
                <button
                    type="button"
                    class="btn btn-primary more-info-btn"
                    id="add-fav-btn"
                    >
                    Add to favorites
                </button>
                </div>
            </div>
        </div>`;

        searchResultsContainer.insertAdjacentHTML('beforeend', cardElementTemplate);

        const moreInfoButton = searchResultsContainer.querySelector('.more-info-btn');
        moreInfoButton.addEventListener('click', (event) => {
            const poster = event.target.getAttribute('data-poster');
            const title = event.target.getAttribute('data-title');
            const plot = event.target.getAttribute('data-plot');
            const runtime = event.target.getAttribute('data-runtime');
            const director = event.target.getAttribute('data-director');
            const country = event.target.getAttribute('data-country');
            
            updateModal(poster, title, plot, runtime, director, country);
        });

        addedMovie = movie;

    } catch (error) {
        console.error('Ошибка при поиске фильма:', error);
    } finally {

        spinnerElement.classList.add('d-none');
    }
});

function updateModal(poster, title, plot, runtime, director, country) {
    console.log('updateModal called with:', poster, title, plot, runtime, director, country);
    document.getElementById('exampleModalLabel').textContent = title;
    document.querySelector('.modal-body').innerHTML = `
      <img src="${poster}" alt="${title} poster" class="img-fluid mb-3">
      <div class="movie-details">
        <p><strong>Plot:</strong> ${plot}</p>
        <p><strong>Runtime:</strong> ${runtime}</p>
        <p><strong>Director:</strong> ${director}</p>
        <p><strong>Country:</strong> ${country}</p>
      </div>
    `;
}

const addFavButton = document.getElementById('add-fav-btn');
addFavButton.addEventListener('click', () => {

    if (!movie) {
        console.error("Movie data is undefined.");
        return;
    }

    const favMoviesList = JSON.parse(localStorage.getItem('favMovies')) || []; // Retrieve existing favorites or start a new array
    favMoviesList.push(movie);  // Add the new movie to the array
    localStorage.setItem('favMovies', JSON.stringify(favMoviesList));  // Update localStorage with the new list
});
