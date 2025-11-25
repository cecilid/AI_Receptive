const darkLink = document.getElementById('styles2-css');
const lightLink = document.getElementById('light-css');

function setTheme(theme) {
  if (theme === 'dark') {
    darkLink.disabled = false;
    lightLink.disabled = true;
    localStorage.setItem('theme', 'dark');
  } else {
    darkLink.disabled = true;
    lightLink.disabled = false;
    localStorage.setItem('theme', 'light');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('theme');
  // Default to light when there's no saved preference
  setTheme(saved === 'dark' ? 'dark' : 'light');

  const btn = document.getElementById('theme-toggle');
  if (btn) btn.addEventListener('click', () => {
    const current = localStorage.getItem('theme') === 'light' ? 'dark' : 'light';
    setTheme(current);
  });
});