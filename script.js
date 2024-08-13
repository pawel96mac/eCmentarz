
    // Ustal zoom na podstawie szerokości ekranu
    var initialZoom = 19;

    var map = L.map('map', {
        center: [51.761846519306985, 16.813415227957215],
        zoom: initialZoom,
        maxZoom: 25,
        renderer: L.canvas(),
    });
    var layers = {};
    var layerPromises = [];
    var orderedOverlayMaps = [];

var baseMaps = {
        "OSM": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 23,  // Maksymalny zoom dla mapy podstawowej OpenStreetMap
        attribution: '© OpenStreetMap contributors'
}),
    "Satelita": L.tileLayer('https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=pDM24DBsryBDrIeZmRKb', {
        maxZoom: 23,
        attribution: '© MapTiler contributors'
    })
};

  // Dodanie warstwy OSM jako domyślny
  baseMaps.OSM.addTo(map);


    function style(feature) {
        var layerId = feature.layerId;
        return {
            fillColor: getColor(layerId),
            weight: 1,
            opacity: 1,
            color: 'black',
            fillOpacity: 0.7
        };
    }
    // Funkcja do dodawania warstwy z pliku GeoJSON jako podkład
function createBackgroundLayer(url, style) {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const layer = L.geoJSON(data, { style: style });
                layer.setZIndex(1); // Ustawienie zIndex na 1, aby warstwa była pod innymi
                layer.addTo(map); // Dodaj warstwę do mapy
                resolve(layer);
            })
            .catch(error => {
                console.error('Błąd podczas ładowania warstwy:', error);
                reject(null);
            });
    });
}

// Styl dla warstwy teren.geojson na podstawie pliku teren.sld
const terenStyle = {
    color: '#232323',    // Kolor linii (stroke)
    weight: 0.5,         // Grubość linii (stroke-width)
    opacity: 0,          // Przezroczystość linii (stroke-opacity)
    fillColor: '#a2caa9',// Kolor wypełnienia (fill)
    fillOpacity: 1       // Przezroczystość wypełnienia (fill-opacity)
};

// Dodanie warstwy teren.geojson jako podkład
createBackgroundLayer('teren.geojson', terenStyle).then(function(layer) {
    if (layer) {
        console.log('Warstwa Teren została utworzona i dodana do mapy');
        // Warstwa Teren jest teraz podkładem
    } else {
        console.error('Nie udało się utworzyć warstwy Teren');
    }
}); 
function createNonInteractiveLayer(url, layerId, layerName, styleOptions) {
    return new Promise(function(resolve, reject) {
        $.getJSON(url, function(data) {
            var layer = L.geoJSON(data, {
                style: function(feature) {
                    return {
                        ...styleOptions,
                        interactive: false  // Wyłącza klikalność
                    };
                }
            }).addTo(map); // Dodaj warstwę do mapy

            layers[layerId] = layer;
            overlayMaps[layerName] = layer;
            resolve(layer);
        }).fail(function() {
            reject('Error loading non-interactive layer: ' + url);
        });
    });
}
var layerId = {
    'https://github.com/pawel96mac/eCmentarz/raw/main/Grobowiec1.geojson': 'Grobowiec1',
    'https://github.com/pawel96mac/eCmentarz/raw/main/Grobowiec2.geojson': 'Grobowiec2',
    'https://github.com/pawel96mac/eCmentarz/raw/main/Kaplica.geojson': 'Kaplica',
    'https://github.com/pawel96mac/eCmentarz/raw/main/groby1.geojson': 'groby1',
    'https://github.com/pawel96mac/eCmentarz/raw/main/groby10.geojson': 'groby10',
    'https://github.com/pawel96mac/eCmentarz/raw/main/groby11.geojson': 'groby11',
    'https://github.com/pawel96mac/eCmentarz/raw/main/groby12.geojson': 'groby12',
    'https://github.com/pawel96mac/eCmentarz/raw/main/groby13.geojson': 'groby13',
    'https://github.com/pawel96mac/eCmentarz/raw/main/groby14.geojson': 'groby14',
    'https://github.com/pawel96mac/eCmentarz/raw/main/groby15.geojson': 'groby15',
    'https://github.com/pawel96mac/eCmentarz/raw/main/groby16.geojson': 'groby16',
    'https://github.com/pawel96mac/eCmentarz/raw/main/groby2.geojson': 'groby2',
    'https://github.com/pawel96mac/eCmentarz/raw/main/groby3.geojson': 'groby3',
    'https://github.com/pawel96mac/eCmentarz/raw/main/groby4.geojson': 'groby4',
    'https://github.com/pawel96mac/eCmentarz/raw/main/groby5.geojson': 'groby5',
    'https://github.com/pawel96mac/eCmentarz/raw/main/groby6.geojson': 'groby6',
    'https://github.com/pawel96mac/eCmentarz/raw/main/groby7.geojson': 'groby7',
    'https://github.com/pawel96mac/eCmentarz/raw/main/groby8.geojson': 'groby8',
    'https://github.com/pawel96mac/eCmentarz/raw/main/groby9.geojson': 'groby9',
    'https://raw.githubusercontent.com/poniec/eCmentarz/main/obszar1.geojson': 'obszar1'
};

