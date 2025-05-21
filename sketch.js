let sourceImg=null;
let maskImg=null;
let renderCounter=0;
let curLayer = 0;

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
  if(curLayer == 0){
    for(let row=0;row<width;row++) {
        for(let col = 0; col < height; col++){
        let x = row;
        let y = col; 
        let pixData = sourceImg.get(x, y);
        let c = color(pixData);

        colorMode(HSB, 360, 100, 100);
        let b = brightness(c);

        let newBrightness = map(b, 0, 100, 50, 100);
        let newColour = color(0, 0, newBrightness);

        fill(newColour);
        set(x, y,newColour);
      }
    }
    updatePixels();
  }

  if(curLayer == 1){
    for(let i=0;i<4000;i++) {
      colorMode(RGB);
      let x = floor(random(sourceImg.width));
      let y = floor(random(sourceImg.height));
      let pixData = sourceImg.get(x, y);
      let maskData = maskImg.get(x, y);
      fill(pixData);

      if(maskData[0] > 128) {
        let pointSize = 15;
        rect(x, y, pointSize, pointSize);  
      }
    }
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
