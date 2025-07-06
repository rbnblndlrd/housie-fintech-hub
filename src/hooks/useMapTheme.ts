
import { useState, useEffect } from 'react';

export type MapTheme = 'standard' | 'dark' | 'retro' | 'tealCream';

export interface MapThemeConfig {
  name: string;
  styles: google.maps.MapTypeStyle[];
}

export const mapThemes: Record<MapTheme, MapThemeConfig> = {
  standard: {
    name: 'Standard',
    styles: [] // Default Google Maps styling
  },
  dark: {
    name: 'Dark',
    styles: [
      { elementType: "geometry", stylers: [{ color: "#212121" }] },
      { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
      { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#757575" }] },
      { featureType: "administrative.country", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
      { featureType: "administrative.land_parcel", stylers: [{ visibility: "off" }] },
      { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#bdbdbd" }] },
      { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
      { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#181818" }] },
      { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
      { featureType: "poi.park", elementType: "labels.text.stroke", stylers: [{ color: "#1b1b1b" }] },
      { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#2c2c2c" }] },
      { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#8a8a8a" }] },
      { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#373737" }] },
      { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#3c3c3c" }] },
      { featureType: "road.highway.controlled_access", elementType: "geometry", stylers: [{ color: "#4e4e4e" }] },
      { featureType: "road.local", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
      { featureType: "transit", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
      { featureType: "water", elementType: "geometry", stylers: [{ color: "#000000" }] },
      { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#3d3d3d" }] }
    ]
  },
  retro: {
    name: 'Retro',
    styles: [
      { elementType: "geometry", stylers: [{ color: "#ebe3cd" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#523735" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#f5f1e6" }] },
      { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#c9b2a6" }] },
      { featureType: "administrative.land_parcel", elementType: "geometry.stroke", stylers: [{ color: "#dcd2be" }] },
      { featureType: "administrative.land_parcel", elementType: "labels.text.fill", stylers: [{ color: "#ae9e90" }] },
      { featureType: "landscape.natural", elementType: "geometry", stylers: [{ color: "#dfd2ae" }] },
      { featureType: "poi", elementType: "geometry", stylers: [{ color: "#dfd2ae" }] },
      { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#93817c" }] },
      { featureType: "poi.park", elementType: "geometry.fill", stylers: [{ color: "#a5b076" }] },
      { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#447530" }] },
      { featureType: "road", elementType: "geometry", stylers: [{ color: "#f5f1e6" }] },
      { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#fdfcf8" }] },
      { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#f8c967" }] },
      { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#e9bc62" }] },
      { featureType: "road.highway.controlled_access", elementType: "geometry", stylers: [{ color: "#e98d58" }] },
      { featureType: "road.highway.controlled_access", elementType: "geometry.stroke", stylers: [{ color: "#db8555" }] },
      { featureType: "road.local", elementType: "labels.text.fill", stylers: [{ color: "#806b63" }] },
      { featureType: "transit.line", elementType: "geometry", stylers: [{ color: "#dfd2ae" }] },
      { featureType: "transit.line", elementType: "labels.text.fill", stylers: [{ color: "#8f7d77" }] },
      { featureType: "transit.line", elementType: "labels.text.stroke", stylers: [{ color: "#ebe3cd" }] },
      { featureType: "transit.station", elementType: "geometry", stylers: [{ color: "#dfd2ae" }] },
      { featureType: "water", elementType: "geometry.fill", stylers: [{ color: "#b9d3c2" }] },
      { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#92998d" }] }
    ]
  },
  tealCream: {
    name: 'Teal & Cream',
    styles: [
      // Base landscape styling - cream background
      { elementType: "geometry", stylers: [{ color: "#f5f5dc" }] },
      
      // Text styling - dark slate gray for contrast
      { elementType: "labels.text.fill", stylers: [{ color: "#2f4f4f" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }] },
      
      // Water styling - teal
      { featureType: "water", elementType: "geometry", stylers: [{ color: "#008080" }] },
      { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#ffffff" }] },
      
      // Road styling - white with slight lightness
      { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
      { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#2f4f4f" }] },
      { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#f8f8ff" }] },
      { featureType: "road.local", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
      
      // Highway styling - darker teal
      { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#4a9999" }] },
      { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#008080" }] },
      { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#ffffff" }] },
      { featureType: "road.highway.controlled_access", elementType: "geometry", stylers: [{ color: "#4a9999" }] },
      { featureType: "road.highway.controlled_access", elementType: "geometry.stroke", stylers: [{ color: "#008080" }] },
      
      // Parks and natural areas - light sea green
      { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#20b2aa" }] },
      { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#2f4f4f" }] },
      { featureType: "landscape.natural", elementType: "geometry", stylers: [{ color: "#20b2aa" }] },
      
      // Administrative boundaries
      { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#4a9999" }] },
      { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#2f4f4f" }] },
      { featureType: "administrative.country", elementType: "labels.text.fill", stylers: [{ color: "#2f4f4f" }] },
      
      // POI styling
      { featureType: "poi", elementType: "geometry", stylers: [{ color: "#f0f8ff" }] },
      { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#2f4f4f" }] },
      
      // Transit styling
      { featureType: "transit", elementType: "geometry", stylers: [{ color: "#4a9999" }] },
      { featureType: "transit", elementType: "labels.text.fill", stylers: [{ color: "#2f4f4f" }] },
      { featureType: "transit.line", elementType: "geometry", stylers: [{ color: "#4a9999" }] },
      { featureType: "transit.station", elementType: "geometry", stylers: [{ color: "#20b2aa" }] }
    ]
  }
};

export const useMapTheme = () => {
  // Default to dark theme for better visibility
  const [currentTheme, setCurrentTheme] = useState<MapTheme>(() => {
    const saved = localStorage.getItem('interactive-map-theme');
    return (saved as MapTheme) || 'dark';
  });

  const cycleTheme = () => {
    const themes: MapTheme[] = ['standard', 'dark', 'retro', 'tealCream'];
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    setCurrentTheme(nextTheme);
    console.log('🎨 useMapTheme: Theme cycled to:', nextTheme);
  };

  const toggleLightDark = () => {
    const newTheme = currentTheme === 'dark' ? 'standard' : 'dark';
    setCurrentTheme(newTheme);
    console.log('🎨 useMapTheme: Theme toggled to:', newTheme);
  };

  useEffect(() => {
    localStorage.setItem('interactive-map-theme', currentTheme);
  }, [currentTheme]);

  return {
    currentTheme,
    currentThemeConfig: mapThemes[currentTheme],
    cycleTheme,
    toggleLightDark,
    setTheme: setCurrentTheme,
    isDark: currentTheme === 'dark'
  };
};
