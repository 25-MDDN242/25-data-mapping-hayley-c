[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/jTsmcDjg)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=19435023&assignment_repo_type=AssignmentRepo)
## Creative Coding + AI II: Custom Pixel
### Filtered Flowers: Flora Through a Pixel Lens
##### By Hayley Chung

> Filtered Flowers is an creative exploration of how viewing nature through a digital lens distorts our perception of it. This project specifically focuses on flowers within nature, which despite still being able to recognize their beauty, we aren't fully appreciating it in its naturality. This project focuses on roses and daisies for the differences in how we percieve the two types of flowers, but through the digital lens as pixels they became the interchangeable.

The training concept for the AI was initially to have the AI be able to differentiate the two flowers, however, with each image only containing a single flower, I decided to shift away from this concept for the scope of this project. 

The photos for this project have been sourced from iNaturalist, as it possesses a large library of photos of flowers, including roses and daisies. I chose to use these photos from iNaturalist, because the photographs are preferable to what I would have been able to capture myself at this time of year with my photography skills. When selecting photos I tried to include a variety of photos that vary in their composition and angle of a single highlighted flower, so I experimented with many different images for a curated selection of images. The attributions are listed in the process documentation. 

After exploring the code base and different filters, I found it particularly important for the masks to be very neat for both training the AI to identify a clean mask area and for using as an input into the code. 

The final submission displays the outputs from the training images: ***input_5***, ***input_7***, and ***input_8***, and the AI images: ***input_new2***, ***input_new3***, and ***input_new4***. These photos are the most refined from the range of images used in the project. 

## Process

### Photo Selection

