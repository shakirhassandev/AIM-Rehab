# AIM Rehab website

A static website for AIM Rehab, a prosthetic and orthotic clinic in Rawalpindi, built with [Astro](https://astro.build). The layout follows the Fertilys template. It builds to plain HTML, CSS and images in `dist/`, so you can host it anywhere (Netlify, Vercel, Cloudflare Pages, cPanel, etc.).

## Run it

```bash
npm install        # first time only
npm run dev        # local preview at http://localhost:4321
npm run build      # makes the final site in dist/
npm run preview    # preview the built site
```

## Before you launch

Business details live in one file: **`src/data/site.ts`**. Change them there and every page, the footer, the map and the Google structured data update together.

Already filled in: both phone numbers, both email addresses, the clinic address (Nelson Medical Complex, Abid Majeed Road, opposite MH Gate 6, Tench Bhata, Rawalpindi), the Google Map and the opening hours (Monday to Sunday, 10 AM to 8 PM).

Still to do:

1. **Your domain** in `src/data/site-url.mjs`. It's used for canonical links, the sitemap, `robots.txt` and social previews.
2. **Social links** in `src/data/site.ts`. Empty links are hidden. When none are set, the header shows your phone number instead.
3. **WhatsApp** (optional). Add the number to `whatsapp` in `src/data/site.ts` if the clinic uses it.
4. **Contact form.** By default it opens the visitor's email app with the message filled in, sent to both emails. To get messages straight to your inbox, paste a form endpoint (Formspree, Web3Forms or similar) into `formEndpoint`.
5. **Privacy Policy and Terms.** These are plain starting drafts. Have them checked before launch.
6. After launch, submit `https://your-domain/sitemap-index.xml` in Google Search Console, and add your website link to the clinic's Google Business Profile.

## Where things are

| What | Where |
| --- | --- |
| Business details, hours, map | `src/data/site.ts` |
| Service pages (text, FAQs, images) | `src/content/services/*.md` |
| Blog posts | `src/content/blog/*.md` |
| Team profiles | `src/data/team.ts` |
| Home page sections | `src/components/*.astro` |
| Map section (home and contact pages) | `src/components/MapSection.astro` |
| Colors, fonts, spacing | `src/styles/global.css` (top of file) |
| Photos | `src/assets/images/` (resized and converted to WebP on build) |
| Logo | `src/assets/brand/` (white version for dark areas, colour version for light ones), plus `public/logo.png`, `public/favicon.png` and `public/apple-touch-icon.png` |

### Add a blog post

Copy any file in `src/content/blog/`, rename it (the file name becomes the web address), change the details at the top and write the post below. It shows up on the blog page and the home page automatically.

## SEO included

- A unique title and description on every page, with Rawalpindi on the main pages for local search
- One H1 per page and a clean heading order
- Structured data for Google: clinic details with address, map, map pin and opening hours, plus services, FAQs, blog posts, team and breadcrumbs
- Auto-generated sitemap and `robots.txt`
- Responsive WebP images with descriptive alt text
- Internal links between services, guides, FAQs and the contact page
- Medical copy avoids guarantees and fake reviews

## Photos

- The service photos, the home page hero, the team portraits and the device shots come from the AIM Rehab design files.
- The other photos are free stock photos from [Pexels](https://www.pexels.com/license/). They're free for business use and don't need a credit. Swap any of them for real clinic photos when you have them. Keep the same file name and the site picks it up.
- Each inner page hero has a colour mood (`teal`, `navy`, `emerald`, `earth` or `ink`), so no two pages look the same. Set it with the `mood` prop on `PageHero`, or with `mood:` at the top of a service or blog file.

| Photo | Used on | Source |
| --- | --- | --- |
| prosthetic-leg-climbing-gym.jpg | Home and About, "Who We Are" | https://www.pexels.com/photo/4045759/ |
| decorating-custom-leg-brace.jpg | Home and About, small photo | https://www.pexels.com/photo/3913024/ |
| fitting-prosthetic-arm-hands.jpg | Home, "Why Choose Us" | https://www.pexels.com/photo/3912959/ |
| prosthetic-hand-handshake.jpg | Home, "Our Promise" | https://www.pexels.com/photo/3912979/ |
| older-couple-walking-in-park.jpg | Booking form photo | https://www.pexels.com/photo/16177535/ |
| adjusting-prosthetic-leg-running-track.jpg | Blog: prosthetic leg fitting | https://www.pexels.com/photo/8346646/ |
| adjusting-leg-brace-strap.jpg | Blog: AFO vs KAFO vs HKAFO | https://www.pexels.com/photo/13538710/ |
| prosthetic-leg-resting-park-bench.jpg | Blog: are prosthetic legs painful | https://www.pexels.com/photo/8437066/ |
| child-wearing-patterned-afo.jpg | Blog: leg braces for children | https://www.pexels.com/photo/3912370/ |
| foot-x-ray-on-tablet.jpg | Blog: custom foot orthotics | https://www.pexels.com/photo/8376138/ |
| first-consultation-in-clinic.jpg | Blog: your first visit | https://www.pexels.com/photo/4266939/ |
| hero-walking-by-the-water.jpg | About hero | https://www.pexels.com/photo/9623428/ |
| hero-prosthetic-leg-studio.jpg | Services hero | https://www.pexels.com/photo/8436966/ |
| hero-hands-at-workbench.jpg | Team hero | https://www.pexels.com/photo/5963131/ |
| hero-prosthetic-arm-tying-shoes.jpg | Blog hero | https://www.pexels.com/photo/5386247/ |
| hero-knee-x-ray-review.jpg | FAQ hero | https://www.pexels.com/photo/7446985/ |
| hero-walking-with-cane-autumn.jpg | Contact hero | https://www.pexels.com/photo/31400541/ |
| hero-x-ray-pattern-blue.jpg | Privacy Policy hero | https://www.pexels.com/photo/7723513/ |
| hero-knee-joint-model.jpg | Terms hero | https://www.pexels.com/photo/27376664/ |

## Content notes

- The "Our Promise" section on the home page holds the clinic's own promises, not patient reviews. Swap in real reviews there once you have patient permission.
- The numbers on the home page (3+ years, 2 specialists, 6 services, 4 steps) come from the team details you supplied. Update them in `src/components/WhyChoose.astro` if they change.
