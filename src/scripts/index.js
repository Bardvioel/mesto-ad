import { getCardList, getUserInfo, setUserInfo, setAvatarInfo, addNewCard, delCard, changeLikeCardStatus } from "./components/api.js";
import { createCardElement, deleteCard, likeCard } from "./components/card.js";
import { openModalWindow, closeModalWindow, setCloseModalWindowEventListeners } from "./components/modal.js";
import { enableValidation, clearValidation } from "./components/validation.js";

const validationSettings = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

enableValidation(validationSettings);

// DOM узлы
const placesWrap = document.querySelector(".places__list");
const profileFormModalWindow = document.querySelector(".popup_type_edit");
const profileForm = profileFormModalWindow.querySelector(".popup__form");
const profileTitleInput = profileForm.querySelector(".popup__input_type_name");
const profileDescriptionInput = profileForm.querySelector(".popup__input_type_description");

const cardFormModalWindow = document.querySelector(".popup_type_new-card");
const cardForm = cardFormModalWindow.querySelector(".popup__form");
const cardNameInput = cardForm.querySelector(".popup__input_type_card-name");
const cardLinkInput = cardForm.querySelector(".popup__input_type_url");

const imageModalWindow = document.querySelector(".popup_type_image");
const imageElement = imageModalWindow.querySelector(".popup__image");
const imageCaption = imageModalWindow.querySelector(".popup__caption");

const openProfileFormButton = document.querySelector(".profile__edit-button");
const openCardFormButton = document.querySelector(".profile__add-button");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");

const avatarFormModalWindow = document.querySelector(".popup_type_edit-avatar");
const avatarForm = avatarFormModalWindow.querySelector(".popup__form");
const avatarInput = avatarForm.querySelector(".popup__input_type_avatar");

const deleteCardModalWindow = document.querySelector(".popup_type_remove-card");
const deleteCardForm = deleteCardModalWindow.querySelector(".popup__form");

const usersModalWindow = document.querySelector(".popup_type_info");
const usersModalTitle = usersModalWindow.querySelector(".popup__title");
const usersModalInfo = usersModalWindow.querySelector(".popup__info");
const usersModalText = usersModalWindow.querySelector(".popup__text");
const usersModalUsersList = usersModalWindow.querySelector(".popup__list");
const logoElement = document.querySelector(".header__logo");



const handlePreviewPicture = ({ name, link }) => {
  imageElement.src = link;
  imageElement.alt = name;
  imageCaption.textContent = name;
  openModalWindow(imageModalWindow);
};

const handleProfileFormSubmit = (evt) => {
  evt.preventDefault();
  profileForm.querySelector("button").textContent = "Сохранение...";
  profileForm.querySelector("button").disabled = true;
  setUserInfo({
    name: profileTitleInput.value,
    about: profileDescriptionInput.value
  })
    .then((userData) => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeModalWindow(profileFormModalWindow);
      profileForm.querySelector("button").textContent = "Сохраненить";
      profileForm.querySelector("button").disabled = false;})
    .catch((err) => console.log(err));
};

const handleAvatarFromSubmit = (evt) => {
  evt.preventDefault();
  avatarForm.querySelector("button").textContent = "Сохранение...";
  avatarForm.querySelector("button").disabled = true;
  setAvatarInfo({ avatar: avatarInput.value })
    .then((userData) => {
      profileAvatar.style.backgroundImage = `url(${userData.avatar})` 
      closeModalWindow(avatarFormModalWindow);
      avatarForm.querySelector("button").textContent = "Сохраненить";
      avatarForm.querySelector("button").disabled = false;})
    .catch((err) => console.log(err));
};

const handleCardFormSubmit = (evt) => {
  evt.preventDefault();
  cardForm.querySelector("button").textContent = "Создание...";
  cardForm.querySelector("button").disabled = true;
  addNewCard({
    name: cardNameInput.value,
    link: cardLinkInput.value,
  })
    .then((cardData) => {
      placesWrap.prepend(
        createCardElement(
          cardData,
          {
            onPreviewPicture: handlePreviewPicture,
            onLikeIcon: (likeButton, cardLikeCounter) => handleLikeCard(cardData._id, likeButton, false, cardLikeCounter),
            onDeleteCard: (cardElement) => handleDeleteCard(cardData._id, cardElement)
          },
          true,
          false
        )
      )
      closeModalWindow(cardFormModalWindow);
      cardForm.querySelector("button").textContent = "Создать";
      cardForm.querySelector("button").disabled = false;
    })
    .catch((err) => console.log(err));
};

const handleDeleteCard = (cardId, cardElement) => {
  openModalWindow(deleteCardModalWindow);
  deleteCardForm.addEventListener("click", (evt) => {
  deleteCardForm.querySelector("button").textContent = "Удаление...";
  deleteCardForm.querySelector("button").disabled = true;
  evt.preventDefault();
  delCard(cardId)
    .then(() => {
      deleteCard(cardElement)
      closeModalWindow(deleteCardModalWindow)
      deleteCardForm.querySelector("button").textContent = "Да";
      deleteCardForm.querySelector("button").disabled = false;
    })
    .catch(err => console.log(err))
})}

