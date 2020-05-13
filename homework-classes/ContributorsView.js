'use strict';

{
  const { createAndAppend } = window.Util;

  class ContributorsView {
    constructor(container) {
      this.container = container;
    }

    update(state) {
      if (!state.error) {
        this.render(state.contributors);
      }
    }

    /**
     * Renders the list of contributors
     * @param {Object[]} contributors An array of contributor objects
     */
    render(contributors) {
      this.container.innerHTML = '';
      createAndAppend('p', this.container, {
        text: 'Contributors',
        class: 'card contributorsTitle',
      });
      contributors.forEach(contributor => {
        const contributorCard = createAndAppend('div', this.container, {
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
      });
    }
  }

  window.ContributorsView = ContributorsView;
}
