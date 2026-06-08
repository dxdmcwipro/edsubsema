/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: UBS India section breaks and section metadata.
 * Inserts <hr> between sections and adds Section Metadata blocks for styled sections.
 * Selectors validated against migration-work/cleaned.html.
 *
 * Sections from page-templates.json (homepage template):
 *   1. Hero Teaser - section.hero-section (style: "dark")
 *   2. Our Capabilities - section.capabilities-section (style: null)
 *   3. About Us - section.about-section (style: null)
 *   4. Fraud Alert - section.fraud-alert-section (style: "grey")
 *   5. CyberSafe Tips - section.cybersafe-section (style: null)
 *   6. Regulatory Disclosures - section.regulatory-section (style: null)
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

/**
 * Finds the content sections within main. Tries template selectors first;
 * if none match (e.g. live DOM differs from cleaned HTML), falls back to
 * identifying top-level section-like containers (divs with content area classes
 * or direct section elements under main).
 */
function findSectionElements(element, sections) {
  // Try template selectors first
  const matched = [];
  for (const section of sections) {
    const el = element.querySelector(section.selector);
    if (el) matched.push({ el, section });
  }
  if (matched.length === sections.length) return matched;

  // Fallback: find top-level content area containers on UBS live pages
  // UBS live DOM uses div.contentarea.grid-container and section elements as main content wrappers
  const candidates = element.querySelectorAll(':scope > div.contentarea, :scope > section, :scope > div[class*="gridcontainer"], :scope > div[class*="section"]');
  if (candidates.length === 0) {
    // Final fallback: use direct children of main that are block-level content containers
    const directChildren = Array.from(element.children).filter(
      (child) => child.tagName !== 'HEADER' && child.tagName !== 'FOOTER' && child.tagName !== 'NAV' && child.tagName !== 'SCRIPT' && child.tagName !== 'LINK',
    );
    const result = [];
    for (let i = 0; i < Math.min(directChildren.length, sections.length); i++) {
      result.push({ el: directChildren[i], section: sections[i] });
    }
    return result;
  }

  const result = [];
  const candidateArray = Array.from(candidates);
  for (let i = 0; i < Math.min(candidateArray.length, sections.length); i++) {
    result.push({ el: candidateArray[i], section: sections[i] });
  }
  return result;
}

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { document } = payload;
    const sections = payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;

    const sectionPairs = findSectionElements(element, sections);
    if (sectionPairs.length < 2) return;

    // Process sections in reverse order to preserve DOM positions
    for (let i = sectionPairs.length - 1; i >= 0; i--) {
      const { el: sectionEl, section } = sectionPairs[i];

      // Add Section Metadata block for sections with a style
      if (section.style) {
        const sectionMetadataBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.append(sectionMetadataBlock);
      }

      // Insert <hr> before each section except the first
      if (i > 0) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
