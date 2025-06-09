let sourceImg = null;
let maskImg = null;
let renderCounter = 0;
let curLayer = 0;
let maskCenter = null; 
let maskCenterSize = null; 
let barcode = [];

let isDaisy = false;
let isRose = false; 

// change these three lines as appropiate
let sourceFile = "input_new4.jpg";
let maskFile = "mask_new4.png";
let outputFile = "output_6.png";

function preload() {
  sourceImg = loadImage(sourceFile);
  maskImg = loadImage(maskFile);
  //console.log(p5.Renderer2D);
}
function setup () {
  let main_canvas = createCanvas(1920, 1080);
  main_canvas.parent('canvasContainer');

  imageMode(CENTER);
  noStroke();
  background(219, 219, 219);
  sourceImg.loadPixels();
  maskImg.loadPixels();
  colorMode(HSB);

  maskCenterSearcher(20);
  maskSizeFinder(20);

  // flower type switch case statement 
  switch (sourceFile){
    // rose source files
    case "input_1.jpg":
    case "input_2.jpg":
    case "input_3.jpg":
    case "input_4.jpg":
    case "input_5.jpg":
    case "input_new1.jpg":
    case "input_new2.jpg":
    case "input_new3.jpg":
      isRose = true;
      isDaisy = false;
      break;

    // daisy source files
    case "input_6.jpg":
    case "input_7.jpg":
    case "input_8.jpg":
    case "input_9.jpg":
    case "input_10.jpg":
    case "input_new4.jpg":
    case "input_new5.jpg":
    case "input_new6.jpg":
      isRose = false;
      isDaisy = true;
      break;
  }
}

let X_STOP = 1920;
let Y_STOP = 1080;

// updated blob search mask center searcher
function maskCenterSearcher(min_width) {
  // stored sum of x, y whereever the mask is then divide to get the average at the end
  let mask_x_sum = 0;
  let mask_y_sum = 0;
  let mask_count = 0;
 
  // scan all rows top to bottom
  print("Scanning mask top to bottom...")
  for(let j=0; j<Y_STOP; j++) {

    // look across row left to right and count
    for(let i=0; i<X_STOP; i++) {
      let maskData = maskImg.get(i, j);
      if (maskData[1] > 128) {
        mask_x_sum = mask_x_sum + i;
        mask_y_sum = mask_y_sum + j;
        mask_count = mask_count + 1;
      }
    }
  }
 
  print("Mask Center Located!")
 
  if (mask_count > min_width) {
    let avg_x_pos = int(mask_x_sum / mask_count);
    let avg_y_pos = int(mask_y_sum / mask_count);
    maskCenter = [avg_x_pos, avg_y_pos];
    print("Center set to: " + maskCenter);
  }
}

// updated blob search mask size finder
function maskSizeFinder(min_width) {
  let max_up_down = 0;
  let max_left_right = 0;

  // first scan all rows top to bottom
  print("Scanning mask top to bottom...")
 
  for(let j=0; j<Y_STOP; j++) {

    // look across row left to right and count
    let mask_count = 0;
    for(let i=0; i<X_STOP; i++) {
      let mask = maskImg.get(i, j);
      if (mask[1] > 128) {
        mask_count = mask_count + 1;
      }
    }

    // check if row sets a new record
    if (mask_count > max_left_right) {
      max_left_right = mask_count;
    }
  }

  // scan once left to right
  print("Scanning mask left to right...")
 
  for(let i=0; i<X_STOP; i++) {

    // look across column up to down and count
    let mask_count = 0;
    for(let j=0; j<Y_STOP; j++) {
      let mask = maskImg.get(i, j);
      if (mask[1] > 128) {
        mask_count = mask_count + 1;
      }
    }

    // check if column sets a new record
    if (mask_count > max_up_down) {
      max_up_down = mask_count;
    }
  }
 
  print("Scanning mask done!")
 
  if (max_left_right > min_width && max_up_down > min_width) {
    maskCenterSize = [max_left_right, max_up_down];
  }
}

