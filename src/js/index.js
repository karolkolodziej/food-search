import Search from './model/Search';
import * as searchView from './view/searchView';
import {elements, renderLoader, clearLoader} from './view/base';

//GLOBAL STATE OF APP
//SEARCH OBJECT
//CURRENT RECIPE OBJECT
//SHOPPING LIST OBJECT
//LIKED RECIPES

const state = {};

const controleSearch = async () => {
    //1.Get query from view
    const query = searchView.getInput()
    console.log(query)

    if (query) {
        //2. New search object
        state.search = new Search(query);

        //3.Prepare UI
        searchView.cleanInput();
        searchView.cleenResults();
        renderLoader(elements.searchRes);

        //4. Search for recipe
        await state.search.getResults();


        //5. Render results for UI
        clearLoader();
        searchView.renderResults(state.search.result);
    }
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controleSearch();

});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.cleenResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});


