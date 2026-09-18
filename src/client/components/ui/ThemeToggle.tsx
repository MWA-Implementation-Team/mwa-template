export default function ThemeToggle() {
  function toggleTheme(_e: any) {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const isDark = currentTheme === 'dark' ||
      (!currentTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);

    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark')

    alert("You changed the theme");
  }
  return (
    <button onClick={toggleTheme}></button>
  );
}

