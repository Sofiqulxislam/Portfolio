# Sofiqul Islam — portfolio

A responsive, single-page portfolio inspired by the supplied misty forest, monochrome landscape, and blue moonlit artwork. It uses a pinned five-scene canvas: intro, projects, a practical build approach and grouped tools, quality and learning journey, and contact. Eased, overlapping scene fades keep each handoff continuous. The split landscape, depth/parallax, particles, and contact aperture are timed to those handoffs. Pointer movement shifts the atmosphere and light; project cards tilt and catch a moving highlight. The scene navigation uses short eased jumps, and a wheel or touch gesture immediately takes control. Darker, lightly blurred glass panels keep the text legible over the backgrounds. The page is plain HTML, CSS, and JavaScript; it has no build step or third-party runtime dependencies.

## Preview

Open `index.html` in a browser, or serve this folder with any static web server. For example, from this directory run `npx serve .` if Node.js is available.

## Live editor

Use the **Light / Dark** control in the top navigation to switch themes. The selected theme is remembered in the current browser on this device.

The **Motion** control lets visitors turn the ambient movement and pointer response on or off. It follows the device’s reduced-motion preference until the visitor chooses a setting; that choice is kept in the current browser.

## Artwork

The supplied landscape references are optimized WebP files in `public/artwork/`. The scenes reuse them as atmospheric backdrops, with a different default forest image behind the intro.
