# Face Foundry (working title?)
Interactive installation prototype using ml5 facemesh, matter.js and p5.js

### March 22nd 2023 
As of now: I have a running p5.js sketch with a live video feed coming from webcam. When a face is detected using ml5, a line around the silhouette of the face is drawn as well as small green dots on each of the keypoints. 

![silhouette with keypoinnts](/assets/images/documentation/1.jpg)

When pressing enter, a snapshot is taken of the entire canvas. This image is then cropped tighter around the face (using the bounding rectangle provided by ml5). Using the face silhouette keypoints as vertices, a shape is then created around and used to create a unique matter.js body. The cropped face image is positioned on top of the body (like a texture) and added to the "world", falling to the bottom of the screen on the ground.

![face on ground](/assets/images/documentation/2.jpg)

These were the first big steps I needed to take in order to jumpstart the project. I will now list things I need to implement in order to reach the second phase, before I can start to experiment in a physical space (because this is an installation and it's essential to also prototype in tangible ways). 

1. Have a second canvas where the face are actually added that will be displayed as a projection.
2. Implement Node.js to easily save the image snapshots on a server, as well as the position and the shape of each face. This will allow for the installation to save in specific states, to ensure it can reboot from its previous state if it stops running. The canvas can then accumulate faces from different sessions is there is desire to do so. 

