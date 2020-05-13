'use strict';

{
  // A global variable for a template that will be used to create the card with the information from the repo.
  const HYFInfoTemplate = [
    { title: 'Repository', desc: 'name', link: 'html_url', target: '_blank' },
    { title: 'Description', desc: 'description' },
    {
      title: 'Forks',
      desc: 'forks_count',
    },
    {
      title: 'Updated',
      desc: 'updated_at',
    },
  ];
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
  async function getDataAxios(url) {
    const response = await axios.get(url);
    return response.data;
  }
  // Creating the selection menu
  function createMenu(repo, index, selectionMenu) {
    createAndAppend('option', selectionMenu, {
      text: repo.name,
      value: index,
    });
  }
  // A function that sorts the fetched repositories alphabetically. I could've joined this function with the fetch function, but chose to separate them for clarity and readability.
  function sortRepos(repos, selectionMenu) {
    repos
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((repo, index) => createMenu(repo, index, selectionMenu));
    return repos;
  }
  // Creates a table based on a template indicating the elements that will be shown from the repo.
  function createTable(repository, parent, referenceTemplate) {
    const infoTable = createAndAppend('table', parent);
    referenceTemplate.forEach(item => {
      const row = createAndAppend('tr', infoTable);
      createAndAppend('td', row, { text: `${item.title}:` });
      if (item.title === 'Updated') {
        createAndAppend('td', row, {
          text: repository[item.desc].replace(/[ tz]/gi, ' '),
        });
        // eslint-disable-next-line no-prototype-builtins
      } else if (!item.hasOwnProperty('link')) {
        createAndAppend('td', row, {
          text: repository[item.desc],
        });
      } else {
        createAndAppend('a', row, {
          text: repository[item.desc],
          href: repository[item.link],
          target: item.target,
        });
      }
    });
  }
  // Shows the selected repository. In previous homework the create table was acallback, which I changed due to that I think it belongs to the showRepo function
  function showRepo(repo, parent) {
    const card = createAndAppend('div', parent, { class: 'card' });
    createTable(repo, card, HYFInfoTemplate);
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

  async function main(url) {
    // Selecting and creating main elements on page and assigning variables
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
    try {
      const sortedRepos = await getDataAxios(url).then(repos =>
        sortRepos(repos, selectionMenu),
      );
      let selectedRepo = sortedRepos[0];
      let selectedListOfContributors = await getDataAxios(
        selectedRepo.contributors_url,
      );
      showRepo(selectedRepo, reposContainer);
      displayContributors(selectedListOfContributors, contributorsContainer);
      selectionMenu.addEventListener('change', async e => {
        const index = e.target.value;
        selectedRepo = sortedRepos[index];
        selectedListOfContributors = await getDataAxios(
          selectedRepo.contributors_url,
        );
        reposContainer.innerHTML = '';
        contributorsContainer.innerHTML = '';
        showRepo(selectedRepo, reposContainer);
        displayContributors(selectedListOfContributors, contributorsContainer);
      });
    } catch (error) {
      createAndAppend('div', root, {
        text: error,
        class: 'alert-error',
      });
    }
  }

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
