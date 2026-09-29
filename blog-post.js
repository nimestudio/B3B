// Blog post sharing buttons for LinkedIn and WhatsApp

const shareUrl = encodeURIComponent(window.location.href);
const shareTitle = encodeURIComponent(document.title);

const linkedinBtn = document.querySelector('.linkedin-share');
const whatsappBtn = document.querySelector('.whatsapp-share');

if (linkedinBtn) {
  linkedinBtn.href = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
}

if (whatsappBtn) {
  whatsappBtn.href = `https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrl}`;
}