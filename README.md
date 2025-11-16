# 🌐 WKT Polygon Visualizer - Cyberpunk Edition

<div align="center">

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-active-success.svg)]()

*A retro-futuristic WKT geometry visualizer with cyberpunk aesthetics*

</div>

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Demo](#demo)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Supported Geometry Types](#supported-geometry-types)
- [Geometry Operations](#geometry-operations)
- [Technologies](#technologies)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 About

The **WKT Polygon Visualizer - Cyberpunk Edition** is an interactive web application that transforms WKT (Well-Known Text) geometries into stunning visual representations on an interactive map. Featuring a neon-soaked, retro-futuristic interface inspired by cyberpunk aesthetics, this tool makes spatial data visualization both functional and visually striking.

Perfect for GIS professionals, developers, and anyone working with spatial data who wants to quickly visualize and analyze geometries with style.

---

## ✨ Features

### 🎨 Cyberpunk Aesthetics
- **Retro-futuristic UI** with neon colors (cyan, magenta, and green)
- **CRT scanline effects** and glowing text shadows
- **Animated visual elements** including pulsing status indicators
- **Grid overlays** and decorative corner elements
- **Custom cyberpunk-themed fonts** (Orbitron, Press Start 2P, VT323)

### 🗺️ Mapping Capabilities
- **Multiple basemap themes**:
  - 🌃 **Cyber Grid** - Dark theme with labels
  - 🏙️ **Neo Tokyo** - Dark theme without labels
  - 🛰️ **Satellite Intel** - High-resolution satellite imagery
  - 🖥️ **Mainframe** - Classic OpenStreetMap with retro styling
- **Interactive map controls** with zoom and pan
- **Automatic viewport fitting** to visualized geometries

### 📐 Geometry Support
- ✅ **POLYGON** - Single polygon geometries
- ✅ **MULTIPOLYGON** - Multiple polygon collections
- ✅ **LINESTRING** - Linear features
- ✅ **POINT** - Point locations
- ✅ **Sample geometries** for quick testing

### 🔧 Advanced Operations (powered by Turf.js)
- **🛡️ Buffer Shield** - Create buffer zones around geometries
- **⚙️ Optimize Geometry** - Simplify complex shapes
- **🔷 Convex Hull** - Generate minimum bounding polygons
- **🎯 Locate Centroid** - Find geometric centers
- **🔗 Merge Protocol** - Union multiple geometries
- **🧹 Clear Operations** - Reset operation layers

### 💻 User Experience
- **Keyboard shortcuts** - `Ctrl/Cmd + Enter` to visualize
- **Error handling** with cyberpunk-styled error messages
- **Real-time operation feedback** with detailed info displays
- **Responsive design** for mobile and desktop
- **Sample data loader** for quick demos

---

## 🚀 Demo

### Interface Preview

The application features a dark, cyberpunk-inspired interface with:
- Neon pink and cyan accents
- Glowing borders and text effects
- Animated scanline overlay
- Retro-futuristic typography

### Example Visualizations

**Polygon Visualization:**
```
POLYGON((-74.0 40.7, -73.9 40.7, -73.9 40.8, -74.0 40.8, -74.0 40.7))
```
Displays a polygon around New York City area with cyan fill and magenta borders.

**Buffer Operation:**
Creates a glowing purple shield zone around your geometry at a specified distance.

**Union Operation:**
Combines multiple geometries into a unified perimeter with neon green visualization.

---

## 🏁 Getting Started

### Prerequisites

No installation required! This is a standalone HTML application that runs directly in your web browser.

### Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SeanLikesData/wkt_viewer_cyberpunk.git
   cd wkt_viewer_cyberpunk
   ```

2. **Open the application:**
   ```bash
   open index.html
   ```
   Or simply double-click `index.html` in your file explorer.

3. **Start visualizing:**
   - Paste your WKT geometry into the text area
   - Click **Visualize** or press `Ctrl/Cmd + Enter`
   - Watch your geometry render on the map!

### Deployment

Deploy anywhere static files are supported:
- **GitHub Pages**
- **Netlify**
- **Vercel**
- **AWS S3**
- Any web server

---

## 📖 Usage

### Basic Workflow

1. **Input WKT Geometry:**
   - Paste your WKT string into the text area
   - Or click **Load Sample** to use example data

2. **Visualize:**
   - Click the **Visualize** button
   - The map automatically fits to show your geometry

3. **Execute Operations:**
   - Adjust operation parameters (buffer distance, simplify tolerance)
   - Click operation buttons to transform your geometry
   - View results overlaid on the original geometry

4. **Switch Basemaps:**
   - Click the layers icon (top-right of map)
   - Select from 4 cyberpunk-themed basemaps

5. **Clear and Reset:**
   - **Clear** button - Removes all geometries and input
   - **Clear Operations** button - Removes only operation results

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + Enter` | Visualize current WKT input |

---

## 🌍 Supported Geometry Types

### POINT
Visualizes as a glowing circular marker.

**Example:**
```
POINT(-77.0 38.9)
```

### LINESTRING
Displays as a cyan polyline connecting coordinates.

**Example:**
```
LINESTRING(-0.1 51.5, 2.3 48.8, 12.5 41.9)
```

### POLYGON
Renders as a filled polygon with magenta borders and cyan fill.

**Example:**
```
POLYGON((-74.0 40.7, -73.9 40.7, -73.9 40.8, -74.0 40.8, -74.0 40.7))
```

### MULTIPOLYGON
Displays multiple polygons as a collection.

**Example:**
```
MULTIPOLYGON(((-122.4 37.7, -122.3 37.7, -122.3 37.8, -122.4 37.8, -122.4 37.7)), ((-118.4 34.0, -118.3 34.0, -118.3 34.1, -118.4 34.1, -118.4 34.0)))
```

---

## 🔧 Geometry Operations

### 🛡️ Deploy Buffer Shield

Creates a buffer zone around your geometry at a specified distance.

- **Input:** Buffer distance in kilometers
- **Default:** 10 km
- **Color:** Purple (#9d4edd)
- **Use case:** Creating safety zones, service areas, or impact zones

**Example:**
```
Buffer Distance: 10 km
Result: Displays a 10km buffer zone around your geometry
```

### ⚙️ Optimize Geometry

Simplifies complex geometries by reducing the number of vertices while maintaining overall shape.

- **Input:** Tolerance value (lower = more precise)
- **Default:** 0.01
- **Color:** Hot pink (#f72585)
- **Use case:** Reducing file size, improving rendering performance

**Example:**
```
Simplify Tolerance: 0.01
Result: "Reduced from 150 to 45 vertices (70% reduction)"
```

### 🔷 Generate Convex Hull

Creates the minimum bounding polygon that contains all points of your geometry.

- **No parameters required**
- **Color:** Cyan (#4cc9f0)
- **Use case:** Bounding box creation, spatial analysis

### 🎯 Locate Centroid

Calculates and displays the geometric center point of your geometry.

- **No parameters required**
- **Color:** Gold (#ffd60a)
- **Use case:** Finding centers, label placement, analysis

**Example:**
```
Result: "Centroid Located: [-122.350000, 37.750000]"
```

### 🔗 Execute Merge Protocol

Combines multiple geometries into a single unified geometry.

- **Requires:** At least 2 geometries visualized
- **Color:** Neon green (#06ffa5)
- **Use case:** Merging adjacent parcels, combining coverage areas

**Workflow:**
1. Visualize first geometry
2. Paste and visualize second geometry
3. Click **Execute Merge Protocol**

---

## 🛠️ Technologies

### Core Libraries

- **[Leaflet.js](https://leafletjs.com/)** v1.9.4 - Interactive mapping
- **[Turf.js](https://turfjs.org/)** v7 - Geospatial analysis
- **[Font Awesome](https://fontawesome.com/)** v6.4.0 - Icons

### Basemap Providers

- **[CARTO](https://carto.com/)** - Dark basemaps (Cyber Grid, Neo Tokyo)
- **[Esri](https://www.esri.com/)** - Satellite imagery
- **[OpenStreetMap](https://www.openstreetmap.org/)** - Mainframe theme

### Styling

- **Google Fonts:**
  - Orbitron - Futuristic sans-serif
  - Press Start 2P - Retro pixelated
  - VT323 - Terminal-style monospace

- **Custom CSS:**
  - Cyberpunk color scheme (cyan, magenta, green)
  - CRT scanline effects
  - Glowing neon text shadows
  - Animated status indicators

### Architecture

```
wkt_viewer_cyberpunk/
├── index.html      # Main HTML structure
├── styles.css      # Cyberpunk styling and animations
├── script.js       # WKT parsing and map logic
└── README.md       # Documentation
```

---

## 📝 WKT Format Reference

### Coordinate Format
All coordinates are in `LONGITUDE LATITUDE` format (X Y).

### Format Rules
- Coordinates separated by commas
- Longitude and latitude separated by spaces
- Polygons must close (first point = last point)
- Nested parentheses for complex geometries

### Quick Examples

**Point:**
```
POINT(longitude latitude)
POINT(-122.4 37.8)
```

**LineString:**
```
LINESTRING(lon1 lat1, lon2 lat2, lon3 lat3)
LINESTRING(0 0, 10 10, 20 5)
```

**Polygon:**
```
POLYGON((lon1 lat1, lon2 lat2, lon3 lat3, lon1 lat1))
POLYGON((0 0, 10 0, 10 10, 0 10, 0 0))
```

**MultiPolygon:**
```
MULTIPOLYGON(((lon1 lat1, lon2 lat2, ...)), ((lon1 lat1, lon2 lat2, ...)))
```

---

## 🎨 Customization

### Color Scheme

The cyberpunk theme uses three primary colors:

| Color | Hex | Usage |
|-------|-----|-------|
| Neon Cyan | `#00ffff` | Labels, borders, primary accents |
| Hot Magenta | `#ff00cc` | Headings, highlights, polygon borders |
| Matrix Green | `#00ff99` | Text, success states, status indicators |
| Deep Purple | `#9d4edd` | Buffer operations |
| Hot Pink | `#f72585` | Simplify operations |

### Modifying Basemaps

Edit `script.js` lines 12-26 to add or modify basemap options:

```javascript
const baseMaps = {
    "Your Theme Name": L.tileLayer('https://your-tile-url/{z}/{x}/{y}.png', {
        attribution: 'Your attribution'
    })
};
```

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature/amazing-feature`
3. **Commit your changes:** `git commit -m 'Add amazing feature'`
4. **Push to the branch:** `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Ideas for Contribution

- Additional geometry operations (intersection, difference, dissolve)
- WKT export functionality
- Geometry measurement tools (area, perimeter, distance)
- Additional basemap themes
- Dark/light mode toggle
- WKT validation and formatting
- Geometry coordinate transformation
- Multiple geometry layer management

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Leaflet.js** community for excellent mapping tools
- **Turf.js** for powerful geospatial analysis
- Cyberpunk and retro-futuristic design inspiration
- CARTO, Esri, and OpenStreetMap for basemap tiles

---

## 📧 Contact

**Project Link:** [https://github.com/SeanLikesData/wkt_viewer_cyberpunk](https://github.com/SeanLikesData/wkt_viewer_cyberpunk)

---

<div align="center">

**Made with 💜 and neon dreams**

*Welcome to the future of spatial data visualization*

</div>
