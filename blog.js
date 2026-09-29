// Sorting and filtering blog posts

function parseCustomDate(dateStr) {
  const parts = dateStr.trim().split('.');
  if (parts.length === 3) {
    return new Date(2000 + parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10)).getTime();
  }
  return 0;
}

function processBlogPosts() {
  const container = document.querySelector('.blog-posts-list');
  if (!container) return;

  const postItemsRaw = Array.from(container.querySelectorAll('.blog-post-item-wrap'));
  
  const itemsData = postItemsRaw.map(item => {
    item.style.display = ''; 
    const dateLabel = item.querySelector('.blog-post-item-date');
    const timestamp = dateLabel ? parseCustomDate(dateLabel.textContent) : 0;
    const categoryLabel = item.querySelector('.blog-post-item-category');
    const category = categoryLabel ? categoryLabel.textContent.trim() : '';
    
    return { item, timestamp, category };
  });

  const topFeaturedPerCategory = {};

  itemsData.forEach(data => {
    if (data.item.querySelector('.blog-post-item-featured-bg')) {
      if (!topFeaturedPerCategory[data.category] || data.timestamp > topFeaturedPerCategory[data.category].timestamp) {
        topFeaturedPerCategory[data.category] = data;
      }
    }
  });

  itemsData.forEach(data => {
    const bg = data.item.querySelector('.blog-post-item-featured-bg');
    if (bg) {
      if (topFeaturedPerCategory[data.category].item !== data.item) {
        bg.remove();
      }
    }
  });

  const finalFeatured = [];
  const finalNormal = [];

  itemsData.forEach(data => {
    if (data.item.querySelector('.blog-post-item-featured-bg')) {
      finalFeatured.push(data);
    } else {
      finalNormal.push(data);
    }
  });

  finalFeatured.sort((a, b) => b.timestamp - a.timestamp);
  finalNormal.sort((a, b) => b.timestamp - a.timestamp);

  finalFeatured.forEach(data => container.appendChild(data.item));
  finalNormal.forEach(data => container.appendChild(data.item));
}

document.addEventListener('DOMContentLoaded', processBlogPosts);

window.fsAttributes = window.fsAttributes || [];
window.fsAttributes.push([
  'cmsfilter',
  (filterInstances) => {
    filterInstances[0].listInstance.on('renderitems', processBlogPosts);
  }
]);