function draw () {
  let maskWidth = maskCenterSize[0];
  let maskHeight = maskCenterSize[1];
  let maskCenterPixel = sourceImg.get(maskWidth, maskHeight);

  // pixel colours
  if(curLayer == 0){
    for(let row=0; row<width; row++) {
        for(let col = 0; col < height; col++){
        let x = row;
        let y = col; 
        let pixData = sourceImg.get(x, y); // pixel data from image
        let maskData = maskImg.get(x, y); // mask data from mask image

        // pixelation distortion filter variables
        let distortAmplitude = 2.5; // amplitude of the distortion wave
        let distortPeriod =   1.5; // period of the distortion wave
        let distortX = x + distortAmplitude * sin(x/distortPeriod); // distort horizontally
        let distortY = y + distortAmplitude * cos(y/distortPeriod); // distort vertically
        let pixelate = sourceImg.get(distortX, distortY); // distortion filter of the source image

        // brightness filter
        colorMode(HSB, 360, 100, 100); // change to HSB colour mode
        let pixelBrightness = brightness(pixData); // brightness value of the pixel data
        let newBrightness = map(pixelBrightness, 0, 100, 50, 100); // reduce brightness
        let grayscale = color(0, 0, newBrightness); // grayscale colour with no hue, no saturation and reduced brightness

        // pixels with distortion filter and original colours
        if(maskData[0] > 128){
          set(x, y, pixelate, pixData); // mask pixels
        }
        // grayscale background filter
        else {
          set(x, y, grayscale); // background pixels
        }
      }
    }
    renderCounter = renderCounter + 1;
    updatePixels();
  }

  // glitch effects 
  else if(curLayer == 1){
    for(let i = 0; i < 50 ; i++) {

      let x1 = random(0, width); // first random x coordinate
      let y1 = random(0, height); // first random y coordinate
      let x2 = x1 + random(-100, 100); // second random x coordinate
      let y2 = y1 + random(-75, 75); // second random y coordinate

      let pixData = sourceImg.get(x1, y1); // pixel data from image
      let maskData = maskImg.get(x1, y1); // mask data from mask image

      if(maskData[1] > 128) {
        // opposite tint rectangle at random x and y coordinates
        rectTint(x1, y1, maskCenterPixel);
        // random image regions copies
        copyGlitch(x1, y1, x2, y2, pixData);
        // opposite colour barcodes at random x and y coordinates
        barcodes(x1, y1, maskCenterPixel);
      }
    }
    renderCounter = renderCounter + 1;
  }
 
  // flower recognition
  else {
    for (let i=0; i<100; i++) {
      // identify flower type
      let flowerType = null;
      if (isRose == true){
        flowerType = "rose"; // rose source image: label as a rose
      }
      else {
        flowerType = "daisy"; // daisy source image: label as a daisy
      }

      // flower identifier variables
      let boxLeft = maskCenter[0] - maskWidth/2; // bounding box left x coordinate
      let boxTop = maskCenter[1] - maskHeight/2; // bounding box top y coordinate
      let labelLeft = boxLeft - 4; // label background left x coordinate
      let labelTop = boxTop - 30; // label background top y coordinate
      let labelWidth = textWidth(flowerType) + 10; // label backing width 
      let textTop = boxTop - 12; // label text top y coordinate

      // bounding box styling
      colorMode(RGB); // RGB colour mode
      rectMode(CENTER); // centre rectangle mode
      strokeWeight(8); // bounding box line weight
      stroke(255, 255, 255); // white bounding box
      noFill(); // no fill

      // draw bounding box
      rect(maskCenter[0], maskCenter[1], maskWidth, maskHeight); // bounding box rectangle

      // label background styling
      rectMode(CORNER); // label from top left corner
      noStroke();
      fill(maskCenterPixel); // mask's centre pixel's colour

      // draw label background
      rect(labelLeft, labelTop, labelWidth, 24); // label backing

      // font attributes
      noFill(); // no fill
      stroke(255, 255, 255); // white text
      strokeWeight(1.75); // font weight
      textSize(24); // font size
      textFont('Courier New'); // courier new typeface

      // write text
      text(flowerType, boxLeft, textTop); // flower type label located at the top left of the flower bounding boz
    }
    renderCounter = renderCounter + 1;
  }

  if (curLayer == 0 && renderCounter > 1) {
    curLayer = 1;
    renderCounter = 0; 
    console.log("change to layer 1")
  }
  else if (curLayer == 1 && renderCounter > 1) {
    curLayer = 2;
    renderCounter = 0;
    print("Switching to curLayer 2");
  }
  else if (curLayer == 2 && renderCounter > 1) {
    console.log("Done!")
    noLoop();
    // uncomment this to save the result
    // saveArtworkImage(outputFile);
  }
}