const handleLikeCard = (cardId, likeButton, isLiked, cardLikeCounter) => {
  changeLikeCardStatus(cardId, isLiked)
    .then(() => {
      likeCard(likeButton);
      
      let currentCount = parseInt(cardLikeCounter.textContent) || 0;
      
      if (!likeButton.classList.contains("card__like-button_is-active")) {
        currentCount = Math.max(0, currentCount - 1);
      } else {
        currentCount = currentCount + 1;
      }
        
        cardLikeCounter.textContent = currentCount;
    })
    .catch(err => console.log(err));
}

// EventListeners
profileForm.addEventListener("submit", handleProfileFormSubmit);
cardForm.addEventListener("submit", handleCardFormSubmit);
avatarForm.addEventListener("submit", handleAvatarFromSubmit);

openProfileFormButton.addEventListener("click", () => {
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  openModalWindow(profileFormModalWindow);
  clearValidation(profileForm, validationSettings);
});

profileAvatar.addEventListener("click", () => {
  avatarForm.reset();
  openModalWindow(avatarFormModalWindow);
  clearValidation(avatarForm, validationSettings);
});

openCardFormButton.addEventListener("click", () => {
  cardForm.reset();
  openModalWindow(cardFormModalWindow);
  clearValidation(cardForm, validationSettings);
});

const allPopups = document.querySelectorAll(".popup");
allPopups.forEach((popup) => {
  setCloseModalWindowEventListeners(popup);
});




Promise.all([getCardList(), getUserInfo()])
  .then(([cards, userData]) => {
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
    const userId = userData._id;

    cards.forEach((cardData) =>  {
      const cardId = cardData._id;
      const isAuthor = cardData.owner._id === userId;
      const isLiked = cardData.likes.some(like => like._id === userId);

      placesWrap.append(
        createCardElement(
        cardData,
        {
          onPreviewPicture: handlePreviewPicture,
          onLikeIcon: (likeButton, cardLikeCounter) => handleLikeCard(cardId, likeButton, isLiked, cardLikeCounter),
          onDeleteCard: isAuthor ? (cardElement) => handleDeleteCard(cardId, cardElement) : undefined
        },
        isAuthor,
        isLiked
        )
      )})
  })
  .catch((err) => {
    console.log(err);
  });



const formatDate = (date) =>
  date.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const createInfoString = (term, description) => {
  const template = document.getElementById('popup-info-definition-template');
  const infoItem = template.content.cloneNode(true);
  
  infoItem.querySelector('.popup__info-term').textContent = term;
  infoItem.querySelector('.popup__info-description').textContent = description;
  
  return infoItem;
};

const createUserPreview = (user) => {
  const template = document.getElementById('popup-info-user-preview-template');
  const userItem = template.content.cloneNode(true);
  const badge = userItem.querySelector('.popup__list-item');
  
  badge.textContent = user;
  badge.classList.add('popup__list-item_type_badge');
  
  return userItem;
};
  
const handleLogoClick = () => {
  usersModalInfo.innerHTML = '';
  usersModalUsersList.innerHTML = '';
  usersModalTitle.textContent = '';
  usersModalText.textContent = '';
  
  getCardList()
    .then((cards) => {
      const allUsers = new Set();
      const userCardCount = {};

      cards.forEach(card => {
        const authorName = card.owner.name;
        userCardCount[authorName] = (userCardCount[authorName] || 0) + 1;
        allUsers.add(authorName)
        card.likes.forEach(userLike => allUsers.add(userLike.name))
      })

      usersModalTitle.textContent = 'Статистика пользователей';

      usersModalInfo.append(createInfoString('Всего карточек:', cards.length.toString()));
      if (cards.length >= 2) {
        usersModalInfo.append(createInfoString('Первая создана:', formatDate(new Date(cards[cards.length - 1].createdAt))));
        usersModalInfo.append(createInfoString('Последняя создана:', formatDate(new Date(cards[0].createdAt))));
      } else if (cards.length === 1) 
        usersModalInfo.append(createInfoString('Карточка создана:', formatDate(new Date(cards[0].createdAt))));
      usersModalInfo.append(createInfoString('Всего пользователей:', allUsers.size.toString()));
      usersModalInfo.append(createInfoString('Максимум карточек от одного:', Math.max(...Object.values(userCardCount)).toString()));
      
      usersModalText.textContent = 'Все пользователи:';
      allUsers.forEach(user => usersModalUsersList.append(createUserPreview(user)));
      openModalWindow(usersModalWindow);
    })
    .catch((err) => {
      console.log(err);
    });
};

logoElement.addEventListener("click", handleLogoClick);
