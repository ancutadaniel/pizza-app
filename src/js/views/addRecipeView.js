import View from './View';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _successMessage = 'Recipe was successfully added!';

  _windowEl = document.querySelector('.add-recipe-window');
  _overlayEl = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  _uploadRecipeBtn = document.querySelector('.upload__btn');

  constructor() {
    super();
    this._addHandlerOpenModal();
    this._addHandlerCloseModal();
  }

  toggleModal() {
    this._overlayEl.classList.toggle('hidden');
    this._windowEl.classList.toggle('hidden');
  }

  _addHandlerOpenModal() {
    this._btnOpen.addEventListener('click', this.toggleModal.bind(this));
  }
  _addHandlerCloseModal() {
    this._btnClose.addEventListener('click', this.toggleModal.bind(this));
    this._overlayEl.addEventListener('click', this.toggleModal.bind(this));
  }

  addHandlerUploadRecipe(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)]; // ES2019 convert array entries to object
      const data = Object.fromEntries(dataArr);

      handler(data);
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