Object.entries(layerId).forEach(function([url, id], index) {
    createLayer(url, id).then(function(layerGroup) {
        if (layerGroup) {
            console.log('Layer ' + id + ' added to map.');
        } else {
            console.error('Failed to add layer ' + id + '.');
        }
    }).catch(function(error) {
        console.error('Error loading layer ' + id + ':', error);
    });
});


function getColor(layerId) {
    var colors = {
        'groby1': 'red',
        'groby2': 'green',
        'groby3': 'black',
        'groby4': 'orange',
        'groby5': 'purple',
        'groby6': 'cyan',
        'groby7': '#000080',
        'groby8': 'maroon',
        'groby9': 'blue',
        'groby10': 'lime',
        'groby11': 'fuchsia',
        'groby12': 'white',
        'groby13': 'teal',
        'groby14': 'olive',
        'groby15': 'gray',
        'groby16': 'green',
    };
    return colors[layerId] || '';
}

function createLayer(url, layerId) {
    return new Promise(function(resolve, reject) {
        $.getJSON(url, function(data) {
            var layerGroup = L.geoJSON(data, {
                style: function(feature) {
                    var defaultStyle = {
                        color: 'black',   // Obramowanie na podstawie koloru warstwy
                        weight: 0.2,      // Grubość obramowania
                        fillColor: getColor(layerId), // Wypełnienie na podstawie koloru warstwy
                        fillOpacity: 0.7 , // Półprzezroczyste wypełnienie
                        smoothFactor: 0 
                    };

                    if (layerId === 'groby16') {
                        return {
                            color: 'green',    // Zielone obramowanie
                            weight: 1,         // Grubość obramowania
                            fillColor: 'none', // Brak wypełnienia
                            fillOpacity: 0     // Całkowicie przezroczyste wypełnienie
                        };
                    } else {
                        return defaultStyle;
                    }
                },
                onEachFeature: function(feature, layer) {
                    var miejsce = feature.properties.miejsce || "brak danych";
                    var popupContent = "<p><strong>Kwatera-Rząd-Numer Grobu: " + miejsce + "</strong></p>";

                    if (layerId === 'groby16') {
                        popupContent += "<p>REZERWACJA</p>";
                    } else {
                        var numberOfPeople = 0;
                        for (var i = 1; i <= 12; i++) {
                            var nazwisko = feature.properties["NAZWISKO I IMIĘ " + i];
                            var dataUrod = feature.properties["DATA URODZENIA " + i] || "brak danych";
                            var dataSmie = feature.properties["DATA ŚMIERCI " + i] || "brak danych";

                            if (nazwisko) {
                                popupContent += "<p>" + nazwisko + " - " + dataUrod + " - " + dataSmie + "<br /></p>";
                                numberOfPeople++;
                            }
                        }

                        var zdjecie = feature.properties.ZDJĘCIE || "brak danych";

                        if (numberOfPeople >= 1) {
                            if (numberOfPeople <= 2) {
                                popupContent += '<a href="#" class="view-image-link">Schowaj zdjęcie</a>';
                                popupContent += '<div class="image-container" style="display:block;">' + 
                                                zdjecie + 
                                                '</div>';
                            } else {
                                popupContent += '<a href="#" class="view-image-link">Zobacz zdjęcie</a>';
                                popupContent += '<div class="image-container" style="display:none;">' + 
                                                zdjecie + 
                                                '</div>';
                            }
                        } else {
                            popupContent += "<p>" + zdjecie + "</p>";
                        }
                    }

                    layer.bindPopup(popupContent);

                    // Dodajemy tooltip, jeśli nie istnieje
                    var tooltipContent = "KWATERA-RZĄD-NR GROBU: " + miejsce;
                    for (var i = 1; i <= 12; i++) {
                        var nazwisko = feature.properties["NAZWISKO I IMIĘ " + i];
                        if (nazwisko) {
                            tooltipContent += "<br/>" + nazwisko;
                        }
                    }

                    // Bind tooltip with the content
                    layer.bindTooltip(tooltipContent, {
                        permanent: false,
                        direction: 'top',
                        opacity: 0.9,
                        className: 'custom-tooltip'
                    });

                    // Store original style as an object
                    feature.properties._originalStyle = {
                        color: layer.options.color,
                        weight: layer.options.weight,
                        fillColor: layer.options.fillColor,
                        fillOpacity: layer.options.fillOpacity
                    };

                    layer.on('popupopen', function() {
                        centerMapOnLayer(layer);
                        layer.setStyle({
                            color: 'yellow',
                            fillColor: 'yellow',
                            fillOpacity: 0.6 // Optionally keep the same fill opacity
                        }); // Zmieniony styl podczas otwierania popupu

                        if (numberOfPeople >= 1) {
                            $('.view-image-link').on('click', function(event) {
                                event.preventDefault();
                                var link = $(this);
                                var container = link.siblings('.image-container');
                                if (container.is(':visible')) {
                                    link.text('Zobacz zdjęcie');
                                    container.hide();
                                } else {
                                    link.text('Schowaj zdjęcie');
                                    container.show();
                                }
                            });

                            setTimeout(function() {
                                // Przesunięcie popupu w górę
                                var popupElement = layer.getPopup().getElement();
                                var offsetY = -100; // Domyślne przesunięcie

                                if (window.innerWidth <= 768) {
                                    offsetY = -250;
                                }

                                var newLatLng = layer.getLatLng();
                                map.setView(newLatLng, 21, {
                                    animate: true,
                                    duration: 1
                                });
                            }, 300); // Czas oczekiwania na pełne wyświetlenie popupa (300ms)
                        }
                    });

                    layer.on('popupclose', function() {
                        var originalStyle = feature.properties._originalStyle;
                        if (originalStyle) {
                            console.log("Restoring original style:", originalStyle); // Debugging line
                            layer.setStyle(originalStyle);
                        } else {
                            console.log("No original style found, applying default style"); // Debugging line
                            layer.setStyle({
                                color: 'black',
                                weight: 0.3,
                                fillColor: getColor(layerId),
                                fillOpacity: 0.6
                            });
                        }
                    });
                }
            });

            // Apply smoothing
            layerGroup.eachLayer(function(layer) {
                layer.options.smoothFactor = 1.5; // Adjust the smoothFactor value
            });

            resolve(layerGroup);
        }).fail(function() {
            console.error("Nie udało się załadować pliku GeoJSON: " + url);
            resolve(null);
        });
    });
}
// Lista linków do plików GeoJSON




    
    
    // Funkcja do zarządzania widocznością tooltipów na podstawie zoomu
    function handleTooltipVisibility() {
        var zoomLevel = map.getZoom();
    
        map.eachLayer(function(layer) {
            if (layer instanceof L.GeoJSON) {
                layer.eachLayer(function(subLayer) {
                    if (subLayer instanceof L.Marker) {
                        if (zoomLevel >= 20 && zoomLevel <= 30) {
                            // Sprawdź, czy tooltip nie jest już ustawiony
                            if (!subLayer.getTooltip()) {
                                var tooltipContent = "KWATERA-RZĄD-NR GROBU: " + (subLayer.feature.properties.miejsce || "brak danych");
                                for (var i = 1; i <= 12; i++) {
                                    var nazwisko = subLayer.feature.properties["NAZWISKO I IMIĘ " + i];
                                    if (nazwisko) {
                                        tooltipContent += "<br/>" + nazwisko;
                                    }
                                }
                                subLayer.bindTooltip(tooltipContent, {
                                    permanent: false,
                                    direction: 'top',
                                    opacity: 0.9,
                                    className: 'custom-tooltip'
                                });
                            }
                            subLayer.openTooltip();
                        } else {
                            // Ukryj tooltipy na wszystkich innych poziomach zoomu
                            subLayer.closeTooltip();
                            subLayer.unbindTooltip();
                        }
                    }
                });
            }
        });
    }
    
    
    // Dodanie debouncingu do obsługi zoomend
    map.on('zoomend', debounce(handleTooltipVisibility, 300));
    
    // Dodanie debouncingu do obsługi zoomstart
    map.on('zoomstart', debounce(handleTooltipVisibility, 300));
    
    // Opcjonalnie: Dodanie opóźnienia przy załadowaniu mapy
    map.on('load', function() {
        handleTooltipVisibility();
    });
    
    // Użycie debounce do obsługi zdarzenia zoomend
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
    
    // Dodanie debouncingu do obsługi zoomend
    map.on('zoomend', debounce(handleTooltipVisibility, 300));
    
    // Opcjonalnie: Dodanie opóźnienia przy załadowaniu mapy
    map.on('load', function() {
        handleTooltipVisibility();
    });


