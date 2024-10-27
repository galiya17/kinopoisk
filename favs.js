document.addEventListener('DOMContentLoaded', () => {
    console.log('Страница избранного загружена');
    renderFavMovies();
});

function renderFavMovies() {
    console.log('Функция renderFavMovies вызвана');
    const favMoviesList = JSON.parse(localStorage.getItem('favMovies')) || [];
    const favMoviesContainer = document.querySelector('.container');

    favMoviesContainer.innerHTML = '';

    if (favMoviesList.length === 0) {
        favMoviesContainer.innerHTML = '<p>У вас пока нет избранных фильмов.</p>';
        return;
    }

    favMoviesList.forEach((favMovie, index) => {
        const cardElementTemplate = `
        <div class="card" style="width: 20rem" data-card-id="${index}">
            <img
            src="${favMovie.Poster}"
            class="card-img-top"
            alt="${favMovie.Title} movie poster"
            />
            <div class="card-body">
                <h5 class="card-title">${favMovie.Title}</h5>
                <p class="card-text">${favMovie.Plot}</p>
                <div class="d-flex align-items-stretch">
                    <a
                    href="#"
                    class="btn btn-primary d-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    >
                    More
                    </a>
                    <a
                        href="#"
                        class="btn btn-danger remove-button"
                        >
                    Delete from favorites
                    </a>
                </div>
            </div>
        </div>`;

        favMoviesContainer.insertAdjacentHTML('beforeend', cardElementTemplate);

        const removeFavMovieButton = favMoviesContainer.children[favMoviesContainer.children.length - 1].querySelector('.remove-button');
        removeFavMovieButton.addEventListener('click', () => {
            favMoviesList.splice(index, 1);
            localStorage.setItem('favMovies', JSON.stringify(favMoviesList));
            renderFavMovies();
        });
    });
};

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
