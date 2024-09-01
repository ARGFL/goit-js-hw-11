// Selectează elementele relevante din DOM
const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let searchQuery = '';  // Variabilă pentru a stoca cuvântul cheie de căutare
let page = 1;  // Inițializează pagina la 1
const perPage = 40;  // Numărul de imagini pe pagină

// Funcție asincronă pentru a obține imaginile de la API-ul Pixabay
async function fetchImages() {
    const API_KEY = '45740320-8998945ab22406472f5d99c94';  // Cheia API pentru autentificare
    const url = `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(
      searchQuery
    )}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;
  
    console.log(`Fetching images for query: "${searchQuery}" on page: ${page}`);
  
    try {
      const response = await axios.get(url);  // Realizează cererea HTTP la API
      const data = response.data;  // Stochează datele din răspuns
  
      console.log('Response data:', data);
  
      // Verifică dacă nu s-au găsit imagini
      if (data.totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        console.log('No images found.');
        return;
      }
  
      // Afișează notificarea cu numărul total de imagini găsite
      if (page === 1) {
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      }
  
      // Randează imaginile în galerie
      renderImages(data.hits);
      console.log(`Images rendered for page: ${page}`);
  
      // Verifică dacă mai sunt imagini de afișat pentru a decide dacă arată butonul "Load more"
      if (data.totalHits > perPage * page) {
        loadMoreBtn.style.display = 'block';
        console.log('More images available. Showing "Load more" button.');
      } else {
        loadMoreBtn.style.display = 'none';
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
        console.log('No more images available. Hiding "Load more" button.');
      }
    } catch (error) {
      // În caz de eroare la cererea HTTP, se afișează un mesaj în consolă și o notificare de eroare
      console.error('Error fetching images:', error);
      Notiflix.Notify.failure('Something went wrong. Please try again later.');
    }
  }
  

// Funcție pentru a randa imaginile în galerie
function renderImages(images) {
  // Afișează în consolă lista de imagini care urmează să fie randează
  console.log('Rendering images:', images);

  // Creează marcajul HTML pentru fiecare imagine și îl adaugă în galerie
  const markup = images
    .map(
      image => `
      <div class="photo-card">
        <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes:</b> ${image.likes}
          </p>
          <p class="info-item">
            <b>Views:</b> ${image.views}
          </p>
          <p class="info-item">
            <b>Comments:</b> ${image.comments}
          </p>
          <p class="info-item">
            <b>Downloads:</b> ${image.downloads}
          </p>
        </div>
      </div>
    `
    )
    .join('');  // Concatenează toate cardurile de imagini într-un singur șir de caractere HTML

  gallery.insertAdjacentHTML('beforeend', markup);  // Adaugă imaginile în galerie
  console.log('Gallery updated with new images.');
}

// Funcție pentru a șterge conținutul galeriei
function clearGallery() {
  gallery.innerHTML = '';  // Golește conținutul HTML al galeriei
  console.log('Gallery cleared.');
}

// Evenimentul de submit al formularului de căutare
form.addEventListener('submit', e => {
  e.preventDefault();  // Previne comportamentul implicit al formularului
  searchQuery = e.target.searchQuery.value.trim();  // Preia valoarea introdusă în câmpul de căutare
  console.log('Form submitted with search query:', searchQuery);

  page = 1;  // Resetează pagina la 1 pentru o nouă căutare
  clearGallery();  // Golește galeria înainte de a afișa noile rezultate
  loadMoreBtn.style.display = 'none';  // Ascunde butonul "Load more"

  // Verifică dacă câmpul de căutare este gol
  if (searchQuery === '') {
    Notiflix.Notify.warning('Please enter a search query.');
    console.log('Search query is empty. Warning displayed.');
    return;
  }

  fetchImages();  // Apelează funcția pentru a căuta imaginile
});

// Evenimentul de click pe butonul "Load more"
loadMoreBtn.addEventListener('click', () => {
  page += 1;  // Incrementează numărul paginii pentru a încărca mai multe imagini
  console.log('Load more button clicked. Loading page:', page);
  fetchImages();  // Apelează funcția pentru a încărca mai multe imagini
});
