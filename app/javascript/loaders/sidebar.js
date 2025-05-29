import { Dropdown } from 'bootstrap';

document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('sidebar');
  const content = document.getElementById('content');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const dropdownToggle = document.getElementById('dropdownUser');

  const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';

  if (isCollapsed) {
    sidebar.classList.add('collapsed');
    content.classList.add('expanded');
  }

  sidebarToggle.addEventListener('click', () => {
    const willCollapse = !sidebar.classList.contains('collapsed');

    sidebar.classList.toggle('collapsed');
    content.classList.toggle('expanded');

    const icon = sidebarToggle.querySelector('i');
    if (willCollapse) {
      icon.classList.remove('bi-list');
      icon.classList.add('bi-layout-sidebar');
    } else {
      icon.classList.remove('bi-layout-sidebar');
      icon.classList.add('bi-list');
    }

    if (dropdownToggle.classList.contains('show')) {
      const dropdown = Dropdown.getInstance(dropdownToggle);
      if (dropdown) dropdown.hide();
    }

    localStorage.setItem('sidebarCollapsed', willCollapse);
  });
});
