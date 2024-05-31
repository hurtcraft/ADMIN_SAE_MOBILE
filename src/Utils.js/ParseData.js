export  function parseCoordinates(coordString) {
    const parts = coordString.split(',');
  
    if (parts.length !== 2) {
      throw new Error('Invalid coordinate format. Expected "lat, lng".');
    }
  
    const lat = parseFloat(parts[0].trim());
    const lng = parseFloat(parts[1].trim());
  
    if (isNaN(lat) || isNaN(lng)) {
      throw new Error('Invalid coordinate values. Unable to parse as numbers.');
    }
  
    return [lat, lng];
  };