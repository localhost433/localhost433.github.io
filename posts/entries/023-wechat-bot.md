---
title: Trying to schedule a WeChat message
date: 2025-11-25
tags: [life, cs]
author: R
location: Manhattan, NYC
---

Tonight I noticed that I had never replied to someone I met at a networking event. It was already late, and sending the message the next morning seemed slightly more appropriate. Email has “send later,” so I wondered whether WeChat had an equivalent.

It turns out it doesn't have one. WeCom has APIs for workplace use, but ordinary WeChat accounts do not have a built-in scheduling feature. The practical options are to set a reminder or to automate the desktop client.

## The desktop-automation version

The simplest program would use the WeChat Mac app and a tool such as `pyautogui`:

1. Open WeChat.
2. Search for the contact.
3. Paste the drafted message.
4. Press Enter.

`cron` could start the script at 9:15 the next morning. That sounds easy until the assumptions are written down. The Mac has to be awake, logged in, and running WeChat. The correct window must have focus. A notification or interface change can redirect the keystrokes. A script based on screen coordinates could easily paste the message into the wrong place.

For one follow-up, keeping a laptop awake overnight and trusting simulated clicks is not a good trade.

## The bot version

I also looked through existing WeChat bot projects. Some automate the desktop client; others imitate a web, iPad, or Mac client through reverse-engineered protocols. The latter are much closer to complete messaging systems than to small scheduling scripts.

Most of them contain the same layers:

### Transport

The transport maintains the connection, handles heartbeats and reconnections, and converts WeChat's internal messages into data the rest of the program can use. For personal accounts this is unofficial and may stop working when WeChat changes its protocol.

### Login and sessions

A typical bot requests a QR code, waits for the user to scan it, and stores the resulting session tokens until they expire. Official accounts and WeCom use different credentials, but they still need a layer that manages authentication and token renewal.

### Messages and contacts

Higher-level code works with objects such as `Message`, `Contact`, and `Room` instead of raw protocol frames. A message records its sender, recipient, room, and content type; those objects usually provide methods for replying or sending a new message.

### Events and handlers

An event loop receives data from the transport and emits events such as `on_message`, `on_login`, or `on_room_join`. Plugins or handlers implement the actual behavior:

```text
handlers/
    echo.py
    auto_reply.py
    welcome_new_member.py
    send_daily_summary.py
```

A scheduled-message feature would sit on top of this, along with configuration, persistent state, and a scheduler such as APScheduler, cron, or Celery.

That is reasonable architecture for a bot that continuously receives and sends messages. It is a lot of machinery for sending one follow-up nine hours later. It also comes with reliability and account-risk questions that a reminder does not have.

## What I did instead

I sent the message that night. The timing was not ideal, but it was less awkward than leaving the message unanswered while building an unreliable bot. If the timing had mattered more, a morning reminder and a manual send would have been enough.

The useful part of the detour was seeing where a tiny automation request stops being tiny. Scheduling one message sounds like a timer problem; on a closed messaging platform, it quickly becomes a problem involving authentication, sessions, protocol maintenance, and account policy. Sometimes that investigation is worthwhile. This time it answered the question before I wrote any code.
