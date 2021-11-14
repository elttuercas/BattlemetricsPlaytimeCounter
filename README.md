# BM-

This extension is my personal take on the BM+ extension as requested by a friend. Since it does remove some features as
it does not use the RCON page, I have decided to call it BM-. There is some data which can be viewed without having
access to the RCON page, and it's this extension's purpose to display it in the standard player information page.

#### BM- Additions:

+ Rust BM playtime - view total playtime by this user on Rust servers that Battlemetrics has access to.
+ Aim train playtime - view total playtime by this user on Rust servers that Battlemetrics has access to and have
  either "ukn" or "aim" in their name.
+ Rust servers played - view total servers joined by this user on Rust servers that Battlemetrics has access to.

Please note that these numbers may be inaccurate. This only tracks the servers that Battlemetrics has access to. All the
hours equal to the sum of the hours that the user has played on Rust on their "public profile" button on the top right
of the RCON profile. Rust BM playtime may significantly differ from actual playtime on the Steam webpage, but it still
is a good estimate of how many hours played are real.

[![](https://i.imgur.com/nwOzJ0A.png)]()

You are free to use and modify this code. If you like you can also submit a pull request, and I'll most likely accept
it. The code might not be the best thing and uses a bunch of hacky things to inject onto the page but it hey, at least
it works :P
