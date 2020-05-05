'use strict';

{
  function fetchJSON(url, cb) {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        cb(data);
      })
      .catch(err =>
        createAndAppend('div', root, {
          text: err,
          class: 'alert-error',
        }),
      );
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

  function createMenu(repo, index, selectionMenu) {
    createAndAppend('option', selectionMenu, {
      text: repo.name,
      value: index,
    });
  }
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
  }
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
  // function displayRepoAndContributors(contributors, repo) {
  //   const mainContainer = createAndAppend('main', root, {
  //     class: 'main-container',
  //   });
  //   const contributorsContainer = createAndAppend('section', mainContainer, {
  //     class: 'contributors-container',
  //   });
  //   const reposContainer = createAndAppend('section', mainContainer, {
  //     class: 'repo-container',
  //   });
  //   showRepo(repo, reposContainer);
  //   createAndAppend('p', contributorsContainer, {
  //     text: 'Contributors',
  //     class: 'card contributorsTitle',
  //   });
  //   // contributors.forEach(contributor =>
  //   //   showContributor(contributor, contributorsContainer),
  //   // );
  // }
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

    fetchJSON(url, repos => {
      repos
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach((repo, index) => createMenu(repo, index, selectionMenu));
      // showing the first repo by default
      // showRepo(repos[0], reposContainer);
      fetchJSON(repos[0].contributors_url, contributors => {
        showRepo(repos[0], reposContainer);
        contributors.forEach(contributor =>
          showContributor(contributor, contributorsContainer),
        );
      });

      // Adding an event listener for changes in the selector
      selectionMenu.addEventListener('change', e => {
        const index = e.target.value;
        reposContainer.innerHTML = '';
        contributorsContainer.innerHTML = '';
        fetchJSON(repos[index].contributors_url, contributors => {
          showRepo(repos[index], reposContainer);
          createAndAppend('p', contributorsContainer, {
            text: 'Contributors',
            class: 'card contributorsTitle',
          });
          contributors.forEach(contributor =>
            showContributor(contributor, contributorsContainer),
          );
        });
      });
    });
  }

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