function keyTyped() {
  if (key == '!') {
    saveBlocksImages();
  }
}

// image regions copies at random x and y coordinates
function copyGlitch(x1, y1, x2, y2, pixData){
  // image pixel regions 
  let sourceWidth = random(25, 50); // copy source width
  let sourceHeight = random(25, 50); // copy source height
  let destWidth = random(50, 200); // copy destination width 
  let destHeight = random(50, 200); // copy destination height

  // copy image
  imageMode(CORNERS); // corner image mode
  noStroke(); // no stroke
  fill(pixData); // image pixels
  copy(sourceImg, x1, y1, sourceWidth, sourceHeight, x2, y2, destWidth, destHeight); // copy source region to new destination with new size 
}

// opposite tint rectangle at random x and y coordinates
function rectTint(x1, y1, maskCenterPixel){
  // rectangle location variables
  let tintX = random (-50, 50); // translate rectangle horizontally
  let tintY = random (-100, 100); // translate rectangle vertically

  // tint colour variables
  colorMode(HSB, 360, 100, 100, 100); // HSB colour mode
  let hueValue = hue(maskCenterPixel); // mask's centre pixel's hue
  let mapHue = map(hueValue, 0, 360, 0, 120); // map mask's centre pixel's hue
  let oppositeHue = 300 - mapHue; // find opposite hue
  let oppositeTint = color(oppositeHue, 100, 100, 75); // opposite colour tint

  rectMode(CENTER); // centre rectangle mode
  noStroke(); // no stroke
  fill(oppositeTint); // opposite colour tint

  // draw rectangular tint
  push();
  translate(tintX, tintY); // translate rectangle horizontally & vertically
  let tintWidth = random(50, 250); // rectangle's width
  let tintHeight = random(5, 100); // rectangle's height
  rect(x1, y1, tintWidth, tintHeight); // rectangle shape
  pop();
}

// opposite colour barcodes at random x and y coordinates
function barcodes(x1, y1, maskCenterPixel){
  // barcode location variables
  let barcodeX = random (-60, 30); // translate barcode horizontally
  let barcodeY = random (-20, 10); // translate barcode vertically

  // barcode colour variables
  colorMode(HSB, 360, 100, 100, 100); // HSB colour mode
  let hueValue = hue(maskCenterPixel); // mask's centre pixel's hue
  let mapHue = map(hueValue, 0, 360, 0, 120); // map mask's centre pixel's hue
  let oppositeHue = 300 - mapHue; // find opposite hue
  let oppositeColour = color(oppositeHue, 100, 100, 100); // opposite colour

  noStroke(); // no stroke
  fill(oppositeColour); // opposite colour

  // draw barcode
  push();
  // bar variables within barcode
  let barcodeWidth = random(75, 125); // barcode's width
  let gaps = random(18, 23); // gap between bars
  let barHeight = random(15, 80); // barcode's height

  translate(barcodeX, barcodeY); // translate barcode horizontally & vertically
  // add the barcode elements to the barcode array
  for (let x = 0; x < barcodeWidth; x += gaps) {
    barcode.push(x);
  }

  // repeat bars and spacing within barcode's width
  for (let i = 0; i < barcode.length; i++) {
    let barWidth = random(2, 10);
    rectMode(CORNER);
    rect(x1 + barcode[i], y1, barWidth, barHeight);
  }
  pop();
}