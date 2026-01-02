# SEO Quick Commands

## Generate OG Image
1. Open `public/og-image-template.html` in your browser
2. Set browser window to exactly 1200x630 pixels
3. Take a screenshot or use browser dev tools to capture
4. Save as `public/og-image.jpg`

Alternative: Use online tools
- https://www.opengraph.xyz/ (Generate OG images)
- https://www.canva.com/ (Design custom OG image at 1200x630)

## Test SEO

### Validate Structured Data
```bash
# Visit these URLs after deployment:
https://validator.schema.org/
https://search.google.com/test/rich-results
```

### Test Page Speed
```bash
# Visit:
https://pagespeed.web.dev/
```

### Test Mobile Friendly
```bash
# Visit:
https://search.google.com/test/mobile-friendly
```

### Test Social Media Cards
```bash
# Facebook:
https://developers.facebook.com/tools/debug/

# Twitter:
https://cards-dev.twitter.com/validator

# LinkedIn:
https://www.linkedin.com/post-inspector/
```

## Submit to Search Engines

### Google Search Console
1. Go to https://search.google.com/search-console
2. Add property: https://liquidata.com
3. Verify ownership (DNS or HTML file)
4. Submit sitemap: https://liquidata.com/sitemap.xml

### Bing Webmaster Tools
1. Go to https://www.bing.com/webmasters
2. Add site
3. Verify ownership
4. Submit sitemap

## Local Development Testing

```bash
# Build and test production
npm run build:production
npm run start:production

# Check sitemap locally
curl http://localhost:3000/sitemap.xml

# Check robots.txt locally
curl http://localhost:3000/robots.txt
```

## SEO Checklist Before Going Live

- [ ] All meta tags present on all pages
- [ ] OG image created and placed in /public/og-image.jpg
- [ ] Sitemap accessible at /sitemap.xml
- [ ] Robots.txt accessible at /robots.txt
- [ ] Google Analytics tracking code active
- [ ] All images have alt text
- [ ] All links work correctly
- [ ] Mobile responsive on all pages
- [ ] Page load time under 3 seconds
- [ ] HTTPS enabled
- [ ] Canonical URLs set correctly
- [ ] Structured data validates without errors
