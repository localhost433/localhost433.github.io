---
title: Server Dev
date: 2025-07-15
tags: [cs]
author: R
location: Futian district, Shenzhen, Guangdong, China
---

Over the past two days, I’ve configured a company-managed Ubuntu server (no Internet) for development. This involved:

- Copying Python wheels over SCP and serving them via a temporary HTTP mirror  
- Setting up SSH access on a custom port  
- Configuring VS Code Remote Development  
- ... that VS Code is developed by Microsoft, bit of a surprise (Not really noting the Logo)

This server is managed by the company, which gave me the port and dev access to it. But the hard part is I never learned how to use it—definitely a new experience and something I'd say I learned online and through AI.

It's basically a command-line-based system that predates Windows or any graphical operating system. After using it I wouldn't say I suddenly became an expert at Linux commands, but I certainly do know the basics now, because without these commands you can't do anything.

Shoutout to my CSCI-UA 101 prof who taught us some of that and using VIM!

> I realize how similar this is to cybersecurity/computer network stuff after doing all this; under the surface, they are trying to design or exploit systems that operate on the same level.

I still laugh at this: after my first successful login, the system prompted me to change the default password. When it asked for `Current password:`, I confidently typed the new one instead—and spent 30 minutes wondering why it kept failing. It reminded me of the time I submitted homework with a full‑width Chinese apostrophe (two bytes): the autograder kept rejecting it with no helpful feedback.

> Indeed one of the reasons why I hate full-width characters (or Unicode) appearing where I don't expect them.

Also, more about the CI/CD pipeline: it's a lot more than I thought. The remote server initializes with an Ubuntu system; I can only access the local network since any type of VPN might block it off; it can't connect to the internet (basically inaccessible from outside, or when I'm not at my cubicle) because of security concerns.

So, that brings me a severe issue: I don't have anything on the other machine, and there's no way for me to do it through a USB stick (it might be rented and ~1000 km away). That means I have to do it through SCP and via an HTTP server—not only the code which I inherited from my predecessor intern who left last month, but also the dependencies, for which I had to fetch all the wheel files individually for the correct version and build. After getting them I just pack (czf) them in a .tar.gz and then unpack (xzf) on the other side.

> The letters are just `tar` verbs and modifiers:
> c := **create** an archive
> x := **extract** an archive
> z := filter through **gzip** (compress or decompress)
> f := use **file** (next arg is the archive’s name)
> **zip** a directory: “create + gzip + file” -> `tar czf archive.tar.gz ...`
> **unzip**: “extract + gzip + file” -> `tar xzf archive.tar.gz`
> I guess the order of flags doesn’t matter at all.