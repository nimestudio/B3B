// Populate select field with CMS open positions

 document.addEventListener("DOMContentLoaded", () => {
  const selectField = document.querySelector('.cms-select');
  const cmsItems = document.querySelectorAll('.cms-item-name');

  if (selectField && cmsItems.length > 0) {
    cmsItems.forEach(item => {
      const option = document.createElement('option');
      const textValue = item.textContent.trim();
      option.value = textValue;
      option.textContent = textValue;
      selectField.appendChild(option);
    });
  }
});