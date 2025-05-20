let sourceImg=null;
let maskImg=null;
let renderCounter=0;

// change these three lines as appropiate
let sourceFile = "input_1.jpg";
let maskFile   = "mask_1.png";
let outputFile = "output_1.png";

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
}

function draw () {
  for(let i=0;i<4000;i++) {
    colorMode(RGB);
    let x = floor(random(sourceImg.width));
    let y = floor(random(sourceImg.height));
    let pixData = sourceImg.get(x, y);
    let col = color(pixData);
    let maskData = maskImg.get(x, y);
    fill(pixData);

    colorMode(HSB, 360, 100, 100);
    let h = hue(col);
    let s = saturation(col);
    let b = brightness(col);

    if(maskData[0] > 128) {
      let pointSize = 15;
    rect(x, y, pointSize, pointSize);  
    }
    else { 
      let newBrightness = map(b, 0, 100, 50, 100);
      let newColour = color(0, 0, newBrightness);
      let pointSize = 5;
      fill(newColour)
      ellipse(x, y, pointSize, pointSize);
    }
  }
}

  renderCounter = renderCounter + 1;
  if(renderCounter > 10) {
    console.log("Done!")
    noLoop();
    // uncomment this to save the result
    // saveArtworkImage(outputFile);
  }

function keyTyped() {
  if (key == '!') {
    saveBlocksImages();
  }
}
