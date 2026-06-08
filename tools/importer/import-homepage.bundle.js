/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-homepage.js
  function parse(element, { document }) {
    const bgImage = element.querySelector(".storyboard__background img, .storyboard__decorative img, img[alt]");
    const heading = element.querySelector("h2.storyboard__hl, .storyboard__impulseLine h2, h1, h2, h3");
    const description = element.querySelector(".storyboard__txt p, .storyboard__content p, p");
    const ctaLinks = Array.from(
      element.querySelectorAll(".storyboard__button a.actionbtn__link, .storyboard__content a[href]")
    ).filter((a) => {
      const isInsideHeading = a.closest("h1, h2, h3");
      const isInsideDescription = a.closest(".storyboard__txt");
      return !isInsideHeading && !isInsideDescription;
    });
    const cells = [];
    if (bgImage) {
      cells.push([[bgImage]]);
    }
    const contentElements = [];
    if (heading) contentElements.push(heading);
    if (description) contentElements.push(description);
    contentElements.push(...ctaLinks);
    if (contentElements.length > 0) {
      cells.push([contentElements]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-homepage", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-overview.js
  function parse2(element, { document }) {
    const cells = [];
    const capabilityItems = element.querySelectorAll(":scope > .capabilities-v1__item, :scope > .textteaser__base");
    if (capabilityItems.length > 0) {
      capabilityItems.forEach((card) => {
        const contentCell = [];
        const heading = card.querySelector("h3.textteaser__hl, h3, h2");
        if (heading) {
          const h3 = document.createElement("h3");
          h3.textContent = heading.textContent.trim();
          contentCell.push(h3);
        }
        const descEl = card.querySelector(".textteaser__txt, p");
        if (descEl) {
          const p = document.createElement("p");
          p.textContent = descEl.textContent.trim();
          contentCell.push(p);
        }
        const linkEl = card.querySelector(".listitem__link, .linklist__item a, a");
        if (linkEl) {
          const a = document.createElement("a");
          a.href = linkEl.href;
          const linkTextEl = linkEl.querySelector(".listitem__text");
          a.textContent = linkTextEl ? linkTextEl.textContent.trim() : linkEl.textContent.trim();
          contentCell.push(a);
        }
        if (contentCell.length > 0) {
          cells.push([contentCell]);
        }
      });
    } else {
      const linkList = element.querySelector("ul.aboutUs-v1__list, ul.linklistreimagined__list, ul");
      if (linkList) {
        const listItems = linkList.querySelectorAll(":scope > li");
        listItems.forEach((li) => {
          const contentCell = [];
          const linkEl = li.querySelector("a.listitem__link, a");
          if (linkEl) {
            const h3 = document.createElement("h3");
            const linkTextEl = linkEl.querySelector(".listitem__text");
            h3.textContent = linkTextEl ? linkTextEl.textContent.trim() : linkEl.textContent.trim();
            contentCell.push(h3);
            const a = document.createElement("a");
            a.href = linkEl.href;
            a.textContent = h3.textContent;
            contentCell.push(a);
          }
          if (contentCell.length > 0) {
            cells.push([contentCell]);
          }
        });
      } else {
        const items = element.querySelectorAll(":scope > div, :scope > a");
        items.forEach((item) => {
          const contentCell = [];
          if (item.tagName === "A") {
            const h3 = document.createElement("h3");
            h3.textContent = item.textContent.trim();
            contentCell.push(h3);
            const a = document.createElement("a");
            a.href = item.href;
            a.textContent = item.textContent.trim();
            contentCell.push(a);
          } else {
            const heading = item.querySelector("h3, h2, h4");
            const description = item.querySelector('p, [class*="txt"], [class*="desc"]');
            const link = item.querySelector("a");
            if (heading) {
              const h3 = document.createElement("h3");
              h3.textContent = heading.textContent.trim();
              contentCell.push(h3);
            }
            if (description) {
              const p = document.createElement("p");
              p.textContent = description.textContent.trim();
              contentCell.push(p);
            }
            if (link) {
              const a = document.createElement("a");
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
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-overview", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/ubs-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "footer"
      ]);
    }
  }

  // tools/importer/transformers/ubs-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function findSectionElements(element, sections) {
    const matched = [];
    for (const section of sections) {
      const el = element.querySelector(section.selector);
      if (el) matched.push({ el, section });
    }
    if (matched.length === sections.length) return matched;
    const candidates = element.querySelectorAll(':scope > div.contentarea, :scope > section, :scope > div[class*="gridcontainer"], :scope > div[class*="section"]');
    if (candidates.length === 0) {
      const directChildren = Array.from(element.children).filter(
        (child) => child.tagName !== "HEADER" && child.tagName !== "FOOTER" && child.tagName !== "NAV" && child.tagName !== "SCRIPT" && child.tagName !== "LINK"
      );
      const result2 = [];
      for (let i = 0; i < Math.min(directChildren.length, sections.length); i++) {
        result2.push({ el: directChildren[i], section: sections[i] });
      }
      return result2;
    }
    const result = [];
    const candidateArray = Array.from(candidates);
    for (let i = 0; i < Math.min(candidateArray.length, sections.length); i++) {
      result.push({ el: candidateArray[i], section: sections[i] });
    }
    return result;
  }
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { document } = payload;
      const sections = payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      const sectionPairs = findSectionElements(element, sections);
      if (sectionPairs.length < 2) return;
      for (let i = sectionPairs.length - 1; i >= 0; i--) {
        const { el: sectionEl, section } = sectionPairs[i];
        if (section.style) {
          const sectionMetadataBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.append(sectionMetadataBlock);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-homepage": parse,
    "cards-overview": parse2
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "UBS India homepage with full-width hero teaser, capability cards, about section, fraud alert banner, and regulatory disclosures",
    urls: [
      "https://www.ubs.com/in/en.html"
    ],
    blocks: [
      {
        name: "hero-homepage",
        instances: [".storyboard.section"]
      },
      {
        name: "cards-overview",
        instances: [".capabilities-v1__container", ".aboutUs-v1__article"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Teaser",
        selector: "section.hero-section",
        style: "dark",
        blocks: ["hero-homepage"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Our Capabilities",
        selector: "section.capabilities-section",
        style: null,
        blocks: ["cards-overview"],
        defaultContent: [".capabilities-section > h2"]
      },
      {
        id: "section-3",
        name: "About Us",
        selector: "section.about-section",
        style: null,
        blocks: ["cards-overview"],
        defaultContent: [".about-section > h2", ".about-section > img"]
      },
      {
        id: "section-4",
        name: "Fraud Alert",
        selector: "section.fraud-alert-section",
        style: "grey",
        blocks: [],
        defaultContent: [".fraud-alert-section .alert-banner", ".fraud-alert-section > p", ".fraud-alert-section > h3", ".fraud-alert-section > a"]
      },
      {
        id: "section-5",
        name: "CyberSafe Tips",
        selector: "section.cybersafe-section",
        style: null,
        blocks: [],
        defaultContent: [".cybersafe-section > h3", ".cybersafe-section > p", ".cybersafe-section > a"]
      },
      {
        id: "section-6",
        name: "Regulatory Disclosures",
        selector: "section.regulatory-section",
        style: null,
        blocks: [],
        defaultContent: [".regulatory-section > h2", ".regulatory-section .disclosure-items", ".regulatory-section > a"]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
