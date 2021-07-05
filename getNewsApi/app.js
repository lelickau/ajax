// 
const form = document.forms['newsControls'];
const countrySelect = form.elements['country'];
const searchInput = form.elements['search'];

// Custom Http Module
function customHttp() {
  return {
    get(url, cb) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.addEventListener('load', () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return;
          }
          const response = JSON.parse(xhr.responseText);
          cb(null, response);
        });

        xhr.addEventListener('error', () => {
          cb(`Error. Status code: ${xhr.status}`, xhr);
        });

        xhr.send();
      } catch (error) {
        cb(error);
      }
    },
    post(url, body, headers, cb) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.addEventListener('load', () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return;
          }
          const response = JSON.parse(xhr.responseText);
          cb(null, response);
        });

        xhr.addEventListener('error', () => {
          cb(`Error. Status code: ${xhr.status}`, xhr);
        });

        if (headers) {
          Object.entries(headers).forEach(([key, value]) => {
            xhr.setRequestHeader(key, value);
          });
        }

        xhr.send(JSON.stringify(body));
      } catch (error) {
        cb(error);
      }
    },
  };
}
// Init http module
const http = customHttp();

const newsService = (function() {
  const apiKey = '433a028a350d49c59957a74995663090';
  const apiUrl = 'https://newsapi.org/v2';

  return {
    topHeadlines(country = 'ua', cb) {
      http.get(
        `${apiUrl}/top-headlines?country=${country}&category=technology&apiKey=${apiKey}`,
        cb,
      );
    },
    everything(query, cb) {
      http.get(`${apiUrl}/everything?q=${query}&apiKey=${apiKey}`, cb);
    },
  }
})();
//  init selects
document.addEventListener('DOMContentLoaded', function() {
  // M -- Materialize
  M.AutoInit();
  loadNews();
});

//load news function
function loadNews() {
  showLoader();
  const country = countrySelect.value;
  const searchText = searchInput.value;

  if (!searchText) {
    newsService.topHeadlines(country, onGetResponse);
  } else {
    newsService.everything(searchText, onGetResponse);
  }
  
}

// 
function onGetResponse(err, res) {
  console.log(res)
  removePreloader();
  if (err) {
    showAlert(err, 'error-msg');
    return;
  }

  if (!res.articles.length) {
    showAlert(`${searchInput.value} not found`, 'error-msg');
    return;
  }
  renderNews(res.articles);
}

// 
function showAlert(msg, type = 'success') {
  // M -- Materialize
  M.toast({html: msg, classes: type});
}

//
function renderNews(news) {
  const newsContainer = document.querySelector('.news-container .row');

  if(newsContainer.children.length) {
    clearContainer(newsContainer);
  }

  let fragment = '';
  news.forEach(item => {
    const elem = newsTemplate(item);
    fragment += elem;
  })
  newsContainer.insertAdjacentHTML('afterbegin', fragment);
}

//
function newsTemplate({ urlToImage, title, url, description }) {
  return `
  <div class="col s12">
  <div class="card">
    <div class="card-image">
      <img src="${urlToImage}">
      <span class="card-title">${title || ''}</span>
    </div>
    <div class="card-content">
      <p>${description || ''}</p>
    </div>
    <div class="card-action">
      <a href="${url}">Read more</a>
    </div>
  </div>
</div>
  `
}

//

form.addEventListener('submit', (e) => {
  e.preventDefault();
  loadNews();
});

// 
function clearContainer(container) {
  let child = container.lastElementChild;
  while (child) {
    container.removeChild(child);
    child = container.lastElementChild;
  }
}

// preloader
function showLoader() {
  document.body.insertAdjacentHTML(
    'afterbegin', 
    `
      <div class="progress">
        <div class="indeterminate"></div>
      </div>
    `);
}

// 
function removePreloader() {
  const loader = document.querySelector('.progress');
  if(loader) {
    loader.remove();
  }
}

