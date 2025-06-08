let sourceImg = null;
let maskImg = null;
let renderCounter = 0;
let curLayer = 0;
let maskCenter = null; 
let maskCenterSize = null; 
let barcode = [];

let loopCounter = 0;

// change these three lines as appropiate
let sourceFile = "input_1.jpg";
let maskFile = "mask_1.png";
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
}

let X_STOP = 1920;
let Y_STOP = 1080;

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

        let wavinessX = 2.5;  // smaller number = fewer repetitions
        let wavinessY = 2.5;
        let periodX =   2.5;  // smaller number = more
        let periodY =   2.5;
      
        let tempX = x + wavinessX * sin(x/periodX);
        let tempY = y + wavinessY * cos(y/periodY);
        let squares = sourceImg.get(tempX, tempY);

        let pixelBrightness = brightness(pixData);
        let newBrightness = map(pixelBrightness, 0, 100, 50, 100);
        let grayscale = color(0, 0, newBrightness);


        // image colours for masked area
        if(maskData[0] > 128){
          set(x, y, squares, pixData); 
        }
        // grayscale background filter
        else {
          set(x, y, grayscale); // grayscale background pixels
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

      let pixData = sourceImg.get(x1, y1);
      let maskData = maskImg.get(x1, y1);

      // copy image regions 
      let sourceWidth = random(25, 50); // copy source width
      let sourceHeight = random(25, 50); // copy source height
      let destWidth = random(50, 200); // copy destination width 
      let destHeight = random(50, 200); // copy destination height
      noStroke();


      if(maskData[1] > 128) {
        imageMode(CORNERS);

        fill(pixData); // image pixels
        copy(sourceImg, x1, y1, sourceWidth, sourceHeight, x2, y2, destWidth, destHeight); // copy source region to new destination with new size 

        colorMode(HSB, 360, 100, 100, 100);
        let hueValue = hue(maskCenterPixel); // hue of mask centre pixel
        let mapHue = map(hueValue, 0, 360, 0, 120); // 
        let oppositeHue = 300 - mapHue; // find complementary hue
        let oppositeOpaque = color(oppositeHue, 100, 100, 100); // complementary colour
        let oppositeTransparent = color(oppositeHue, 100, 100, 75); // complementary colour

      //   // random solid colour rectangle
        fill(oppositeTransparent);
        rectTint(x1, y1);
        fill(oppositeOpaque);
        barcodes(x1, y1);
      }
    }
    renderCounter = renderCounter + 1;
  }
 
  // mask scanner focus rectangle
  if (maskCenter !== null) {
    let flowerType = 'daisy'
    // focus rectangle
    colorMode(RGB);
    rectMode(CENTER);
    strokeWeight(8); // scan line weight
    stroke(255, 255, 255); // white scan lines
    noFill();
    rect(maskCenter[0], maskCenter[1], maskWidth, maskHeight); // scan rectangle

    // label background
    let labelWidth = textWidth(flowerType) + 5; // label backing width 
    rectMode(CORNER);
    noStroke();
    fill(maskCenterPixel); // centre mask pixel colour
    rect(maskCenter[0] - maskWidth/2 - 2, maskCenter[1] - maskHeight/2 - 30, labelWidth, 24); // label backing

    // label text
    rectMode(CENTER);
    noFill();
    stroke(255, 255, 255); // white text
    strokeWeight(2); // text weight
    textSize(24); // text size
    textFont('Courier New'); // courier new typeface
    text(flowerType, maskCenter[0] - maskWidth/2, maskCenter[1] - maskHeight/2 - 10); // text and text location 
  }
  renderCounter = renderCounter + 1;

  if(curLayer == 0 && renderCounter > 1) {
    curLayer = 1;
    renderCounter = 0; 
    console.log("change to layer 1")
  }
  else if(curLayer == 1 && renderCounter > 1) {
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

function rectTint(x1, y1){
  let tintX = random (-50, 50);
  let tintY = random (-100, 100);
  push();
  translate(tintX, tintY);
  rectMode(CENTER);
  let tintWidth = random(50, 250);
  let tintHeight = random(5, 100);
  rect(x1, y1, tintWidth, tintHeight);
  pop();
}

function barcodes(x1, y1){
  let barcodeX = random (-60, 30);
  let barcodeY = random (-20, 10);
  push();
  let barcodeSize = random(75, 125);
  let gaps = random(18, 23);
  translate(barcodeX, barcodeY);
  for (let x = 0; x < barcodeSize; x += gaps) {
    barcode.push(x);
  }
  let barHeight = random(15, 80);
  for (let i = 0; i < barcode.length; i++) {
    let barWidth = random(2, 10);
    rectMode(CORNER);
    rect(x1 + barcode[i], y1, barWidth, barHeight);
  }
  pop();
}

function flowerLabel(){

      // let x1 = random(0, width);
    // let y1 = random(0, height);
    // let maskData = maskImg.get(x1, y1);
    // if (maskData[1] > 218 && maskData[1] < 236){
    //   let flowerType = 'rose'
    // }
    // else if(maskData[1] > 236){
    //   let flowerType = 'daisy'
    // }
  colorMode(RGB);
    rectMode(CENTER);
    strokeWeight(5); // scan line weight
    stroke(255, 255, 255); // white scan lines
    noFill();
    rect(maskCenter[0], maskCenter[1], maskWidth, maskHeight); // scan rectangle
 
    // label background
    let labelWidth = textWidth('rose') + 2; // label backing width 
    rectMode(CORNER);
    noStroke();
    fill(maskCenterPixel); // centre mask pixel colour
    rect(maskCenter[0] - maskWidth/2 - 2, maskCenter[1] - maskHeight/2 - 30, labelWidth, 24); // label backing

    // label text
    rectMode(CENTER);
    noFill();
    stroke(255, 255, 255); // white text
    strokeWeight(2); // text weight
    textSize(24); // text size
    textFont('Courier New'); // courier new typeface
    text('rose', maskCenter[0] - maskWidth/2, maskCenter[1] - maskHeight/2 - 10); // text and text location 
}

