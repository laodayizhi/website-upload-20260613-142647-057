(function () {
  var input = document.querySelector('[data-search-input]');
  var form = document.querySelector('[data-search-form]');
  var results = document.querySelector('[data-search-results]');
  var empty = document.querySelector('[data-empty-state]');
  var params = new URLSearchParams(window.location.search);
  var initial = params.get('q') || '';

  if (!input || !results) {
    return;
  }

  input.value = initial;

  function card(movie) {
    var tags = (movie.tags || []).slice(0, 4).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');
    return '<a class="movie-card" href="./' + encodeURI(movie.url) + '">' +
      '<span class="poster-wrap">' +
      '<img src="' + escapeAttribute(movie.cover) + '" alt="' + escapeAttribute(movie.title) + '" loading="lazy">' +
      '<span class="poster-shade"></span><span class="play-icon">▶</span><span class="corner-label">' + escapeHtml(movie.year) + '</span>' +
      '</span><span class="card-body">' +
      '<strong>' + escapeHtml(movie.title) + '</strong>' +
      '<small>' + escapeHtml(movie.type) + ' · ' + escapeHtml(movie.region) + '</small>' +
      '<em>' + escapeHtml(movie.oneLine) + '</em>' +
      '<span class="card-tags">' + tags + '</span>' +
      '</span></a>';
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[char];
    });
  }

  function escapeAttribute(value) {
    return escapeHtml(value).replace(/`/g, '&#96;');
  }

  function render() {
    var q = input.value.trim().toLowerCase();
    var data = window.__SITE_MOVIES__ || [];
    var matched = data.filter(function (movie) {
      if (!q) {
        return true;
      }
      var text = [movie.title, movie.type, movie.region, movie.genre, movie.category, movie.year, movie.oneLine, (movie.tags || []).join(' ')].join(' ').toLowerCase();
      return text.indexOf(q) !== -1;
    }).slice(0, 120);

    results.innerHTML = matched.map(card).join('');
    if (empty) {
      empty.classList.toggle('is-visible', matched.length === 0);
    }
  }

  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var url = new URL(window.location.href);
      url.searchParams.set('q', input.value.trim());
      window.history.replaceState(null, '', url.toString());
      render();
    });
  }

  input.addEventListener('input', render);
  render();
})();
