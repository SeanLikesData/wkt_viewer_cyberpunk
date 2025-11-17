# CLAUDE.md - AI Assistant Guide

> **Last Updated:** 2025-11-17
> **Project:** WKT Polygon Visualizer - Cyberpunk Edition
> **Repository:** https://github.com/SeanLikesData/wkt_viewer_cyberpunk

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Codebase Structure](#codebase-structure)
- [Technology Stack](#technology-stack)
- [Architecture & Key Components](#architecture--key-components)
- [Development Workflow](#development-workflow)
- [Code Conventions](#code-conventions)
- [Common Development Tasks](#common-development-tasks)
- [Testing & Debugging](#testing--debugging)
- [Important Notes for AI Assistants](#important-notes-for-ai-assistants)

---

## 🎯 Project Overview

The **WKT Polygon Visualizer - Cyberpunk Edition** is an interactive, single-page web application that visualizes Well-Known Text (WKT) geometries on an interactive map with a retro-futuristic cyberpunk aesthetic.

### Core Functionality
- **WKT Parsing & Visualization**: Supports POINT, LINESTRING, POLYGON, and MULTIPOLYGON geometries
- **Interactive Mapping**: Built on Leaflet.js with multiple cyberpunk-themed basemaps
- **GIS Operations**: Buffer, simplify, convex hull, centroid, and union operations via Turf.js
- **Layer Management**: Comprehensive layer system for managing multiple geometries and operation results
- **Visual Editing**: Interactive polygon editing with real-time WKT updates

### Key Features
- Cyberpunk-themed UI with neon colors (cyan #00ffff, magenta #ff00cc, green #00ff99)
- CRT scanline effects and retro typography
- Layer visibility toggles and management
- Copy WKT functionality
- Keyboard shortcuts (Ctrl/Cmd + Enter to visualize)

---

## 📁 Codebase Structure

```
wkt_viewer_cyberpunk/
├── index.html          # Main HTML structure and UI components
├── script.js           # Core JavaScript logic (811 lines)
├── styles.css          # Cyberpunk styling and animations (705 lines)
├── README.md           # User-facing documentation
├── CLAUDE.md           # This file - AI assistant guide
└── .git/               # Git repository
```

### File Responsibilities

**index.html** (148 lines)
- HTML structure with semantic markup
- External library CDN imports (Leaflet, Leaflet.Draw, Turf.js, Font Awesome)
- UI sections: input panel, operations panel, layers panel, map container
- Decorative elements (corners, scanlines, status indicator)

**script.js** (811 lines)
- WKT parsing logic (`parseWKT()` - lines 319-438)
- Layer management system (`LayerManager` class - lines 48-265)
- GIS operations (lines 574-741)
- Leaflet/GeoJSON conversion utilities (lines 440-506)
- Event handlers and user interactions (lines 792-811)

**styles.css** (705 lines)
- Cyberpunk color scheme and theming
- CRT effects (scanlines, noise overlay, glowing text)
- Responsive layout (split-view design)
- Custom Leaflet control styling
- Animation keyframes

---

## 🛠️ Technology Stack

### Core Libraries (CDN-based)

| Library | Version | Purpose | CDN Location |
|---------|---------|---------|--------------|
| **Leaflet.js** | 1.9.4 | Interactive mapping | cdnjs.cloudflare.com |
| **Leaflet.Draw** | 1.0.4 | Geometry editing | cdnjs.cloudflare.com |
| **Turf.js** | 7.x | Geospatial analysis | cdn.jsdelivr.net |
| **Font Awesome** | 6.4.0 | Icons | cdnjs.cloudflare.com |

### Fonts (Google Fonts)
- **Orbitron**: Headings and labels (futuristic sans-serif)
- **Press Start 2P**: Main title (retro pixelated)
- **VT323**: Body text and inputs (terminal-style monospace)

### Basemap Providers
- **CARTO**: Dark basemaps (Cyber Grid, Neo Tokyo themes)
- **Esri**: Satellite imagery (Satellite Intel theme)
- **OpenStreetMap**: Standard map (Mainframe theme)

### No Build System
- **Pure vanilla JavaScript** - No transpilation, bundling, or npm dependencies
- **Runs directly in browser** - Just open index.html
- **CDN-based dependencies** - No package.json or node_modules

---

## 🏗️ Architecture & Key Components

### 1. LayerManager Class (lines 48-265)

The central data structure for managing all map layers.

```javascript
class LayerManager {
    constructor(map)

    // Core Methods
    addLayer(geometry, name, type, params)     // Add new layer
    removeLayer(layerId)                        // Remove layer
    toggleLayerVisibility(layerId)              // Show/hide layer
    clearAllLayers()                            // Remove all layers
    clearOperationLayers()                      // Remove operation results only

    // Helper Methods
    getColorForType(type)                       // Type-based color coding
    updateLayerPanel()                          // Refresh UI
    zoomToLayer(layerId)                        // Fit bounds to layer
    copyLayerWKT(layerId)                      // Copy layer as WKT
}
```

**Layer Types & Colors:**
- `input`: #00ffff (cyan) - User-inputted geometries
- `buffer`: #9d4edd (purple) - Buffer operation results
- `simplify`: #f72585 (hot pink) - Simplified geometries
- `convexhull`: #4cc9f0 (cyan) - Convex hull results
- `centroid`: #ffd60a (gold) - Centroid points
- `union`: #06ffa5 (neon green) - Union operation results
- `custom`: #ffaa00 (orange) - Fallback color

### 2. WKT Parsing System (lines 319-438)

**Function:** `parseWKT(wktString)` → Leaflet layer

Supports geometry types:
- **POINT**: Returns `L.circleMarker` with radius 8
- **LINESTRING**: Returns `L.polyline` with cyan styling
- **POLYGON**: Returns `L.polygon` with magenta border, cyan fill
- **MULTIPOLYGON**: Returns `L.polygon` with multiple coordinate arrays

**Parsing Logic:**
1. Extract geometry type via regex: `/^([A-Z]+)/`
2. Extract coordinate text after geometry type
3. Parse coordinate pairs: split by commas, then by whitespace
4. Convert to Leaflet [lat, lng] format (WKT is lon/lat)
5. Apply cyberpunk styling

### 3. GIS Operations (Turf.js Integration)

All operations use Turf.js for spatial analysis:

```javascript
// Buffer (lines 576-607)
executeBuffer() → turf.buffer(geometry, distance, {units: 'kilometers'})

// Simplify (lines 609-644)
executeSimplify() → turf.simplify(geometry, {tolerance, highQuality: false})

// Convex Hull (lines 646-676)
executeConvexHull() → turf.convex(geometry)

// Centroid (lines 678-706)
executeCentroid() → turf.centroid(geometry)

// Union (lines 708-736)
executeUnion() → turf.union(featureCollection)
```

**Operation Flow:**
1. Validate current geometry exists
2. Execute Turf.js operation
3. Add result to LayerManager with appropriate type
4. Update currentGeometry reference
5. Update WKT textarea via `updateWKTFromGeometry()`
6. Display operation info message

### 4. Coordinate System Conversions

**Leaflet ↔ GeoJSON ↔ WKT:**

```javascript
// Leaflet → GeoJSON
leafletToGeoJSON(layer) → layer.toGeoJSON()

// GeoJSON → Leaflet
geoJSONToLeaflet(geojson, color) → L.geoJSON(geojson, {style, pointToLayer})

// GeoJSON → WKT
geoJSONToWKT(geojson) → "POLYGON((lon lat, lon lat, ...))"
```

**Coordinate Order:**
- WKT format: `LONGITUDE LATITUDE` (X Y)
- Leaflet format: `[LATITUDE, LONGITUDE]` (Y X)
- **Always swap when converting between WKT and Leaflet!**

### 5. State Management

Global state variables (lines 40-45):

```javascript
let currentGeometry = null;      // Active geometry (GeoJSON)
let allGeometries = [];          // Array of all visualized geometries
let currentEditableLayer = null; // Currently editable Leaflet layer
const geomLayer = L.featureGroup(); // Legacy layer group (deprecated in favor of LayerManager)
const operationLayer = L.featureGroup(); // Legacy operation layer
```

**State Flow:**
1. User inputs WKT → `parseWKT()` → Leaflet layer
2. Convert to GeoJSON → Store in `currentGeometry`
3. Add to `allGeometries` array
4. Add to `layerManager` for UI management
5. Operations update `currentGeometry` and create new layers

---

## 💻 Development Workflow

### Git Branch Naming Convention

**Format:** `claude/<description>-<session-id>`

**Examples:**
```
claude/gis-polygon-layer-handling-012qhGjuGWouXtGPbqDhc5dm
claude/debug-issue-013CbNDsoaHT44ZESrZTXXpT
claude/edit-polygon-geometry-011LS9yw2H2GDhxhvUSNDtGe
```

**Branch Guidelines:**
- Use lowercase with hyphens for description
- Keep description concise (3-5 words)
- Session ID is automatically generated
- Always develop on feature branches, never on main
- Use `git push -u origin <branch-name>` for first push

### Commit Message Style

**Pattern:** `<verb> <description>`

**Good Examples:**
```
Add comprehensive layer management system for GIS operations
Fix console errors: Leaflet Draw, invalid image URL, and missing favicon
Add visual polygon editing and WKT copy functionality
Set Alaska polygon as default sample WKT
Expand UI layout: remove container max-width and widen tools panel
```

**Commit Message Guidelines:**
- Start with imperative verb (Add, Fix, Update, Remove, Refactor)
- Be specific and descriptive
- For bug fixes: mention what was broken
- For features: describe what was added
- Keep under 72 characters when possible
- Multi-line commits: use colons or "and" to separate items

### Pull Request Workflow

**Current PR History:**
- PR #9: Layer management system
- PR #8: Debug console errors
- PR #7: Polygon editing features
- PR #6: UI layout expansion
- PR #5: Default sample update

**PR Guidelines:**
1. Create feature branch with `claude/` prefix
2. Develop and test changes locally
3. Commit with descriptive messages
4. Push to origin with `-u` flag
5. Create PR via GitHub interface (or `gh pr create` if CLI available)
6. Merge via GitHub UI after approval
7. Delete feature branch after merge

### Development Environment

**No setup required** - this is a static web application.

**Local Testing:**
```bash
# Option 1: Open directly in browser
open index.html

# Option 2: Simple HTTP server (if needed for CORS)
python3 -m http.server 8000
# Then visit http://localhost:8000

# Option 3: VS Code Live Server extension
# Right-click index.html → "Open with Live Server"
```

---

## 📐 Code Conventions

### JavaScript Style

**Naming Conventions:**
- **Functions**: camelCase (`parseWKT`, `executeBuffer`, `showError`)
- **Classes**: PascalCase (`LayerManager`)
- **Constants**: camelCase for objects (`baseMaps`, `samples`)
- **DOM elements**: camelCase with descriptive names (`wktInput`, `visualizeBtn`)

**Code Patterns:**

```javascript
// DOM element references at top of file
const wktInput = document.getElementById('wktInput');
const visualizeBtn = document.getElementById('visualizeBtn');

// Event listeners at bottom of file (lines 792-811)
visualizeBtn.addEventListener('click', visualizeWKT);

// Error handling pattern
try {
    // operation code
    hideError();
    const result = performOperation();
    showOperationInfo('Success message');
} catch (error) {
    showError('Operation failed: ' + error.message);
    console.error(error);
}

// Turf.js operation pattern
const result = turf.operation(currentGeometry, options);
const layerName = `Operation Name ${params}`;
layerManager.addLayer(result, layerName, 'operation-type', params);
currentGeometry = result;
updateWKTFromGeometry();
```

### CSS Conventions

**Cyberpunk Color Palette:**
```css
/* Primary Colors */
--cyan: #00ffff;         /* Labels, borders, primary accents */
--magenta: #ff00cc;      /* Headings, highlights, polygon borders */
--green: #00ff99;        /* Text, success states, status indicators */
--dark-bg: #0a0a1a;      /* Background */
--panel-bg: rgba(5, 5, 16, 0.8); /* Panel backgrounds */

/* Operation Colors */
--buffer: #9d4edd;       /* Purple */
--simplify: #f72585;     /* Hot pink */
--convexhull: #4cc9f0;   /* Cyan */
--centroid: #ffd60a;     /* Gold */
--union: #06ffa5;        /* Neon green */
--error: #ff3366;        /* Error red */
```

**Effects & Animations:**
- Glowing text shadows: `text-shadow: 0 0 5px <color>`
- Box shadows for neon glow: `box-shadow: 0 0 20px rgba(color, 0.3)`
- CRT scanline overlay: 4px gradient lines
- Hover effects: `transform: translateY(-3px)` + enhanced shadows
- Pulsing status dot: CSS animation on `.status-dot`

**Font Usage:**
- `Press Start 2P`: Main title only
- `Orbitron`: Labels, buttons, headings
- `VT323`: Body text, inputs, textarea

### HTML Structure Patterns

**Section Pattern:**
```html
<div class="[section-name]-section">
    <div class="label-wrapper">
        <i class="fas fa-[icon]"></i>
        <label>[SECTION TITLE]:</label>
    </div>
    <!-- Section content -->
</div>
```

**Button Pattern:**
```html
<button id="[action]Btn" class="operation-btn [type]-btn">
    <i class="fas fa-[icon]"></i> [Button Text]
</button>
```

---

## 🔧 Common Development Tasks

### Adding a New GIS Operation

**Example: Adding an "Intersect" operation**

1. **Add UI Button** (index.html):
```html
<button id="intersectBtn" class="operation-btn intersect-btn">
    <i class="fas fa-cut"></i> Intersect Geometries
</button>
```

2. **Add CSS Styling** (styles.css):
```css
.intersect-btn {
    background: linear-gradient(135deg, #ff6b9d 0%, #c9184a 100%);
    color: #fff;
}
```

3. **Add Color to LayerManager** (script.js, line 89-97):
```javascript
const typeColors = {
    // ... existing types
    'intersect': '#ff6b9d'
};
```

4. **Add Operation Icon** (script.js, line 222-232):
```javascript
const icons = {
    // ... existing icons
    'intersect': '<i class="fas fa-cut"></i>'
};
```

5. **Implement Operation Function** (script.js, after line 741):
```javascript
function executeIntersect() {
    if (allGeometries.length < 2) {
        showError("Please visualize at least 2 geometries!");
        return;
    }

    try {
        hideError();

        // Execute Turf.js intersect
        const intersected = turf.intersect(
            turf.featureCollection([allGeometries[0], allGeometries[1]])
        );

        if (!intersected) {
            showError("No intersection found between geometries");
            return;
        }

        // Add result to layer manager
        const layerName = `Intersection Result`;
        layerManager.addLayer(intersected, layerName, 'intersect');

        // Update current geometry
        currentGeometry = intersected;
        updateWKTFromGeometry();

        showOperationInfo('Intersection completed successfully');
    } catch (error) {
        showError("Intersect operation failed: " + error.message);
        console.error(error);
    }
}
```

6. **Add Event Listener** (script.js, after line 803):
```javascript
document.getElementById('intersectBtn').addEventListener('click', executeIntersect);
```

### Adding a New Geometry Type

**Example: Adding GEOMETRYCOLLECTION support**

1. **Update parseWKT() function** (script.js, line 319-438):
```javascript
else if (geometryType === 'GEOMETRYCOLLECTION') {
    // Parse and create L.featureGroup with multiple geometries
    const features = [];
    // ... parsing logic
    return L.featureGroup(features);
}
```

2. **Update info message** (index.html, line 67):
```html
<div class="info">
    <i class="fas fa-info-circle"></i>
    Supports POLYGON, MULTIPOLYGON, LINESTRING, POINT, GEOMETRYCOLLECTION and other WKT geometry types
</div>
```

3. **Add sample** (script.js, lines 302-307):
```javascript
const samples = [
    // ... existing samples
    'GEOMETRYCOLLECTION(POINT(-77.0 38.9), LINESTRING(-77.0 38.9, -76.9 39.0))'
];
```

### Adding a New Basemap

**Example: Adding Stamen Toner basemap**

1. **Add to baseMaps object** (script.js, lines 12-26):
```javascript
const baseMaps = {
    // ... existing basemaps
    "Hacker Terminal": L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>',
        className: 'retro-map'
    })
};
```

2. **Optional: Add custom CSS filter** (styles.css):
```css
.leaflet-tile-pane .retro-map {
    filter: hue-rotate(90deg) saturate(150%);
}
```

### Modifying the Color Scheme

**To change from cyberpunk to another theme:**

1. **Update CSS variables approach** - Search and replace colors in styles.css:
   - Find: `#00ffff` (cyan) → Replace with new primary color
   - Find: `#ff00cc` (magenta) → Replace with new secondary color
   - Find: `#00ff99` (green) → Replace with new accent color

2. **Update LayerManager colors** (script.js, lines 53-57, 88-98)

3. **Update parseWKT() styling** (script.js, lines 337-343, 364-366, 395-399, 427-431)

---

## 🧪 Testing & Debugging

### Browser Console Testing

**Test WKT Parsing:**
```javascript
// In browser console
const testWKT = 'POLYGON((-74.0 40.7, -73.9 40.7, -73.9 40.8, -74.0 40.8, -74.0 40.7))';
const layer = parseWKT(testWKT);
const geojson = leafletToGeoJSON(layer);
const wkt = geoJSONToWKT(geojson);
console.log('Original:', testWKT);
console.log('Round-trip:', wkt);
```

**Test Layer Manager:**
```javascript
// Check layer count
console.log('Total layers:', layerManager.layers.size);

// Inspect specific layer
const layerId = Array.from(layerManager.layers.keys())[0];
const layer = layerManager.layers.get(layerId);
console.log(layer);

// Test color assignment
console.log('Buffer color:', layerManager.getColorForType('buffer'));
```

**Test Turf.js Operations:**
```javascript
// Create test polygon
const poly = turf.polygon([[[-74, 40], [-73, 40], [-73, 41], [-74, 41], [-74, 40]]]);

// Test buffer
const buffered = turf.buffer(poly, 10, {units: 'kilometers'});
console.log('Buffered area:', turf.area(buffered));

// Test centroid
const center = turf.centroid(poly);
console.log('Centroid:', center.geometry.coordinates);
```

### Common Issues & Solutions

**Issue: WKT not parsing**
- Check coordinate order: WKT uses lon/lat (X Y), not lat/lon
- Ensure polygon is closed (first point = last point)
- Verify proper parentheses nesting for MULTIPOLYGON

**Issue: Map not displaying**
- Open browser console and check for Leaflet errors
- Verify CDN links are loading (check Network tab)
- Ensure container div has explicit height in CSS

**Issue: Operation fails**
- Check `currentGeometry` is not null
- Verify geometry is valid GeoJSON
- Check Turf.js version compatibility (using v7)

**Issue: Layer not appearing**
- Check layer visibility checkbox
- Verify layer color isn't transparent
- Check if layer is outside current map bounds

**Issue: Console errors on Leaflet Draw**
- Recent fix: PR #8 addressed Leaflet Draw console errors
- Ensure edit control is only added to `geomLayer` featureGroup
- Check `selectedPathOptions` configuration

---

## ⚠️ Important Notes for AI Assistants

### Critical Guidelines

1. **Single-Page Application**
   - This is a pure client-side application with NO backend
   - NO build process, NO npm, NO bundler required
   - All dependencies loaded via CDN
   - Changes take effect immediately on page refresh

2. **Coordinate System Awareness**
   - **WKT format**: LONGITUDE LATITUDE (X Y)
   - **Leaflet format**: [LATITUDE, LONGITUDE] (Y X)
   - **ALWAYS swap coordinates** when converting between systems
   - Failure to swap will result in geometries appearing in wrong locations

3. **State Management**
   - `currentGeometry` holds the active geometry in GeoJSON format
   - `allGeometries` array maintains all visualized geometries for union operations
   - LayerManager handles visual representation and UI
   - Always update all three when modifying geometries

4. **Styling Consistency**
   - Maintain cyberpunk aesthetic with cyan/magenta/green color scheme
   - Use existing font families (Press Start 2P, Orbitron, VT323)
   - Apply glow effects to match existing UI elements
   - Keep button gradients and hover effects consistent

5. **Operation Pattern**
   - All GIS operations should follow the established pattern:
     1. Validate geometry exists
     2. Execute Turf.js operation
     3. Add result to LayerManager
     4. Update currentGeometry
     5. Update WKT textarea
     6. Show operation info message

6. **Error Handling**
   - Always use try-catch blocks for operations
   - Show user-friendly error messages via `showError()`
   - Log detailed errors to console for debugging
   - Validate inputs before processing

7. **Layer Management**
   - Use LayerManager for all new layers (don't use legacy `geomLayer` or `operationLayer`)
   - Assign appropriate layer type for color coding
   - Update layer panel UI after changes
   - Provide zoom-to-layer functionality for new features

8. **Git Workflow**
   - ALWAYS develop on `claude/` prefixed branches
   - NEVER commit directly to main
   - Use descriptive commit messages with imperative verbs
   - Create PRs for all feature merges

9. **Browser Compatibility**
   - Target modern browsers (Chrome, Firefox, Safari, Edge)
   - Use standard JavaScript (ES6+) features
   - Leaflet handles most cross-browser map issues
   - Test clipboard API (fallback already implemented)

10. **Performance Considerations**
    - Large geometries (10,000+ vertices) may slow rendering
    - Simplify operation can improve performance
    - Layer visibility toggles help with complex scenes
    - Consider debouncing for real-time operations

### Testing Checklist for Changes

Before committing changes, verify:

- [ ] WKT parsing works for all geometry types (POINT, LINESTRING, POLYGON, MULTIPOLYGON)
- [ ] Operations add layers to LayerManager correctly
- [ ] Operation colors match type-specific colors
- [ ] Layer panel updates show new layers
- [ ] Layer visibility toggles work
- [ ] Copy WKT functionality works
- [ ] Zoom to layer functionality works
- [ ] Console has no errors (check browser DevTools)
- [ ] UI styling matches cyberpunk theme
- [ ] Responsive design works on mobile (test at 768px breakpoint)
- [ ] Keyboard shortcuts still work (Ctrl/Cmd + Enter)

### File Modification Guidelines

**When editing index.html:**
- Maintain semantic HTML structure
- Keep CDN links for external libraries
- Preserve decorative elements (corners, scanline, status)
- Update button groups if adding new operations

**When editing script.js:**
- Add new functions in logical sections (with operations, with utilities, etc.)
- Update LayerManager if adding new layer types
- Add event listeners at bottom of file (lines 792-811)
- Maintain comment headers for major sections

**When editing styles.css:**
- Maintain cyberpunk color palette
- Keep consistent spacing/padding (10px, 15px, 20px increments)
- Add new operation button styles near existing operation buttons
- Test responsive breakpoints (@media max-width: 768px)

### Common Pitfall Avoidance

❌ **Don't:**
- Add npm dependencies or package.json
- Remove CDN links or replace with local files
- Change the core color scheme without updating all references
- Bypass LayerManager and add layers directly to map
- Forget to swap lat/lon when converting from WKT
- Use `var` keyword (use `const` or `let`)
- Add backend API calls (this is client-side only)

✅ **Do:**
- Use existing utility functions (parseWKT, geoJSONToWKT, etc.)
- Follow established patterns for operations and UI
- Maintain error handling and user feedback
- Update README.md when adding user-facing features
- Test in browser console before committing
- Keep code DRY (Don't Repeat Yourself)
- Add helpful comments for complex logic

---

## 📚 Additional Resources

### External Documentation
- [Leaflet.js Documentation](https://leafletjs.com/reference.html)
- [Turf.js Documentation](https://turfjs.org/docs/)
- [WKT Format Specification](https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry)
- [Leaflet.Draw Documentation](https://leaflet.github.io/Leaflet.draw/docs/leaflet-draw-latest.html)

### Useful Code References
- **WKT Parsing**: script.js lines 319-438
- **Layer Management**: script.js lines 48-265
- **GIS Operations**: script.js lines 574-741
- **Coordinate Conversion**: script.js lines 440-506, 467-506
- **Event Handlers**: script.js lines 792-811
- **Cyberpunk Styling**: styles.css lines 1-705

### Recent Development History
- **PR #9**: Added comprehensive layer management system
- **PR #8**: Fixed Leaflet Draw console errors and favicon issues
- **PR #7**: Added visual polygon editing and WKT copy functionality
- **PR #6**: Expanded UI layout by removing max-width constraints
- **PR #5**: Set Alaska polygon as default sample

---

## 🤖 AI Assistant Quick Reference

### When asked to...

**"Add a new operation"** → Follow [Adding a New GIS Operation](#adding-a-new-gis-operation) guide

**"Fix a bug"** → Check [Common Issues & Solutions](#common-issues--solutions), use browser console for debugging

**"Change the styling"** → Refer to [Cyberpunk Color Palette](#code-conventions) and maintain consistency

**"Add a basemap"** → Follow [Adding a New Basemap](#adding-a-new-basemap) guide

**"Parse new geometry type"** → Update `parseWKT()` function and follow [Adding a New Geometry Type](#adding-a-new-geometry-type)

**"Make it responsive"** → Check existing mobile breakpoint at 768px in styles.css lines 672-705

**"Debug coordinate issues"** → Remember WKT is lon/lat, Leaflet is [lat, lon] - SWAP THEM!

---

**End of CLAUDE.md** - This guide should be updated whenever significant architectural changes are made to the codebase.
