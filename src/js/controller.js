import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';

import 'regenerator-runtime';
import 'core-js/stable';

// hot reload parcel
// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    // read the id hash # from url
    const id = window.location.hash.slice(1);

    // guard clause
    if (!id) return;
    recipeView.renderSpinner();

    //  0)  Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // 1) loading recipe from model
    await model.loadRecipe(id);

    // 2) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    console.log(error);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // 1) get query search
    const query = searchView.getQuery();

    // guard clause
    if (!query) return;

    // 2) load search from model
    await model.loadSearchResults(query);

    // 3) render search results
    // resultsView.render(model.state.search.results); // render all the results
    resultsView.render(model.getSearchResultsPage()); // get by page

    // 4) render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (error) {
    recipeView.renderError();
  }
};

const controlPagination = function (goToPage) {
  // 1) render NEW results
  // resultsView.render(model.state.search.results); // render all the results
  resultsView.render(model.getSearchResultsPage(goToPage)); // get by page

  // 4) render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings
  model.updateServings(newServings);

  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddDeleteBookmark = function () {
  // Add || Delete bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);

  // Display bookmark arrays
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading renderSpinner
    addRecipeView.renderSpinner();

    // Upload new recipe data
    await model.uploadRecipe(newRecipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Display success message
    addRecipeView.renderMessage();

    // Render bookmarksView
    bookmarksView.render(model.state.bookmarks);

    // Change the ID in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form modal
    setTimeout(() => addRecipeView.toggleModal(), MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    console.error(error);
    addRecipeView.renderError(error.message);
  }
};

const newFeature = () => console.log(`Welcome to the application!`);

const init = function () {
  // Publisher - subscriber pattern - relation controller view
  // Event should be listened for in view
  // Event should be handled for in controller
  // Solution: subscribe to publisher(recipeView) by passing the subscriber fct(controlRecipe) as argument
  // subscriber  - code that want to react
  recipeView.addHandlerRender(controlRecipes); // Publisher - subscriber pattern
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddDeleteBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  bookmarksView.addHandlerRender(controlBookmarks);
  addRecipeView.addHandlerUploadRecipe(controlAddRecipe);
};
init();
