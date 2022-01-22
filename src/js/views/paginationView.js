'use strict';
import View from './View';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  // publisher function that listen to the event and pass down to the controller
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      e.preventDefault();
      //event delegation
      const btn = e.target.closest('.btn--inline');

      if (!btn) return;

      // to create connection DOM - js we use data attributes
      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }

  _generateMarkup() {
    const currentPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    console.log(this, numPages);
    // page 1, there are other pages
    if (currentPage === 1 && numPages > 1) {
      return `
         <button data-goto="${
           currentPage + 1
         }" class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
    }
    // last page
    if (currentPage === numPages && numPages > 1) {
      return `
          <button  data-goto="${
            currentPage - 1
          }"  class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
          </button>`;
    }
    // other page
    if (currentPage < numPages) {
      return `
          <button data-goto="${
            currentPage - 1
          }"  class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
          </button>
          <button data-goto="${
            currentPage + 1
          }"  class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
          `;
    }

    // page 1, there are NO other pages
    return '';
  }
}

export default new PaginationView();
