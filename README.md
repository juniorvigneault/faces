# Face Foundry 
Interactive installation prototype using Ml5 facemesh, matter.js and p5.js

### March 22nd 2023 
Right now I have a running p5.js sketch running with the live video feed. When a face is detected, there is a line around the silhouette of the face of the person detected with small green dots on each keypoint of the silhouette. 

![silhouette with keypoinnts](/assets/images/documentation/1.jpg)

When pressing enter, a snapshot is taken of the entire canvas, and then cropped in a bouding rectangle around the face. Using the silhouette keypoints as vertices, a shape is created around the face and used to create a unique matter.js body. The cropped face image is then positioned on top of the body (like a texture). The face falls to the bottom of the screen on a ground. 

![face on ground](/assets/images/documentation/2.jpg)
