/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-overview
 * Base block: cards
 * Selectors: .capabilities-v1__container, .aboutUs-v1__article
 * Handles two patterns:
 *   1. Capabilities cards: .capabilities-v1__item children with h3 + description + CTA link
 *   2. About us article: ul.aboutUs-v1__list > li link items (link-only cards)
 * Generated: 2026-06-08
 */
export default function parse(element, { document }) {
  const cells = [];

  // Pattern 1: Capabilities cards (.capabilities-v1__item or .textteaser__base children)
  const capabilityItems = element.querySelectorAll(':scope > .capabilities-v1__item, :scope > .textteaser__base');

  if (capabilityItems.length > 0) {
    capabilityItems.forEach((card) => {
      const contentCell = [];

      // Heading: h3.textteaser__hl or any h3/h2
      const heading = card.querySelector('h3.textteaser__hl, h3, h2');
      if (heading) {
        const h3 = document.createElement('h3');
        h3.textContent = heading.textContent.trim();
        contentCell.push(h3);
      }

      // Description: .textteaser__txt or direct p
      const descEl = card.querySelector('.textteaser__txt, p');
      if (descEl) {
        const p = document.createElement('p');
        p.textContent = descEl.textContent.trim();
        contentCell.push(p);
      }

      // CTA link: .listitem__link or direct a
      const linkEl = card.querySelector('.listitem__link, .linklist__item a, a');
      if (linkEl) {
        const a = document.createElement('a');
        a.href = linkEl.href;
        // Get visible link text from .listitem__text or full text
        const linkTextEl = linkEl.querySelector('.listitem__text');
        a.textContent = linkTextEl ? linkTextEl.textContent.trim() : linkEl.textContent.trim();
        contentCell.push(a);
      }

      if (contentCell.length > 0) {
        cells.push([contentCell]);
      }
    });
  } else {
    // Pattern 2: About us article with ul list of links
    const linkList = element.querySelector('ul.aboutUs-v1__list, ul.linklistreimagined__list, ul');

    if (linkList) {
      const listItems = linkList.querySelectorAll(':scope > li');
      listItems.forEach((li) => {
        const contentCell = [];
        const linkEl = li.querySelector('a.listitem__link, a');

        if (linkEl) {
          // Create heading from link text
          const h3 = document.createElement('h3');
          const linkTextEl = linkEl.querySelector('.listitem__text');
          h3.textContent = linkTextEl ? linkTextEl.textContent.trim() : linkEl.textContent.trim();
          contentCell.push(h3);

          // Create the CTA link
          const a = document.createElement('a');
          a.href = linkEl.href;
          a.textContent = h3.textContent;
          contentCell.push(a);
        }

        if (contentCell.length > 0) {
          cells.push([contentCell]);
        }
      });
    } else {
      // Fallback: treat direct child divs or anchors as cards
      const items = element.querySelectorAll(':scope > div, :scope > a');
      items.forEach((item) => {
        const contentCell = [];
        if (item.tagName === 'A') {
          const h3 = document.createElement('h3');
          h3.textContent = item.textContent.trim();
          contentCell.push(h3);
          const a = document.createElement('a');
          a.href = item.href;
          a.textContent = item.textContent.trim();
          contentCell.push(a);
        } else {
          const heading = item.querySelector('h3, h2, h4');
          const description = item.querySelector('p, [class*="txt"], [class*="desc"]');
          const link = item.querySelector('a');
          if (heading) {
            const h3 = document.createElement('h3');
            h3.textContent = heading.textContent.trim();
            contentCell.push(h3);
          }
          if (description) {
            const p = document.createElement('p');
            p.textContent = description.textContent.trim();
            contentCell.push(p);
          }
          if (link) {
            const a = document.createElement('a');
            a.href = link.href;
            a.textContent = link.textContent.trim();
            contentCell.push(a);
          }
        }
        if (contentCell.length > 0) {
          cells.push([contentCell]);
        }
      });
    }
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-overview', cells });
  element.replaceWith(block);
}
