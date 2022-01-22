'use strict';
import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  /**
   * Documentation how write this in on Jsdoc.app
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be render(e.g. recipe)
   * @param {boolean} [render=true] If false create markup string instead rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {Object} View instance
   * @author Daniel Ancuta
   * @todo Finish implementation
   */
  render(data, render = true) {
    // console.log(this); // we receive this val from child
    // guard clause data or empty array
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError(); // error msg comes from child like resultsView set in _errorMessage

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    // transform string to new DOM el and compare with old one
    const newDOM = document.createRange().createContextualFragment(newMarkup);

    const newElements = Array.from(newDOM.querySelectorAll('*')); // array of elements virtual DOM - node list
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      // compare two DOM nodes and update where is a change
      // second condition we select the node value the text from nodeEL
      // the condition below executes on elements that contains text

      // Update text changed
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log(newEl.firstChild.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }

      // Update attributes
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(error = this._errorMessage) {
    // if no error pass we set default
    const markup = `
     <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${error}</p>
          </div> `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(success = this._successMessage) {
    // if no success pass we set default
    const markup = `
     <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${success}</p>
          </div> `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