// Dodaj warstwy dla kwater 1-15 i Rezerwacje dla 16
for (var i = 1; i <= 16; i++) {
    (function(i) {
        var layerName = (i === 16) ? 'Rezerwacje' : 'Kwatera ' + i;
        layerPromises.push(
            createLayer('groby' + i + '.geojson', 'groby' + i).then(function(layer) {
                if (layer) {
                    layers['groby' + i] = layer;
                    orderedOverlayMaps.push({ name: layerName, layer: layer });
                }
            })
        );
    })(i);
}
// Dodaj warstwę dla "Rezerwacje"
layerPromises.push(
    createLayer('groby16.geojson', 'groby16').then(function(layer) {
        if (layer) {
            layers['groby16'] = layer;
            var layerName = 'Rezerwacje';  // Nazwa warstwy w legendzie
            orderedOverlayMaps.push({ name: layerName, layer: layer });
        } else {
            console.error('Nie udało się załadować warstwy Rezerwacje (groby16.geojson)');
        }
    }).catch(function(error) {
        console.error('Błąd podczas ładowania warstwy Rezerwacje: ', error);
    })
);

// Dodaj warstwy dla Grobowców 1-2
for (var j = 1; j <= 2; j++) {
(function(j) {
    layerPromises.push(
        createLayer('Grobowiec' + j + '.geojson', 'Grobowiec' + j).then(function(layer) {
            if (layer) {
                layers['Grobowiec' + j] = layer;
                var layerName = 'Grobowiec ' + j;
                orderedOverlayMaps.push({ name: layerName, layer: layer });
            }
        })
    );
})(j);
}


