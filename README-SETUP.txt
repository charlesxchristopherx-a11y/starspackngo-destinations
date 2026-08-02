STARS PACK N GO DESTINATIONS — WEBSITE SETUP GUIDE
=====================================================
Built for: Shana Star Nunez, Stars Pack N Go Destinations
Target domain: www.starspackngodestinations.com


WHAT'S IN THIS FOLDER
----------------------
index.html          Home page
about.html           About Shana / credentials
destinations.html    Services + destinations + featured cruise deal
testimonials.html    Client reviews
contact.html         "Plan My Trip" lead capture form
css/style.css        All site styling (emerald + gold theme)
js/script.js         Mobile menu + form handling
images/               Logo, favicon, and all photos (all self-hosted,
                      no external image dependencies)


STEP 1 — CONNECT THE LEAD FORM (DO THIS FIRST)
------------------------------------------------
The trip-request form on contact.html is built and styled, but it needs
to be pointed at a real inbox before it will actually deliver leads.

1. Go to https://formspree.io and create a free account using
   Starspackngodestinations3@gmail.com
2. Click "New Form," name it something like "Trip Requests," and confirm
   the notification email.
3. Formspree will give you a Form ID that looks like: abcdwxyz
4. Open contact.html in any text editor, find this line near the top of
   the <form> tag:

       action="https://formspree.io/f/YOUR_FORM_ID"

   Replace YOUR_FORM_ID with the ID Formspree gave you.
5. Save the file and re-upload it to your host (or ask Claude to update
   and re-deliver it for you).

Formspree's free plan includes 50 submissions/month, which is plenty to
start — you can upgrade later if the site takes off. Every submission
emails straight to Starspackngodestinations3@gmail.com with all of the
traveler's answers (name, budget, destinations, dates, etc).


STEP 2 — GET THE SITE ONLINE AT YOUR DOMAIN
----------------------------------------------
You already have the domain name in mind: www.starspackngodestinations.com
Here are three easy ways to get these files live. Netlify is the
simplest for a beginner and is free.

OPTION A — Netlify (recommended, free, beginner-friendly)
  1. Go to https://app.netlify.com and create a free account.
  2. Once logged in, drag this entire folder onto the Netlify dashboard
     ("Sites" tab has a drag-and-drop upload zone).
  3. Netlify will publish the site instantly at a random *.netlify.app
     address.
  4. Go to Site Settings > Domain Management > Add a domain, and enter
     www.starspackngodestinations.com. Netlify will show you the DNS
     records to add.
  5. Log into wherever you registered the domain (GoDaddy, Namecheap,
     etc.) and add those DNS records. It usually takes 15 minutes to a
     few hours to go live.

OPTION B — GoDaddy Website Hosting
  If you bought the domain through GoDaddy, they also sell basic web
  hosting with file upload (cPanel/FTP). Upload every file in this
  folder into the "public_html" directory, keeping the folder
  structure (css/, js/, images/) intact.

OPTION C — Cloudflare Pages (also free)
  Similar to Netlify: create a Cloudflare account, go to "Workers &
  Pages," create a new Pages project, and upload this folder directly.
  Then add the custom domain the same way as Option A.

Whichever option you choose, keep the folder structure exactly as-is —
the css/, js/, and images/ folders must stay next to the HTML files or
the site will lose its styling and photos.


STEP 3 — PERSONALIZE BEFORE LAUNCH
-------------------------------------
A few things were intentionally left as placeholders and should be
swapped out before the site goes fully live:

- Real photo of Shana: about.html currently shows a placeholder
  monogram card instead of a photo. Search for the comment
  "<!-- Replace this placeholder block -->" in about.html, add a real
  photo file (e.g. images/shana.jpg) and swap in an <img> tag.
- Testimonials: testimonials.html and index.html currently include
  sample reviews clearly marked as illustrative. Replace these with
  real client quotes as they come in (with permission).
- Stock photography: destination photos throughout the site are
  licensed stock images representing each destination's general vibe
  (Unsplash). Swapping in real trip photos over time will make the
  site feel even more personal and trustworthy.
- Social links: the Facebook/Instagram icons in the footer currently
  link to "#". Update the href attributes in each HTML file's footer
  once Shana's business social accounts are ready.
- Featured deal: the Royal Caribbean Adventure of the Seas promo on
  the homepage and destinations page is pulled from the flyer you
  shared. Update or remove it in index.html and destinations.html once
  that promotion ends.


NOTES ON THE DESIGN
----------------------
- The whole site is mobile-first and was tested at both phone and
  desktop widths — the floating "Call Shana / Plan My Trip" bar only
  shows up on phones, since that's the fastest way for a mobile visitor
  to reach out.
- The lead form captures: name, email, phone, preferred contact method,
  number of travelers, trip type, destinations of interest, budget
  range, travel dates, departure city, special occasion, notes, and how
  they heard about Shana — everything needed to send a fast, relevant
  quote.
- No page depends on any external service except Google Fonts (for
  typography) and Formspree (for the contact form) — both free, both
  reliable, and both easy to swap out later if needed.

Questions or want changes? Just ask — this whole site was generated as
plain HTML/CSS/JS, so any part of it can be edited or extended later.
