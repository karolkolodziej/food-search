import Search from './model/Search';
import List from './model/List';
import Likes from './model/Likes';
import * as searchView from './view/searchView';
import * as recipeView from './view/RecipeView';
import * as listView from './view/listView';
import * as likesView from './view/likesView';
import Recipe from './model/Recipe';
import {elements, renderLoader, clearLoader} from './view/base';

//GLOBAL STATE OF APP
//SEARCH OBJECT
//CURRENT RECIPE OBJECT
//SHOPPING LIST OBJECT
//LIKED RECIPES

const state = {};

//SEARCH CONTROLER
const controleSearch = async () => {
    
    //1.Get query from view
    const query = searchView.getInput() 
        if (query) {
        //2. New search object
        state.search = new Search(query);

        //3.Prepare UI
        searchView.cleanInput();
        searchView.cleenResults();
        renderLoader(elements.searchRes);

        try {
            //4. Search for recipe
            await state.search.getResults();
   
            //5. Render results for UI
            clearLoader();
            searchView.renderResults(state.search.result);
        }catch (err){
            alert('Something wrong with search')
            clearLoader();
        }
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

//RECIPE CONTROLER
const controlRecipe = async () => {
    //Get ID from URL
    const id = window.location.hash.replace('#', '')
    //console.log(id)
    
    if (id) {
        //Prep UI 
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //Highlight selected
        if(state.search){
        searchView.highlihtSelected(id);
        }
        //Create new recipe obj
        state.recipe = new Recipe(id);
        //window.r = state.recipe////////For test
        //Get recipe data and parse ingred
        try{

            await state.recipe.getRecipe();
            state.recipe.parsIngredients();
            //Calc serving and time
            state.recipe.calcTime();
            state.recipe.calcServings();
            //Render recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
                );
        }catch (error){           
            alert('Err-procesing - Something went wrong :(((');   
        }
    }
};

//window.addEventListener('hashchange', controlRecipe)
//window.addEventListener('load', controlRecipe)

['hashchange','load'].forEach(event => window.addEventListener(event, controlRecipe)); 

//LIST CONTROLER
const controlList = () =>{
    //Create new list
    if(!state.list){
        state.list = new List ()
    }
    //Add each ing 
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    })
}

//Del and update list
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    //del btn
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        state.list.deleteItem(id);
        listView.deleteItem(id);
    }else if (e.target.matches('.shopping__count-value')){
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val)
    }
});

//LIKE CONTROLLER 
state.likes = new Likes();
likesView.toggleLikeMenu(state.likes.getNumLikes());

const controlLike = () =>{
    if(!state.likes) state.likes = new Likes();
    const currentID= state.recipe.id;

    if(!state.likes.isLiked(currentID)){
        //Add like to state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        //Toggle the like btn
            likesView.toggleLikeBtn(true);
        //Add to UI
        likesView.renderLike(newLike);
    }else{
        //Remove like to state
            state.likes.deleteLike(currentID)
        //Toggle the like btn
        likesView.toggleLikeBtn(false);
        //Remove to UI
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

//Restore liked recipes
window.addEventListener('load', () => {
    state.likes = new Likes();    
    state.likes.readStorage();
    likesView.toggleLikeMenu(state.likes.getNumLikes());
    state.likes.likes.forEach(like => likesView.renderLike(like));
});

//Handling recipe button clicks
elements.recipe.addEventListener('click', e =>{
    if (e.target.matches('.btn-dec, .btn-dec *')){
        //Dec btn is clicked
        if (state.recipe.servings > 1)
        state.recipe.updateServings('dec')
        recipeView.updateServingIngr(state.recipe)
    }else if (e.target.matches('.btn-inc, .btn-inc *')){
        //Inc btn is clicked
        state.recipe.updateServings('inc')
        recipeView.updateServingIngr(state.recipe)
    }else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        controlList()
    }else if (e.target.matches('.recipe__love, .recipe__love *')) {
        //like controler
        controlLike();
    }   
});

