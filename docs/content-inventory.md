# Content inventory: fbf.studio (crawled 2026-11-02)

Source: live WordPress 6.x + Elementor site at `https://fbf.studio`. Pages were listed from `wp-sitemap.xml` and crawled directly. The WP REST API returns `406` to non-browser clients, so it wasn't used.

Machine-readable case-study data: [`content/case-studies.raw.json`](../content/case-studies.raw.json). Media catalog: [`content/raw/CATALOG.md`](../content/raw/CATALOG.md).

---

## 1. Pages

| URL | Status | Purpose |
|---|---|---|
| `/` | live | Home: hero, intro, process, clients, services, footer |
| `/about/` | live | History + 11 team bios |
| `/works/` | live | Grid of 21 projects |
| `/work/{slug}/` | live ×21 | Case studies (all WP *posts* in category `work`) |
| `/category/work/` | live | WP auto archive, duplicates `/works/` |
| `/sample-page/`, `/welcome/` | live | WordPress leftovers, no real content |

The global nav has three items: **Home · About · Works**. There is no contact page; contact details sit in the header bar and footer.

## 2. Global elements

- **Header bar:** `hello@fbf.studio` · `Mon - Fri: 9:00 - 18:30` · social icons
- **Logo:** `FBF-Logo-Animaion-2.0-Mod.gif` (animated GIF logo) and `WhiteLogo.png`
- **Footer:** Bole Atlas, Ghana Road, in front of Axum Bldg. 4th Floor, Addis Ababa, Ethiopia · social icons
- **Typeface on current site:** Poppins (Google Fonts, all weights loaded)
- **Socials**
  - YouTube: https://www.youtube.com/channel/UCUSZ0mcuSpyWL8AQ2wptZaQ/featured
  - Instagram: https://www.instagram.com/fbfstudios_/
  - Twitter/X: https://twitter.com/fbfstudios_
  - Facebook: https://www.facebook.com/fbfstudios

## 3. Home page copy (verbatim)

**Hero:** "We are …" is a rotating/animated headline, but the rotating words are injected by JS and not present in the HTML. *(See open questions.)*

**A Creative Studio**
> frame by frame is a creative studio focused on visual storytelling. We're a team of creatives passionate about providing our clients highly original solutions from concept to delivery. We take joy in working together to create meaningful stories.

**Concept/Design/Execution**
> We understand telling an engaging story isn't easy. But worry not, we can guide you through every step. From the concept, to the medium used, to execution, we're here to help. At the end, you'll have a high quality content ready to share.

**Our Clients:** logo wall (see §6)

**Services and Capabilities**
> We do all our works with love and special attention. We help organizations and businesses solve their problems and reach their goals in various ways. We try out best to understand what is needed and execute deft plans to achieve them.

| Service | Copy | Icon |
|---|---|---|
| Animation | Every concept is better when it's given life. Animation is the primary tool we use to breathe life into ideas. | `Animation-Icon.png` |
| Content Production | Regardless of the form it's presented in, content is always king. At FBF we are always striving to create brilliant and original content for us and our clients. | `Content-Production-Icon.png` |
| Live Streaming | Live streaming is the best way to easily reach your audience worldwide. FBF is ready to help you reach them a standout content and ease. | `Live-Streaming-Icon.png` |

A "More Services" button has no target page.

### Tightened copy (draft, same voice)
- **Intro:** "Frame by Frame is a creative studio in Addis Ababa. We tell visual stories, from the first idea to the final frame, and we do every one of them with love."
- **Process:** "Telling a story well isn't easy. Worry not, we'll guide you through every step: the concept, the design and the execution. You leave with something ready to share."
- **Animation:** "Every idea is better when it moves. Animation is how we breathe life into yours."
- **Content Production:** "Whatever the format, content is king. We make original work for our clients and for ourselves."
- **Live Streaming:** "Reach your audience anywhere in the world. We stream your event so it looks as good live as it does in the edit."

## 4. About page

**Our History** (verbatim)
> framebyframe is a collection of creatives with similar vision and drive. Before fbf, our team worked together on many different occasions. Our similar taste and creative energy then inspired the founding of fbf.
> Led by our founder Amman, we aspire to provide our clients highly original solutions from concept to delivery. We take joy in working together to create meaningful stories.
> Our mission? Simple. Consistently exceed expectations by delivering exceptional solutions and tell stories that inspire.

**Our Team** (bios are on the live page; names and roles below, photos in `content/raw/2021/07|08/`)

