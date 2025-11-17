# 🌐 WKT Polygon Visualizer - Cyberpunk Edition

<div align="center">

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-active-success.svg)]()

*Because viewing WKT polygons should look cool*

</div>

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Supported Geometry Types](#supported-geometry-types)
- [Geometry Operations](#geometry-operations)
- [Technologies](#technologies)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 About

I work in geospatial and constantly need to check what a WKT polygon actually is—you know, paste it somewhere and see where it shows up on a map. This tool does exactly that, but with a retro-futuristic cyberpunk aesthetic because why not?

If you're a GIS professional who needs to quickly visualize WKT geometries, or if you just want to play around with spatial data while pretending you're in a William Gibson novel, this is for you. It's a single HTML file that runs in your browser with no setup required.

---

## ✨ Features

### What it does
- Paste WKT geometry, see it on a map instantly
- Supports POLYGON, MULTIPOLYGON, LINESTRING, and POINT
- Layer management so you can visualize multiple geometries
- Basic GIS operations (buffer, simplify, convex hull, centroid, union) via Turf.js
- Multiple basemap options (dark themes, satellite, OpenStreetMap)
- Copy WKT from layers you've created

### Why it looks like this
- Neon cyan, magenta, and green color scheme
- CRT scanline effects and glowing text
- Retro fonts (Press Start 2P, Orbitron, VT323)
- Because geospatial work doesn't have to be boring

### Practical stuff
- Keyboard shortcut: `Ctrl/Cmd + Enter` to visualize
- Works on mobile and desktop
- No installation, no build process—just open the HTML file
- Sample geometries included if you want to try it out

---

## 🏁 Getting Started

No installation needed. Just download and open.

```bash
git clone https://github.com/SeanLikesData/wkt_viewer_cyberpunk.git
cd wkt_viewer_cyberpunk
open index.html
```

Or just double-click `index.html` in your file explorer. That's it.

If you want to deploy it somewhere, it's just static files—works on GitHub Pages, Netlify, Vercel, or any web server.

---

## 📖 Usage

1. Paste your WKT geometry into the text area (or click **Load Sample** to try an example)
2. Click **Visualize** or press `Ctrl/Cmd + Enter`
3. The map zooms to your geometry automatically

That's the basic workflow. From there you can:
- Switch basemaps using the layers control (top-right corner)
- Run GIS operations (buffer, simplify, etc.)
- Toggle layer visibility in the layers panel
- Copy WKT from any layer you've created
- Visualize multiple geometries and union them together

---

## 🌍 Supported Geometry Types

**POINT** - Shows as a glowing circular marker
```
POINT(-77.0 38.9)
```

**LINESTRING** - Rendered as a cyan polyline
```
LINESTRING(-0.1 51.5, 2.3 48.8, 12.5 41.9)
```

**POLYGON** - Filled polygon with magenta border and cyan fill
```
POLYGON((-74.0 40.7, -73.9 40.7, -73.9 40.8, -74.0 40.8, -74.0 40.7))
```

**MULTIPOLYGON** - Multiple polygons in one geometry
```
MULTIPOLYGON(((-122.4 37.7, -122.3 37.7, -122.3 37.8, -122.4 37.8, -122.4 37.7)), ((-118.4 34.0, -118.3 34.0, -118.3 34.1, -118.4 34.1, -118.4 34.0)))
```

All coordinates are `LONGITUDE LATITUDE` (X Y format). Polygons must be closed (first point = last point).

---

## 🔧 Geometry Operations

All operations use Turf.js for the spatial analysis:

**Create Buffer** - Draws a buffer zone around your geometry
- Input: distance in kilometers (default 10km)
- Useful for: creating service areas, impact zones, etc.
- Color: Purple

**Simplify Geometry** - Reduces vertex count while keeping the general shape
- Input: tolerance value (lower = more detailed)
- Useful for: simplifying complex polygons, reducing file size
- Color: Hot pink
- Shows you how many vertices were removed

**Convex Hull** - Creates the smallest polygon that contains all points
- No input needed
- Useful for: bounding geometry, spatial analysis
- Color: Cyan

**Calculate Centroid** - Finds the geometric center point
- No input needed
- Shows coordinates in the operation info
- Color: Gold

**Union Geometries** - Combines multiple geometries into one
- Requires: at least 2 geometries visualized on the map
- Useful for: merging adjacent areas, combining polygons
- Color: Neon green
- Workflow: visualize first geometry, visualize second geometry, click union

---

## 🛠️ Technologies

**Core libraries** (all loaded from CDN):
- [Leaflet.js](https://leafletjs.com/) v1.9.4 - Interactive mapping
- [Leaflet.Draw](https://leaflet.github.io/Leaflet.draw/) v1.0.4 - Polygon editing
- [Turf.js](https://turfjs.org/) v7 - Geospatial operations
- [Font Awesome](https://fontawesome.com/) v6.4.0 - Icons

**Basemaps**:
- CARTO (dark themes)
- Esri (satellite imagery)
- OpenStreetMap (standard map)

**Fonts**:
- Press Start 2P (title)
- Orbitron (labels and buttons)
- VT323 (body text)

**Structure**:
```
wkt_viewer_cyberpunk/
├── index.html      # HTML structure and UI
├── styles.css      # Cyberpunk styling
├── script.js       # WKT parsing and operations
└── README.md       # This file
```

No build system. Just vanilla JavaScript, HTML, and CSS.


---

## 🤝 Contributing

Feel free to fork it and make it your own. Pull requests welcome if you want to add features.

Some ideas if you're looking for things to work on:
- Additional geometry operations (intersection, difference, etc.)
- Measurement tools (area, perimeter, distance)
- More basemap themes
- WKT validation and better error messages
- Coordinate system transformations

---

## 📄 License

MIT License - do whatever you want with it.

---

<div align="center">

**Made for fun by someone who looks at too many polygons**

[github.com/SeanLikesData/wkt_viewer_cyberpunk](https://github.com/SeanLikesData/wkt_viewer_cyberpunk)

</div>
