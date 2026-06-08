/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: UBS India site-wide cleanup.
 * Removes non-authorable content (header/nav, footer).
 * Selectors validated against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // No cookie banners or overlays detected in cleaned HTML
  }
  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable site chrome
    // From cleaned.html: <header> contains <nav> with logo and main navigation links
    // From cleaned.html: <footer> contains footer-sections and footer-legal divs
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
    ]);
  }
}
