# AIM Rehab HTML5 website

A standalone website made with HTML5, CSS and vanilla JavaScript. All 22 pages are real HTML files, including the six service pages, six blog posts and custom 404 page. There is no framework, dependency install, compilation, client-side routing or application server required to publish it.

## Preview

Open **index.html** directly in a browser, or use any static web server. Relative links also allow the website to be hosted in a subfolder.

For the included local server, use Node.js 20 or newer:

```sh
npm run dev
```

Visit **http://127.0.0.1:4321**. No `npm install` is needed. On Windows PowerShell, use `npm.cmd` if your execution policy blocks `npm.ps1`.

## Publish

Upload the HTML page folders, `assets/`, root icons, `robots.txt` and sitemap XML files to any static host, including cPanel, Netlify, Vercel or Cloudflare Pages. Existing directory URLs such as `/about/` and `/services/lower-limb-prosthetics/` continue to work; internal links explicitly reference `index.html` so they also work when opened from disk.

You can also prepare a folder containing only the files needed for hosting:

```sh
npm run build
npm run preview
```

`build` checks the site and copies it into **dist/**. It does not compile or transform the website. Upload the contents of `dist/` to your host. `preview` serves this folder at the same local address. Stop an existing preview with Ctrl+C before starting another one on the same port. Configure your host to use `/404.html` for missing pages. For hosting in a subfolder, update the `<base href="/">` in `404.html` to that subfolder so the error page's links resolve correctly.

## Edit the website

| Content | Location |
| --- | --- |
| Home page | `index.html` |
| About, contact, team, FAQ and policy pages | Each folder's `index.html` |
| Service overview and individual services | `services/index.html`, `services/<slug>/index.html` |
| Blog overview and individual posts | `blog/index.html`, `blog/<slug>/index.html` |
| Colors, spacing, layout and responsive styles | `assets/css/styles.css` |
| Local font declarations | `assets/css/fonts.css` |
| Menu, accordions, sliders, counters and forms | `assets/js/main.js` |
| Form recipient addresses and optional endpoint | `assets/js/config.js` |
| Responsive photos, device images and logos | `assets/images/` |
| Local fonts and their licenses | `assets/fonts/` |
| Deployable file/folder list | `scripts/site-files.mjs` |

Headers, footers and business details are written into every HTML page so they load without JavaScript. When changing shared details, update all affected HTML files, including their structured data and form `action` attributes. The form configuration changes JavaScript submission settings; it does not rewrite visible contact details.

Photos retain their optimized WebP variants and `srcset` sizes. If replacing a photo, update its `src`, `srcset`, width, height and alt text together. Add new pages as ordinary HTML files and update the relevant navigation, sitemap and `scripts/site-files.mjs` if adding a new top-level folder.

## Contact forms

Appointment and callback forms open the visitor's email app with their request addressed to both clinic email addresses. The visitor must send the email; a static website cannot deliver email on its own.

To use a hosted form service, put its submission URL in **assets/js/config.js** under `formEndpoint`. The forms will POST to it, show success only for successful HTTP responses and retain the entered details if submission fails. This requires an internet connection and a form service that accepts browser requests. Test the endpoint after configuring it.

## Before launch

- Replace **https://www.your-domain.com** throughout the HTML files, `robots.txt` and both sitemap files with your actual domain. Include the hosting subfolder in metadata URLs if applicable.
- Check the clinic's phone numbers, emails, address, hours and map.
- Review the existing Privacy Policy and Terms drafts.
- Configure and test a form endpoint if you need direct submissions rather than the email-app fallback.
- Submit `sitemap-index.xml` to Google Search Console after publishing.

## Validation

```sh
npm run check
```

The dependency-free checker verifies HTML5 doctypes, unique page titles, descriptions, canonical tags, one H1 per page, unique element IDs, image alt text, structured-data JSON, local links and anchors, responsive images, scripts, styles and font files. The build runs this check on both the source and the packaged site.

## Photo credits

The clinic's service photos, team portraits and device images come from the supplied AIM Rehab design files. Other photos are from [Pexels](https://www.pexels.com/license/):

| Photo | Source |
| --- | --- |
| Prosthetic leg climbing gym | https://www.pexels.com/photo/4045759/ |
| Decorating a custom leg brace | https://www.pexels.com/photo/3913024/ |
| Fitting a prosthetic arm | https://www.pexels.com/photo/3912959/ |
| Prosthetic handshake | https://www.pexels.com/photo/3912979/ |
| Older couple walking | https://www.pexels.com/photo/16177535/ |
| Prosthetic leg fitting at track | https://www.pexels.com/photo/8346646/ |
| Adjusting a leg brace | https://www.pexels.com/photo/13538710/ |
| Prosthetic leg on park bench | https://www.pexels.com/photo/8437066/ |
| Child wearing an AFO | https://www.pexels.com/photo/3912370/ |
| Foot X-ray | https://www.pexels.com/photo/8376138/ |
| First consultation | https://www.pexels.com/photo/4266939/ |
| Walking by the water | https://www.pexels.com/photo/9623428/ |
| Prosthetic leg studio | https://www.pexels.com/photo/8436966/ |
| Hands at workbench | https://www.pexels.com/photo/5963131/ |
| Prosthetic arm tying shoes | https://www.pexels.com/photo/5386247/ |
| Knee X-ray review | https://www.pexels.com/photo/7446985/ |
| Walking with a cane | https://www.pexels.com/photo/31400541/ |
| X-ray pattern | https://www.pexels.com/photo/7723513/ |
| Knee joint model | https://www.pexels.com/photo/27376664/ |

The home page's “Our Promise” section contains the clinic's commitments, not patient reviews. Clinic statistics and all medical copy have been preserved from the supplied website.
