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
        
        // Event listeners
        visualizeBtn.addEventListener('click', visualizeWKT);
        clearBtn.addEventListener('click', clearAll);
        sampleBtn.addEventListener('click', loadSample);
        
        // Keyboard shortcut
        wktInput.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                visualizeWKT();
            }
        });