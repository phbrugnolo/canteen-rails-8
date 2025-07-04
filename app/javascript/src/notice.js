document.addEventListener('DOMContentLoaded', () => {
  const notice = document.getElementById('notice-message');
  if (notice) {
    setTimeout(() => {
      notice.classList.add('fade-out');
      setTimeout(() => {
        notice.style.display = 'none';
      }, 500);
    }, 5000);
  }
});
