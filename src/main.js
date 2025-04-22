import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  hideLoadMoreButton,
  showLoadMoreButton,
} from './js/render-functions.js';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.form');
const input = document.querySelector('[name="search-text"]');
const submitBtn = document.querySelector('[type="submit"]');
const gallery = document.querySelector('.gallery');

let currentQuery = '';
let page = 1;
const perPage = 15;
let totalHits = 0;

hideLoadMoreButton();
hideLoader();

form.addEventListener('submit', async e => {
  e.preventDefault();
  showLoader();
  const currentQuery = e.target.elements[0].value.trim();
  if (!currentQuery) {
    hideLoader();
    iziToast.warning({
      message: 'Please enter a search term.',
      position: 'topRight',
    });
    return;
  }
  page = 1;
  clearGallery();
  hideLoadMoreButton();
  try {
    const data = await getImagesByQuery(currentQuery, page, perPage);
    totalHits = data.totalHits;

    if (data.hits.length === 0) {
      iziToast.warning({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      return;
    }
    createGallery(data.hits);

    if (perPage * page < totalHits) showLoadMoreButton();
  } catch (error) {
    iziToast.error({ message: 'Error loading images.', position: 'topRight' });
    console.error(error);
  } finally {
    hideLoader();
  }
});

const handleLoadMore = async () => {
  page += 1;
  hideLoadMoreButton();
  showLoader();
  try {
    const data = await getImagesByQuery(currentQuery, page, perPage);
    createGallery(data.hits);

    if (perPage * page < totalHits) {
      showLoadMoreButton();
    } else {
      iziToast.info({
        message: 'We are sorry, but you`ve reached the search results.',
        position: 'topRight',
      });
    }
  } catch (error) {
    iziToast.error({
      message: 'Failed to load more images.',
      position: 'topRight',
    });
    console.error(error);
  } finally {
    hideLoader();
  }
};
document.addEventListener('click', e => {
  if (e.target.matches('.load-more-btn')) {
    handleLoadMore();
  }
});
