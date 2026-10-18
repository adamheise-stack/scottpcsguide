---
# SPONSORED ARTICLE TEMPLATE (rate card #4). Copy to src/guides/<slug>.md and fill in.
# The `sponsoredBy` field is what makes this a sponsored article:
#   - a "Sponsored" / "This article is sponsored by ..." label renders above the H1
#   - EVERY external link in the body automatically gets rel="sponsored noopener"
#   - the category's exclusive-sponsor bar is replaced by the sponsored label
# Keep it useful and factual, cite official sources, keep it OPSEC-safe, and never claim
# "military-approved" or use DoD/USAF insignia. Adam approves before publishing.
layout: layouts/guide.njk
title: "VA Loan Basics for Scott AFB Homebuyers"        # H1 + og:title
seoTitle: "VA Loan Basics Near Scott AFB | Scott PCS Guide" # <title>, under 60 chars
description: "140-155 characters with the main answer in it."
keyword: "va loan scott afb"
section: housing            # housing | schools | bah | childcare | moving | local-services | things-to-do
date: 2026-11-01            # publish date
updated: 2026-11-01         # last verified date (shown on page + Article dateModified)
sponsoredBy:
  name: "Example Lending Co."
  url: "https://example.com"
  start: "2026-11-01"       # for Ad Sales records; the article stays live 12 months per rate card
  end: "2027-10-31"
answer: "2-3 sentence direct answer to the main question."
faq:
  - q: "Question people actually ask?"
    a: "Short factual answer."
---

<div class="callout answer">

**Short answer:** {{ answer }}

</div>

Intro paragraph.

## Question-style H2

Body. Link sources inline.

## Frequently asked questions

{% for item in faq %}
### {{ item.q }}

{{ item.a }}
{% endfor %}

## Sources

- [Official source](https://example.gov) (accessed YYYY-MM-DD)
