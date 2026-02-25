import { qsa } from './selectors';

const clickedLinks = new Set<HTMLAnchorElement>();
const attributeName = '[data-navigation-link]';
const navigationLinks = qsa(attributeName) as NodeListOf<HTMLAnchorElement>;

navigationLinks.forEach((link: HTMLAnchorElement) => {
  link.addEventListener('click', (event: Event) => {
    const target = event.currentTarget as HTMLAnchorElement;
    // Block if already clicked
    if (clickedLinks.has(target)) {
      console.warn(`${attributeName}: Navigation click blocked to prevent double navigation: ${target.href}`);
      event.preventDefault();
      return;
    }
    // Mark as clicked
    clickedLinks.add(target);
  });
});

// Should clear automatically when new page is loaded. But this event will listen to back/forward nav BFcache restores.
window.addEventListener('pageshow', () => {
  console.log(`${attributeName}: guard state cleared on pageshow event`);
  clickedLinks.clear();
});
