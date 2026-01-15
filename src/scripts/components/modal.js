export const likeCard = (likeButton) => {
  likeButton.classList.toggle("card__like-button_is-active");
};

export const deleteCard = (cardElement) => {  
  cardElement.remove();
};

const getTemplate = () => {
  return document
    .getElementById("card-template")
    .content.querySelector(".card")
    .cloneNode(true);
};

export const createCardElement = (
  data, { onPreviewPicture, onLikeIcon, onDeleteCard }, isAuthor, isLiked
) => {
  const cardElement = getTemplate();

  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__control-button_type_delete");
  const cardImage = cardElement.querySelector(".card__image");
  const cardLikeCounter = cardElement.querySelector(".card__like-count");
  const cardText = cardElement.querySelector(".card__title")

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardText.textContent = data.name;

  if (cardLikeCounter) {
    const likesCount = data.likes ? data.likes.length : 0;
    cardLikeCounter.textContent = likesCount;
  }

  if (isLiked)
    likeCard(likeButton)

  if (onLikeIcon) {
    likeButton.addEventListener("click", () => onLikeIcon(likeButton, cardLikeCounter));
  }

  if (onDeleteCard && isAuthor)
    deleteButton.addEventListener("click", () => onDeleteCard(cardElement));
  else
    deleteButton.remove();

  if (onPreviewPicture) {
    cardImage.addEventListener("click", () => onPreviewPicture({name: data.name, link: data.link}));
  }

  return cardElement;
};
