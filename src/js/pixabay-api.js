import axios from 'axios';
export async function getImagesByQuery(query, page = 1) {
  const BASE_URL = 'https://pixabay.com/api/';
  const API_KEY = '49539312-1d6717d33bfa63c1c4ab44e48';
  const response = await axios.get(BASE_URL, {
    params: {
      key: API_KEY,
      q: `${query}`,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: page,
      per_page: 15,
    },
  });

  return response.data;
}