| Name | Role | Photo |
|---|---|---|
| Ammanuel A. Wake ("Amman") | Creative Director & Founder | `2021/08/Ammanuel-Wake-Wide.jpg` |
| Mikiyas Girmachew ("Mike") | Technical Director | `Mikiyas-Girmachew-Technical-Director-1.jpeg` |
| Yafet Yemane | General Manager | `Yafet-Yemane-General-Manager-1.jpg` |
| Fitsum Admasu | Art Director (co-founder of partner agency Firma Media and Communications) | `Fitsum.jpg` |
| Naol Getnet | Lead Animator and Designer | `Naol-Getnet-Lead-Animator-1.jpeg` |
| Mosisa Yayo ("Mosi") | Sound Director | `Mosisa-Yayo-Sound-Director-1.jpg` |
| Amen Demissie | Editor | `Amen-Demissie-Editor-1.jpg` |
| Kidus Deribe | Intern 3D Animator | `Kidus-Derebe-Intern-3D-Animator-1.jpg` |
| Bethlehem A. Wake ("Betty") | Social Media Manager | `Bethlehem-A.-Wake-Social-Media-Manager-1.jpeg` |
| Jodahi B. Petros | Social Media Manager | `Jodahi-B.-Petros-Social-Media-Manager-1.jpg` |
| Yenkuel Bekele ("Yenku") | Production Designer | `Yenkuel-Bekele-Production-Designer-1.jpg` |

