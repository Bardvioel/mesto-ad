import axios from 'axios';

const api = axios.create({
  baseURL: 'https://mesto.nomoreparties.co/v1/...',
  headers: {
    authorization: '...',
    'Content-Type': 'application/json'
  },
});

const handleResponse = (response) =>  response.data;
const handleError = (error) => console.log(error);

export const getUserInfo = () => {
  return api.get('/users/me')
    .then(handleResponse)
    .catch(handleError);
};

export const getCardList = () => {
  return api.get('/cards')
    .then(handleResponse)
    .catch(handleError);
};

export const setUserInfo = ({ name, about }) => 
  api.patch('/users/me', { name, about })
  .then(handleResponse)
  .catch(handleError);

export const setAvatarInfo = ({ avatar }) => 
  api.patch('/users/me/avatar', { avatar })
  .then(handleResponse)
  .catch(handleError);

export const addNewCard = ({ name, link }) =>
  api.post('/cards', { name, link })
  .then(handleResponse)
  .catch(handleError);

export const delCard = ( cardId ) =>
  api.delete(`/cards/${cardId}`)
  .then(handleResponse)
  .catch(handleError);

export const changeLikeCardStatus = (cardId, isLiked) => 
  api({
    url: `/cards/likes/${cardId}`,
    method: isLiked ? 'DELETE' : 'PUT'
  })
    .then(handleResponse)
    .catch(handleError);