Promise.all(layerPromises).then(function() {
    // Posortuj warstwy: najpierw kwatery, potem grobowce
    orderedOverlayMaps.sort(function(a, b) {
        var aIsGrobowiec = a.name.startsWith('Grobowiec');
        var bIsGrobowiec = b.name.startsWith('Grobowiec');
        
        if (aIsGrobowiec && !bIsGrobowiec) return 1; // Grobowce na końcu
        if (!aIsGrobowiec && bIsGrobowiec) return -1; // Kwatery na początku

        // Sortowanie numeryczne wewnątrz grupy (kwatery albo grobowce)
        var aMatch = a.name.match(/\d+/);
        var bMatch = b.name.match(/\d+/);

        var aNum = aMatch ? parseInt(aMatch[0]) : (aIsGrobowiec ? Infinity : 0);
        var bNum = bMatch ? parseInt(bMatch[0]) : (bIsGrobowiec ? Infinity : 0);

        return aNum - bNum;
    });

    var overlayMaps = {}; // Przygotuj obiekt dla kontrolera warstw

    // Dodaj warstwy do obiektu w zamówionej kolejności
    orderedOverlayMaps.forEach(function(item) {
        overlayMaps[item.name] = item.layer;
    });

    // Użycie standardowego kontrolera warstw
    L.control.layers(baseMaps, overlayMaps, { collapsed: true, position: 'topleft' }).addTo(map);

    // Automatycznie dodaj wszystkie warstwy na mapę
    for (var key in overlayMaps) {
        overlayMaps[key].addTo(map);
    }

    updateLegend(); 
});




    function shiftMapByPixels(pixels) {
        var center = map.getCenter();
        var offset = map.containerPointToLatLng([0, pixels]);
        var newCenter = L.latLng(center.lat + offset.lat - center.lat, center.lng);
        map.setView(newCenter, map.getZoom(), { animate: false });
    }

    function centerMapOnLayer(layer) {
        var bounds = layer.getBounds();
        map.fitBounds(bounds, { padding: [50, 50], animate: false });
        map.setZoom(map.getZoom() - 3, { animate: false });
        shiftMapByPixels(100);
    }

        function extractYear(dateString) {
            // Usuń wszelkie dodatkowe teksty takie jak "ur." na początku
            var cleanedDate = dateString.replace(/^ur\.\s*/, '').trim();
        
            // Wyrażenie regularne do znajdowania czterocyfrowych liczb
            var yearMatches = cleanedDate.match(/\b\d{4}\b/g);
        
            // Zwróć pierwszą czterocyfrową liczbę, jeśli istnieje
            return yearMatches ? yearMatches[0] : "brak danych";
        }
        
        function searchGrave() {
            var searchTerm = $('#searchBox').val().trim().toLowerCase();
            var searchTerms = searchTerm.split(/\s+/); // Rozdziel zapytanie na słowa
        
            // Pokaż wyniki tylko po wpisaniu co najmniej 2 znaków
            if (searchTerm.length < 2) {
                $('#searchResults').hide();
                return;
            }
        
            var searchResults = [];
        
            Object.keys(layers).forEach(function(layerId) {
                layers[layerId].eachLayer(function(layer) {
                    var properties = layer.feature.properties;
                    var resultFields = [];
        
                    // Zbieraj dane z nazwisk, imion, dat urodzenia oraz dat śmierci
                    for (var i = 1; i <= 15; i++) {
                        var name = properties["NAZWISKO I IMIĘ " + i];
                        var birthDate = properties["DATA URODZENIA " + i];
                        var deathDate = properties["DATA ŚMIERCI " + i];
                        var birthYear = birthDate ? extractYear(birthDate) : "brak danych";
                        var deathYear = deathDate ? extractYear(deathDate) : "brak danych";
        
                        if (name || birthYear !== "brak danych" || deathYear !== "brak danych") {
                            var nameParts = name ? name.toLowerCase().split(/\s+/) : []; // Rozdziel nazwisko i imię na części
                            resultFields.push({
                                name: name,
                                nameParts: nameParts, // Przechowuj części imienia i nazwiska
                                birthYear: birthYear,
                                deathYear: deathYear
                            });
                        }
                    }
        
                    resultFields.forEach(function(field) {
                        var allTermsFound = searchTerms.every(function(term) {
                            return field.nameParts.some(function(part) {
                                return part.includes(term);
                            }) || field.birthYear.includes(term) || field.deathYear.includes(term);
                        });
        
                        if (allTermsFound) {
                            searchResults.push({
                                matches: [field.name, field.birthYear, field.deathYear],
                                layer: layer,
                                layerId: layerId
                            });
                        }
                    });
                });
            });
        
            // Sortowanie wyników według dopasowania
            searchResults.sort(function(a, b) {
                return a.matches[0].toLowerCase().indexOf(searchTerm) - b.matches[0].toLowerCase().indexOf(searchTerm);
            });
        
            $('#searchResults').empty().show();
            searchResults.forEach(function(result) {
                var name = result.matches[0];
                var birthYear = result.matches[1];
                var deathYear = result.matches[2];
        
                // Przygotowanie tekstu do wyświetlenia
                var displayText = '<div class="search-result-name">' + name + '</div>';
                if (birthYear !== "brak danych") {
                    displayText += '<div class="search-result-date">ur. ' + birthYear + '</div>';
                }
                if (deathYear !== "brak danych") {
                    displayText += '<div class="search-result-date">zm. ' + deathYear + '</div>';
                }
        
                var item = $('<div class="search-result-item">').html(displayText);
                item.css({
                    'border': '3px solid ' + getColor(result.layerId), // Dodanie obramowania w kolorze warstwy
                    'border-radius': '8px', // Zaokrąglenie rogów
                    'padding': '10px', // Wewnętrzne odstępy
                    'margin': '5px', // Margines wokół elementu
                    'box-shadow': '0 0 5px rgba(0, 0, 0, 0.2)' // Cień dla lepszego efektu wizualnego
                });
                item.on('click', function() {
                    var layer = result.layer;
                    centerMapOnLayer(layer);
                    layer.openPopup();
                    layer.setStyle({ fillColor: 'yellow' });
                    $('#searchResults').hide();
                });
                $('#searchResults').append(item);
            });
        }
        
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

