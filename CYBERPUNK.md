# Cyberpunk / Retro-Futuristic Design System

A comprehensive guide to implementing the cyberpunk retro-futuristic aesthetic used in the WKT Polygon Visualizer. This document provides reusable patterns, code samples, and design principles for creating similar cyberpunk-themed applications.

## Table of Contents
1. [Color Palette](#color-palette)
2. [Typography](#typography)
3. [Background Effects](#background-effects)
4. [Visual Effects](#visual-effects)
5. [Interactive Elements](#interactive-elements)
6. [Component Patterns](#component-patterns)
7. [Animations](#animations)

---

## Color Palette

### Primary Colors
The cyberpunk aesthetic relies on high-contrast neon colors against dark backgrounds:

```css
/* Core Color Variables */
:root {
  /* Primary Neon Colors */
  --neon-cyan: #00ffff;
  --neon-magenta: #ff00cc;
  --neon-green: #00ff99;

  /* Background Colors */
  --bg-dark: #0a0a1a;
  --bg-dark-alt: #080820;
  --bg-panel: rgba(5, 5, 16, 0.8);
  --bg-section: rgba(15, 15, 45, 0.4);

  /* Accent Colors for Operations */
  --accent-purple: #9d4edd;
  --accent-pink: #f72585;
  --accent-blue: #4cc9f0;
  --accent-yellow: #ffd60a;
  --accent-teal: #06ffa5;
  --accent-red: #ff3366;
}
```

### Usage Example
```css
body {
  background-color: var(--bg-dark);
  color: var(--neon-green);
}

h1 {
  color: var(--neon-magenta);
}

label {
  color: var(--neon-cyan);
}
```

---

## Typography

### Font Stack
Three complementary fonts create the retro-futuristic feel:

```html
<!-- Google Fonts Import -->
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Press+Start+2P&family=VT323&display=swap" rel="stylesheet">
```

```css
/* Font Usage */
body {
  font-family: 'VT323', monospace; /* Retro terminal font */
  font-size: 1.3rem;
  line-height: 1.6;
}

h1, h2 {
  font-family: 'Press Start 2P', cursive; /* Pixel-style headers */
  letter-spacing: 2px;
}

label, button {
  font-family: 'Orbitron', sans-serif; /* Futuristic labels */
  letter-spacing: 1px;
  text-transform: uppercase;
}
```

### Neon Text Glow Effect
```css
h1 {
  color: #ff00cc;
  text-shadow:
    0 0 5px #ff00cc,
    0 0 10px rgba(255, 0, 204, 0.5);
}

/* Multi-layer glow for stronger effect */
label {
  color: #00ffff;
  text-shadow:
    0 0 5px rgba(0, 255, 255, 0.5),
    0 0 10px rgba(0, 255, 255, 0.3),
    0 0 20px rgba(0, 255, 255, 0.2);
}
```

---

## Background Effects

### 1. Layered Gradient Background
```css
body {
  background-color: #0a0a1a;
  background-image:
    radial-gradient(circle at 10% 20%, rgba(0, 255, 153, 0.03) 0%, transparent 20%),
    radial-gradient(circle at 90% 80%, rgba(255, 0, 204, 0.03) 0%, transparent 20%),
    linear-gradient(to bottom, #0a0a1a 0%, #080820 100%);
}
```

### 2. CRT Noise Overlay
Adds authentic retro screen texture:

```css
body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* Base64 noise texture */
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAUVBMVEWFhYWDg4N3d3dtbW17e3t1dXWBgYGHh4d5eXlzc3OLi4ubm5uVlZWPj4+NjY19fX2JiYl/f39ra2uRkZGZmZlpaWmXl5dvb29xcXGTk5NnZ2c8TV1mAAAAG3RSTlNAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAvEOwtAAAFVklEQVR4XpWWB67c2BUFb3g557T/hRo9/WUMZHlgr4Bg8Z4qQgQJlHI4A8SzFVrapvmTF9O7dmYRFZ60YiBhJRCgh1FYhiLAmdvX0CzTOpNE77ME0Zty/nWWzchDtiqrmQDeuv3powQ5ta2eN0FY0InkqDD73lT9c9lEzwUNqgFHs9VQce3TVClFCQrSTfOiYkVJQBmpbq2L6iZavPnAPcoU0dSw0SUTqz/GtrGuXfbyyBniKykOWQWGqwwMA7QiYAxi+IlPdqo+hYHnUt5ZPfnsHJyNiDtnpJyayNBkF6cWoYGAMY92U2hXHF/C1M8uP/ZtYdiuj26UdAdQQSXQErwSOMzt/XWRWAz5GuSBIkwG1H3FabJ2OsUOUhGC6tK4EMtJO0ttC6IBD3kM0ve0tJwMdSfjZo+EEISaeTr9P3wYrGjXqyC1krcKdhMpxEnt5JetoulscpyzhXN5FRpuPHvbeQaKxFAEB6EN+cYN6xD7RYGpXpNndMmZgM5Dcs3YSNFDHUo2LGfZuukSWyUYirJAdYbF3MfqEKmjM+I2EfhA94iG3L7uKrR+GdWD73ydlIB+6hgref1QTlmgmbM3/LeX5GI1Ux1RWpgxpLuZ2+I+IjzZ8wqE4nilvQdkUdfhzI5QDWy+kw5Wgg2pGpeEVeCCA7b85BO3F9DzxB3cdqvBzWcmzbyMiqhzuYqtHRVG2y4x+KOlnyqla8AoWWpuBoYRxzXrfKuILl6SfiWCbjxoZJUaCBj1CjH7GIaDbc9kqBY3W/Rgjda1iqQcOJu2WW+76pZC9QG7M00dffe9hNnseupFL53r8F7YHSwJWUKP2q+k7RdsxyOB11n0xtOvnW4irMMFNV4H0uqwS5ExsmP9AxbDTc9JwgneAT5vTiUSm1E7BSflSt3bfa1tv8Di3R8n3Af7MNWzs49hmauE2wP+ttrq+AsWpFG2awvsuOqbipWHgtuvuaAE+A1Z/7gC9hesnr+7wqCwG8c5yAg3AL1fm8T9AZtp/bbJGwl1pNrE7RuOX7PeMRUERVaPpEs+yqeoSmuOlokqw49pgomjLeh7icHNlG19yjs6XXOMedYm5xH2YxpV2tc0Ro2jJfxC50ApuxGob7lMsxfTbeUv07TyYxpeLucEH1gNd4IKH2LAg5TdVhlCafZvpskfncCfx8pOhJzd76bJWeYFnFciwcYfubRc12Ip/ppIhA1/mSZ/RxjFDrJC5xifFjJpY2Xl5zXdguFqYyTR+zOW1E6STYwb/DzmxdZhbuE9YVvN0aTEFpPpuQ+WQJ7CIiC2L7EIMhUAZ/rPbdaHrupdvAkL+3FO1CJVQOJiAIpGGIDCY36ggMTB3SLVQpbF6uLVxK5Rz2NU/ReeAzjPkN+pz8QpFQIDALDitrMtwAAAABJRU5ErkJggg==');
  opacity: 0.05;
  pointer-events: none;
  z-index: 9998;
}
```

### 3. Grid/Circuit Pattern
```css
.container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    linear-gradient(to right, transparent 49.5%, rgba(0, 255, 153, 0.1) 49.5%, rgba(0, 255, 153, 0.1) 50.5%, transparent 50.5%),
    linear-gradient(to bottom, transparent 49.5%, rgba(0, 255, 153, 0.1) 49.5%, rgba(0, 255, 153, 0.1) 50.5%, transparent 50.5%);
  background-size: 30px 30px;
  pointer-events: none;
  z-index: -1;
}
```

### 4. Scanline Effect
```css
/* Animated scanline element */
.scanline {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  pointer-events: none;
  z-index: 9999;
  opacity: 0.5;
  animation: scanline 4s linear infinite;
}

@keyframes scanline {
  0% { transform: translateY(-100vh); }
  100% { transform: translateY(100vh); }
}
```

### 5. CRT Scanlines on Elements
```css
#map::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    rgba(0, 0, 0, 0) 50%,
    rgba(0, 0, 0, 0.05) 50%
  );
  background-size: 100% 4px;
  z-index: 1000;
  pointer-events: none;
  opacity: 0.3;
}
```

---

## Visual Effects

### 1. Neon Glow Borders
```css
.container {
  background-color: rgba(5, 5, 16, 0.8);
  border-radius: 10px;
  border: 2px solid #333;
  box-shadow:
    0 0 30px rgba(0, 255, 153, 0.3),
    0 0 60px rgba(0, 255, 153, 0.1);
}

/* Stronger glow on focus */
textarea:focus {
  border-color: #ff00cc;
  box-shadow:
    0 0 15px rgba(255, 0, 204, 0.3),
    inset 0 0 10px rgba(0, 0, 0, 0.5);
}
```

### 2. Corner Bracket Decorations
```css
.corner {
  position: absolute;
  width: 30px;
  height: 30px;
  z-index: 2;
}

.corner-tl {
  top: 10px;
  left: 10px;
  border-top: 3px solid #ff00cc;
  border-left: 3px solid #ff00cc;
}

.corner-tr {
  top: 10px;
  right: 10px;
  border-top: 3px solid #ff00cc;
  border-right: 3px solid #ff00cc;
}

.corner-bl {
  bottom: 10px;
  left: 10px;
  border-bottom: 3px solid #ff00cc;
  border-left: 3px solid #ff00cc;
}

.corner-br {
  bottom: 10px;
  right: 10px;
  border-bottom: 3px solid #ff00cc;
  border-right: 3px solid #ff00cc;
}
```

### 3. Text Shadow Clone Effect
Creates a glitch-style duplicate text:

```css
h1 {
  position: relative;
  overflow: hidden;
}

h1::after {
  content: 'WKT POLYGON VISUALIZER'; /* Match h1 text */
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: rgba(255, 0, 204, 0.3);
  transform: translateX(5px) translateY(5px);
  z-index: -1;
}
```

### 4. Status Indicator
```css
.status {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: rgba(0, 0, 0, 0.3);
  padding: 5px 10px;
  border-radius: 20px;
  border: 1px solid rgba(0, 255, 255, 0.3);
}

.status-dot {
  width: 10px;
  height: 10px;
  background-color: #00ff99;
  border-radius: 50%;
  box-shadow: 0 0 8px #00ff99;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 0.8; }
  50% { opacity: 1; }
  100% { opacity: 0.8; }
}
```

---

## Interactive Elements

### 1. Cyberpunk Buttons
```css
button {
  font-family: 'Orbitron', sans-serif;
  background: none;
  border: none;
  cursor: pointer;
  padding: 12px 20px;
  border-radius: 5px;
  font-weight: bold;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

/* Gradient backgrounds for different button types */
.primary-btn {
  background: linear-gradient(135deg, #00ff99 0%, #00cc77 100%);
  color: #000;
}

.danger-btn {
  background: linear-gradient(135deg, #ff3366 0%, #cc0044 100%);
  color: #000;
}

.info-btn {
  background: linear-gradient(135deg, #00ffff 0%, #00cccc 100%);
  color: #000;
}

/* Shine effect on hover */
button::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: rgba(255, 255, 255, 0.1);
  transform: rotate(30deg);
  transition: transform 0.5s;
  pointer-events: none;
}

button:hover::after {
  transform: rotate(30deg) translate(-30%, -30%);
}

button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
}

button:active {
  transform: translateY(1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
}
```

### 2. Cyberpunk Input Fields
```css
textarea,
input[type="text"],
input[type="number"] {
  width: 100%;
  background-color: rgba(15, 15, 45, 0.7);
  color: #00ff99;
  border: 1px solid #00ffff;
  border-radius: 5px;
  padding: 15px;
  font-family: 'VT323', monospace;
  font-size: 1.3rem;
  box-shadow:
    0 0 10px rgba(0, 255, 255, 0.2),
    inset 0 0 10px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;
}

textarea:focus,
input:focus {
  outline: none;
  border-color: #ff00cc;
  box-shadow:
    0 0 15px rgba(255, 0, 204, 0.3),
    inset 0 0 10px rgba(0, 0, 0, 0.5);
}
```

### 3. Custom Scrollbar
```css
.layers-list::-webkit-scrollbar {
  width: 8px;
}

.layers-list::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
}

.layers-list::-webkit-scrollbar-thumb {
  background: rgba(0, 255, 153, 0.5);
  border-radius: 4px;
}

.layers-list::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 255, 153, 0.7);
}
```

---

## Component Patterns

### 1. Panel/Section with Glow
```css
.section {
  position: relative;
  padding: 20px;
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 8px;
  background-color: rgba(15, 15, 45, 0.4);
  box-shadow:
    0 0 15px rgba(0, 255, 255, 0.2),
    inset 0 0 15px rgba(0, 0, 0, 0.3);
}
```

### 2. Error/Alert Messages
```css
.error-message {
  color: #ff3366;
  padding: 15px;
  background-color: rgba(255, 51, 102, 0.1);
  border-left: 3px solid #ff3366;
  border-radius: 3px;
  font-size: 1.1rem;
  text-shadow: 0 0 5px rgba(255, 51, 102, 0.3);
  animation: pulse 2s infinite;
}

.info-message {
  color: #00ff99;
  padding: 15px;
  background-color: rgba(0, 255, 153, 0.1);
  border-left: 3px solid #00ff99;
  border-radius: 3px;
  text-shadow: 0 0 5px rgba(0, 255, 153, 0.3);
}
```

### 3. Layer/List Item
```css
.layer-item {
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 5px;
  padding: 12px;
  margin-bottom: 10px;
  transition: all 0.3s ease;
}

.layer-item:hover {
  background-color: rgba(0, 255, 255, 0.05);
  border-color: rgba(0, 255, 255, 0.4);
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.2);
  transform: translateX(5px);
}
```

### 4. Icon Integration
```css
/* Using Font Awesome icons */
label i {
  margin-right: 10px;
  color: #ff00cc;
}

button i {
  font-size: 1rem;
  margin-right: 8px;
}

/* Glowing icons */
.icon-glow {
  color: #00ffff;
  text-shadow: 0 0 8px #00ffff;
}
```

---

## Animations

### 1. Pulse Animation
```css
@keyframes pulse {
  0% { opacity: 0.8; }
  50% { opacity: 1; }
  100% { opacity: 0.8; }
}

.pulsing {
  animation: pulse 2s infinite;
}
```

### 2. Slide In Animation
```css
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-in {
  animation: slideIn 0.3s ease-out;
}
```

### 3. Glow Pulse
```css
@keyframes glowPulse {
  0% {
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.6);
  }
  100% {
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
  }
}

.glow-pulse {
  animation: glowPulse 2s infinite;
}
```

### 4. Glitch Effect
```css
@keyframes glitch {
  0% {
    transform: translate(0);
  }
  20% {
    transform: translate(-2px, 2px);
  }
  40% {
    transform: translate(-2px, -2px);
  }
  60% {
    transform: translate(2px, 2px);
  }
  80% {
    transform: translate(2px, -2px);
  }
  100% {
    transform: translate(0);
  }
}

.glitch:hover {
  animation: glitch 0.3s infinite;
}
```

---

## Complete Example: Cyberpunk Card Component

Here's a full implementation combining multiple patterns:

```html
<div class="cyber-card">
  <div class="corner corner-tl"></div>
  <div class="corner corner-tr"></div>
  <div class="corner corner-bl"></div>
  <div class="corner corner-br"></div>

  <div class="card-header">
    <i class="fas fa-terminal"></i>
    <h2>SYSTEM STATUS</h2>
  </div>

  <div class="card-content">
    <p>All systems operational</p>
    <div class="status">
      <div class="status-dot"></div>
      <span>ONLINE</span>
    </div>
  </div>

  <div class="card-actions">
    <button class="cyber-btn primary-btn">
      <i class="fas fa-check"></i> Confirm
    </button>
    <button class="cyber-btn danger-btn">
      <i class="fas fa-times"></i> Cancel
    </button>
  </div>
</div>
```

```css
.cyber-card {
  position: relative;
  background-color: rgba(5, 5, 16, 0.8);
  border: 2px solid #333;
  border-radius: 10px;
  padding: 30px;
  box-shadow:
    0 0 30px rgba(0, 255, 153, 0.3),
    0 0 60px rgba(0, 255, 153, 0.1);
  overflow: hidden;
}

.cyber-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    linear-gradient(to right, transparent 49.5%, rgba(0, 255, 153, 0.1) 49.5%, rgba(0, 255, 153, 0.1) 50.5%, transparent 50.5%),
    linear-gradient(to bottom, transparent 49.5%, rgba(0, 255, 153, 0.1) 49.5%, rgba(0, 255, 153, 0.1) 50.5%, transparent 50.5%);
  background-size: 30px 30px;
  pointer-events: none;
  z-index: -1;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(0, 255, 255, 0.3);
}

.card-header i {
  color: #ff00cc;
  font-size: 1.5rem;
}

.card-header h2 {
  font-family: 'Orbitron', sans-serif;
  color: #00ffff;
  font-size: 1.2rem;
  text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
  margin: 0;
}

.card-content {
  color: #00ff99;
  font-family: 'VT323', monospace;
  font-size: 1.2rem;
  margin-bottom: 20px;
}

.card-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

/* Corner decorations */
.cyber-card .corner {
  position: absolute;
  width: 30px;
  height: 30px;
  z-index: 2;
}

.cyber-card .corner-tl {
  top: 10px;
  left: 10px;
  border-top: 3px solid #ff00cc;
  border-left: 3px solid #ff00cc;
}

.cyber-card .corner-tr {
  top: 10px;
  right: 10px;
  border-top: 3px solid #ff00cc;
  border-right: 3px solid #ff00cc;
}

.cyber-card .corner-bl {
  bottom: 10px;
  left: 10px;
  border-bottom: 3px solid #ff00cc;
  border-left: 3px solid #ff00cc;
}

.cyber-card .corner-br {
  bottom: 10px;
  right: 10px;
  border-bottom: 3px solid #ff00cc;
  border-right: 3px solid #ff00cc;
}
```

---

## Customization Tips

### 1. Color Variations
Easily create different color schemes:

```css
/* Purple/Pink Theme */
.theme-purple {
  --primary: #b794f6;
  --secondary: #f687b3;
  --accent: #ed64a6;
}

/* Blue/Teal Theme */
.theme-blue {
  --primary: #63b3ed;
  --secondary: #4fd1c5;
  --accent: #38b2ac;
}

/* Green/Yellow Theme */
.theme-matrix {
  --primary: #48bb78;
  --secondary: #ecc94b;
  --accent: #38a169;
}
```

### 2. Intensity Control
Adjust glow intensity:

```css
/* Subtle glow */
.glow-low {
  box-shadow: 0 0 5px rgba(0, 255, 255, 0.2);
}

/* Medium glow */
.glow-medium {
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
}

/* Strong glow */
.glow-high {
  box-shadow:
    0 0 20px rgba(0, 255, 255, 0.5),
    0 0 40px rgba(0, 255, 255, 0.3);
}
```

### 3. Dark Mode Variations
For even darker themes:

```css
.ultra-dark {
  --bg-dark: #000000;
  --bg-dark-alt: #0a0a0a;
  --bg-panel: rgba(0, 0, 0, 0.9);
}
```

---

## Performance Considerations

1. **Use CSS transforms for animations** (not top/left) for better performance
2. **Limit box-shadow layers** to 2-3 maximum for smooth rendering
3. **Use `will-change` sparingly** for frequently animated elements
4. **Optimize background patterns** with CSS gradients instead of images when possible
5. **Consider reduced motion** for accessibility:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Accessibility Notes

While maintaining the cyberpunk aesthetic:

1. **Ensure sufficient contrast** - All text should have at least 4.5:1 contrast ratio
2. **Don't rely on color alone** - Use icons and text labels
3. **Make animations optional** - Respect `prefers-reduced-motion`
4. **Maintain focus indicators** - Keep glowing borders on `:focus`
5. **Use semantic HTML** - Structure matters for screen readers

---

## Browser Compatibility

Most effects work in modern browsers. For best compatibility:

- **CSS Grid/Flexbox**: IE11+ (with prefixes)
- **Custom Properties**: No IE support (provide fallbacks)
- **Backdrop-filter**: Limited support (provide alternatives)
- **Mix-blend-mode**: IE/Edge legacy (use carefully)

### Fallback Example
```css
.container {
  background-color: #050510; /* Fallback */
  background-color: rgba(5, 5, 16, 0.8); /* Modern browsers */
}
```

---

## Quick Start Template

Minimal HTML/CSS to get started:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cyberpunk App</title>

  <!-- Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Press+Start+2P&family=VT323&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'VT323', monospace;
      background-color: #0a0a1a;
      color: #00ff99;
      padding: 20px;
      min-height: 100vh;
      background-image:
        radial-gradient(circle at 10% 20%, rgba(0, 255, 153, 0.03) 0%, transparent 20%),
        linear-gradient(to bottom, #0a0a1a 0%, #080820 100%);
    }

    h1 {
      font-family: 'Press Start 2P', cursive;
      color: #ff00cc;
      text-align: center;
      text-shadow: 0 0 5px #ff00cc, 0 0 10px rgba(255, 0, 204, 0.5);
      margin-bottom: 30px;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      background-color: rgba(5, 5, 16, 0.8);
      border-radius: 10px;
      padding: 30px;
      box-shadow: 0 0 30px rgba(0, 255, 153, 0.3);
      border: 2px solid #333;
    }

    button {
      font-family: 'Orbitron', sans-serif;
      background: linear-gradient(135deg, #00ff99 0%, #00cc77 100%);
      color: #000;
      border: none;
      padding: 12px 24px;
      border-radius: 5px;
      cursor: pointer;
      font-weight: bold;
      text-transform: uppercase;
      transition: all 0.3s;
    }

    button:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>CYBERPUNK INTERFACE</h1>
    <p>Your content here...</p>
    <button><i class="fas fa-rocket"></i> Launch</button>
  </div>
</body>
</html>
```

---

## References

- **Fonts**: Google Fonts - Orbitron, Press Start 2P, VT323
- **Icons**: Font Awesome 6+
- **Color Theory**: High contrast neon colors on dark backgrounds
- **Inspiration**: 1980s cyberpunk aesthetics, retro-futurism, CRT monitors

---

## License

This design system is documented for educational purposes. Feel free to use and modify these patterns in your projects.

**Created for**: WKT Polygon Visualizer
**Style**: Cyberpunk Retro-Futuristic
**Version**: 1.0
