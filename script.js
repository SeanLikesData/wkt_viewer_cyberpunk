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
        
        // Add retro style for OpenStreetMap tiles
        const retroMapStyle =
        
        // Add default base layer
        baseMaps["Cyber Grid"].addTo(map);
        
        // Add layer control
        L.control.layers(baseMaps).addTo(map);
        
        // Layer group for geometries
        const geomLayer = L.layerGroup().addTo(map);

        // Layer group for operation results
        const operationLayer = L.layerGroup().addTo(map);

        // Store current geometry for operations
        let currentGeometry = null;
        let allGeometries = [];
        
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
                // Clear previous layers and errors
                geomLayer.clearLayers();
                hideError();

                // Parse and display the WKT
                const layer = parseWKT(wktString);
                layer.addTo(geomLayer);

                // Store current geometry for operations
                currentGeometry = leafletToGeoJSON(layer);
                allGeometries.push(currentGeometry);

                // Fit bounds
                if (layer.getBounds) {
                    map.fitBounds(layer.getBounds(), { padding: [50, 50] });
                } else if (layer.getLatLng) {
                    map.setView(layer.getLatLng(), 10);
                }
            } catch (error) {
                showError("Error: " + error.message);
                console.error(error);
            }
        }
        
        function clearAll() {
            wktInput.value = "";
            geomLayer.clearLayers();
            hideError();
        }

        function loadSample() {
            const randomIndex = Math.floor(Math.random() * samples.length);
            wktInput.value = samples[randomIndex];
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

                // Clear previous operations and display buffer
                operationLayer.clearLayers();
                const bufferLayer = geoJSONToLeaflet(buffered, '#9d4edd');
                bufferLayer.addTo(operationLayer);

                // Fit bounds to show both original and buffer
                const allLayers = L.featureGroup([...geomLayer.getLayers(), ...operationLayer.getLayers()]);
                map.fitBounds(allLayers.getBounds(), { padding: [50, 50] });

                showOperationInfo(`Buffer Shield Deployed: ${distance}km radius protection zone activated`);
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

                // Clear previous operations and display simplified geometry
                operationLayer.clearLayers();
                const simplifiedLayer = geoJSONToLeaflet(simplified, '#f72585');
                simplifiedLayer.addTo(operationLayer);

                // Fit bounds
                map.fitBounds(simplifiedLayer.getBounds(), { padding: [50, 50] });

                // Count vertices
                const originalCoords = JSON.stringify(currentGeometry).match(/\[[\d.-]+,[\d.-]+\]/g) || [];
                const simplifiedCoords = JSON.stringify(simplified).match(/\[[\d.-]+,[\d.-]+\]/g) || [];

                showOperationInfo(`Geometry Optimized: Reduced from ${originalCoords.length} to ${simplifiedCoords.length} vertices (${Math.round((1 - simplifiedCoords.length / originalCoords.length) * 100)}% reduction)`);
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

                // Clear previous operations and display hull
                operationLayer.clearLayers();
                const hullLayer = geoJSONToLeaflet(hull, '#4cc9f0');
                hullLayer.addTo(operationLayer);

                // Fit bounds to show both original and hull
                const allLayers = L.featureGroup([...geomLayer.getLayers(), ...operationLayer.getLayers()]);
                map.fitBounds(allLayers.getBounds(), { padding: [50, 50] });

                showOperationInfo(`Convex Hull Generated: Minimum bounding polygon calculated`);
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

                // Clear previous operations and display centroid
                operationLayer.clearLayers();
                const centroidLayer = geoJSONToLeaflet(centroid, '#ffd60a');
                centroidLayer.addTo(operationLayer);

                // Get coordinates
                const coords = centroid.geometry.coordinates;

                showOperationInfo(`Centroid Located: [${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}]`);
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

                // Clear previous operations and display union
                operationLayer.clearLayers();
                const unionLayer = geoJSONToLeaflet(unioned, '#06ffa5');
                unionLayer.addTo(operationLayer);

                // Fit bounds
                map.fitBounds(unionLayer.getBounds(), { padding: [50, 50] });

                showOperationInfo(`Merge Protocol Executed: ${allGeometries.length} geometries combined into unified perimeter`);
            } catch (error) {
                showError("Union operation failed: " + error.message);
                console.error(error);
            }
        }

        function clearOperations() {
            operationLayer.clearLayers();
            hideOperationInfo();
        }

        // Event listeners
        visualizeBtn.addEventListener('click', visualizeWKT);
        clearBtn.addEventListener('click', clearAll);
        sampleBtn.addEventListener('click', loadSample);

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