| Name | Orginal Image | Attribution | URL |
| ---- | ------------- | ----------- | --- |
| input_1 | ![Rose training image](https://inaturalist-open-data.s3.amazonaws.com/photos/61728710/medium.jpeg) | © Eber Barraza  | [iNaturalist Mexico](https://www.inaturalist.org/photos/61728710) |
| input_2 | ![Rose training image](https://inaturalist-open-data.s3.amazonaws.com/photos/478851874/medium.jpeg) | © valhera  | [iNaturalist](https://www.inaturalist.org/photos/478851874) |
| input_3 | ![Rose training image](https://inaturalist-open-data.s3.amazonaws.com/photos/41140535/medium.jpg) |  © Evan M. Raskin | [iNaturalist](https://www.inaturalist.org/photos/41140535) |
| input_4 | ![Rose training image](https://inaturalist-open-data.s3.amazonaws.com/photos/388605272/medium.jpg) |  © Milan Kovačević  | [iNaturalist Canada](https://www.inaturalist.org/photos/388605272) |
| input_5 | ![Rose training image](https://inaturalist-open-data.s3.amazonaws.com/photos/388605398/medium.jpg) |  © Milan Kovačević  | [iNaturalist](https://www.inaturalist.org/photos/388605398) |
| input_6 | ![Daisy training image](https://inaturalist-open-data.s3.amazonaws.com/photos/271637974/medium.jpeg) | © vojtar | [iNaturalist](https://www.inaturalist.org/photos/271637974) |
| input_7 | ![Daisy training image](https://inaturalist-open-data.s3.amazonaws.com/photos/337990/medium.JPG) | © Donna Pomeroy | [iNaturalist Canada](https://www.inaturalist.org/photos/337990) |
| input_8 | ![Daisy training image](https://inaturalist-open-data.s3.amazonaws.com/photos/63293825/medium.jpg) | © Yi CHEN | https://www.inaturalist.org/photos/63293825 |
| input_9 | ![Daisy training image](https://inaturalist-open-data.s3.amazonaws.com/photos/217876098/medium.jpeg) | © bsteer | [iNaturalist Canada](https://www.inaturalist.org/photos/217876098)  |
| input_10 | ![Daisy training image](https://inaturalist-open-data.s3.amazonaws.com/photos/40495365/medium.jpeg) | © Kat | [iNaturalist Canada](https://www.inaturalist.org/photos/40495365)  |
| input_new1 | ![Rose image for AI](https://inaturalist-open-data.s3.amazonaws.com/photos/388605481/medium.jpg) | © Milan Kovačević | [iNaturalist](https://www.inaturalist.org/photos/388605481) |
| input_new2 | ![Rose image for AI](https://inaturalist-open-data.s3.amazonaws.com/photos/429269785/medium.jpg) | © Татьяна Химера | [iNaturalist](https://www.inaturalist.org/photos/429269785) |
| input_new3 | ![Rose image for AI](https://inaturalist-open-data.s3.amazonaws.com/photos/273663408/small.jpeg) | © Eric Johnson | [iNaturalist](https://www.inaturalist.org/photos/273663408) |
| input_new4 | ![Daisy image for AI](https://inaturalist-open-data.s3.amazonaws.com/photos/40713926/medium.jpeg) | © Kat | [iNaturalist Canada](https://www.inaturalist.org/photos/40713926) |
| input_new5 | [!Dasiy image for AI](https://inaturalist-open-data.s3.amazonaws.com/photos/21365414/medium.jpg) | © ࣪࣪tobypcr| [iNaturalist](https://www.inaturalist.org/observations/14371808) |
| input_new6 | ![Daisy image for AI](https://inaturalist-open-data.s3.amazonaws.com/photos/508624440/medium.jpg) | 	© 林棋欽 | [愛自然-臺灣(iNaturalist Taiwan)](https://www.inaturalist.org/photos/508624440) |

### Filter Development
Using some of my own photos of flowers, I explored the mechanics of the code, creating a pointalism inspired filter before deciding on the idea of how technology distorts our view of nature, using the following images as precedents.

### Precedents
| ![Glitched flower](/assets/glitchedFlower.png) | ![Blob tracking flower](/assets/blobTracking.png) | ![Abstract glitch](/assets/abstractGlitch.png) |
| ----------- | ----------- | ----------- |
| [Pinterest](https://nz.pinterest.com/pin/831688256216836236/) | [Pinterest](https://nz.pinterest.com/pin/633459503852463968/) | [DNA - Justin Johnson](https://www.behance.net/gallery/62895145/DNA) |

To highight the flower, I tried following the HSB code example to desaturate the background pixels, whilst maintaining the image colours for the masked out flowers.

<img src = "/assets/pointalism.jpg" alt = "Desaturated background contrasting with flower" width = "300"/>

I then began using the layers code example to draw random rectangles over the image to replicate a glitching effect.

<img src = "/assets/glitchLayer.jpg" alt = "Rectangular glitches on flower" width = "300"/>

To further the idea of viewing flowers through a distorted digital perspective, I wanted to utilized the blob scan effect code to identify the masked flower and then draw a labelled bounding box around it, which would replicate the look of image recognition. For this, I found it important to still have the flower distinguishable to viewers by making it distinct from both the background and the glitch layers. For the flower label, I used the colour of the centre pixel of the masked area for the label background and the corresponding name. I initially tried to use the colour of the mask to differentiate the text within the label, which is why the masks for the roses have been edited to a shade of gray. However, I was not able to get this to wotk within my existing code structure as it either struggled to find the mask data or the array of words, so I turned to using a switch case statement with the sourceFile variable to change the text. 

*Indistinguishable as a flower:* <br\>
<img src="/assets/boundingBox.jpg" alt="Unclear flower with image recognition" width = "300px">

*Recognizable as a flower:*<br\>
<img src="/assets/withColour.jpg" alt="Flower with image recognition" width = "300px">

Looking through the P5.js references, I found the copy() method which could be used to copy a region of pixels from a source image and translate and scale them to a different part of the canvas. I think this effect worked particularly well with creating the appearance of a glitched and distorted flower.

<img src = "/assets/copy.jpg" alt = "Copied image glitches on flower" width = "300"/>

Another idea for the glitching I had was to incorporate the complemenary colour of the flower. However, to avoid too many colours and shades within the output, I chose to just use the complementary colour of the mask's centre pixel. This was applied to solid random rectangles as well as sections of repeated rectangles.

<img src = "/assets/oppositeColour.jpg" alt = "Rectangular glitches of opposite colour on flower" width = "300"/>

Most of my image manipulations so far are 2D primatives drawn on a different layer, so I wanted to try mainpulating the pixels themselves. I initally started with the warping class example, but I thought the appearance of the green background pixels warped into the flower took away from the image. I later returned to the warping code and adjusted the different variables to see how the output would change. Although, I thought the outcome was actually quite interesting, it wasn't the look I was going after. Another iteration I tried was adapting the distortion filter code from jeffThompson's [CP2: Distorting Images](https://editor.p5js.org/jeffThompson/sketches/amZAWPv9S), changing the variables and wound up with a subtle pixelation effect.

*Applied the class warping code without altering the variables:*<br\>
<img src="/assets/wavy.jpg" alt="Warping code to make a wavy pattern in flower" width = "300px">

 *Exploration of changing the variables of the class warping code:*<br\>
<img src="/assets/wavyVariables.jpg" alt="Flower with image recognition" width = "300px">

*Subtle large pixelation of the flower pixels:*<br\>
<img src="/assets/squares.jpg" alt="Flower with large pixelation effect" width = "300px">

After trying these different pixel and image mainpulations, I then started combining them and adjusting each to work cohesively together. The solid rectangles became translucent to make if different from the barcode glitches, the widths of thhe bars in the barcodes were randomised to make them more interesting, the size of the pixelation warping became smaller and more noticeable. 

<img src = "/assets/pixelate.jpg" alt = "Combination of opposite colour rectangles, barcodes, copied image regions, and subtle pixelation glitches" width = "300"/>


#### Other Outputs
The additional photos I used to train the AI and for the AI demonstrate its learnings that have not been included in the final submission of this project. These extra training and AI inputs have also had my pixel filter applied to them and these outputs are displayed below.

#### Roses
| Input | input_1 | input_2 | input_3 | input_new4 | input_new1 |
| ---------- | ------- | ------- | ------- | ---------- | ---------- |
| Output | ![Output from input_1](/assets/extraOutputs/output_input_1.png) | ![Output from input_2](/assets/extraOutputs/output_input_2.png) | ![Output from input_3](/assets/extraOutputs/output_input_3.png) | ![Output from input_4](/assets/extraOutputs/output_input_4.png) | ![Output from input_new1](/assets/extraOutputs/output_input_new1.png) |

#### Daisies
| Input | input_6 | input_9 | input_10 | input_new5 | input_new6 |
| ----------- | ------- | ------- | -------- | ---------- | ---------- |
| Output | ![Output from input_6](/assets/extraOutputs/output_input_6.png) | ![Output from input_9](/assets/extraOutputs/output_input_9.png) | ![Output from input_10](/assets/extraOutputs/output_input_10.png) | ![Output from input_new5](/assets/extraOutputs/output_input_new5.png) | ![Output from input_new6](/assets/extraOutputs/output_input_new6.png) |

#### Reflection
Although I had a clear idea of how I wanted my final output to look most of the time, I found it somewhat difficult to translate them to the code base, due to being unfamiliar with image and pixel mainpulation in creative coding contexts. The theme and direction of this project has many possible options that it could be taken within beyond the assignment. Futher iterations could be made to emphasize the glitching with the background of the flower seeping into the masked area.Apart from pixel filter possibilities, other futher developments could be to explore the training of the AI to differentiate different flowers which I briefly tried, or to create completely different pixel filters for different flowers and delve into a themematic project on how different species of flowers are perceived.
