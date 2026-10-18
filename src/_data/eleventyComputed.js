// Breadcrumb trail for every page except home (visible nav + BreadcrumbList JSON-LD).
export default {
  breadcrumbs: (data) => {
    const url = data.page?.url;
    if (!url || url === "/" || data.noBreadcrumbs || !data.title) return null;
    const crumbs = [{ name: "Home", url: "/" }];
    const isGuide = url.startsWith("/guides/") && url !== "/guides/";
    const sec = data.section && data.sections?.[data.section];
    if (isGuide && sec) crumbs.push({ name: sec.title, url: sec.url });
    else if (isGuide) crumbs.push({ name: "Guides", url: "/guides/" });
    crumbs.push({ name: data.navTitle || data.title, url });
    return crumbs;
  },
};
