        // DOM elements
        const wktInput = document.getElementById('wktInput');
        const visualizeBtn = document.getElementById('visualizeBtn');
        const clearBtn = document.getElementById('clearBtn');
        const sampleBtn = document.getElementById('sampleBtn');
        const errorMsg = document.getElementById('errorMsg');
        
        // Initialize map
        const map = L.map('map').setView([0, 0], 2);
        
        // Base maps with retro-futuristic styling
        const baseMaps = {
            "Cyber Grid": L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            }),
            "Neo Tokyo": L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            }),
            "Satellite Intel": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            }),
            "Mainframe": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                className: 'retro-map'
            })
        };

        // Add default base layer
        baseMaps["Cyber Grid"].addTo(map);
        
        // Add layer control
        L.control.layers(baseMaps).addTo(map);
        
        // Layer group for geometries
        const geomLayer = L.featureGroup().addTo(map);

        // Layer group for operation results
        const operationLayer = L.featureGroup().addTo(map);

        // Store current geometry for operations
        let currentGeometry = null;
        let allGeometries = [];

        // Store reference to the current editable layer
        let currentEditableLayer = null;

        // ===== LAYER MANAGEMENT SYSTEM =====
        class LayerManager {
            constructor(map) {
                this.map = map;
                this.layers = new Map(); // layerId -> layer metadata
                this.layerCounter = 0;
                this.colors = [
                    '#9d4edd', '#f72585', '#4cc9f0', '#ffd60a',
                    '#06ffa5', '#ff6b6b', '#00ffff', '#ff00cc',
                    '#00ff99', '#ffaa00', '#7209b7', '#00b4d8'
                ];
            }

            generateId() {
                return `layer_${++this.layerCounter}_${Date.now()}`;
            }

            addLayer(geometry, name, type = 'custom', params = {}) {
                const id = this.generateId();
                const color = this.getColorForType(type);
                const leafletLayer = geoJSONToLeaflet(geometry, color);

                leafletLayer.addTo(this.map);

                const layer = {
                    id: id,
                    name: name,
                    type: type,
                    geometry: geometry,
                    leafletLayer: leafletLayer,
                    visible: true,
                    color: color,
                    createdAt: new Date(),
                    params: params
                };

                this.layers.set(id, layer);
                this.updateLayerPanel();
                return id;
            }

            getColorForType(type) {
                const typeColors = {
                    'input': '#00ffff',
                    'buffer': '#9d4edd',
                    'simplify': '#f72585',
                    'convexhull': '#4cc9f0',
                    'centroid': '#ffd60a',
                    'union': '#06ffa5',
                    'custom': '#ffaa00'
                };
                return typeColors[type] || this.colors[this.layers.size % this.colors.length];
            }

            removeLayer(layerId) {
                const layer = this.layers.get(layerId);
                if (layer) {
                    this.map.removeLayer(layer.leafletLayer);
                    this.layers.delete(layerId);
                    this.updateLayerPanel();
                }
            }

            toggleLayerVisibility(layerId) {
                const layer = this.layers.get(layerId);
                if (layer) {
                    layer.visible = !layer.visible;
                    if (layer.visible) {
                        layer.leafletLayer.addTo(this.map);
                    } else {
                        this.map.removeLayer(layer.leafletLayer);
                    }
                    this.updateLayerPanel();
                }
            }

            renameLayer(layerId, newName) {
                const layer = this.layers.get(layerId);
                if (layer) {
                    layer.name = newName;
                    this.updateLayerPanel();
                }
            }

            getLayerGeometry(layerId) {
                const layer = this.layers.get(layerId);
                return layer ? layer.geometry : null;
            }

            clearAllLayers() {
                this.layers.forEach(layer => {
                    this.map.removeLayer(layer.leafletLayer);
                });
                this.layers.clear();
                this.updateLayerPanel();
            }

            clearOperationLayers() {
                const operationTypes = ['buffer', 'simplify', 'convexhull', 'centroid', 'union'];
                this.layers.forEach((layer, id) => {
                    if (operationTypes.includes(layer.type)) {
                        this.removeLayer(id);
                    }
                });
            }

            updateLayerPanel() {
                const panel = document.getElementById('layersList');
                if (!panel) return;

                panel.innerHTML = '';

                if (this.layers.size === 0) {
                    panel.innerHTML = '<div class="layer-empty">No layers yet. Visualize a geometry or run an operation to create layers.</div>';
                    return;
                }

                // Convert to array and sort by creation time (newest first)
                const layersArray = Array.from(this.layers.values()).reverse();

                layersArray.forEach(layer => {
                    const layerItem = document.createElement('div');
                    layerItem.className = 'layer-item';
                    layerItem.dataset.layerId = layer.id;

                    const typeIcon = this.getTypeIcon(layer.type);
                    const timeStr = this.formatTime(layer.createdAt);

                    layerItem.innerHTML = `
                        <div class="layer-header">
                            <input type="checkbox" class="layer-visibility" ${layer.visible ? 'checked' : ''}>
                            <div class="layer-color" style="background-color: ${layer.color}"></div>
                            <div class="layer-info">
                                <div class="layer-name">${typeIcon} ${layer.name}</div>
                                <div class="layer-meta">${layer.type} • ${timeStr}</div>
                            </div>
                        </div>
                        <div class="layer-actions">
                            <button class="layer-action-btn zoom-btn" title="Zoom to layer">
                                <i class="fas fa-search-location"></i>
                            </button>
                            <button class="layer-action-btn copy-btn" title="Copy WKT">
                                <i class="fas fa-copy"></i>
                            </button>
                            <button class="layer-action-btn delete-btn" title="Delete layer">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `;

                    // Event listeners
                    const visibilityCheckbox = layerItem.querySelector('.layer-visibility');
                    visibilityCheckbox.addEventListener('change', () => {
                        this.toggleLayerVisibility(layer.id);
                    });

                    const zoomBtn = layerItem.querySelector('.zoom-btn');
                    zoomBtn.addEventListener('click', () => {
                        this.zoomToLayer(layer.id);
                    });

                    const copyBtn = layerItem.querySelector('.copy-btn');
                    copyBtn.addEventListener('click', () => {
                        this.copyLayerWKT(layer.id);
                    });

                    const deleteBtn = layerItem.querySelector('.delete-btn');
                    deleteBtn.addEventListener('click', () => {
                        this.removeLayer(layer.id);
                    });

                    panel.appendChild(layerItem);
                });
            }

            getTypeIcon(type) {
                const icons = {
                    'input': '<i class="fas fa-map-marked-alt"></i>',
                    'buffer': '<i class="fas fa-shield-alt"></i>',
                    'simplify': '<i class="fas fa-compress-arrows-alt"></i>',
                    'convexhull': '<i class="fas fa-draw-polygon"></i>',
                    'centroid': '<i class="fas fa-crosshairs"></i>',
                    'union': '<i class="fas fa-object-group"></i>',
                    'custom': '<i class="fas fa-layer-group"></i>'
                };
                return icons[type] || icons['custom'];
            }

            formatTime(date) {
                const now = new Date();
                const diff = Math.floor((now - date) / 1000); // seconds

                if (diff < 60) return 'just now';
                if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
                if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
                return date.toLocaleDateString();
            }

            zoomToLayer(layerId) {
                const layer = this.layers.get(layerId);
                if (layer && layer.leafletLayer.getBounds) {
                    this.map.fitBounds(layer.leafletLayer.getBounds(), { padding: [50, 50] });
                } else if (layer && layer.leafletLayer.getLatLng) {
                    this.map.setView(layer.leafletLayer.getLatLng(), 10);
                }
            }

            copyLayerWKT(layerId) {
                const layer = this.layers.get(layerId);
                if (layer) {
                    const wkt = geoJSONToWKT(layer.geometry);
                    navigator.clipboard.writeText(wkt).then(() => {
                        showOperationInfo(`WKT copied for layer: ${layer.name}`);
                    }).catch(err => {
                        showError('Failed to copy WKT: ' + err.message);
                    });
                }
            }
        }

        // Initialize the layer manager
        const layerManager = new LayerManager(map);

        // Initialize draw control for editing
        const drawControl = new L.Control.Draw({
            draw: false,
            edit: {
                featureGroup: geomLayer,
                edit: {
                    selectedPathOptions: {
                        maintainColor: true,
                        opacity: 0.8,
                        fillOpacity: 0.4
                    }
                }
            }
        });
        map.addControl(drawControl);

        // Handle geometry edits
        map.on(L.Draw.Event.EDITED, function (e) {
            const layers = e.layers;
            layers.eachLayer(function (layer) {
                // Update current geometry with edited version
                currentGeometry = leafletToGeoJSON(layer);
                currentEditableLayer = layer;

                // Update WKT textarea with new geometry
                updateWKTFromGeometry();

                showOperationInfo('Geometry edited successfully');
            });
        });
        
        // Sample WKT polygons
        const samples = [
            'POLYGON((-74.0 40.7, -73.9 40.7, -73.9 40.8, -74.0 40.8, -74.0 40.7))', // NYC area
            'MULTIPOLYGON(((-122.4 37.7, -122.3 37.7, -122.3 37.8, -122.4 37.8, -122.4 37.7)), ((-118.4 34.0, -118.3 34.0, -118.3 34.1, -118.4 34.1, -118.4 34.0)))', // SF and LA - fixed spacing
            'LINESTRING(-0.1 51.5, 2.3 48.8, 12.5 41.9)', // London-Paris-Rome
            'POINT(-77.0 38.9)' // Washington DC
        ];

        // Functions
        function showError(message) {
            errorMsg.textContent = message;
            errorMsg.style.display = 'block';
        }
        
        function hideError() {
            errorMsg.style.display = 'none';
        }
        
        function parseWKT(wktString) {
            try {
                wktString = wktString.trim();
                
                // Extract geometry type
                const typeMatch = wktString.match(/^([A-Z]+)/);
                if (!typeMatch) throw new Error("Invalid WKT format");
                
                const geometryType = typeMatch[1].toUpperCase();
                const coordsText = wktString.substring(geometryType.length).trim();
                
                if (geometryType === 'POINT') {
                    const pointMatch = coordsText.match(/\(\s*([-\d.]+)\s+([-\d.]+)\s*\)/);
                    if (!pointMatch) throw new Error("Invalid POINT format");
                    
                    const lng = parseFloat(pointMatch[1]);
                    const lat = parseFloat(pointMatch[2]);
                    
                    return L.circleMarker([lat, lng], {
                        radius: 8,
                        color: '#ff00cc',
                        weight: 2,
                        fillColor: '#00ffff',
                        fillOpacity: 0.7
                    });
                } 
                else if (geometryType === 'LINESTRING') {
                    const coordsMatch = coordsText.match(/\((.*)\)/);
                    if (!coordsMatch) throw new Error("Invalid LINESTRING format");
                    
                    const points = [];
                    const pairs = coordsMatch[1].split(',');
                    
                    for (const pair of pairs) {
                        const coords = pair.trim().split(/\s+/);
                        if (coords.length >= 2) {
                            const lng = parseFloat(coords[0]);
                            const lat = parseFloat(coords[1]);
                            if (!isNaN(lng) && !isNaN(lat)) {
                                points.push([lat, lng]);
                            }
                        }
                    }
                    
                    return L.polyline(points, {
                        color: '#00ffff',
                        weight: 3
                    });
                }
                else if (geometryType === 'POLYGON') {
                    let coordString;
                    const doubleParenMatch = coordsText.match(/\(\((.*)\)\)/);
                    
                    if (doubleParenMatch) {
                        coordString = doubleParenMatch[1];
                    } else {
                        const singleParenMatch = coordsText.match(/\((.*)\)/);
                        if (!singleParenMatch) throw new Error("Invalid POLYGON format");
                        coordString = singleParenMatch[1];
                    }
                    
                    const points = [];
                    const pairs = coordString.split(',');
                    
                    for (const pair of pairs) {
                        const coords = pair.trim().split(/\s+/);
                        if (coords.length >= 2) {
                            const lng = parseFloat(coords[0]);
                            const lat = parseFloat(coords[1]);
                            if (!isNaN(lng) && !isNaN(lat)) {
                                points.push([lat, lng]);
                            }
                        }
                    }
                    
                    return L.polygon(points, {
                        color: '#ff00cc',
                        weight: 2,
                        fillColor: '#00ffff',
                        fillOpacity: 0.2
                    });
                }
                else if (geometryType === 'MULTIPOLYGON') {
                    const polygonRegex = /\(\((.*?)\)\)/g;
                    const polygons = [];
                    let match;
                    
                    while ((match = polygonRegex.exec(coordsText)) !== null) {
                        const points = [];
                        const pairs = match[1].split(',');
                        
                        for (const pair of pairs) {
                            const coords = pair.trim().split(/\s+/);
                            if (coords.length >= 2) {
                                const lng = parseFloat(coords[0]);
                                const lat = parseFloat(coords[1]);
                                if (!isNaN(lng) && !isNaN(lat)) {
                                    points.push([lat, lng]);
                                }
                            }
                        }
                        
                        if (points.length > 0) {
                            polygons.push(points);
                        }
                    }
                    
                    return L.polygon(polygons, {
                        color: '#ff00cc',
                        weight: 2,
                        fillColor: '#00ffff',
                        fillOpacity: 0.2
                    });
                }
                
                throw new Error(`Unsupported geometry type: ${geometryType}`);
            } catch (error) {
                throw error;
            }
        }
        
        // Helper: Convert Leaflet layer to GeoJSON
        function leafletToGeoJSON(layer) {
            return layer.toGeoJSON();
        }

        // Helper: Convert GeoJSON to Leaflet layer with custom styling
        function geoJSONToLeaflet(geojson, color = '#ffaa00') {
            return L.geoJSON(geojson, {
                style: {
                    color: color,
                    weight: 3,
                    fillColor: color,
                    fillOpacity: 0.3
                },
                pointToLayer: function (feature, latlng) {
                    return L.circleMarker(latlng, {
                        radius: 8,
                        color: color,
                        weight: 2,
                        fillColor: color,
                        fillOpacity: 0.7
                    });
                }
            });
        }

        // Helper: Convert GeoJSON to WKT format
        function geoJSONToWKT(geojson) {
            const geom = geojson.geometry || geojson;
            const type = geom.type;
            const coords = geom.coordinates;

            function formatCoordinatePair(coord) {
                return coord.join(' ');
            }

            function formatCoordinateArray(coordArray) {
                return coordArray.map(formatCoordinatePair).join(', ');
            }

            function formatPolygonRing(ring) {
                return '(' + formatCoordinateArray(ring) + ')';
            }

            if (type === 'Point') {
                return 'POINT(' + formatCoordinatePair(coords) + ')';
            } else if (type === 'LineString') {
                return 'LINESTRING(' + formatCoordinateArray(coords) + ')';
            } else if (type === 'Polygon') {
                const rings = coords.map(formatPolygonRing).join(', ');
                return 'POLYGON(' + rings + ')';
            } else if (type === 'MultiPolygon') {
                const polygons = coords.map(polygon => {
                    const rings = polygon.map(formatPolygonRing).join(', ');
                    return '(' + rings + ')';
                }).join(', ');
                return 'MULTIPOLYGON(' + polygons + ')';
            } else if (type === 'MultiLineString') {
                const lines = coords.map(line => '(' + formatCoordinateArray(line) + ')').join(', ');
                return 'MULTILINESTRING(' + lines + ')';
            } else if (type === 'MultiPoint') {
                const points = coords.map(formatCoordinatePair).join(', ');
                return 'MULTIPOINT(' + points + ')';
            }

            throw new Error('Unsupported geometry type: ' + type);
        }

        // Operation info display
        function showOperationInfo(message) {
            const operationInfo = document.getElementById('operationInfo');
            operationInfo.textContent = message;
            operationInfo.classList.add('show');
            operationInfo.style.display = 'block';
        }

        function hideOperationInfo() {
            const operationInfo = document.getElementById('operationInfo');
            operationInfo.classList.remove('show');
            setTimeout(() => {
                operationInfo.style.display = 'none';
            }, 300);
        }

        function visualizeWKT() {
            const wktString = wktInput.value.trim();

            if (!wktString) {
                showError("Please enter a WKT string");
                return;
            }

            try {
                hideError();

                // Parse the WKT to get geometry
                const layer = parseWKT(wktString);
                currentGeometry = leafletToGeoJSON(layer);
                allGeometries.push(currentGeometry);

                // Add to layer manager (which will add to map)
                const geometryType = currentGeometry.geometry.type;
                const layerName = `Input ${geometryType} ${layerManager.layers.size + 1}`;
                const layerId = layerManager.addLayer(currentGeometry, layerName, 'input');

                // Fit bounds
                const addedLayer = layerManager.layers.get(layerId);
                if (addedLayer && addedLayer.leafletLayer.getBounds) {
                    map.fitBounds(addedLayer.leafletLayer.getBounds(), { padding: [50, 50] });
                } else if (addedLayer && addedLayer.leafletLayer.getLatLng) {
                    map.setView(addedLayer.leafletLayer.getLatLng(), 10);
                }
            } catch (error) {
                showError("Error: " + error.message);
                console.error(error);
            }
        }
        
        function clearAll() {
            wktInput.value = "";
            geomLayer.clearLayers();
            layerManager.clearAllLayers();
            allGeometries = [];
            currentGeometry = null;
            hideError();
        }

        function loadSample() {
            // Alaska WKT polygon
            const alaskaWKT = 'POLYGON((-141.0205 70.0187,-141.7291 70.1292,-144.8163 70.4515,-148.4583 70.7471,-151.1609 70.7923,-152.6221 71.1470,-153.9954 71.1185,-154.8853 71.4307,-156.7529 71.5232,-157.9449 71.2796,-159.6313 71.2249,-161.8671 70.6363,-163.5809 70.0843,-165.2399 69.3028,-166.8768 69.1782,-168.0414 68.3344,-165.9155 67.6844,-164.6082 67.2933,-164.0149 66.7789,-165.7507 66.5810,-167.5745 66.2867,-168.9862 66.0269,-168.9478 65.4970,-167.4756 65.0420,-167.0142 64.3922,-165.7343 64.0554,-163.2294 64.0193,-162.1143 63.9615,-163.6029 63.6877,-165.3717 63.4530,-166.3715 62.4133,-166.9867 61.6534,-166.4429 60.8556,-167.8381 60.5357,-167.7118 59.5482,-165.8002 59.4115,-164.5972 59.3696,-162.8558 59.1168,-162.5427 58.1185,-160.6421 58.1359,-159.5050 58.0285,-158.8953 57.6336,-159.9060 56.9090,-160.6531 56.3926,-161.8835 56.2342,-162.9822 55.7240,-164.3994 55.2478,-165.3168 54.7753,-167.1075 54.1463,-168.5852 53.5632,-169.9146 53.1402,-169.5959 52.5964,-168.2227 52.9089,-162.7734 54.2139,-159.1452 54.6786,-155.4634 55.6567,-152.1400 57.3510,-150.8203 59.2209,-147.4461 59.7695,-145.9850 60.3521,-144.1544 59.8917,-141.6811 59.8172,-140.5124 59.5225,-138.8548 59.0292,-136.8526 57.9032,-136.0725 56.9157,-134.9794 56.1555,-134.0057 55.3237,-133.6418 54.6341,-130.6261 54.7135,-129.9930 55.2869,-130.0108 55.9869,-130.1083 56.1057,-131.5887 56.6086,-132.8755 57.8404,-133.8423 58.7276,-134.9121 59.3108,-135.4724 59.8020,-136.3445 59.6039,-136.8251 59.1619,-137.6079 59.2441,-139.2119 60.0902,-139.0938 60.3575,-140.0056 60.1866,-140.9999 60.3059,-141.0205 70.0187,-141.0205 70.0187))';
            wktInput.value = alaskaWKT;
            visualizeWKT();
        }

        // ===== GEOMETRY OPERATIONS =====

        function executeBuffer() {
            if (!currentGeometry) {
                showError("Please visualize a geometry first!");
                return;
            }

            try {
                hideError();
                const distance = parseFloat(document.getElementById('bufferDistance').value);

                if (isNaN(distance) || distance <= 0) {
                    showError("Please enter a valid buffer distance!");
                    return;
                }

                // Create buffer using Turf.js
                const buffered = turf.buffer(currentGeometry, distance, { units: 'kilometers' });

                // Add buffer as a new layer
                const layerName = `Buffer ${distance}km`;
                layerManager.addLayer(buffered, layerName, 'buffer', { distance });

                // Update current geometry and WKT
                currentGeometry = buffered;
                updateWKTFromGeometry();

                showOperationInfo(`Buffer created: ${distance}km buffer zone`);
            } catch (error) {
                showError("Buffer operation failed: " + error.message);
                console.error(error);
            }
        }

        function executeSimplify() {
            if (!currentGeometry) {
                showError("Please visualize a geometry first!");
                return;
            }

            try {
                hideError();
                const tolerance = parseFloat(document.getElementById('simplifyTolerance').value);

                if (isNaN(tolerance) || tolerance <= 0) {
                    showError("Please enter a valid tolerance value!");
                    return;
                }

                // Simplify using Turf.js
                const simplified = turf.simplify(currentGeometry, { tolerance: tolerance, highQuality: false });

                // Count vertices before update
                const originalCoords = JSON.stringify(currentGeometry).match(/\[[\d.-]+,[\d.-]+\]/g) || [];
                const simplifiedCoords = JSON.stringify(simplified).match(/\[[\d.-]+,[\d.-]+\]/g) || [];

                // Add simplified geometry as a new layer
                const layerName = `Simplified (tol: ${tolerance})`;
                layerManager.addLayer(simplified, layerName, 'simplify', { tolerance });

                // Update current geometry and WKT
                currentGeometry = simplified;
                updateWKTFromGeometry();

                showOperationInfo(`Geometry simplified: Reduced from ${originalCoords.length} to ${simplifiedCoords.length} vertices (${Math.round((1 - simplifiedCoords.length / originalCoords.length) * 100)}% reduction)`);
            } catch (error) {
                showError("Simplify operation failed: " + error.message);
                console.error(error);
            }
        }

        function executeConvexHull() {
            if (!currentGeometry) {
                showError("Please visualize a geometry first!");
                return;
            }

            try {
                hideError();

                // Create convex hull using Turf.js
                const hull = turf.convex(currentGeometry);

                if (!hull) {
                    showError("Could not generate convex hull for this geometry");
                    return;
                }

                // Add convex hull as a new layer
                const layerName = `Convex Hull`;
                layerManager.addLayer(hull, layerName, 'convexhull');

                // Update current geometry and WKT
                currentGeometry = hull;
                updateWKTFromGeometry();

                showOperationInfo(`Convex hull created: Minimum bounding polygon`);
            } catch (error) {
                showError("Convex hull operation failed: " + error.message);
                console.error(error);
            }
        }

        function executeCentroid() {
            if (!currentGeometry) {
                showError("Please visualize a geometry first!");
                return;
            }

            try {
                hideError();

                // Calculate centroid using Turf.js
                const centroid = turf.centroid(currentGeometry);

                // Get coordinates
                const coords = centroid.geometry.coordinates;

                // Add centroid as a new layer
                const layerName = `Centroid [${coords[0].toFixed(2)}, ${coords[1].toFixed(2)}]`;
                layerManager.addLayer(centroid, layerName, 'centroid');

                // Update current geometry and WKT
                currentGeometry = centroid;
                updateWKTFromGeometry();

                showOperationInfo(`Centroid calculated: [${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}]`);
            } catch (error) {
                showError("Centroid operation failed: " + error.message);
                console.error(error);
            }
        }

        function executeUnion() {
            if (allGeometries.length < 2) {
                showError("Please visualize at least 2 geometries! Load a geometry, then load another to merge them.");
                return;
            }

            try {
                hideError();

                // Union all geometries using Turf.js
                let unioned = allGeometries[0];
                for (let i = 1; i < allGeometries.length; i++) {
                    unioned = turf.union(turf.featureCollection([unioned, allGeometries[i]]));
                }

                // Add union as a new layer
                const layerName = `Union (${allGeometries.length} geometries)`;
                layerManager.addLayer(unioned, layerName, 'union');

                // Update current geometry and WKT
                currentGeometry = unioned;
                updateWKTFromGeometry();

                showOperationInfo(`Union completed: ${allGeometries.length} geometries merged`);
            } catch (error) {
                showError("Union operation failed: " + error.message);
                console.error(error);
            }
        }

        function clearOperations() {
            layerManager.clearOperationLayers();
            hideOperationInfo();
        }

        // Update WKT textarea from current geometry
        function updateWKTFromGeometry() {
            if (!currentGeometry) {
                return;
            }

            try {
                const wkt = geoJSONToWKT(currentGeometry);
                wktInput.value = wkt;
            } catch (error) {
                console.error('Error converting to WKT:', error);
                showError('Error converting geometry to WKT: ' + error.message);
            }
        }

        // Copy WKT to clipboard
        function copyWKT() {
            const wktText = wktInput.value.trim();

            if (!wktText) {
                showError('No WKT to copy! Please visualize a geometry first.');
                return;
            }

            try {
                // Use the modern clipboard API
                navigator.clipboard.writeText(wktText).then(function() {
                    showOperationInfo('WKT copied to clipboard!');
                }).catch(function(err) {
                    // Fallback method
                    const textArea = document.createElement('textarea');
                    textArea.value = wktText;
                    textArea.style.position = 'fixed';
                    textArea.style.left = '-999999px';
                    document.body.appendChild(textArea);
                    textArea.select();
                    try {
                        document.execCommand('copy');
                        showOperationInfo('WKT copied to clipboard!');
                    } catch (copyErr) {
                        showError('Failed to copy WKT: ' + copyErr.message);
                    }
                    document.body.removeChild(textArea);
                });
            } catch (error) {
                showError('Failed to copy WKT: ' + error.message);
            }
        }

        // Event listeners
        visualizeBtn.addEventListener('click', visualizeWKT);
        clearBtn.addEventListener('click', clearAll);
        sampleBtn.addEventListener('click', loadSample);
        document.getElementById('copyWktBtn').addEventListener('click', copyWKT);

        // Operation event listeners
        document.getElementById('bufferBtn').addEventListener('click', executeBuffer);
        document.getElementById('simplifyBtn').addEventListener('click', executeSimplify);
        document.getElementById('convexHullBtn').addEventListener('click', executeConvexHull);
        document.getElementById('centroidBtn').addEventListener('click', executeCentroid);
        document.getElementById('unionBtn').addEventListener('click', executeUnion);
        document.getElementById('clearOperationsBtn').addEventListener('click', clearOperations);

        // Keyboard shortcut
        wktInput.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                visualizeWKT();
            }
        });