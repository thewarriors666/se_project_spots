export function setButtonText(
  btn,
  isLoading,
  loadingText = "Saving...",
  defaultText = "Save",
  isDeleting,
  deleteText = "Deleting...",
  defaultDeleteText = "Delete",
) {
  const text = isLoading
    ? loadingText
    : isDeleting
      ? deleteText
      : defaultText;

  if (btn) {
    btn.textContent = text;
  }

  return text;
}
