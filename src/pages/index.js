import "./index.css";
import { setSaveButtonText, setDeleteButtonText } from "../utils/helpers.js";
import logoImg from "../images/logo.svg";
import pencilImg from "../images/pencil.svg";
import pencilWhiteImg from "../images/Pencilwhite.svg";
import plusImg from "../images/plus.svg";
import {
  enableValidation,
  resetValidation,
  enableButton,
  disableButton,
  settings,
} from "../scripts/validation.js";
import Api from "../utils/Api.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "0fe91c30-f704-42e4-afd9-90cf6c810f95",
    "Content-Type": "application/json",
  },
});

const avatarProfile = document.querySelector(".profile__avatar");

api
  .getAppInfo()
  .then(([cards, currentUser]) => {
    userInfo = currentUser;
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.prepend(cardElement);
    });
    avatarProfile.src = currentUser.avatar;
    profileNameEl.textContent = currentUser.name;
    profileDescriptionEl.textContent = currentUser.about;
  })
  .catch(console.error);

document.querySelector(".header__logo").src = logoImg;
document.querySelector(".profile__pencilImg").src = pencilImg;
document.querySelector(".pencilWhiteicon").src = pencilWhiteImg;
document.querySelector(".plus__icon").src = plusImg;

const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input",
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input",
);
const newPostModal = document.querySelector("#new-post-modal");
const newPostForm = newPostModal.querySelector(".modal__form");
const newPostSubmitBtn = newPostModal.querySelector(".modal__submit-btn");
const newPostImageInputEl = newPostModal.querySelector("#card-image-input");
const newPostCaptionInputEl = newPostModal.querySelector(
  "#profile-caption-input",
);

const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarSubmitBtn = avatarModal.querySelector(".modal__submit-btn");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");

const newPostBtn = document.querySelector(".profile__add-btn");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");

const previewModal = document.querySelector("#preview-modal");
const previewModalCloseBtn = previewModal.querySelector(
  ".modal__close-btn_type_preview",
);
const previewImageEl = previewModal.querySelector(".modal__image");
const previewCaptionEl = previewModal.querySelector(".modal__caption");

const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");
const deleteModalCloseBtn = deleteModal.querySelector(".modal__close-btn");
const deleteModalCancelBtn = deleteModal.querySelector(
  "#delete__form_cancel_btn",
);
const deleteModalDeleteBtn = deleteModal.querySelector(
  "#delete__form_delete_btn",
);

let selectedCard;
let selectedCardId;
let userInfo;

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  const cardLikeBtnEl = cardElement.querySelector(".card__like-btn");
  cardLikeBtnEl.addEventListener("click", (evt) => handleLike(evt, data._id));

  cardLikeBtnEl.classList.toggle("card__like-btn_active", data.isLiked);

  const cardDeleteBtnEl = cardElement.querySelector(".card__delete-btn");
  cardDeleteBtnEl.addEventListener("click", () =>
    handleDeleteCard(cardElement, data._id),
  );

  cardImageEl.addEventListener("click", () => {
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    previewCaptionEl.textContent = data.name;
    openModal(previewModal);
  });
  return cardElement;
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  setDeleteButtonText(deleteModalDeleteBtn, true);
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      setDeleteButtonText(deleteModalDeleteBtn, false);
    });
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

function handleLike(evt, cardId) {
  const cardElement = evt.target.closest(".card");
  const isLiked = evt.target.classList.contains("card__like-btn_active");

  api
    .changelikeStatus(cardId, isLiked)
    .then((newCardData) => {
      evt.target.classList.toggle("card__like-btn_active");
    })
    .catch(console.error);
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscapeKey);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscapeKey);
}

function handleEscapeKey(evt) {
  if (evt.key === "Escape") {
    const openModal = document.querySelector(".modal_is-opened");
    if (openModal) {
      closeModal(openModal);
    }
  }
}

editProfileBtn.addEventListener("click", function () {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  resetValidation(
    editProfileForm,
    [editProfileNameInput, editProfileDescriptionInput],
    settings,
  );
  openModal(editProfileModal);
});

editProfileCloseBtn.addEventListener("click", function () {
  closeModal(editProfileModal);
});

newPostBtn.addEventListener("click", function () {
  openModal(newPostModal);
});

newPostCloseBtn.addEventListener("click", function () {
  closeModal(newPostModal);
});

previewModalCloseBtn.addEventListener("click", function () {
  closeModal(previewModal);
});

avatarModalBtn.addEventListener("click", function () {
  openModal(avatarModal);
});

avatarModalCloseBtn.addEventListener("click", function () {
  closeModal(avatarModal);
});

deleteModalCloseBtn.addEventListener("click", function () {
  closeModal(deleteModal);
});

deleteModalCancelBtn.addEventListener("click", function () {
  closeModal(deleteModal);
});

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  const profileSubmitBtn = evt.submitter;
  setSaveButtonText(profileSubmitBtn, true);

  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((data) => {
      profileNameEl.textContent = data.name;
      profileDescriptionEl.textContent = data.about;
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      setSaveButtonText(profileSubmitBtn, false);
    });
}

function handleNewPostSubmit(evt) {
  evt.preventDefault();
  const newPostSubmitBtn = evt.submitter;
  setSaveButtonText(newPostSubmitBtn, true);
  api
    .postUserCard({
      name: newPostCaptionInputEl.value,
      link: newPostImageInputEl.value,
    })
    .then((cardData) => {
      const cardElement = getCardElement(cardData);
      cardsList.prepend(cardElement);
      newPostForm.reset();
      disableButton(newPostSubmitBtn, settings);
      closeModal(newPostModal);
    })
    .catch(console.error)
    .finally(() => {
      setSaveButtonText(newPostSubmitBtn, false);
    });
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const avatarSubmitBtn = evt.submitter;
  setSaveButtonText(avatarSubmitBtn, true);
  api
    .editAvatarInfo(avatarInput.value)
    .then((updatedUser) => {
      userInfo = updatedUser;
      avatarProfile.src = updatedUser.avatar;
      avatarForm.reset();
      disableButton(avatarSubmitBtn, settings);
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => {
      setSaveButtonText(avatarSubmitBtn, false);
    });
}

editProfileForm.addEventListener("submit", handleEditProfileSubmit);
newPostForm.addEventListener("submit", handleNewPostSubmit);
avatarForm.addEventListener("submit", handleAvatarSubmit);
deleteForm.addEventListener("submit", handleDeleteSubmit);

const modals = document.querySelectorAll(".modal");
modals.forEach((modal) => {
  modal.addEventListener("mousedown", (e) => {
    if (e.target === modal) {
      closeModal(modal);
    }
  });
});

enableValidation(settings);
