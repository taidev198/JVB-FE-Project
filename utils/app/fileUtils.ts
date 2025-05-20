async function loadImage(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const blob = await response.blob();
    const img = new Image();
    img.src = URL.createObjectURL(blob);
    return img;
  }