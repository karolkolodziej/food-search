import {elements} from './base';

export const getInput = () => elements.searchInput.value;

export const cleanInput = () => {
    elements.searchInput.value = ''
};

export const cleenResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

export const highlihtSelected = id =>{ 
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active')
    })
    document.querySelector(`a[href="#${id}"]`).classList.add('results__link--active');
};


//Reduce length of recipe title 
export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length
        }, 0);
        //Return results with spaces between words
        return `${newTitle.join(' ') }...`;
    }
    return title
};

const renderRecipe = recipe => {
    const markup = `
    <li>
                    <a class="results__link" href="#${recipe.recipe_id}">
                        <figure class="results__fig">
                            <img src="${recipe.image_url}" ${recipe.title}">
                        </figure>
                        <div class="results__data">
                            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                            <p class="results__author">${recipe.publisher}</p>
                        </div>
                    </a>
                </li>
    `;
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

//Type: prev, next
const createButton = (page, type) => {
    //creating the markup for the prev and next button  
    return `<button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
    <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>`;
};

const renderButtons = (page, numResults, resPerPage) =>{
    const pages = Math.ceil(numResults / resPerPage);
    let button;
     
    if (page === 1 && pages >1 ) {
        //Button- next page
         button = createButton(page, 'next');
    }else if (page < pages) {
        //Both buttons
        button = `
        ${createButton(page, 'prev')}
        ${createButton(page, 'next')}
        `;
    } else if (page === pages) {
        //Button- previous page 
        button = createButton(page, 'prev')
    }
    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    //Render results of cur page

    const start = (page -1) *resPerPage;
    const end = page * resPerPage;

    recipes.slice(start, end).forEach(renderRecipe);
    
    //Render button
    renderButtons(page, recipes.length, resPerPage)
};

function newFunction() {
    let button;
    return button;
}
