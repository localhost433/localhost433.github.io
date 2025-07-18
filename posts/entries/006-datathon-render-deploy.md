---
title: Datathon + Render deployment
date: 2025-06-01
tags: [cs, life]
author: R
location: Alumni Hall, New York, NY
---
## Datathon
After I got the news from a friend, I felt it was an unbelievable thing to hear. It really did surprise me that we stood out among all the teams that participated. When I joined the team, I was hoping we could gain a more experienced member, but everyone I asked had other stuff to do, so we headed straight there that Friday.

On the technical side, there were many more features I wanted to implement, and I didn't successfully deploy it on Render at that time. The static page worked well, but as I was running out of time, I just wrote instructions to let people deploy it locally so I could head over to the jazz club on time.

## Render
Speaking from a few weeks later, debugging it for the Render deployment is still painful; it spends 20 minutes every time just to build and get it running live. (These little 🎉 emojis in the service log are one of the only reasons I keep doing this.)

Sometimes:
- It couldn't even make it there.

Other times:
- It ran out of memory (free tier...).
- It returned a 404 for a file that was supposed to be there.

Eventually, I downgraded so much by sacrificing many features, to make it use less memory/storage in general, and perhaps rebuilding the index every time I deployed it again,
still,
502.

I just have to keep trying. The thing is, once I change something and it doesn't work, I try to find the problem. But when this happens too many times, I fear I'll never get it to work, and I might just roll back to the previous version. Finally, making it run (and then dealing with the next problem) gives me some satisfaction overall.