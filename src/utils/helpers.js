export function setSaveButtonText(
  btn,
  isLoading,
  loadingText = "Saving...",
  defaultText = "Save",
) {
  if (!btn) {
    return;
  }

  btn.textContent = isLoading ? loadingText : defaultText;
}

export function setDeleteButtonText(
  btn,
  isLoading,
  loadingText = "Deleting...",
  defaultText = "Delete",
) {
  if (!btn) {
    return;
  }

  btn.textContent = isLoading ? loadingText : defaultText;
}

// export function setButtonText(
//   btn,
//   isLoading,
//   loadingText = "Saving...",
//   defaultText = "Save",
//   isDeleting,
//   deleteText = "Deleting...",
//   defaultDeleteText = "Delete",
// ) {
//   const text = isLoading
//     ? loadingText
//     : isDeleting
//       ? deleteText
//       : defaultText;

//   if (btn) {
//     btn.textContent = text;
//   }

//   return text;
// }
