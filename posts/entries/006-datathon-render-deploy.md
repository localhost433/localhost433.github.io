---
title: Datathon + Render deployment
date: 2025-06-01
tags: [cs, life]
author: R
location: Alumni Hall, New York, NY
---
## Datathon

After I got the news from a friend, I felt it was unbelievable. It really did surprise me that we stood out among all the teams that participated. When I joined the team, I was hoping we could gain a more experienced member, but everyone I asked had other stuff to do, so we headed straight there that Friday.

On the technical side, there were many more features I wanted to implement, and I didn't successfully deploy it on Render at that time. The static page worked well, but as I was running out of time, I just wrote instructions so people could deploy it locally and I could head over to the jazz club on time.

## Render

Speaking a few weeks later, debugging it for the Render deployment is still painful; Every deploy took ~20 minutes just to decide whether it would crash spectacularly or reward me with a tiny 🎉. Sometimes it didn't even build. Other times it ran out of memory, or returned a 404 for a file I could swear was right there.

Eventually, I cut features, trimmed indexes, and tightened memory, then still hit a 502. The whiplash between "I think I fixed it" and "it fell over again" is real. But the weird thing is: shipping anything, even a small update, carries just enough dopamine to keep going.

 Finally getting it to run (and then dealing with the next problem) gives me some satisfaction overall.

I'll keep iterating. The balloons are ridiculous. I'm not done with them yet.
