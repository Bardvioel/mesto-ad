/*
  Файл index.js является точкой входа в наше приложение
  и только он должен содержать логику инициализации нашего приложения
  используя при этом импорты из других файлов

  Из index.js не допускается что то экспортировать
*/

import { initialCards } from "./cards.js";
import { createCardElement, deleteCard, likeCard } from "./components/card.js";
import { openModalWindow, closeModalWindow, setCloseModalWindowEventListeners } from "./components/modal.js";

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
const avatarInput = avatarForm.querySelector(".popup__input");

const handlePreviewPicture = ({ name, link }) => {
  imageElement.src = link;
  imageElement.alt = name;
  imageCaption.textContent = name;
  openModalWindow(imageModalWindow);
};



const setEventListeners = (formElement) => {
  const inputList = Array.from(formElement.querySelectorAll('input'));
  const buttonElement = formElement.querySelector('button');

  buttonElement.classList.add('popup__button_disabled');
  buttonElement.disabled = true;
  
  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      checkInputValidity(formElement, inputElement, buttonElement);
    });
  });
};

function checkInputValidity(form, inputElement, buttonElement) {
  if (!inputElement.validity.valid)
    showInputError(form, inputElement, buttonElement);
  else
    hideInputError(form, inputElement, buttonElement);
}

function showInputError(form, inputElement, buttonElement) {
  const errorElement = form.querySelector(`#${inputElement.id}-error`);
  if (errorElement) {
    errorElement.style.opacity = 1;
    errorElement.textContent = inputElement.validationMessage;
  }
  inputElement.style.borderBottom = '1px solid #ff0000';
  updateButtonState(form, buttonElement);
}

function hideInputError(form, inputElement, buttonElement) {
  const errorElement = form.querySelector(`#${inputElement.id}-error`);
  if (errorElement) {
    errorElement.style.opacity = 0;
    errorElement.textContent = '';
  }
  inputElement.style.borderBottom = '1px solid rgba(0, 0, 0, .2)';
  updateButtonState(form, buttonElement);
}

function updateButtonState(form, buttonElement) {
  const inputList = Array.from(form.querySelectorAll('input'));
  
  if (hasInvalidInput(inputList)) {
    buttonElement.classList.add('popup__button_disabled');
    buttonElement.disabled = true;
  } else {
    buttonElement.classList.remove('popup__button_disabled');
    buttonElement.disabled = false;
  }
}

function hasInvalidInput(inputList) {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
}



const handleProfileFormSubmit = (evt) => {
  evt.preventDefault();
  const inputList = Array.from(profileForm.querySelectorAll('input'));
  const isFormValid = !hasInvalidInput(inputList);
  
  if (isFormValid) {
    profileTitle.textContent = profileTitleInput.value;
    profileDescription.textContent = profileDescriptionInput.value;
    closeModalWindow(profileFormModalWindow);
  }
};

const handleAvatarFromSubmit = (evt) => {
  evt.preventDefault();
  const inputList = Array.from(profileAvatar.querySelectorAll('input'));
  const isFormValid = !hasInvalidInput(inputList);
  
  if (isFormValid) {
    profileAvatar.style.backgroundImage = `url(${avatarInput.value})`;
    closeModalWindow(avatarFormModalWindow);
  }
};

const handleCardFormSubmit = (evt) => {
  evt.preventDefault();
  const inputList = Array.from(cardForm.querySelectorAll('input'));
  const isFormValid = !hasInvalidInput(inputList);
  
  if (isFormValid) {
    placesWrap.prepend(
      createCardElement(
        {
          name: cardNameInput.value,
          link: cardLinkInput.value,
        },
        {
          onPreviewPicture: handlePreviewPicture,
          onLikeIcon: likeCard,
          onDeleteCard: deleteCard,
        }
      )
    );

    closeModalWindow(cardFormModalWindow);
  }
};

// EventListeners
profileForm.addEventListener("submit", handleProfileFormSubmit);
cardForm.addEventListener("submit", handleCardFormSubmit);
avatarForm.addEventListener("submit", handleAvatarFromSubmit);

openProfileFormButton.addEventListener("click", () => {
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  openModalWindow(profileFormModalWindow);
  setEventListeners(profileForm);
});

profileAvatar.addEventListener("click", () => {
  avatarForm.reset();
  openModalWindow(avatarFormModalWindow);
  setEventListeners(avatarForm);
});

openCardFormButton.addEventListener("click", () => {
  cardForm.reset();
  openModalWindow(cardFormModalWindow);
  setEventListeners(cardForm);
});

// отображение карточек
initialCards.forEach((data) => {
  placesWrap.append(
    createCardElement(data, {
      onPreviewPicture: handlePreviewPicture,
      onLikeIcon: likeCard,
      onDeleteCard: deleteCard,
    })
  );
});

//настраиваем обработчики закрытия попапов
const allPopups = document.querySelectorAll(".popup");
allPopups.forEach((popup) => {
  setCloseModalWindowEventListeners(popup);
});
