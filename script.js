const apiKey = "8073addf"; // Your OMDb API key

// Load favorites from localStorage or initialize empty array
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// Toggle favorites tab visibility
function toggleFavoritesTab() {
  const favTab = document.getElementById("favoritesTab");
  favTab.style.display = favTab.style.display === "block" ? "none" : "block";
}

// Save favorites to localStorage
function saveFavorites() {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

// Check if movie is favorited
function isFavorited(imdbID) {
  return favorites.some(movie => movie.imdbID === imdbID);
}

// Toggle favorite status for a movie
function toggleFavorite(movie) {
  if (isFavorited(movie.imdbID)) {
    favorites = favorites.filter(m => m.imdbID !== movie.imdbID);
  } else {
    favorites.push(movie);
  }
  saveFavorites();
  renderFavoritesTab();
  renderMovieCard(movie);
}

// Render favorites tab content
function renderFavoritesTab() {
  const favList = document.getElementById("favoritesList");
  if (favorites.length === 0) {
    favList.innerHTML = "<p>No favorites yet.</p>";
    return;
  }
  favList.innerHTML = favorites
    .map(movie => `
      <div class="fav-item" onclick="showMovieDetails('${movie.Title}')">
        <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.png'}" alt="${movie.Title}" />
        <span>${movie.Title} (${movie.Year})</span>
      </div>
    `)
    .join("");
}

// Example function to show movie details from favorites tab (optional)
function showMovieDetails(title) {
  document.getElementById("searchInput").value = title;
  toggleFavoritesTab();
  searchMovies();
}

// Render movie card with favorite button updated
function renderMovieCard(data) {
  const movieResult = document.getElementById("movieResult");
  const favorited = isFavorited(data.imdbID);

  movieResult.innerHTML = `
    <div class="movie-card">
      <img src="${data.Poster !== 'N/A' ? data.Poster : 'placeholder.png'}" alt="${data.Title}" />
      <div class="movie-info">
        <h2>${data.Title}</h2>
        <p><strong>Year:</strong> ${data.Year}</p>
        <p><strong>Genre:</strong> ${data.Genre}</p>
        <p><strong>Director:</strong> ${data.Director}</p>
        <p><strong>Actors:</strong> ${data.Actors}</p>
        <p><strong>Plot:</strong> ${data.Plot}</p>
        <p><strong>IMDb Rating:</strong> ${data.imdbRating}</p>
        <button id="favBtn" class="${favorited ? 'favorited' : ''}">
          ${favorited ? '★ Favorited' : '☆ Add to Favorites'}
        </button>
      </div>
    </div>
  `;

  document.getElementById("favBtn").addEventListener("click", () => {
    toggleFavorite(data);
  });
}

// Search movies using OMDb API
function searchMovies() {
  const movieName = document.getElementById("searchInput").value.trim();
  const movieResult = document.getElementById("movieResult");

  if (!movieName) {
    movieResult.innerHTML = "<p>Please enter a movie name!</p>";
    return;
  }

  movieResult.innerHTML = "<p>Loading...</p>";

  fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(movieName)}&apikey=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      if (data.Response === "True") {
        renderMovieCard(data);
      } else {
        movieResult.innerHTML = `<p>Movie not found: "${movieName}"</p>`;
      }
    })
    .catch(() => {
      movieResult.innerHTML = "<p>Oops! Something went wrong. Please try again.</p>";
    });
}

// Initialize favorites tab on page load
window.onload = () => {
  renderFavoritesTab();
};
