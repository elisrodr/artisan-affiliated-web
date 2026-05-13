# Artisan Affiliated

The public landing page for Artisan Affiliated. A quiet announcement of the house, the thesis, and the four foundations we build at. Visitors can read the thesis and leave a note. Specific works are not named on the page. They will be unveiled as the site grows.

## What this is

A single-page site that:

- Introduces the house and its four foundations (Sustenance, Defense, Sovereignty, Trust)
- Carries the firm's thesis in editorial long-form
- Collects correspondence via a Formspree-backed contact form
- Designed to feel timeless rather than technical. Navy, gold, light blue. Italiana display, Cormorant Garamond body.

## Stack

- Plain HTML, CSS, and a small amount of vanilla JavaScript
- Google Fonts (Italiana, Cormorant Garamond) loaded via CDN
- No framework, no build step, no dependencies
- Form submissions handled by [Formspree](https://formspree.io/)

## Setup

1. Create a free account at [formspree.io](https://formspree.io/).
2. Create a new form in the Formspree dashboard and copy your form ID (looks like `xyzabcde`).
3. In `index.html`, find the `TODO` block inside the `handleSubmit` function near the bottom and paste your form ID into the fetch URL.
4. Commit and push to GitHub. Vercel auto-deploys.

## Deployment

Deployed via [Vercel](https://vercel.com/) at [artisanaffiliated.com](https://artisanaffiliated.com/). No build step required, plain HTML.

## Correspondence collection

Submissions are sent to Formspree and stored in the Formspree dashboard. Formspree emails a notification on every new submission. Confirmation auto-reply to the sender can be configured inside Formspree settings, not in this codebase.

## Structure

```
index.html          The entire site, one file
README.md           This file
```

That is the whole repository. Anything more than that is a future problem.
