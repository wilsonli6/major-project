# Major Project Reflection
In this project, I tried to make something similar to 'head soccer' using stick figures. There were many challenges that I encountered and I'll mention what they were and how I attempted to fix them.

## Problems
- Net Boundaries: The ball would go through the net ocassionally, whenever it was supposed to hit the crossbar.
- Kicking Issues: The players would stay in kicking position after pressing the spacebar/the zero key next to the arrows.
- Placement Issues: A lot of my images and texts were not in the place that I thought I designated them to be. This is because many things require different image modes.



## Solutions
- I fixed the net boundary by setting the crossbar just a tad higher, so that it would not interact with the area that was set as the goal. That way, my program wouldn't be confused to whether the ball was in the goal area or hit the crossbar.
- The kicking issues were simply fixed by the setTimeout() function. That way, I was able to set the character back to its normal position, whilst also making it so that the key could not be spammed.
- I was able to fix many of my issues by changing image modes and also pushing and popping to set the mode back to the original. This way, I was able to put every image and text where I needed them, as well as rotate the soccer ball whenever it was kicked, without rotating the entire coordinate plane.