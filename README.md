# AIM Rehab website

A static website for AIM Rehab, built with [Astro](https://astro.build). The layout follows the Fertilys template. It builds to plain HTML, CSS and images in `dist/`, so you can host it anywhere (Netlify, Vercel, Cloudflare Pages, cPanel, etc.).

## Run it

```bash
npm install        # first time only
npm run dev        # local preview at http://localhost:4321
npm run build      # makes the final site in dist/
npm run preview    # preview the built site
```

## Before you launch

Most business details live in one file: **`src/data/site.ts`**. Change them there and every page updates.

1. **Phone, email, address and hours** in `src/data/site.ts` (look for `TODO`).
2. **Your domain** in `src/data/site-url.mjs`. It's used for canonical links, the sitemap, `robots.txt` and social previews.
3. **Social links** in `src/data/site.ts`. Empty links are hidden. When none are set, the header shows your phone number instead.
4. **Contact form.** By default it opens the visitor's email app with the message filled in. To get messages straight to your inbox, paste a form endpoint (Formspree, Web3Forms or similar) into `formEndpoint`.
5. **City name for local search.** If you add your city to the page titles and intro text (for example "Prosthetic Clinic in Peshawar"), you'll rank better for local searches.
6. **Privacy Policy and Terms.** These are plain starting drafts. Have them checked before launch.
7. After launch, submit `https://your-domain/sitemap-index.xml` in Google Search Console.

## Where things are

| What | Where |
| --- | --- |
| Service pages (text, FAQs, images) | `src/content/services/*.md` |
| Blog posts | `src/content/blog/*.md` |
| Team profiles | `src/data/team.ts` |
| Home page sections | `src/components/*.astro` |
| Colors, fonts, spacing | `src/styles/global.css` (top of file) |
| Photos | `src/assets/images/` (resized and converted to WebP on build) |

### Add a blog post

Copy any file in `src/content/blog/`, rename it (the file name becomes the web address), change the details at the top and write the post below. It shows up on the blog page and the home page automatically.

## SEO included

- A unique title and description on every page
- One H1 per page and a clean heading order
- Structured data for Google: clinic details, services, FAQs, blog posts, team and breadcrumbs
- Auto-generated sitemap and `robots.txt`
- Responsive WebP images with descriptive alt text
- Internal links between services, guides, FAQs and the contact page
- Medical copy avoids guarantees and fake reviews

## Content notes

- The "Our Promise" section on the home page holds the clinic's own promises, not patient reviews. Swap in real reviews there once you have patient permission.
- The numbers on the home page (3+ years, 2 specialists, 6 services, 4 steps) come from the team details you supplied. Update them in `src/components/WhyChoose.astro` if they change.
