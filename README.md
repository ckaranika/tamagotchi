# Animals Sample App 🐩

> _What could be more fun than having a pet? Making your own!_

## What Is This?

I had so much fun making this. It started simple, like you know, just follow the brief to get it done, but then I got this feeling. Like, wait a second... this is a Tamagotchi! So it has to be like a real one! And I remembered mine. It was small, no internet, no pictures, no fancy tricks. It beeped (once during my maths class, great disaster...), it got hungry, sometimes it died. But I loved it.

So I built it like that. No uploads, no routing, just one screen, one pet at a time. You feed it, play with it, let it rest. That's all. And I find that's what makes a Tamagotchi so nice.

Then my kids saw it. "Mum, what's this turtle?" So now I'm building, testing, tweaking, thinking all the fun they'll have once I'm done. I made sure the stats change over time, made them red when the pet's too hungry or sleepy. I tested every single thing. Every little one. Then added a bit more, I couldn't stop. Yes, I got carried away, mayyyybe I went a bit too far... Maybe. But I was having too much fun and I'm sure tomorrow my kids will have too.

So yes, it's simple. On purpose. It's meant to feel like those olden times toys: small, sweet, and kind of funny. But also, it works. It's neat. It's tested. It makes me smile. Hope it makes you smile too.

## Getting Started

1. Clone the project
2. Run `bun install`
3. Run `bun dev` (or `bun build` if you want to build it)

and you can also test it:

4. with `bun run test`
5. or with `bun run test:coverage`

## The Brief (in case you forgot)

- Users should be able to name animals
- Users should be able to have multiple animals of different types
- Playing with animals makes them happy
- Feeding animals makes them less hungry
- Resting animals makes them less sleepy
- Animals start "neutral" on all metrics
- Happiness should decrease over time
- Hunger should increase over time
- Sleepiness should increase over time
- Happiness should decrease faster when sleep or hunger is full
- Each animal type should have metrics which increase/decrease at different rates

## Judging Criteria

- All points in the brief have been followed and work as described
- The main functionality and business logic should be tested. Each bullet point in the brief should be tested explicitly
- Use of 3rd party libraries is permitted but should be kept to a minimum - we would like to see what you are capable of!
- We also look at project structure, code clarity, type quality, use of bad practices and bugs.
- Solutions forking or PRing back to the main repo will be disqualified - please upload to a new repo

## Extras (in case I forget)
- Tiny one-page app with no navigation or image uploads, can easily be extended (don't do it, it's a Tamagotchi!)
- Lightweight and minimal (no UI frameworks, no CSS frameworks, etc)
- Extensively tested, including edge cases like an empty animal list or modal reset
- Animal types usually display an emoji, but can also display a custom svg image
- The animal collection is saved in localStorage
- Animal name is trimmed, validated and limited in length to avoid nonsense
- Autofocus on name input, disabled button hover cursor and perfectly aligned layout
- UI turns red when animals are starving or exhausted or sad (just like a real Tamagotchi)

---

Have Fun 🚀
