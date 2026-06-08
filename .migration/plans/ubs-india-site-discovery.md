# Site Discovery Plan: UBS India (ubs.com/in/en)

## Objective

Discover all pages and page layouts/templates for the UBS India website at `https://www.ubs.com/in/en.html`. This involves URL discovery (via sitemap or crawling), page analysis, and grouping pages into template categories based on shared layout patterns.

## Source Site

- **URL**: https://www.ubs.com/in/en.html
- **Region**: India (English)
- **Domain**: ubs.com

## Approach

1. **URL Discovery** — Fetch all available URLs from the site's sitemap (`/sitemap.xml` or region-specific sitemap) or crawl from the provided entry point.
2. **Page Sampling & Analysis** — Analyze representative pages to identify structural patterns (headers, footers, sections, blocks, layouts).
3. **Template Grouping** — Cluster pages by shared layout characteristics (e.g., homepage, product pages, article pages, landing pages) into distinct page templates.
4. **Site Catalog Generation** — Produce a structured catalog documenting each template type, its URLs, description, and block composition.

## Skill to Use

The **excat-site-catalog** skill will orchestrate this workflow — it handles URL discovery, page analysis, template grouping, and catalog output.

## Expected Outputs

- `page-templates.json` — Structured catalog of discovered templates with URLs and descriptions
- Page screenshots and analysis artifacts for representative pages
- Summary of template types with page counts

## Checklist

- [ ] Run URL discovery for https://www.ubs.com/in/en.html (sitemap fetch or crawl)
- [ ] Analyze discovered pages to identify layout patterns
- [ ] Group pages into template categories based on structural similarity
- [ ] Generate site catalog (`page-templates.json`) with template definitions
- [ ] Review and summarize discovered templates and page counts

## Execution

This plan requires **Execute mode** to proceed. The `excat:excat-site-catalog` skill will be invoked with the target URL to perform the discovery workflow.
