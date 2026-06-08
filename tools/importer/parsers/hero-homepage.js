/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-homepage
 * Base block: hero
 * Source: https://www.ubs.com/in/en.html
 * Selector: .storyboard.section
 * Generated: 2026-06-08
 *
 * Full-width hero banner with background image, heading, description, and CTA link.
 * Target structure (from library example):
 *   Row 1: Background image (single cell)
 *   Row 2: Heading + description + CTA link (all in one cell)
 */
export default function parse(element, { document }) {
  // Extract background image from storyboard background area
  const bgImage = element.querySelector('.storyboard__background img, .storyboard__decorative img, img[alt]');

  // Extract heading (h2.storyboard__hl on live page, fallback to h1/h2/h3)
  const heading = element.querySelector('h2.storyboard__hl, .storyboard__impulseLine h2, h1, h2, h3');

  // Extract description paragraph from storyboard text area
  const description = element.querySelector('.storyboard__txt p, .storyboard__content p, p');

  // Extract CTA link(s) - actionbtn__link on live page, fallback to generic anchors
  const ctaLinks = Array.from(
    element.querySelectorAll('.storyboard__button a.actionbtn__link, .storyboard__content a[href]')
  ).filter((a) => {
    // Exclude links that are part of the heading or description
    const isInsideHeading = a.closest('h1, h2, h3');
    const isInsideDescription = a.closest('.storyboard__txt');
    return !isInsideHeading && !isInsideDescription;
  });

  // Build cells to match library example structure
  // Each row is an array of cells; each cell is an array of elements
  const cells = [];

  // Row 1: Background image (single cell)
  if (bgImage) {
    cells.push([[bgImage]]);
  }

  // Row 2: Heading + description + CTA link (all combined in one cell)
  const contentElements = [];
  if (heading) contentElements.push(heading);
  if (description) contentElements.push(description);
  contentElements.push(...ctaLinks);
  if (contentElements.length > 0) {
    cells.push([contentElements]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-homepage', cells });
  element.replaceWith(block);
}
