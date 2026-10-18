---
layout: layouts/page.njk
title: "Scott AFB Visitor Center and Gate Info"
navTitle: "Visitor center and gate info"
permalink: /visitor-center/
updated: 2026-10-18
description: "Where to find official Scott AFB visitor center, visitor pass, and base access information. We link only to official sources and don't republish gate details."
lede: "For visitor passes, base access, and gate information, go straight to the official Scott AFB pages below. They're the only up-to-date source."
faq:
  - q: "How do our family or friends get a visitor pass for Scott AFB?"
    a: "Go to the official Scott AFB Dixon Visitor Center page on scott.af.mil. It has the current visitor pass and contact information. We don't republish pass procedures here."
  - q: "Where do newcomers find base access information?"
    a: "On the official Scott AFB Newcomers page on scott.af.mil. Your sponsor can also help."
  - q: "Where can I find official check-in information before a PCS to Scott?"
    a: "On the Scott AFB check-in procedures page on MilitaryINSTALLATIONS, the installation directory from Military OneSource."
---
**Who this page is for:** newcomers and visiting family and friends who need visitor pass or base access information. It's a short list of links to the official sources.

For operational security, and because these details change, we don't republish hours, procedures, or gate details. Please use the official pages:

- [Scott AFB Dixon Visitor Center](https://www.scott.af.mil/Units/Dixon-Visitor-Center/) (scott.af.mil): visitor passes and contact information
- [Scott AFB Newcomers: Base Access](https://www.scott.af.mil/Newcomers/) (scott.af.mil): base access basics for new arrivals
- [MilitaryINSTALLATIONS: Scott AFB check-in procedures](https://installations.militaryonesource.mil/military-installation/scott-air-force-base/base-essentials/check-in-procedures) (Military OneSource)

Questions? Ask your sponsor or the official office listed on those pages.

## Frequently asked questions

{% for item in faq %}
### {{ item.q }}

{{ item.a }}
{% endfor %}