$('#searchBox').on('input', debounce(searchGrave, 300));
// Funkcja do tworzenia popupu z przyciskami
function createPopupContent() {
return `
    <div class="popup-content">
        <p>Treść popupa tutaj.</p>
        <div class="popup-controls">
            <button onclick="resizePopup(-20)">-</button>
            <button onclick="resizePopup(20)">+</button>
        </div>
    </div>
`;
}

function updateLegend() {
var legendContent = $('#legendContent');
legendContent.empty(); // Czyści legendę

// Przygotowanie tablicy do przechowywania warstw "groby"
var legendItems = [];

// Zbieranie warstw "groby" do tablicy
Object.keys(layers).forEach(function(layerId) {
    if (layerId.startsWith('groby')) {  // Tylko dla warstw "groby"
        var color = getColor(layerId);
        if (color) {  // Tylko dodaj, jeśli kolor nie jest pusty
            var layerIndex = parseInt(layerId.replace('groby', ''));
            if (!isNaN(layerIndex)) {  // Sprawdzamy, czy numer jest prawidłowy
                legendItems.push({
                    index: layerIndex,
                    name: 'Kwatera ' + (layerIndex <= 15 ? layerIndex : String.fromCharCode(64 + layerIndex - 9)),
                    color: color
                });
            }
        }
    }
});

// Sortowanie tablicy według numerów kwater
legendItems.sort(function(a, b) {
    return a.index - b.index;
});

// Dodawanie posortowanych warstw do legendy
legendItems.forEach(function(item) {
    legendContent.append(
        '<div class="legend-item">' +
        '<div style="background-color:' + item.color + ';"></div>' +
        item.name +
        '</div>'
    );
});

// Funkcja do aktualizacji legendy
function updateLegend() {
    var legendContent = $('#legendContent');
    legendContent.empty(); // Czyści legendę

    // Przygotowanie tablicy do przechowywania warstw "groby"
    var legendItems = [];

    // Zbieranie warstw "groby" do tablicy
    Object.keys(layers).forEach(function(layerId) {
        if (layerId.startsWith('groby')) {  // Tylko dla warstw "groby"
            var color = getColor(layerId);
            if (color) {  // Tylko dodaj, jeśli kolor nie jest pusty
                var layerIndex = parseInt(layerId.replace('groby', ''));
                if (!isNaN(layerIndex)) {  // Sprawdzamy, czy numer jest prawidłowy
                    // Zmieniamy nazwę dla warstwy 16
                    var layerName = (layerIndex === 16) ? 'Rezerwacje' : 'Kwatera ' + layerIndex;

                    legendItems.push({
                        index: layerIndex,
                        name: layerName,
                        color: color,
                        isRezerwacje: (layerIndex === 16)
                    });
                }
            }
        }
    });

    // Dodaj warstwę Kaplica do legendy
    legendItems.push({
        index: null,  // Brak indeksu dla Kaplicy
        name: 'Kaplica',
        color: 'yellow'
    });

    // Sortowanie tablicy według numerów kwater
    legendItems.sort(function(a, b) {
        return a.index - b.index;
    });

    // Dodawanie posortowanych warstw do legendy
    legendItems.forEach(function(item) {
        var style = '';
        if (item.isRezerwacje) {
            style = 'border: 2px solid green; background-color: rgba(0, 255, 0, 0.1);'; // Zielona obwódka, przeźroczyste wypełnienie
        } else {
            style = 'background-color:' + item.color + ';'; // Normalne kolory dla innych warstw
        }

        legendContent.append(
            '<div class="legend-item">' +
            '<div style="' + style + '"></div>' +
            item.name +
            '</div>'
        );
    });
}

// Funkcja do tworzenia warstwy z pliku GeoJSON
function createNonInteractiveLayer(url, layerName, styleOptions) {
    return new Promise(function(resolve, reject) {
        $.getJSON(url, function(data) {
            var layer = L.geoJSON(data, {
                style: function() {
                    return styleOptions;
                },
                onEachFeature: function(feature, layer) {
                    // Nie dodawaj popupów ani tooltipów, aby warstwa była nieklikalna
                }
            });

            // Dodaj warstwę do mapy (jeśli chcesz)
            layer.addTo(map);

            resolve(layer);
        }).fail(function() {
            console.error("Nie udało się załadować pliku GeoJSON: " + url);
            resolve(null);
        });
    });
}

// Styl dla warstwy Kaplica
var kaplicaStyle = {
    color: 'black',          // Kolor obramowania
    weight: 1,               // Grubość obramowania
    fillColor: 'yellow',     // Kolor wypełnienia
    fillOpacity: 0.5         // Przezroczystość wypełnienia
};

// Tworzenie warstwy Kaplica i dodanie jej do mapy
createNonInteractiveLayer('Kaplica.geojson', 'Kaplica', kaplicaStyle).then(function(layer) {
    if (layer) {
        console.log('Warstwa Kaplica została utworzona i dodana do mapy');
        // Dodaj warstwę Kaplica do legendy
        updateLegend();
    } else {
        console.error('Nie udało się utworzyć warstwy Kaplica');
    }
});
}

    $('#searchBox').on('input', function() {
        searchGrave();
    });

    $('#searchBox').on('keypress', function(e) {
        if (e.which === 13) {
            searchGrave();
        }
    });

    $('#authorPopup').on('click', function() {
        alert("Autor mapy: Paweł Maćkowiak\nDane opracowali: Zofia Poprawska, Piotr Bączyk");
    });

    $('.designer-small').on('click', function() {
        alert("Autor mapy: Paweł Maćkowiak\nDane opracowali: Zofia Poprawska, Piotr Bączyk");
    });
