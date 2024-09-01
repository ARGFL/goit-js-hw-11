// Importă SimpleLightbox și stilurile sale
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

// Așteaptă ca documentul să fie complet încărcat
document.addEventListener('DOMContentLoaded', () => {
  
  // Inițializează SimpleLightbox pentru linkurile din galerie
  const lightbox = new SimpleLightbox('.gallery a');
  
  // Selectează elementele din DOM
  const form = document.getElementById('search-form');
  const gallery = document.querySelector('.gallery');
  const loadMoreBtn = document.querySelector('.load-more');

  // Variabile pentru stocarea cuvântului cheie și gestionarea paginării
  let searchQuery = '';
  let page = 1;
  const perPage = 40;  // Numărul de imagini pe pagină

  // Funcție asincronă pentru a obține imaginile de la API-ul Pixabay
  const fetchImages = async () => {
    const API_KEY = '45740320-8998945ab22406472f5d99c94';  // Cheia API pentru autentificare
    const url = `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(searchQuery)}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;
    
    try {
      // Efectuează cererea HTTP către API și extrage datele din răspuns
      const { data } = await axios.get(url);

      // Verifică dacă nu s-au găsit imagini și afișează un mesaj de eroare
      if (!data.totalHits) {
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        return;
      }

      // Afișează o notificare cu numărul total de imagini găsite la prima pagină
      if (page === 1) {
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      }

      // Apelează funcția pentru a randa imaginile în galerie
      renderImages(data.hits);

      // Verifică dacă există mai multe imagini de afișat și gestionează vizibilitatea butonului "Load More"
      loadMoreBtn.style.display = data.totalHits > perPage * page ? 'block' : 'none';
      if (data.totalHits <= perPage * page) {
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
      }

      // Reîmprospătează instanța SimpleLightbox pentru a include noile imagini
      lightbox.refresh();

    } catch (error) {
      // Afișează o eroare în consolă și o notificare dacă cererea HTTP eșuează
      console.error('Error fetching images:', error);
      Notiflix.Notify.failure('Something went wrong. Please try again later.');
    }
  };

  // Funcție pentru a randa imaginile în galerie
  const renderImages = (images) => {
    // Creează marcajul HTML pentru fiecare imagine și le adaugă în galerie
    const markup = images.map(({ largeImageURL, webformatURL, tags, likes, views, comments, downloads }) => `
      <a href="${largeImageURL}" class="gallery-link">
        <div class="photo-card">
          <img src="${webformatURL}" alt="${tags}" loading="lazy" />
          <div class="info">
            <p class="info-item"><b>Likes</b> ${likes}</p>
            <p class="info-item"><b>Views</b> ${views}</p>
            <p class="info-item"><b>Comments</b> ${comments}</p>
            <p class="info-item"><b>Downloads</b> ${downloads}</p>
          </div>
        </div>
      </a>
    `).join('');

    // Adaugă imaginile în containerul `.gallery`
    gallery.insertAdjacentHTML('beforeend', markup);
  };

  // Funcție pentru a șterge conținutul galeriei (de exemplu, înainte de o nouă căutare)
  const clearGallery = () => {
    gallery.innerHTML = '';
  };

  // Gestionează evenimentul de submit al formularului de căutare
  form.addEventListener('submit', e => {
    e.preventDefault();  // Previne comportamentul implicit al formularului
    searchQuery = e.target.searchQuery.value.trim();  // Preia valoarea introdusă în câmpul de căutare

    // Verifică dacă câmpul de căutare este gol și afișează o notificare
    if (!searchQuery) {
      Notiflix.Notify.warning('Please enter a search query.');
      return;
    }

    // Resetează starea pentru o nouă căutare
    page = 1;
    clearGallery();
    loadMoreBtn.style.display = 'none';
    fetchImages();
  });

  // Gestionează evenimentul de click pe butonul "Load More" pentru a încărca mai multe imagini
  loadMoreBtn.addEventListener('click', () => {
    page += 1;  // Crește pagina pentru a încărca următorul set de imagini
    fetchImages();  // Apelează funcția pentru a încărca mai multe imagini
  });
});
