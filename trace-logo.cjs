const ImageTracer = require('imagetracerjs');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

async function convert() {
    try {
        const image = await loadImage('assets/logo-512.png');
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);
        
        // Ensure image data format
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        console.log("Tracing image...");
        const options = {
            corsenabled: false,
            ltres: 1,
            qtres: 1,
            pathomit: 8,
            rightangleenhance: true,
            colorsampling: 2,
            numberofcolors: 16,
            mincolorratio: 0,
            colorquantcycles: 3,
            layering: 0,
            strokewidth: 1,
            linefilter: false,
            scale: 1,
            roundcoords: 1,
            viewbox: false,
            desc: false,
            blurradius: 0,
            blurdelta: 20
        };
        
        const svgString = ImageTracer.imagedataToSVG(imgData, options);

        // Clean up for BIMI
        console.log("Cleaning SVG for BIMI format...");
        let cleanedSVG = svgString;

        // 1. Remove XML declaration and comments if they exist for clean start
        cleanedSVG = cleanedSVG.replace(/<\?xml.*\?>\n?/, '');
        
        // 2. Add proper root element with Tiny-PS rules
        cleanedSVG = cleanedSVG.replace(/<svg[^>]*>/, `<svg version="1.2" baseProfile="tiny-ps" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${image.width} ${image.height}">\n  <title>Vision Education</title>`);
        
        // 3. Remove unsupported tags like <g>
        cleanedSVG = cleanedSVG.replace(/<g[^>]*>/g, '');
        cleanedSVG = cleanedSVG.replace(/<\/g>/g, '');
        
        // Add XML header
        cleanedSVG = `<?xml version="1.0" encoding="utf-8"?>\n` + cleanedSVG;

        fs.writeFileSync('assets/logo.svg', cleanedSVG);
        console.log("Trace and cleanup complete: assets/logo.svg");
    } catch(err) {
        console.error(err);
    }
}

convert();
