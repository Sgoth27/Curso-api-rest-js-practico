let maxPage;
let page= 1;
let infiniteScroll;

searchFormBtn.addEventListener('click', () =>{
    
    location.hash = '#search=' + searchFormInput.value;
})

trendingBtn.addEventListener('click', () =>{
    location.hash = '#trends';
})

arrowBtn.addEventListener('click', () =>{
    history.back(); //para que al dar sobre la flecha guarde historial de navegación
    //location.hash = '#home';
})

window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);
window.addEventListener('scroll', infiniteScroll, false);

//Passive lo que hace es evitar el llamado de preventDefault() en el caso de que este existiese en la función llamada por el Listener. En los navegadores que usa la gente normal el valor por defecto es false por lo que no se aplica, pero en el caso de Safari e Internet Explorer el valor por defecto es true. Por lo que supongo que es recomendable ponerle un valor para que el código se ejecute igual en todos los navegadores.

function navigator(){
    console.log({location});

    if(infiniteScroll){
        window.removeEventListener('scroll', infiniteScroll, {passive: false});
        infiniteScroll = undefined;
    }

    if (location.hash.startsWith('#trends')){
        trendsPage()
    }else if(location.hash.startsWith('#search=')){
        searchPage()
    }else if(location.hash.startsWith('#movie=')){
        movieDetailsPage();
    }else if(location.hash.startsWith('#category=')){
        categoriesPage();
    }else{
        homePage();
    }

    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    //document.body.scrollTop  = 0;

    if(infiniteScroll){
        window.addEventListener('scroll', infiniteScroll,{passive: false});
    }
    
}

function homePage(){
    console.log('Home');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.add('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.remove('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.remove('inactive');
    categoriesPreviewSection.classList.remove('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');

    getTrendingMoviesPreview();
    getCategoriesPreview();
}

function categoriesPage(){
    console.log('categories');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    // const url = location.hash.split('=')  //para convertir la url en un array de strings seprando donde encuentre un igual ['#category', 'id-name'];
    // const urlPage = url[0];
    // const urlInfo = url[1];

    //con ecma 6 se puede destructurar lo de arriba de la siguiente forma
    const [ _ , categoryData] = location.hash.split('=');

    const [categoryId, categoryName] = categoryData.split('-');

    headerCategoryTitle.innerHTML = categoryName;

    getMoviesByCategory(categoryId);
    infiniteScroll = getPaginatedMoviesByCategory(id); 
}

function movieDetailsPage(){
    console.log('Movie');

    headerSection.classList.add('header-container--long');
    //headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive');

    const [ _ , movieId] = location.hash.split('=');

    getMovieById(movieId);

    
}

function searchPage(){
    console.log('Search');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    //['#search', 'lo que digito el usuario']
    const [ _ , query] = location.hash.split('=');
    getMoviesBySearch(query);

    //se hace closure en el archivo de main para que aqui ahora si no se tenga conflicto al hacer el llamado de la funcion
    //es decir cuando se escuche el evento de scroll se estaria enviando algo como getPaginatedMoviesBySearch(query)(); 
    infiniteScroll = getPaginatedMoviesBySearch(query); 
}

function trendsPage(){
    console.log('TRENDS');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    headerCategoryTitle.innerHTML = 'Tendencias';

    getTrendingMovies();

    infiniteScroll = getPaginatedTrendingMovies;
}