# UBS India Homepage Migration Plan

## Objective

Migrate the UBS India homepage (`https://www.ubs.com/in/en.html`) to AEM Edge Delivery Services. This involves analyzing the page structure, mapping content blocks to EDS-compatible blocks, generating import infrastructure, importing content, and applying styling.

## Source Page

- **URL**: https://www.ubs.com/in/en.html
- **Template**: `homepage` (from site catalog)
- **Key blocks identified**: Hero teaser, capability cards, about section, fraud alert banner, regulatory disclosures, footer navigation

## Context from Site Discovery

The site catalog was already completed and found:
- The homepage uses a full-width hero with capability cards, content sections, alerts, and regulatory disclosures
- UBS uses Akamai WAF that blocks standard HTTP fetches (403) — WebFetch tool has partial access
- Template: `homepage` in `catalog/template-catalog.json`

## Approach

1. **Page Analysis** — Deep-dive into the homepage structure, identify sections, blocks, and authoring decisions using the `excat-page-analysis` skill
2. **Block Mapping** — Map source blocks to available EDS blocks (hero, cards, columns, etc.)
3. **Import Infrastructure** — Generate block parsers and page transformers for the import script
4. **Content Import** — Run the import to produce EDS-compatible HTML content
5. **Design Migration** — Extract and apply visual styles from the source site

## Known Challenges

- **Bot protection**: Akamai WAF returns 403 for automated requests; WebFetch has intermittent access
- **JavaScript-rendered content**: Some page content may require browser rendering
- **Complex navigation**: Multi-level mega menu with expandable sub-menus
- **Custom blocks**: Fraud alert banner and regulatory disclosures have no standard EDS equivalent

## Checklist

- [ ] Run detailed page analysis on https://www.ubs.com/in/en.html (sections, blocks, content model)
- [ ] Map identified blocks to EDS block types (hero, cards, columns, custom blocks)
- [ ] Generate block parsers for each block variant
- [ ] Generate page transformers (cleanup, sections, metadata)
- [ ] Create and bundle the import script
- [ ] Execute content import to produce EDS HTML
- [ ] Verify imported content renders correctly in local preview
- [ ] Migrate visual design (CSS tokens, typography, colors, spacing)
- [ ] Validate page against original for visual fidelity

## Execution

This plan requires **Execute mode** to proceed. The `excat:excat-site-migration` skill will orchestrate the migration workflow for this single page URL.
