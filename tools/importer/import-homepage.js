/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroHomepageParser from './parsers/hero-homepage.js';
import cardsOverviewParser from './parsers/cards-overview.js';

// TRANSFORMER IMPORTS
import ubsCleanupTransformer from './transformers/ubs-cleanup.js';
import ubsSectionsTransformer from './transformers/ubs-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-homepage': heroHomepageParser,
  'cards-overview': cardsOverviewParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'UBS India homepage with full-width hero teaser, capability cards, about section, fraud alert banner, and regulatory disclosures',
  urls: [
    'https://www.ubs.com/in/en.html',
  ],
  blocks: [
    {
      name: 'hero-homepage',
      instances: ['.storyboard.section'],
    },
    {
      name: 'cards-overview',
      instances: ['.capabilities-v1__container', '.aboutUs-v1__article'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Teaser',
      selector: 'section.hero-section',
      style: 'dark',
      blocks: ['hero-homepage'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Our Capabilities',
      selector: 'section.capabilities-section',
      style: null,
      blocks: ['cards-overview'],
      defaultContent: ['.capabilities-section > h2'],
    },
    {
      id: 'section-3',
      name: 'About Us',
      selector: 'section.about-section',
      style: null,
      blocks: ['cards-overview'],
      defaultContent: ['.about-section > h2', '.about-section > img'],
    },
    {
      id: 'section-4',
      name: 'Fraud Alert',
      selector: 'section.fraud-alert-section',
      style: 'grey',
      blocks: [],
      defaultContent: ['.fraud-alert-section .alert-banner', '.fraud-alert-section > p', '.fraud-alert-section > h3', '.fraud-alert-section > a'],
    },
    {
      id: 'section-5',
      name: 'CyberSafe Tips',
      selector: 'section.cybersafe-section',
      style: null,
      blocks: [],
      defaultContent: ['.cybersafe-section > h3', '.cybersafe-section > p', '.cybersafe-section > a'],
    },
    {
      id: 'section-6',
      name: 'Regulatory Disclosures',
      selector: 'section.regulatory-section',
      style: null,
      blocks: [],
      defaultContent: ['.regulatory-section > h2', '.regulatory-section .disclosure-items', '.regulatory-section > a'],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  ubsCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [ubsSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