Notable facts: the technical team "managed more than fifty physical and virtual events" (Mikiyas's bio).

The team list dates from 2021 and needs confirming (see open questions).

## 5. Works page and case studies

**Works intro** (verbatim): "Animations, infographics, explainers, ads, music-videos, films; all made with love and special attention."

Every case study has the same structure: title, one paragraph of description, a YouTube video (lightbox with poster), **Client**, **Credits**, a still gallery of 3–15 frames, and Previous/Next links. **No case study states results, metrics or a problem→approach split.** These would have to come from the studio and must not be invented.

Service tags below are **my proposed classification** for the new filter chips, inferred from each description. They are to be confirmed.

| # | Slug (old URL `/work/{slug}/`) | Title | Client | YouTube | Proposed tags | Stills |
|---|---|---|---|---|---|---|
| 1 | `schmoo` | Schmoo Radio Show (Trailer) | The Schmoo Show (EBC Radio) | `tRz2OllahmE` | Animation (stop-motion) | 5 |
| 2 | `427-anthem` | 427 Anthem (Official Music Video) | Beza International Ministries | `HuxAx3NSA4I` | Production, Animation | 4 |
| 3 | `smartface` | Smart-face and Conveyer Belt | World Food Programme (WFP Ethiopia) | `MNzeHHbZnJI` | Animation (explainer) | 5 |
| 4 | `one-block-campaign` | One Block Campaign | Beza International Ministries | `9gtSiCFmObY` | Animation (infographic) | 4 |
| 5 | `tsilat` | Tsilat – Opening Titles | Golden Oil Ministries | `jTS_ThdS-2w` | Animation (titles) | 3 |
| 6 | `kibir-bearyam-official-lyric-video` | Kibir Be'Aryam (Official Lyric Video) | Endalkachew Hawaz | `x9SX6pvqwFI` | Animation (2.5D, custom type) | 7 |
| 7 | `redeemedia` | RedeeMedia – Training on Media Missions and Creativity in Ministry | RedeeMedia | `gp9JX-OqBoM` | Animation (flat design) | 4 |
| 8 | `addis-sew-negn` | Addis Sew Negn | RedeeMedia | `-YoIoerHzKg` | Animation (kinetic type) | 4 |
| 9 | `ahif-2019` | AHIF 2019 – Highlights Video | Africa Hotel Investment Forum, Bench Events, Flawless Events | `cUCwxkLKZWE` | Production | 6 |
| 10 | `now-is-the-time` | Now Is The Time – A Short Film | Beza International Ministries | `0RxJuPFDykE` | Production (short film, iPhone) | 6 |
| 11 | `tana-forum-2019` | Tana Forum 2019 – Highlights Video | AAU IPSS | `lsgXX805Xho` | Production | 7 |
| 12 | `i-am-an-african` | I Am An African – 7th Edition of The Youth Mag | The Youth Mag | `jDDhbrQrMus` | Animation | 6 |
| 13 | `ifrc` | IFRC – Practice Guide for Migrant Health Workers | Gebeya Media Productions (for IFRC) | `JNi2xjarg8s` | Animation (character) | 6 |
| 14 | `we-love-walking-together-tsi-mirrors` | We Love Walking Together – Tsi-Mirrors | Tsi Mirrors | `hgtKipbaHtc` | Animation | 3 |
| 15 | `ignite-africa-challenge` | Ignite Africa Challenge | Gebeya Media Productions | `NcdRf-Y6T8g` | Animation (promo) | 5 |
| 16 | `balenjeraye` | Balenjeraye Animation Series | Balinjeraye (The Neighbor-Love Movement) | `isk5Ffzv-7Q` | Animation (series) | 15 |
| 17 | `marriage-laws-in-africa` | Marriage Laws In Africa | UN Women | `20Hv_i1igLc` | Animation (explainer) | 4 |
| 18 | `wedefit-forward-official-lyric-video` | Wedefit/Forward (Official Lyric Video) | Beza International Ministries | `uFexKhyCjRY` | Animation (lyric) | 9 |
| 19 | `startup-ethiopia` | Startup Ethiopia – Highlights Video | Bluemoon Ethiopia | `pbWoaJusCGo` ⚠ | **Live**, Production | 5 |
| 20 | `mindset` | Mindset, A COVID-19 Special Show – Trailer | Mindset Consult (site says "Midset") | `pbWoaJusCGo` ⚠ duplicate | Production (TV, 3 months on Fana TV) | 6 |
| 21 | `5th-annual-private-equity-on-east-africa-highlights-video` | 5th Annual Private Equity on East Africa – Highlights Video | Flawless Events | `jYwFgZ9bUGk` | **Live**, Production | 6 |

Full descriptions and credits for every project are in `content/case-studies.raw.json`. Recurring credits: Ammanuel A. Wake (creative direction, animation on nearly all); Fitsum Admasu; ISAAC (music); camera crew Elias Berhanu, Simon Seyfu, Andualem Aseffa, Mikiyas Girmachew.

Possible flagship projects for the showreel chapters and the onion-skin viewer: **Marriage Laws in Africa (UN Women)**, **Smart-face (WFP)**, **IFRC**, **Balenjeraye** (15 stills, a good fit for a BTS timeline) and **Kibir Be'Aryam** (2.5D, the stills show stages).

## 6. Client logos (16 files found)

The prompt asked for about 17. The site numbers its logos 01–18 but skips **12** and **14**, so 16 logos are present.

| # | File | Client | Linked case study |
|---|---|---|---|
| 01 | `01.-Beza-International-Ministries.png` | Beza International Ministries | 427 Anthem, One Block, Now Is The Time, Wedefit |
| 02 | `02.-WFP.png` | World Food Programme | smartface |
| 03 | `03.-UN-Women.png` | UN Women | marriage-laws-in-africa |
| 04 | `04.-IFRC.png` | IFRC | ifrc |
| 05 | `05.-Flawless-Events.png` | Flawless Events | ahif-2019, 5th-annual-private-equity |
| 06 | `06.-Mindset-Consult.png` | Mindset Consult (⚠ artwork shows an Ethiopic wordmark + "Sol", so it may be the wrong logo) | mindset |
| 07 | `07.-Tana-Forum-1.png` | Tana Forum | tana-forum-2019 |
| 08 | `08.-AHIF.png` | Africa Hotel Investment Forum | ahif-2019 |
| 09 | `09.-Schmoo-1.png` | The Schmoo Show | schmoo |
| 10 | `10.-tym-1.png` | The Youth Mag | i-am-an-african |
| 11 | `11.-Tsi-Mirrors.png` | Tsi Mirrors | we-love-walking-together-tsi-mirrors |
| 13 | `13-Au.png` | African Union | (none, partner on Marriage Laws?) |
| 15 | `15-Africa-24-Logo.jpg` | Africa 24 | (none) |
| 16 | `16-DStv-Logo.png` | DStv | (none) |
| 17 | `17-O6RGwCPa-1.png` | RedeeMedia | redeemedia, addis-sew-negn |
| 18 | `18-tom.png` | "tom" (unidentified) | (none) |

Clients named in case studies but without a logo: Golden Oil Ministries, Endalkachew Hawaz, Gebeya Media Productions, Bluemoon Ethiopia, Balinjeraye, Bench Events, AAU IPSS.

## 7. Redirect map (old → new)

| Old URL | New URL |
|---|---|
| `/works/` | `/work` |
| `/work/{slug}/` (all 21) | `/work/{slug}`, with slugs kept 1:1 (consider shortening the long ones *with* a 301) |
| `/category/work/` | `/work` |
| `/about/` | `/about` |
| `/sample-page/`, `/welcome/` | `/` |
| `/wp-content/uploads/*` | keep a 301 to the new asset path for any image indexed by Google Images (optional) |
| `/feed/`, `/wp-admin/*`, `/wp-login.php` | `410 Gone` |
