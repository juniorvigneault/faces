# Face Foundry (working title?)
Interactive installation prototype using ml5 facemesh, matter.js and p5.js.

### March 10 2023
Initial sketch and idea:

![Initial sketch of the project](public/assets/images/documentation/sketch1.jpg)


### March 22nd 2023 
As of now: I have a running p5.js sketch with a live video feed coming from webcam. When a face is detected using ml5, a line around the silhouette of the face is drawn as well as small green dots on each of the keypoints. 

![Silhouette with keypoinnts](public/assets/images/documentation/1.jpg)

When pressing enter, a snapshot of the entire canvas is taken. This image is then cropped tighter around the face (using the bounding rectangle provided by ml5). Using the face silhouette keypoints as vertices, a shape is created and used to build a new unique matter.js body. The cropped face image is positioned on top of its matter.js clone (like a texture) and added to the "world". The result is a face falling from the top of the screen, landing on the ground at the bottom of the canvas.

![Face on ground](public/assets/images/documentation/2.jpg)

These were the first big steps I needed to take in order to jumpstart the project. I will now list things I need to implement in order to reach the second phase, before I can start to experiment in a physical space (because this is an installation and it's essential to also prototype in tangible ways). 

1. Have a second canvas where the face are actually added that will be displayed as a projection.
2. Implement Node.js to easily save the image snapshots on a server, as well as the position and the shape of each face. This will allow for the installation to save in specific states, to ensure it can reboot from its previous state if it stops running. The canvas can then accumulate faces from different sessions is there is desire to do so. 

### March 27nd 2023 

I implemented a database with mongoDB so that all the position, angle, vertices and image path of each face are stored indidividually. I was originally planning on doing this with Json but I was scared it would be too difficult to manage. I now have to figure out how to retrieve the information and run it so that the all the faces reappear at the position they were in last. I also need to figure out something: if I want to save everything again, I want my database to only save the new faces as new entities, and update the position and angle of the previously stored faces. Maybe I could also just delete everything and save it again as a whole... Because some faces are maybe going to dissappear if they fall to the side and are spliced from the array. I'm not even sure if I want to do that. Anyway, I want to learn how to retrieve and save stuff from the database in case I want to do it in different ways. I will start by writing code to get the stored data in the database and running it to recreate at least one face. 

My goal today is to do that and to create another canvas to add the faces on. I will create it on below the canvas with camera feed so we can see both. 

I'm starting a list of details I want to add that I might forget along the way:

1. Use higher confidence level to detect only faces 
2. Create a seperate file for my database password and stuff... haha