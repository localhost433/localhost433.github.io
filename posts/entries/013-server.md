---
title: Server Dev
date: 2025-07-17
tags: [cs]
author: R
location: Futian district, Shenzhen, Guangdong, China
---

# Dev 
What have I learned past two days:
- How to use a remote server for development
- How to set up the environment and dependencies on it, even if it can't access the internet
- How to use SSH and SCP to transfer files
- How to generate a key for SSH, and login in terminal
- How to use a local server port to transfer data
- A bunch of linux commands
- some weird ubuntu stuff
- How to setup VS Code for remote dev using a extension
- ... that VS Code by Microsoft, a bit of a surprise (Not really noting the Logo)

This server is managed by the company, which give me the port and dev access to it. But the hard part is I never learned how to use SSH or doing stuff on a remote server, definitely a new experience or sth that I'd say that I have learned online and through ChatGPT.

basically a command line based system that predates Windows or any graphical operating system, after using it I wouldn't say I suddenly becoming an expert at linux commands but I now certainly do know the basics, because without these commands you can't do anything.

Shout out thanks to my CSCI-UA 101 prof. who taught us some of that and using VIM!

> I realize how similar to kinda cybersecurity/computer network stuff after doing all this, under the surface, they are trying to design a system or exploit a system that operates on the same level.

Just on how dumb I was, I was prompted to change the default login password by the admin after my first successful login to the server, however, I couldn't do it. Why? Because it was asking for `Current password:` right after I login, and without even a tiny bit of effort trying to comprehend it, I enter the new password. Got stuck for 30 minutes just on this, the last time I felt like this was putting a chinese apostrophe (Full width, taking two bytes) writting a homework, the autograder just won't let it pass without any useful output.

> Indeed one of the reason why I hate full width characters (or unicode) appearing out of where I don't expect them.

Also more about the CI/CD pipeline, it's a lot more than what I've thought. The remote server initializes with a Ubuntu system; I can only access local network since any type of VPN might block it off; it can't connect to the internet (basically inaccessible from outside, or when I'm not at my cubicle) because of security concerns.

So, that brings me a severe issue: I don't have anything on the other machine, and there's no way for me to do it through a USB stick (it might be rented and ~1000km away). That makes me have to do it through SCP and via HTTP server, not only the code which I inherit from my predecessor intern who left last month, also the dependencies which I have to fetch all the wheel files individually for the correct version and build. After getting them I just pack (czf) them in a .tar.gz and then unpack (xzf) on the other side.

> The letters are just `tar` verbs and modifiers:
> c := **create** an archive
> x := **extract** an archive
> z := filter through **gzip** (compress or decompress)
> f := use **file** (next arg is the archive’s name)
> **zip** a directory: “create + gzip + file” -> `tar czf archive.tar.gz ...`
> **unzip**: “extract + gzip + file” -> `tar xzf archive.tar.gz`
> I guess the order of flags doesn’t matter at all.