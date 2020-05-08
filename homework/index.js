'use strict';

{
  // The function was supplied by the project and used to create elements. No changes wer made to the function
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
  // A function that contain the fetch function, and which return response.json.
  function fetchJSON(url) {
    return fetch(url).then(response => response.json());
  }
  // A function that sorts the fetched repositories alphabetically. I could've joined this function with the fetch function, but chose to separate them for clarity and readability.
  function sortRepos(repos, selectionMenu) {
    repos
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((repo, index) => createMenu(repo, index, selectionMenu));
    return repos;
  }
  // Creating the selection menu
  function createMenu(repo, index, selectionMenu) {
    createAndAppend('option', selectionMenu, {
      text: repo.name,
      value: index,
    });
  }
  // the function that displays the selected repository on the page. innerHTML was selected due te the fact that with the chosen format looping and creating each element would not have saved much code. At the end the function return a new fetch promise with the the url of a contributors, which is used by the next function.
  function showRepo(repo, theParent) {
    const card = createAndAppend('div', theParent, { class: 'card' });
    const infoTable = createAndAppend('table', card);
    infoTable.innerHTML = `
      <tr>
        <td>Repository: </td>
        <td><a href=${repo.html_url} target="_blank">${repo.name}</a>
        </td>
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
    return fetchJSON(repo.contributors_url);
  }
  // A function that creates  the contributor card on the page.
  function showContributor(contributor, contributorsContainer) {
    const contributorCard = createAndAppend('div', contributorsContainer, {
      class: 'card card-small',
    });
    createAndAppend('img', contributorCard, {
      src: contributor.avatar_url,
      width: '50px',
    });
    createAndAppend('a', contributorCard, {
      href: contributor.html_url,
      class: 'userName',
      target: '_blank',
      text: contributor.login,
    });
    createAndAppend('div', contributorCard, {
      class: 'badge',
      text: contributor.contributions,
    });
  }
  // The function loops over each contributor and display it on the page using the function above. The two functions could've been combined but I chose to separate them for clarity and readability.
  function displayContributors(contributors, contributorsContainer) {
    createAndAppend('p', contributorsContainer, {
      text: 'Contributors',
      class: 'card contributorsTitle',
    });
    contributors.forEach(contributor =>
      showContributor(contributor, contributorsContainer),
    );
  }

  function main(url) {
    // Selecting and creating main elements on page
    const root = document.getElementById('root');
    const headerContainer = createAndAppend('header', root, {
      class: 'header',
    });
    createAndAppend('p', headerContainer, { text: 'HYF Repositories' });
    const selectionMenu = createAndAppend('select', headerContainer, {
      class: 'selectMenu',
    });
    const mainContainer = createAndAppend('main', root, {
      class: 'main-container',
    });
    const reposContainer = createAndAppend('section', mainContainer, {
      class: 'repo-container',
    });
    const contributorsContainer = createAndAppend('section', mainContainer, {
      class: 'contributors-container',
    });
    // Creating a variable with sorted repos to be used after running the code and after a change in the menu
    const sortedRepos = fetchJSON(url).then(repos =>
      sortRepos(repos, selectionMenu),
    );
    // Showing the first repo and its contributors by default
    sortedRepos
      .then(repos => showRepo(repos[0], reposContainer))
      .then(listOfContributors =>
        displayContributors(listOfContributors, contributorsContainer),
      )
      .catch(err =>
        createAndAppend('div', root, {
          text: err,
          class: 'alert-error',
        }),
      );
    // Adding an event listener for change on the select menu and updating the view
    selectionMenu.addEventListener('change', e => {
      const index = e.target.value;
      reposContainer.innerHTML = '';
      contributorsContainer.innerHTML = '';
      sortedRepos
        .then(repos => showRepo(repos[index], reposContainer))
        .then(listOfContributors =>
          displayContributors(listOfContributors, contributorsContainer),
        );
    });
  }

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
