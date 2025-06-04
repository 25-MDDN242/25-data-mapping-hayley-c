let sourceImg=null;
let maskImg=null;
let renderCounter=0;
let curLayer = 0;
let maskCenter = null; 
let maskCenterSize = null; 
let rectRepeat = [];

// change these three lines as appropiate
let sourceFile = "input_new2.jpg";
let maskFile   = "mask_new2.png";
let outputFile = "output_5.png";

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

  for (let x = 20; x < 100; x += 20) {
    rectRepeat.push(x);
  }
}

let X_STOP = 1920;
let Y_STOP = 1080;
let OFFSET = 20;

function maskCenterSearcher(min_width) {
  let mask_x_sum = 0;
  let mask_y_sum = 0;
  let mask_count = 0;
 
  print("Scanning mask top to bottom...")
 
  for(let j=0; j<Y_STOP; j++) {
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

function maskSizeFinder(min_width) {
  let max_up_down = 0;
  let max_left_right = 0;

  print("Scanning mask top to bottom...")
 
  for(let j=0; j<Y_STOP; j++) {
    let mask_count = 0;
    for(let i=0; i<X_STOP; i++) {
      let mask = maskImg.get(i, j);
      if (mask[1] > 128) {
        mask_count = mask_count + 1;
      }
    }

    if (mask_count > max_left_right) {
      max_left_right = mask_count;
    }
  }

  print("Scanning mask left to right...")
 
  for(let i=0; i<X_STOP; i++) {
    let mask_count = 0;
    for(let j=0; j<Y_STOP; j++) {
      let mask = maskImg.get(i, j);
      if (mask[1] > 128) {
        mask_count = mask_count + 1;
      }
    }
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
        let pixData = sourceImg.get(x, y);
        let maskData = maskImg.get(x, y);
        colorMode(HSB, 360, 100, 100);

        // image colours for masked area
        if(maskData[0] > 128) {
          fill(pixData);
          set(x, y, pixData); // image colour masked area pixels
        }
        // grayscale background filter
        else {
          let pixelBrightness = brightness(pixData);
          let newBrightness = map(pixelBrightness, 0, 100, 50, 100);
          let grayscale = color(0, 0, newBrightness);
          set(x, y, grayscale); // grayscale background pixels
        }
      }
    }
    updatePixels();
  }

  // glitch effects 
  if(curLayer == 1){
    for(let i = 0; i < 4 ; i++) {

      // copy image regions 
      let sourceWidth = random(-50, 50); // copy source width
      let sourceHeight = random(-50, 50); // copy source height
      let destWidth = random(-200, 200); // copy destination width 
      let destHeight = random(-200, 200); // copy destination height

      let x1 = random(0, width); // first random x coordinate
      let y1 = random(0, height); // first random y coordinate
      let x2 = x1 + random(-100, 100); // second random x coordinate
      let y2 = y1 + random(-75, 75); // second random y coordinate


      let pixData = sourceImg.get(x1, y1);
      let maskData = maskImg.get(x1, y1);
      noStroke();

      if(maskData[0] > 128) {
        imageMode(CORNERS);
        fill(pixData); // image pixels
        copy(sourceImg, x1, y1, sourceWidth, sourceHeight, x2, y2, destWidth, destHeight); // copy source region to new destination with new size 

        rectMode(CORNERS);
        colorMode(HSB, 360, 100, 100);
        let hueValue = hue(maskCenterPixel); // hue of mask centre pixel
        let mapHue = map(hueValue, 0, 360, 0, 120); // 
        let complementaryHue = 300 - mapHue; // find complementary hue
        let complementaryColour = color(complementaryHue, 100, 100); // complementary colour

        // random solid colour rectangle
        fill(complementaryColour);
        rect(x1, y1, x2, y2); 

        // repeating rectangles
        for (let i = 0; i < rectRepeat.length; i += 1) {
          rectMode(CORNER);
          rect(x1 + rectRepeat[i], y1, 15, 40);
        }
      }
    }
    renderCounter = renderCounter + 1;
  }

  // mask scanner focus rectangle
  if (maskCenter !== null){
    colorMode(RGB);
    rectMode(CENTER);
    strokeWeight(5); // scan line weight
    stroke(255, 255, 255); // white scan lines
    noFill();
    rect(maskCenter[0], maskCenter[1], maskWidth, maskHeight); // scan rectangle
    line(maskCenter[0] - maskWidth/2, maskCenter[1], maskCenter[0] - maskWidth/2 + 25, maskCenter[1]); // scan left line
    line(maskCenter[0] + maskWidth/2, maskCenter[1], maskCenter[0] + maskWidth/2 - 25, maskCenter[1]); // scan right line
    line(maskCenter[0], maskCenter[1] - maskHeight/2, maskCenter[0], maskCenter[1] - maskHeight/2 + 25); // scan top line
    line(maskCenter[0], maskCenter[1] + maskHeight/2, maskCenter[0], maskCenter[1]  + maskHeight/2 - 25); // scan bottom line

    let labelWidth = textWidth('rose') + 2; // label backing width 
    rectMode(CORNER);
    noStroke();
    fill(maskCenterPixel); // centre mask pixel colour
    rect(maskCenter[0] - maskWidth/2 - 2, maskCenter[1] - maskHeight/2 - 30, labelWidth, 24); // label backing

    rectMode(CENTER);
    noFill();
    stroke(255, 255, 255); // white text
    strokeWeight(2); // text weight
    textSize(24); // text size
    textFont('Courier New'); // courier new typeface
    text('rose', maskCenter[0] - maskWidth/2, maskCenter[1] - maskHeight/2 - 10); // text and text location 
  }
  
  renderCounter = renderCounter + 1;
  if(renderCounter > 1 && curLayer == 0) {
  renderCounter = 0; 
  curLayer = 1;
  console.log("change to layer 1")
  }
  if(renderCounter > 4 && curLayer == 1) {
    renderCounter = 0; 
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