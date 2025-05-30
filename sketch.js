let sourceImg=null;
let maskImg=null;
let renderCounter=0;
let curLayer = 0;

// change these three lines as appropiate
let sourceFile = "input_1.jpg";
let maskFile   = "mask_1.png";
let outputFile = "output_1.png";

let maskCenter = null; 
let maskCenterSize = null; 

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
  if(curLayer == 0){
    for(let row=0;row<width;row++) {
        for(let col = 0; col < height; col++){
        let x = row;
        let y = col; 
        let pixData = sourceImg.get(x, y);
        let maskData = maskImg.get(x, y);
        colorMode(HSB, 360, 100, 100);

        if(maskData[0] > 128) {
          fill(pixData);
          set(x, y, pixData);
        }
        else {
          let c = color(pixData);
          let b = brightness(c);
          let newBrightness = map(b, 0, 100, 50, 100);
          let newColour = color(0, 0, newBrightness);
          fill(newColour);
          set(x, y,newColour);
        }
      }
    }
    updatePixels();
  }

  if(curLayer == 1){
    for(let i=0;i<50;i++) {
      let x1 = random(0, width);
      let y1 = random(0, height);
      let x2 = x1 + random(-75, 75);
      let y2 = y1 + random(-50, 50);

      colorMode(RGB);
      let pixData = sourceImg.get(x1, y1);
      let maskData = maskImg.get(x1, y1);
      fill(pixData);
      noStroke();

      if(maskData[0] > 128) {
        rectMode(CORNERS);
        rect(x1, y1, x2, y2);
      }

      imageMode(CORNERS);
      copy(sourceImg, x1, y1, 10, 10, x2, y2, 50, 50);
    }
  }
  

  if (maskCenter !== null){
    colorMode(RGB);
    rectMode(CENTER);
    strokeWeight(5);
    stroke(255, 255, 255);
    noFill();
    let mcw = maskCenterSize[0];
    let mch = maskCenterSize[1];
    rect(maskCenter[0], maskCenter[1], mcw, mch);
    line(maskCenter[0] - mcw/2, maskCenter[1], maskCenter[0] - mcw/2 + 25, maskCenter[1]);
    line(maskCenter[0] + mcw/2, maskCenter[1], maskCenter[0] + mcw/2 - 25, maskCenter[1]);
    line(maskCenter[0], maskCenter[1] - mch/2, maskCenter[0], maskCenter[1] - mch/2 + 25);
    line(maskCenter[0], maskCenter[1] + mch/2, maskCenter[0], maskCenter[1]  + mch/2 - 25);

    let pixData = sourceImg.get(mcw, mch);
    textSize(24);
    let label = 'rose';
    let labelWidth = textWidth(label) + 2;
    rectMode(CORNER);
    noStroke();
    fill(pixData);
    rect(maskCenter[0] - mcw/2 - 2, maskCenter[1] - mch/2 - 30, labelWidth, 24);

    rectMode(CENTER);
    noFill();
    stroke(255, 255, 255);
    strokeWeight(2);
    textFont('Courier New');
    text('rose', maskCenter[0] - mcw/2, maskCenter[1] - mch/2 - 10);
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