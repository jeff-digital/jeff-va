# Jeff — Portfolio

## Building production assets

The homepage serves committed, minified CSS and JavaScript from `assets/`.
After editing files in `css/` or `js/`, run `pnpm install` followed by
`pnpm build`, then commit the updated homepage and generated assets together.
The build preserves the existing stylesheet cascade and script order, and uses
content hashes so changed files receive new URLs. The static host does not need
Node.js at runtime.

Images in `assets/` are resized WebP delivery variants; original project images
remain available in their original folders. The hero has responsive 400px and
800px variants and high fetch priority. Other content images load lazily.
Inter's Latin variable font is self-hosted with `font-display: swap`; local SVG
masks provide the Font Awesome icons, including the video control states.
Third-party licenses are in `assets/`.

`_headers` configures Cloudflare static asset caching: hashed assets can be
cached for a year while the homepage revalidates. If a custom Worker generates
responses instead of serving static assets, apply equivalent headers there.

After deployment, rerun mobile PageSpeed Insights to verify the production
score and response headers. Local checks do not measure production latency.

Welcome to my portfolio.

This website is designed as a **professional portfolio and client presentation**, showcasing my skills, selected projects, and experience. It is intended primarily for demonstration and presentation purposes and is **not designed as a long-term management system or business application**.

The portfolio includes examples of my work in:

- Web Design & Development
- Technical Support
- Administrative Support
- Visual Design
- Social Media Management
- Content Creation

## Design & Usage

The design of this portfolio may be used as inspiration or recreated for personal or client projects.

If you choose to copy, closely reproduce, or adapt the overall design, I kindly ask that you **notify me beforehand** or provide appropriate credit by mentioning me in the footer as the original designer.

For example:

> Design by Jeff / Jeffrey A.

Please respect the original design work and provide credit when appropriate.

## Contact

If you have an inquiry, would like to discuss a project, or are interested in my services, please **contact me directly**.

Thank you for visiting my portfolio.
