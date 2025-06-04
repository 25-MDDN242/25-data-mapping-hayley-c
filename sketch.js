let sourceImg=null;
let maskImg=null;
let renderCounter=0;
let curLayer = 0;
let maskCenter = null; 
let maskCenterSize = null; 
let rectRepeat = [];

// change these three lines as appropiate
let sourceFile = "input_5.jpg";
let maskFile   = "mask_5.png";
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

  if(curLayer == 0){
    for(let row=0; row<width; row++) {
        for(let col = 0; col < height; col++){
        let x = row;
        let y = col; 
        let pixData = sourceImg.get(x, y);
        let maskData = maskImg.get(x, y);
        colorMode(HSB, 360, 100, 100);

        // use image colours for masked area
        if(maskData[0] > 128) {
          fill(pixData);
          set(x, y, pixData); // image colour masked area pixels
        }
        // grayscale background filter
        else {
          let c = color(pixData);
          let b = brightness(c);
          let newBrightness = map(b, 0, 100, 50, 100);
          let newColour = color(0, 0, newBrightness);
          set(x, y, newColour); // grayscale background pixels
        }
      }
    }
    updatePixels();
  }

  if(curLayer == 1){
    for(let i=0; i<2 ; i++) {
      colorMode(RGB, 100);

      let sourceWidth = random(-50, 50); // 
      let sourceHeight = random(-50, 50); //
      let destWidth = random(-200, 200); //
      let destHeight = random(-200, 200); //

      let x1 = random(0, width);
      let y1 = random(0, height);
      let x2 = x1 + random(-100, 100);
      let y2 = y1 + random(-75, 75);


      let pixData = sourceImg.get(x1, y1);
      let maskData = maskImg.get(x1, y1);
      noStroke();

      if(maskData[0] > 128) {
        imageMode(CORNERS);
        fill(pixData);
        copy(sourceImg, x1, y1, sourceWidth, sourceHeight, x2, y2, destWidth, destHeight);

        rectMode(CORNERS);
        colorMode(HSB, 360, 100, 100);

        let selectCenter = sourceImg.get(maskWidth, maskHeight);
        let c = color(selectCenter);
        let hueValue = hue(c);
        let mapHue = map(hueValue, 0, 360, 0, 120);
        let newHue = 300 - mapHue;
        let invertHue = color(newHue, 100, 100);

        fill(invertHue);
        rect(x1, y1, x2, y2);

        for(let i=0;i<1;i++) {
          for (let i = 0; i < rectRepeat.length; i += 1) {
            rectMode(CORNER);
            rect(x1 + rectRepeat[i], y1, 15, 40);
          }
        }
      }
    }
  }

  if (maskCenter !== null){
    colorMode(RGB);
    rectMode(CENTER);
    strokeWeight(5);
    stroke(255, 255, 255);
    noFill();
    rect(maskCenter[0], maskCenter[1], maskWidth, maskHeight);
    line(maskCenter[0] - maskWidth/2, maskCenter[1], maskCenter[0] - maskWidth/2 + 25, maskCenter[1]);
    line(maskCenter[0] + maskWidth/2, maskCenter[1], maskCenter[0] + maskWidth/2 - 25, maskCenter[1]);
    line(maskCenter[0], maskCenter[1] - maskHeight/2, maskCenter[0], maskCenter[1] - maskHeight/2 + 25);
    line(maskCenter[0], maskCenter[1] + maskHeight/2, maskCenter[0], maskCenter[1]  + maskHeight/2 - 25);

    let pixData = sourceImg.get(maskWidth, maskHeight);
    textSize(24);
    let label = 'rose';
    let labelWidth = textWidth(label) + 2;
    rectMode(CORNER);
    noStroke();
    fill(pixData);
    rect(maskCenter[0] - maskWidth/2 - 2, maskCenter[1] - maskHeight/2 - 30, labelWidth, 24);

    rectMode(CENTER);
    noFill();
    stroke(255, 255, 255);
    strokeWeight(2);
    textFont('Courier New');
    text('rose', maskCenter[0] - maskWidth/2, maskCenter[1] - maskHeight/2 - 10);
  }
  
  renderCounter = renderCounter + 1;
  if(renderCounter > 1 && curLayer == 0) {
  renderCounter = 0; 
  curLayer = 1;
  console.log("change to layer 1")
  }

  if(renderCounter > 10 && curLayer == 1) {
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