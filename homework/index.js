'use strict';

{
  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status <= 299) {
        console.log(xhr.response);
        cb(null, xhr.response);
      } else {
        cb(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
      }
    };
    xhr.onerror = () => cb(new Error('Network request failed'));
    xhr.send();
  }

  function createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    Object.entries(options).forEach(([key, value]) => {
      if (key === 'text') {
        elem.textContent = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  function renderRepoDetails(repo, root) {
    const card = createAndAppend('div', root, { class: 'card' });
    // The usage of table was selected because the data was tabular. Additionally, I relied on inner HTML to format the data because it was unconventional, i.e. one is a link, in the other data the time should be fomratted. So, there was an option of looping through two arrays of items and their description, but I thought it would not save code or effort.
    const infoTable = createAndAppend('table', card);
    infoTable.innerHTML = `
      <tr>
    <td>Repository: </td>
    <td><a href=${repo.html_url}>${repo.name}</a></td>
  </tr>
  <tr>
    <td>Description: </td>
    <td>${repo.description}</td>
  </tr>
  <tr>
    <td>Forks: </td>
    <td>${repo.forks_count}</td>
  </tr>
  <tr>
    <td>Updated: </td>
    <td>${repo.updated_at.replace(/[ tz]/gi, ' ')}</td>
  </tr>
    `;
  }

  function main(url) {
    fetchJSON(url, (err, repos) => {
      const root = document.getElementById('root');
      createAndAppend('p', root, {
        text: 'HYF Repositories',
        class: 'header',
      });

      if (err) {
        createAndAppend('p', root, {
          text: err.message,
          class: 'alert-error',
        });
        return;
      }
      // Because The assignment didn't indicate the basis for which the 10 repos are chosen, and also hinted on using sort and locale compare, I assumed alphabetically by name.
      repos
        .sort((a, b) => a.name.localeCompare(b.name))
        .slice(0, 10)
        .forEach(repo => renderRepoDetails(repo, root));
    });
  }

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
