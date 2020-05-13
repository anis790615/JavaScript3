'use strict';

{
  const { createAndAppend } = window.Util;

  class RepoView {
    constructor(container) {
      this.container = container;
    }

    update(state) {
      if (!state.error) {
        this.render(state.selectedRepo);
      }
    }

    /**
     * Renders the repository details.
     * @param {Object} repo A repository object.
     */
    render(repo) {
      this.container.innerHTML = '';
      const card = createAndAppend('div', this.container, {
        class: 'card',
      });
      const HYFInfoTemplate = [
        {
          title: 'Repository',
          desc: 'name',
          link: 'html_url',
          target: '_blank',
        },
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
      const infoTable = createAndAppend('table', card);
      HYFInfoTemplate.forEach(item => {
        const row = createAndAppend('tr', infoTable);
        createAndAppend('td', row, { text: `${item.title}:` });
        if (item.title === 'Updated') {
          createAndAppend('td', row, {
            text: repo[item.desc].replace(/[ tz]/gi, ' '),
          });
          // eslint-disable-next-line no-prototype-builtins
        } else if (!item.hasOwnProperty('link')) {
          createAndAppend('td', row, {
            text: repo[item.desc],
          });
        } else {
          createAndAppend('a', row, {
            text: repo[item.desc],
            href: repo[item.link],
            target: item.target,
          });
        }
      });
    }
  }

  window.RepoView = RepoView;
}
