
//metodo con axios
//se hace ahora la conversion a axios y se define su estructura
//en axios se puede establecer parametros o los queeryparameters para no estar copiandolos cada vez que se llama una url
const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers:{
        'Content-Type': 'application/json;charset=utf-8',
    },
    params:{
        'api_key': API_KEY,
    }
});

//Utils o helpers

//al intersectionObserver se le pasa dos argumentos callback y optiones sin embargo como no vamos a poner un observador a cada contenedor sino a toda la pantalla que ve el usuario no se le pasa el segundo argumento
const lazyLoader = new IntersectionObserver( (entries) =>{
    entries.forEach( (entry) => {
       console.log({entry});

       if(entry.isIntersecting){
        const url = entry.target.getAttribute('data-img')
        entry.target.setAttribute ('src', url)
       }
         
    });
})


function createMovies(movies, container, {lazyLoad = false, clean = true}={},){
    if(clean){
        container.innerHTML = '';
    }
    
    
    

    movies.forEach(movie => {
        //const trendingMoviesPreviewList = document.querySelector('#trendingPreview .trendingPreview-movieList'); //para evitar que se duplique las peliculas
        const movieContainer = document.createElement('div')
        movieContainer.classList.add('movie-container');
        movieContainer.addEventListener('click', () =>{
            location.hash = 'movie=' + movie.id;
        })

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        

        movieImg.setAttribute(
          lazyLoad ?  'data-img': 'src',  //se cambioa el atributo src por data-img para usarlo en el lazyloading
            'https://image.tmdb.org/t/p/w300/'+ movie.poster_path
        );

        //en el caso de que una imagen no carge bien desde el servicio o el backend
        movieImg.addEventListener('error', () =>{
            movieImg.setAttribute('src', 'https://static.platzi.com/static/images/error/img404.png');
        })

        if(lazyLoad){
            lazyLoader.observe(movieImg)
        };
        
        movieContainer.appendChild(movieImg);
        container.appendChild(movieContainer);

    
    });
}

function createCategories(categories, container){
    container.innerHTML = '';

    categories.forEach(category => {
        //const categoriesPreviewList = document.querySelector('#categoriesPreview .categoriesPreview-list'); se saca dado que se esta duplicando la informacion 
        const categoryContainer = document.createElement('div')
        categoryContainer.classList.add('category-container');

        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id', 'id'+category.id);
        categoryTitle.addEventListener('click', ()=>{
            location.hash =`#category=${category.id}-${category.name}`;
        })
        const categoryTitleText = document.createTextNode(category.name);
        
        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        container.appendChild(categoryContainer);

    
    });
};


//lamados a la API

async function getTrendingMoviesPreview(){
    const { data } = await api('trending/movie/day');
    const movies = data.results;

    createMovies(movies, trendingMoviesPreviewList, true );
    
}

async function getCategoriesPreview(){
    const { data } = await api('genre/movie/list');  //axios parsea autoamticamente a data
    const categories = data.genres;

    createCategories(categories, categoriesPreviewList);

    
}

async function getMoviesByCategory(id){
    const { data } = await api('discover/movie', {
        params: {
            with_genres: id,
        },
    });
    
    const movies = data.results;
    maxPage = data.total_pages;

    createMovies(movies, genericSection, {lazyLoad:true});

    
}

function getPaginatedMoviesByCategory(id) {
    return async function () {
      const {
        scrollTop,
        scrollHeight,
        clientHeight
      } = document.documentElement;
      
      const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
      const pageIsNotMax = page < maxPage;
    
      if (scrollIsBottom && pageIsNotMax) {
        page++;
        const { data } = await api('discover/movie', {
          params: {
            with_genres: id,
            page,
          },
        });
        const movies = data.results;
      
        createMovies(
          movies,
          genericSection,
          { lazyLoad: true, clean: false },
        );
      }
    }
  }

async function getMoviesBySearch(query){
    const { data } = await api('search/movie', {
        params: {
            query
        },
    });
    
    const movies = data.results;
    maxPage = data.total_pages;
    console.log(maxPage);

    createMovies(movies, genericSection);

    
}

function getPaginatedMoviesBySearch(query){
    //se va a realizar uso de closure para poder implementar el scroll infinito en la sección de busqueda
    //se retorna un valor en este caso una funciona la cual no se ha ejecutado y en el archivo navigation es donde 
    //se va a ejecturar
    return async function () {
        const {
            scrollTop,
            scrollHeight,
            clientHeight
          } = document.documentElement; //se desctructura para no estar repitiendo varias veces document.documentelement
          
          const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15); //se resta 15 para que no genere conflicto al bajar toda la pagina
          const pageIsNotMax = page < maxPage;
          
    
        if(scrollIsBottom && pageIsNotMax){
            const { data } = await api('search/movie', {
                params: {
                    query,
                    page,
                },
            });
            
            const movies = data.results;
            createMovies(movies, genericSection, { lazyLoad:true, clean:false} );
        }
    }
    
   
}

async function getTrendingMovies(){
    const { data } = await api('trending/movie/day');
    const movies = data.results;
    maxPage = data.total_pages;
    //console.log(data.total_pages);

    //console.log(movies);

    createMovies(movies, genericSection, { lazyLoad:true, clean:true} );

    // const btnLoadMore = document.createElement('button');
    // btnLoadMore.innerText = 'Cargar Mas'
    // btnLoadMore.addEventListener('click', getPaginatedTrendingMovies);
    // genericSection.appendChild(btnLoadMore);
    
}


async function getPaginatedTrendingMovies(){
    const {
        scrollTop,
        scrollHeight,
        clientHeight
      } = document.documentElement; //se desctructura para no estar repitiendo varias veces document.documentelement
      
      const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15); //se resta 15 para que no genere conflicto al bajar toda la pagina
      const pageIsNotMax = page < maxPage;
      

    if(scrollIsBottom && pageIsNotMax){
        page++;
        const { data } = await api('trending/movie/day',{
            params: {
                page //´para que sea dinamica y muestre la siguiente pagina al llamar la funcion de nuevo
            },
        });

        const movies = data.results;
        createMovies(movies, genericSection, { lazyLoad:true, clean:false} );
    }
    
    

    

    // const btnLoadMore = document.createElement('button');
    // btnLoadMore.innerText = 'Cargar Mas'
    // btnLoadMore.addEventListener('click', getPaginatedTrendingMovies);
    // genericSection.appendChild(btnLoadMore);
}

async function getMovieById(id){
    const { data: movie } = await api('movie/' + id); //como no se recibe un array de objetos solo se necesita a data y se renombra a movie
    
    const movieImgUrl = 'https://image.tmdb.org/t/p/w500/' + movie.poster_path
    console.log(movieImgUrl);
    headerSection.style.background = `
    linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%),
    url(${movieImgUrl})`;

    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average;

    createCategories(movie.genres, movieDetailCategoriesList);
    getRelatedMoviesId(id);


    
}

async function getRelatedMoviesId(id){
    const { data } = await api(`movie/${id}/recommendations`);
    const relatedMovies = data.results;

    createMovies(relatedMovies,relatedMoviesContainer);
}

//para el lazyloading tener cuidad con el heigth de las imagenes porque si todas aparecen al mismo tiempo 
//porque tiene tamaño 0 , todas aparecen de inmediato.. tener cuidado en el css