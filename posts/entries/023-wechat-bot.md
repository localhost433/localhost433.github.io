---
title: Scheduling a WeChat message (Or, why I ended up hitting send)
date: 2025-11-25
tags: [life, cs]
author: R
location: Manhattan, NYC
---

This all started with a very ordinary situation.

I was going through my WeChat chats tonight and realized I'd never replied to someone I met at a networking event. I told myself I'd follow up "later." Later became "oops, it's already late (at night) and I still haven't replied."

Now, I had a different problem:

- If I reply **right now**, it's kind of a weird timing - like sending email to someone after work hours.
- If I wait until **tomorrow morning**, that feels like a nicer follow-up window: awake, thoughtful, polite, etc. Same reason someone would schedule an email to go out at 9am.

So an obvious question pops into my head:

> Could I just schedule a message for tomorrow morning???

You can probably guess how this ends.

---

## The initial idea: treat WeChat like email

Email clients have had "Send later" since forever. You write the thing, pick a time, and forget about it. The client on the server does the boring waiting part.

I wanted exactly that but for WeChat:

1. Draft the message at night.
2. Choose a time like 9:15am tomorrow.
3. Forget about it.

Except WeChat doesn't do that. There's no such button, no built-in delay feature. (WeCom does have that API but it's more of a workspace app.) If I want the effect of a scheduled message, there are two realistic options:

- Remember to open the chat myself and hit send at 9:15am, or  
- Use some external thing as a reminder (Reminders app, calendar, etc.)

At this point, a normal person would just move on. Apparently I'm not so normal, too autistic I guess.

---

## "Why can't I just write a program?"

My brain starts to produce these incredibly annoying thoughts like:

> Surely I can write a (couple) script(s) to do all this.

The idea I had in mind:

- Use my Mac, with the WeChat desktop client open.
- Use Python plus something like `pyautogui` to:
  - Select the right chat,
  - Paste the message into input box,
  - Hit Enter at exactly the time I want.
- Use **cron** so the script runs at the right moment without me sitting there.

On paper, this is totally doable:

1. Cron wakes up at 9:15am and runs `python3 send_wechat.py ...`.
2. The script:
   - `open -a WeChat`
   - Presses the right button to search.
   - Type name, press Enter.
   - Paste message.
   - Presses Enter.
3. Script ends, cron goes back to sleep, life goes on.

Unfortunately, reality is never that simple.

---

## Sleep, brittleness

The first obvious problem is sleep. If I close my MacBook, the machine sleeps -> `cron` doesn't run -> nothing happens. So for this to work, I'd have to:

1. Keep the Mac awake and logged in at the scheduled time.
2. Either leave the lid open, or use some setup with power + external display.
3. Possibly run `caffeinate` so macOS doesn't decide to nap anyway.

Then there's the brittleness. If some random notification pops-up, the script happily types my heartfelt networking follow-up into the wrong window. Pixel-based click logic goes off with UI change.

---

## WeChat bots

I searched GitHub and, unsurprisingly, there are already **a bunch of WeChat bots** people have written over the years, in multiple languages. Some highlights:

- Bots that use desktop automation (similar in spirit to my idea).
- Frameworks using reverse-engineered protocols:
  - Fake a Web / iPad / Mac client.
  - Do QR-code login
  - Maintain sessions
  - Send and receive messages, handle reconnections, etc.

---

## The architecture pattern: a typical WeChat bot

Same big pieces appear over and over. Roughly:

### 1. Transport / protocol

This "talks" to WeChat; manages the connection to WeChat's servers (HTTP, WebSocket, or some custom thing); Handles heartbeats, reconnects when needed; Knows how to send/parse the raw frames/XML/JSON used internally.

For personal-account bots, this is all unofficial and reverse-engineered.It's like "we stared at traffic long enough to figure out the pattern."

### 2. Login & session management

Most personal WeChat bots use QR code to login, The process goes like:

1. The bot asks WeChat for a QR code.
2. Scan it with phone
3. WeChat allowed this weird client to act as you
4. The bot gets session tokens/cookies.
5. The bot saves these tokens somewhere (file, DB) for reconnecting until expiration.

Official-accounts / enterprise stuff looks different (app IDs, secrets, access tokens), but the idea of some token layer is the same.

### 3. Data models: `Message`, `Contact`, `Room`

`Message` is with, `from`, `to`, (and optional `room`), type (text, image, etc.), convenience methods like `.text` and `.say(...)`. There's also `Contact` / `ContactSelf` for people (including the bot), `Room` for group chats, with methods to send messages to the whole group.

These code never needs to deal with low-level protocol junk directly; it just works with these objects.

### 4. Event Core

At the center is an event loop that listens for new messages(events) from the transport. For each one, it constructs a `Message` / `Room` / `Contact` object. It emits events like `on_message(message)`, `on_room_join(...)`, `on_friendship(...)`, `on_login(...)`.

### 5. Handlers

On top of all that it comes actual "behaviors" which I'm too lazy to list out fully. In the "nice" repos these show up as plugins:

```text
handlers/
    echo.py
    auto_reply.py
    welcome_new_member.py
    send_daily_summary.py
```

If I did wrote a scheduled follow-up bot, this is probably where the logic would go.

### 6. Important stuff

Usually, config files (for tokens, IDs, etc.), database or key-value store to remember state, some kind of scheduler...(internal ones like APScheduler, external (cron + HTTP callbacks), sth. part of a bigger task system (Celery, etc.))

That original "schedule one message" look tiny compared to this large pile.

---

## So what was the point of all this?

All of that just so I can avoid sending a message at 10pm and instead have it go out at 9:15am. At some point, after thinking through all that, I had the correct realization:

> If I'm willing to invest this much effort, I could have just... sent the message.

So I replied right away. It felt slightly suboptimal, but infinitely better than actually starting this mini-bot project. For things like this, a reminder app + manual send is good enough. As an afterthought, a public API for "`send_message`" would be a spammer's dream, ngl. Social media messaging apps are designed this way for a reason.

If I name one biggest takeaway, it's not the technical stuff:

> **Overengineering is a very specific kind of temptation**  
> 
> Once you know you *could* automate something, it's weirdly hard to accept you should move on. But sometimes that's just better.
