"use client";

import { useEffect, useMemo, useState } from "react";

const games = [
  {
    "id": "pacman",
    "name": "Pac-Man",
    "category": "Arcade",
    "description": "Clear the maze, collect dots, and avoid the ghosts.",
    "playUrl": "/games/pacman/index.html",
  },
  {
    "id": "2048",
    "name": "2048",
    "category": "Puzzle",
    "description": "Merge number tiles to reach 2048.",
    "playUrl": "/games/2048/index.html",
  },
  {
    "id": "air-hockey",
    "name": "Air Hockey",
    "category": "Sports",
    "description": "Play a quick air-hockey match against the computer.",
    "playUrl": "/games/air-hockey/index.html",
  },
  {
    "id": "ant-flap",
    "name": "Ant Flap",
    "category": "Arcade",
    "description": "Keep the ant flying through the gaps.",
    "playUrl": "/games/ant-flap/index.html",
  },
  {
    "id": "ant-jump",
    "name": "Ant Jump",
    "category": "Arcade",
    "description": "Jump across obstacles and keep moving.",
    "playUrl": "/games/ant-jump/index.html",
  },
  {
    "id": "battleship",
    "name": "Battleship",
    "category": "Board",
    "description": "Place your fleet and try to find the opponent's ships.",
    "playUrl": "/games/battleship/index.html",
  },
  {
    "id": "block-drop",
    "name": "Block Drop",
    "category": "Puzzle",
    "description": "Fit falling blocks together and clear lines.",
    "playUrl": "/games/block-drop/index.html",
  },
  {
    "id": "breakout",
    "name": "Breakout",
    "category": "Arcade",
    "description": "Bounce the ball and clear the bricks.",
    "playUrl": "/games/breakout/index.html",
  },
  {
    "id": "bubble-shooter",
    "name": "Bubble Shooter",
    "category": "Puzzle",
    "description": "Match bubbles to clear the board.",
    "playUrl": "/games/bubble-shooter/index.html",
  },
  {
    "id": "connect-four",
    "name": "Connect Four",
    "category": "Board",
    "description": "Connect four discs before your opponent.",
    "playUrl": "/games/connect-four/index.html",
  },
  {
    "id": "cross-road",
    "name": "Cross Road",
    "category": "Arcade",
    "description": "Navigate across busy lanes without getting hit.",
    "playUrl": "/games/cross-road/index.html",
  },
  {
    "id": "dino-run",
    "name": "Dino Run",
    "category": "Arcade",
    "description": "Jump over obstacles and survive as long as possible.",
    "playUrl": "/games/dino-run/index.html",
  },
  {
    "id": "fruit-slice",
    "name": "Fruit Slice",
    "category": "Arcade",
    "description": "Slice the flying fruit and avoid mistakes.",
    "playUrl": "/games/fruit-slice/index.html",
  },
  {
    "id": "gem-match",
    "name": "Gem Match",
    "category": "Puzzle",
    "description": "Match gems to make combos and clear the board.",
    "playUrl": "/games/gem-match/index.html",
  },
  {
    "id": "helix-drop",
    "name": "Helix Drop",
    "category": "Arcade",
    "description": "Guide the ball down through the rotating tower.",
    "playUrl": "/games/helix-drop/index.html",
  },
  {
    "id": "lights-out",
    "name": "Lights Out",
    "category": "Puzzle",
    "description": "Turn off every light by solving the tile puzzle.",
    "playUrl": "/games/lights-out/index.html",
  },
  {
    "id": "maze-muncher",
    "name": "Maze Muncher",
    "category": "Arcade",
    "description": "Find your way through the maze and collect items.",
    "playUrl": "/games/maze-muncher/index.html",
  },
  {
    "id": "memory-match",
    "name": "Memory Match",
    "category": "Puzzle",
    "description": "Flip cards and find matching pairs.",
    "playUrl": "/games/memory-match/index.html",
  },
  {
    "id": "merge-drop",
    "name": "Merge Drop",
    "category": "Puzzle",
    "description": "Drop and combine matching pieces to build bigger values.",
    "playUrl": "/games/merge-drop/index.html",
  },
  {
    "id": "minesweeper",
    "name": "Minesweeper",
    "category": "Puzzle",
    "description": "Clear the grid using clues to avoid hidden mines.",
    "playUrl": "/games/minesweeper/index.html",
  },
  {
    "id": "paddle-duel",
    "name": "Paddle Duel",
    "category": "Arcade",
    "description": "Keep the ball in play and outscore the other paddle.",
    "playUrl": "/games/paddle-duel/index.html",
  },
  {
    "id": "piano-tap",
    "name": "Piano Tap",
    "category": "Casual",
    "description": "Tap the notes in time and keep your streak going.",
    "playUrl": "/games/piano-tap/index.html",
  },
  {
    "id": "reversi",
    "name": "Reversi",
    "category": "Board",
    "description": "Flip discs and finish with more of your color on the board.",
    "playUrl": "/games/reversi/index.html",
  },
  {
    "id": "slide-puzzle",
    "name": "Slide Puzzle",
    "category": "Puzzle",
    "description": "Slide tiles into the correct order.",
    "playUrl": "/games/slide-puzzle/index.html",
  },
  {
    "id": "snake",
    "name": "Snake",
    "category": "Classic",
    "description": "Eat the dots, grow longer, and avoid crashing.",
    "playUrl": "/games/snake/index.html",
  },
  {
    "id": "sokoban",
    "name": "Sokoban",
    "category": "Puzzle",
    "description": "Push crates onto the target spaces.",
    "playUrl": "/games/sokoban/index.html",
  },
  {
    "id": "stack-tower",
    "name": "Stack Tower",
    "category": "Arcade",
    "description": "Stack moving platforms as high as you can.",
    "playUrl": "/games/stack-tower/index.html",
  },
  {
    "id": "star-defender",
    "name": "Star Defender",
    "category": "Arcade",
    "description": "Defend against waves of incoming space enemies.",
    "playUrl": "/games/star-defender/index.html",
  },
  {
    "id": "sudoku",
    "name": "Sudoku",
    "category": "Puzzle",
    "description": "Fill the grid with numbers using logic.",
    "playUrl": "/games/sudoku/index.html",
  },
  {
    "id": "tic-tac-toe",
    "name": "Tic-Tac-Toe",
    "category": "Board",
    "description": "Get three marks in a row to win.",
    "playUrl": "/games/tic-tac-toe/index.html",
  },
  {
    "id": "water-sort",
    "name": "Water Sort",
    "category": "Puzzle",
    "description": "Sort the colored liquid into matching tubes.",
    "playUrl": "/games/water-sort/index.html",
  },
  {
    "id": "whack-a-mole",
    "name": "Whack-a-Mole",
    "category": "Arcade",
    "description": "Hit the targets before time runs out.",
    "playUrl": "/games/whack-a-mole/index.html",
  },
  {
    id: "cookie-clicker",
    name: "Cookie Clicker",
    category: "Clicker",
    description: "Click cookies, buy upgrades, and build your cookie empire. Original open-source project hosted locally for reliable play.",
    playUrl: "/games/cookie-clicker/index.html",
    sourceUrl: "https://github.com/OjiTheChamp/cookie-clicker"
  },
  {
    id: "click-circle",
    name: "Click Circle",
    category: "Clicker",
    description: "A fast reaction clicking game: pick a difficulty, click targets before they disappear, and beat your high score.",
    playUrl: "/games/click-circle/index.html",
    sourceUrl: "https://github.com/aryankakk/Clicker-game"
  },
  {
    id: "hextris-open",
    name: "Hextris",
    category: "Puzzle",
    description: "Stack falling blocks around a rotating hexagon.",
    playUrl: "https://linkingtechnologies.github.io/libre-arcade/hextris/public/index.html",
    sourceUrl: "https://github.com/linkingtechnologies/libre-arcade/tree/main/hextris"
  },
  {
    id: "open-breakout",
    name: "HTML5 Breakout",
    category: "Arcade",
    description: "Break every brick with a bouncing ball.",
    playUrl: "/games/classic-breakout/index.html",
    sourceUrl: "https://github.com/linkingtechnologies/libre-arcade/tree/main/html5-breakout"
  },
  {
    id: "open-snake",
    name: "Classic Snake",
    category: "Classic",
    description: "Grow longer while avoiding your own tail.",
    playUrl: "/games/classic-snake/index.html",
    sourceUrl: "https://github.com/linkingtechnologies/libre-arcade/tree/main/html5-snake"
  },
  {
    id: "relaxed-snake",
    name: "Relaxed Snake",
    category: "Classic",
    description: "A snake game with wraparound edges.",
    playUrl: "https://linkingtechnologies.github.io/libre-arcade/react-simple-snake/public/index.html",
    sourceUrl: "https://github.com/linkingtechnologies/libre-arcade/tree/main/react-simple-snake"
  },
  {
    id: "space-invaders-open",
    name: "HTML5 Space Invaders",
    category: "Arcade",
    description: "Defend the planet from incoming alien waves.",
    playUrl: "https://linkingtechnologies.github.io/libre-arcade/html5-space-invaders/public/index.html",
    sourceUrl: "https://github.com/linkingtechnologies/libre-arcade/tree/main/html5-space-invaders"
  },
  {
    id: "netris",
    name: "Netris",
    category: "Puzzle",
    description: "A classic falling-block puzzle game.",
    playUrl: "https://linkingtechnologies.github.io/libre-arcade/netris/public/index.html",
    sourceUrl: "https://github.com/linkingtechnologies/libre-arcade/tree/main/netris"
  },
  {
    id: "netrok",
    name: "Netrok",
    category: "Arcade",
    description: "An arcade brick-breaking game with multiple levels.",
    playUrl: "https://linkingtechnologies.github.io/libre-arcade/netrok/public/index.html",
    sourceUrl: "https://github.com/linkingtechnologies/libre-arcade/tree/main/netrok"
  },
  {
    id: "njam",
    name: "Njam",
    category: "Arcade",
    description: "Navigate mazes, collect dots, and dodge enemies.",
    playUrl: "https://linkingtechnologies.github.io/libre-arcade/njam/public/index.html",
    sourceUrl: "https://github.com/linkingtechnologies/libre-arcade/tree/main/njam"
  },
  {
    id: "naval-battle-open",
    name: "Naval Battle",
    category: "Board",
    description: "Place ships and outsmart the computer fleet.",
    playUrl: "https://linkingtechnologies.github.io/libre-arcade/naval-battle/public/index.html",
    sourceUrl: "https://github.com/linkingtechnologies/libre-arcade/tree/main/naval-battle"
  },
  {
    id: "klondike",
    name: "Klondike Solitaire",
    category: "Board",
    description: "Sort the deck into four completed suits.",
    playUrl: "https://linkingtechnologies.github.io/libre-arcade/klondike/public/index.html",
    sourceUrl: "https://github.com/linkingtechnologies/libre-arcade/tree/main/klondike"
  },
  {
    id: "briscola",
    name: "Briscola",
    category: "Board",
    description: "A traditional trick-taking card game.",
    playUrl: "https://linkingtechnologies.github.io/libre-arcade/briscola/public/index.html",
    sourceUrl: "https://github.com/linkingtechnologies/libre-arcade/tree/main/briscola"
  },
  {
    id: "for-science",
    name: "For Science!",
    category: "Puzzle",
    description: "A tactical match-three duel against an opponent.",
    playUrl: "https://linkingtechnologies.github.io/libre-arcade/for-science/public/index.html",
    sourceUrl: "https://github.com/linkingtechnologies/libre-arcade/tree/main/for-science"
  },
  {
    id: "donkey-bolonkey",
    name: "Donkey Bolonkey",
    category: "Puzzle",
    description: "Pop and match colored bubbles across the levels.",
    playUrl: "https://linkingtechnologies.github.io/libre-arcade/donkey-bolonkey/public/index.html",
    sourceUrl: "https://github.com/linkingtechnologies/libre-arcade/tree/main/donkey-bolonkey"
  },
  {
    id: "psypong3d",
    name: "Psy Pong 3D",
    category: "Sports",
    description: "A fast 3D pong game with unusual physics.",
    playUrl: "https://linkingtechnologies.github.io/libre-arcade/psypong3d/public/index.html",
    sourceUrl: "https://github.com/linkingtechnologies/libre-arcade/tree/main/psypong3d"
  },
  {
    id: "wok-open",
    name: "Wok",
    category: "Arcade",
    description: "Catch falling balls and build combo scores.",
    playUrl: "https://linkingtechnologies.github.io/libre-arcade/wok/public/index.html",
    sourceUrl: "https://github.com/linkingtechnologies/libre-arcade/tree/main/wok"
  },
  {
    id: "yanoid",
    name: "Yanoid",
    category: "Arcade",
    description: "A brick-breaker with a sequence of challenging maps.",
    playUrl: "https://linkingtechnologies.github.io/libre-arcade/yanoid/public/index.html",
    sourceUrl: "https://github.com/linkingtechnologies/libre-arcade/tree/main/yanoid"
  },
  {
    id: "terramancers",
    name: "Terramancers",
    category: "Strategy",
    description: "Capture tiles in a turn-based Reversi-style strategy game.",
    playUrl: "https://linkingtechnologies.github.io/libre-arcade/terramancers/public/index.html",
    sourceUrl: "https://github.com/linkingtechnologies/libre-arcade/tree/main/terramancers"
  },
  {
    id: "don-ceferino",
    name: "Don Ceferino",
    category: "Arcade",
    description: "Pop bouncing targets through a set of levels.",
    playUrl: "https://linkingtechnologies.github.io/libre-arcade/don-ceferino/public/index.html",
    sourceUrl: "https://github.com/linkingtechnologies/libre-arcade/tree/main/don-ceferino"
  },
  {
    id: "glparchis",
    name: "glParchis",
    category: "Board",
    description: "Race your pieces around a classic board.",
    playUrl: "https://linkingtechnologies.github.io/libre-arcade/glparchis/public/index.html",
    sourceUrl: "https://github.com/linkingtechnologies/libre-arcade/tree/main/glparchis"
  },
  {
    id: "game-of-goose",
    name: "Game of the Goose",
    category: "Board",
    description: "A local multiplayer race around a winding board.",
    playUrl: "https://linkingtechnologies.github.io/libre-arcade/game-of-the-goose/public/index.html",
    sourceUrl: "https://github.com/linkingtechnologies/libre-arcade/tree/main/game-of-the-goose"
  },
  {
    id: "bubble-train",
    name: "Bubble Train",
    category: "Puzzle",
    description: "Match and clear colored bubbles through many levels.",
    playUrl: "https://linkingtechnologies.github.io/libre-arcade/bubble-train/public/index.html",
    sourceUrl: "https://github.com/linkingtechnologies/libre-arcade/tree/main/bubble-train"
  },
  {
    id: "nova-pinball",
    name: "Nova Pinball",
    category: "Arcade",
    description: "Keep the ball alive across a sci-fi pinball table.",
    playUrl: "https://linkingtechnologies.github.io/libre-arcade/nova-pinball/public/index.html",
    sourceUrl: "https://github.com/linkingtechnologies/libre-arcade/tree/main/nova-pinball"
  },
  {
    id: "mechanical-night-pinball",
    name: "Mechanical Night Pinball",
    category: "Arcade",
    description: "A physics-based pinball table with multiple objectives.",
    playUrl: "https://linkingtechnologies.github.io/libre-arcade/mechanical-night-pinball/public/index.html",
    sourceUrl: "https://github.com/linkingtechnologies/libre-arcade/tree/main/mechanical-night-pinball"
  },
  {
    id: "comet-pinball",
    name: "Comet Pinball",
    category: "Arcade",
    description: "Keep the ball in play and chase a high score.",
    playUrl: "https://linkingtechnologies.github.io/libre-arcade/comet-pinball/public/index.html",
    sourceUrl: "https://github.com/linkingtechnologies/libre-arcade/tree/main/comet-pinball"
  },
  {
    id: "disk-field",
    name: "Disk Field",
    category: "Puzzle",
    description: "Rotate a vector field to guide a disk to its goal.",
    playUrl: "https://linkingtechnologies.github.io/libre-arcade/disk-field/public/index.html",
    sourceUrl: "https://github.com/linkingtechnologies/libre-arcade/tree/main/disk-field"
  },
  {
    id: "highmoon",
    name: "HighMoon",
    category: "Arcade",
    description: "A space-artillery duel against a friend or the computer.",
    playUrl: "https://linkingtechnologies.github.io/libre-arcade/highmoon/public/index.html",
    sourceUrl: "https://github.com/linkingtechnologies/libre-arcade/tree/main/highmoon"
  },
  {
    id: "asteroids-infinity",
    name: "Asteroids Infinity",
    category: "Arcade",
    description: "Fly through an asteroid field in a classic arcade shooter.",
    playUrl: "https://linkingtechnologies.github.io/libre-arcade/asteroids-infinity/public/index.html",
    sourceUrl: "https://github.com/linkingtechnologies/libre-arcade/tree/main/asteroids-infinity"
  },
  {
    id: "the-lost-path",
    name: "The Lost Path",
    category: "Puzzle",
    description: "Solve a maze before the countdown runs out.",
    playUrl: "https://linkingtechnologies.github.io/libre-arcade/the-lost-path/public/index.html",
    sourceUrl: "https://github.com/linkingtechnologies/libre-arcade/tree/main/the-lost-path"
  },
  {
    id: "54321",
    name: "54321 Puzzle Collection",
    category: "Puzzle",
    description: "Five unusual puzzle games built around different dimensions.",
    playUrl: "https://linkingtechnologies.github.io/libre-arcade/54321/public/index.html",
    sourceUrl: "https://github.com/linkingtechnologies/libre-arcade/tree/main/54321"
  },
  {
    id: "grugnetto-go",
    name: "Grugnetto Go!",
    category: "Arcade",
    description: "A small platform game with a classic arcade feel.",
    playUrl: "https://linkingtechnologies.github.io/libre-arcade/grugnetto-go/public/index.html",
    sourceUrl: "https://github.com/linkingtechnologies/libre-arcade/tree/main/grugnetto-go"
  },
  {
    id: "strider-open",
    name: "Strider",
    category: "Arcade",
    description: "Climb through a sci-fi world and dodge enemies.",
    playUrl: "https://linkingtechnologies.github.io/libre-arcade/strider/public/index.html",
    sourceUrl: "https://github.com/linkingtechnologies/libre-arcade/tree/main/strider"
  },
  {
    id: "eaglercraft",
    name: "Eaglercraft",
    category: "Sandbox",
    description: "Minecraft-inspired browser sandbox. Embedded hosting may be limited by the source site.",
    playUrl: "https://eaglercraft.com/",
    sourceUrl: "https://github.com/a50411278apeter40-svg/eaglercraft-x"
  },
  {
    id: "retro-bowl",
    name: "Retro Bowl",
    category: "Sports",
    description: "Retro-style American football.",
    playUrl: "https://retrobowl.me/"
  },
  {
    id: "tiny-fishing",
    name: "Tiny Fishing",
    category: "Casual",
    description: "Cast a line and collect fish as you progress.",
    playUrl: "https://poki.com/en/g/tiny-fishing"
  },
  {
    id: "hill-climb",
    name: "Hill Climb Racing",
    category: "Racing",
    description: "Drive across uneven terrain while managing your fuel.",
    playUrl: "https://poki.com/en/g/hill-climb-racing-lite"
  },
  {
    id: "geoguessr",
    name: "GeoGuessr",
    category: "Geography",
    description: "Explore a location and guess where you are.",
    playUrl: "https://www.geoguessr.com/"
  },
  {
    id: "chess",
    name: "Chess",
    category: "Board",
    description: "Play a classic strategy match.",
    playUrl: "https://www.chess.com/play/computer"
  },
  {
    id: "hill-climb-2",
    name: "Hill Climb Racing 2",
    category: "Racing",
    description: "Race across bumpy tracks and upgrade your vehicle.",
    playUrl: "https://poki.com/en/g/hill-climb-racing-2"
  },
  {
    "id": "opensource-6oct",
    "name": "6 Octagons",
    "category": "Puzzle",
    "description": "Octagon-tile sliding puzzle.",
    "playUrl": "https://sausi-7.github.io/games/games/puzzle/6oct/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/puzzle/6oct"
  },
  {
    "id": "opensource-rock-paper-scissors",
    "name": "Rock Paper Scissors",
    "category": "Board",
    "description": "The timeless hand game vs the AI.",
    "playUrl": "https://sausi-7.github.io/games/games/board/rock-paper-scissors/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/board/rock-paper-scissors"
  },
  {
    "id": "opensource-abhita",
    "name": "Abhita",
    "category": "Arcade",
    "description": "Reflex-driven dodge mini-game.",
    "playUrl": "https://sausi-7.github.io/games/games/arcade/abhita/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/arcade/abhita"
  },
  {
    "id": "opensource-antigravity",
    "name": "Anti-Gravity",
    "category": "Platformer",
    "description": "Flip gravity to navigate hazards.",
    "playUrl": "https://sausi-7.github.io/games/games/platformer/antigravity/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/platformer/antigravity"
  },
  {
    "id": "opensource-archer",
    "name": "Archer",
    "category": "Sports",
    "description": "Aim, draw, and release. Hit your target.",
    "playUrl": "https://sausi-7.github.io/games/games/sports/archer/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/sports/archer"
  },
  {
    "id": "opensource-balance-stack",
    "name": "Balance Stack",
    "category": "Arcade",
    "description": "Stack blocks without toppling the tower.",
    "playUrl": "https://sausi-7.github.io/games/games/arcade/balance-stack/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/arcade/balance-stack"
  },
  {
    "id": "opensource-basketball",
    "name": "Basketball",
    "category": "Sports",
    "description": "Arc the ball through the hoop.",
    "playUrl": "https://sausi-7.github.io/games/games/sports/basketball/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/sports/basketball"
  },
  {
    "id": "opensource-boom-dots",
    "name": "Boom Dots",
    "category": "Arcade",
    "description": "Tap to detonate dots and clear the screen.",
    "playUrl": "https://sausi-7.github.io/games/games/arcade/boom-dots/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/arcade/boom-dots"
  },
  {
    "id": "opensource-bowling",
    "name": "Bowling",
    "category": "Sports",
    "description": "Knock down all the pins.",
    "playUrl": "https://sausi-7.github.io/games/games/sports/bowling/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/sports/bowling"
  },
  {
    "id": "opensource-breakoid",
    "name": "Breakoid",
    "category": "Arcade",
    "description": "Breakout-style brick smashing.",
    "playUrl": "https://sausi-7.github.io/games/games/arcade/breakoid/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/arcade/breakoid"
  },
  {
    "id": "opensource-bubble-pop",
    "name": "Bubble Pop",
    "category": "Casual",
    "description": "Pop matching bubbles to score.",
    "playUrl": "https://sausi-7.github.io/games/games/casual/bubble-pop/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/casual/bubble-pop"
  },
  {
    "id": "opensource-bug-smasher",
    "name": "Bug Smasher",
    "category": "Arcade",
    "description": "Squash bugs before they reach the goal.",
    "playUrl": "https://sausi-7.github.io/games/games/arcade/bug-smasher/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/arcade/bug-smasher"
  },
  {
    "id": "opensource-buttermilk",
    "name": "Buttermilk",
    "category": "Casual",
    "description": "Cute pour-and-mix idle game.",
    "playUrl": "https://sausi-7.github.io/games/games/casual/buttermilk/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/casual/buttermilk"
  },
  {
    "id": "opensource-candy-crush",
    "name": "Candy Crush",
    "category": "Casual",
    "description": "Match-3 candy puzzle.",
    "playUrl": "https://sausi-7.github.io/games/games/casual/candy-crush/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/casual/candy-crush"
  },
  {
    "id": "opensource-candy-crusher",
    "name": "Candy Crusher",
    "category": "Casual",
    "description": "Smash candy patterns for points.",
    "playUrl": "https://sausi-7.github.io/games/games/casual/candy-crusher/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/casual/candy-crusher"
  },
  {
    "id": "opensource-cargo-stack",
    "name": "Cargo Stack",
    "category": "Puzzle",
    "description": "Pack cargo crates without overflow.",
    "playUrl": "https://sausi-7.github.io/games/games/puzzle/cargo-stack/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/puzzle/cargo-stack"
  },
  {
    "id": "opensource-car-race",
    "name": "Car Race",
    "category": "Racing",
    "description": "3D car-racing run with traffic dodging.",
    "playUrl": "https://sausi-7.github.io/games/games/racing/car-race/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/racing/car-race"
  },
  {
    "id": "opensource-carrom",
    "name": "Carrom",
    "category": "Board",
    "description": "Pocket the carrom pieces with skill.",
    "playUrl": "https://sausi-7.github.io/games/games/board/carrom/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/board/carrom"
  },
  {
    "id": "opensource-circle-path",
    "name": "Circle Path",
    "category": "Arcade",
    "description": "Trace the rotating circle without slipping.",
    "playUrl": "https://sausi-7.github.io/games/games/arcade/circle-path/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/arcade/circle-path"
  },
  {
    "id": "opensource-circuit-bulb",
    "name": "Circuit Bulb",
    "category": "Puzzle",
    "description": "Wire circuits to light the bulb.",
    "playUrl": "https://sausi-7.github.io/games/games/puzzle/circuit-bulb/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/puzzle/circuit-bulb"
  },
  {
    "id": "opensource-catch-me-if-you-can",
    "name": "Catch Me If You Can",
    "category": "Arcade",
    "description": "Outrun the chasers in a wide arena.",
    "playUrl": "https://sausi-7.github.io/games/games/arcade/catch-me-if-you-can/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/arcade/catch-me-if-you-can"
  },
  {
    "id": "opensource-collector",
    "name": "Collector",
    "category": "Arcade",
    "description": "Sweep up coins before time runs out.",
    "playUrl": "https://sausi-7.github.io/games/games/arcade/collector/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/arcade/collector"
  },
  {
    "id": "opensource-color-dash",
    "name": "Color Dash",
    "category": "Arcade",
    "description": "Match the player's color to pass each gate.",
    "playUrl": "https://sausi-7.github.io/games/games/arcade/color-dash/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/arcade/color-dash"
  },
  {
    "id": "opensource-colour-pour",
    "name": "Colour Pour",
    "category": "Puzzle",
    "description": "Sort liquids into single-color tubes.",
    "playUrl": "https://sausi-7.github.io/games/games/puzzle/colour-pour/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/puzzle/colour-pour"
  },
  {
    "id": "opensource-connected",
    "name": "Connected",
    "category": "Puzzle",
    "description": "Link nodes without crossing lines.",
    "playUrl": "https://sausi-7.github.io/games/games/puzzle/connected/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/puzzle/connected"
  },
  {
    "id": "opensource-cooking",
    "name": "Cooking",
    "category": "Casual",
    "description": "Plate orders before the timer hits zero.",
    "playUrl": "https://sausi-7.github.io/games/games/casual/cooking/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/casual/cooking"
  },
  {
    "id": "opensource-cool-platformer",
    "name": "Cool Platformer",
    "category": "Platformer",
    "description": "Run, jump, and dash through hazards.",
    "playUrl": "https://sausi-7.github.io/games/games/platformer/cool-platformer/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/platformer/cool-platformer"
  },
  {
    "id": "opensource-cosmic-cleaner",
    "name": "Cosmic Cleaner",
    "category": "3D",
    "description": "3D space-junk vacuum-up game.",
    "playUrl": "https://sausi-7.github.io/games/games/3d/cosmic-cleaner/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/3d/cosmic-cleaner"
  },
  {
    "id": "opensource-cricket-123",
    "name": "Cricket 1-2-3",
    "category": "Sports",
    "description": "Bat through fast deliveries.",
    "playUrl": "https://sausi-7.github.io/games/games/sports/cricket-123/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/sports/cricket-123"
  },
  {
    "id": "opensource-crossy-road",
    "name": "Crossy Road",
    "category": "Arcade",
    "description": "Hop across roads, rivers, and rails.",
    "playUrl": "https://sausi-7.github.io/games/games/arcade/crossy-road/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/arcade/crossy-road"
  },
  {
    "id": "opensource-crowd-control",
    "name": "Crowd Control",
    "category": "Arcade",
    "description": "Steer your growing crowd through obstacles.",
    "playUrl": "https://sausi-7.github.io/games/games/arcade/crowd-control/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/arcade/crowd-control"
  },
  {
    "id": "opensource-curve-snake",
    "name": "Curve Snake",
    "category": "Arcade",
    "description": "Snake-style game with smooth curve trails.",
    "playUrl": "https://sausi-7.github.io/games/games/arcade/curve-snake/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/arcade/curve-snake"
  },
  {
    "id": "opensource-cut-rope",
    "name": "Cut the Rope",
    "category": "Puzzle",
    "description": "Slice ropes to land the candy in the goal.",
    "playUrl": "https://sausi-7.github.io/games/games/puzzle/cut-rope/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/puzzle/cut-rope"
  },
  {
    "id": "opensource-dodge-enemy",
    "name": "Dodge Enemy",
    "category": "Arcade",
    "description": "Slip past charging enemies.",
    "playUrl": "https://sausi-7.github.io/games/games/arcade/dodge-enemy/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/arcade/dodge-enemy"
  },
  {
    "id": "opensource-dodge-master",
    "name": "Dodge Master",
    "category": "Arcade",
    "description": "Endless dodging at increasing speed.",
    "playUrl": "https://sausi-7.github.io/games/games/arcade/dodge-master/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/arcade/dodge-master"
  },
  {
    "id": "opensource-doodle-jump",
    "name": "Doodle Jump",
    "category": "Platformer",
    "description": "Jump from platform to platform — go higher.",
    "playUrl": "https://sausi-7.github.io/games/games/platformer/doodle-jump/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/platformer/doodle-jump"
  },
  {
    "id": "opensource-dream-weaver",
    "name": "Dream Weaver",
    "category": "Arcade",
    "description": "Weave glowing trails through a dreamscape.",
    "playUrl": "https://sausi-7.github.io/games/games/arcade/dream-weaver/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/arcade/dream-weaver"
  },
  {
    "id": "opensource-ellars",
    "name": "Ellars",
    "category": "Arcade",
    "description": "Surreal arcade dodger.",
    "playUrl": "https://sausi-7.github.io/games/games/arcade/ellars/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/arcade/ellars"
  },
  {
    "id": "opensource-endless-runner",
    "name": "Endless Runner",
    "category": "Racing",
    "description": "Run forever. Dodge everything.",
    "playUrl": "https://sausi-7.github.io/games/games/racing/endless-runner/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/racing/endless-runner"
  },
  {
    "id": "opensource-flappy",
    "name": "Flappy",
    "category": "Arcade",
    "description": "Tap to flap. Don't hit the pipes.",
    "playUrl": "https://sausi-7.github.io/games/games/arcade/flappy/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/arcade/flappy"
  },
  {
    "id": "opensource-flip-jump",
    "name": "Flip Jump",
    "category": "Platformer",
    "description": "Flip the world to land safely.",
    "playUrl": "https://sausi-7.github.io/games/games/platformer/flip-jump/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/platformer/flip-jump"
  },
  {
    "id": "opensource-fly-monkey",
    "name": "Fly Monkey",
    "category": "Arcade",
    "description": "Swing the monkey through the canopy.",
    "playUrl": "https://sausi-7.github.io/games/games/arcade/fly-monkey/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/arcade/fly-monkey"
  },
  {
    "id": "opensource-football",
    "name": "Football",
    "category": "Sports",
    "description": "Score goals in a fast-paced footy match.",
    "playUrl": "https://sausi-7.github.io/games/games/sports/football/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/sports/football"
  },
  {
    "id": "opensource-forest-runner",
    "name": "Forest Runner",
    "category": "Racing",
    "description": "Sprint through a forest — dodge logs and gaps.",
    "playUrl": "https://sausi-7.github.io/games/games/racing/forest-runner/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/racing/forest-runner"
  },
  {
    "id": "opensource-four-dots",
    "name": "Four Dots",
    "category": "Puzzle",
    "description": "Tap dots in the right pattern.",
    "playUrl": "https://sausi-7.github.io/games/games/puzzle/four-dots/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/puzzle/four-dots"
  },
  {
    "id": "opensource-fruit-basket",
    "name": "Fruit Basket",
    "category": "Casual",
    "description": "Catch falling fruits in your basket.",
    "playUrl": "https://sausi-7.github.io/games/games/casual/fruit-basket/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/casual/fruit-basket"
  },
  {
    "id": "opensource-fruit-cosmics",
    "name": "Fruit Cosmics",
    "category": "Casual",
    "description": "Cosmic-themed fruit smasher.",
    "playUrl": "https://sausi-7.github.io/games/games/casual/fruit-cosmics/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/casual/fruit-cosmics"
  },
  {
    "id": "opensource-fruit-merge",
    "name": "Fruit Merge",
    "category": "Casual",
    "description": "Drop fruits — merge same kinds to evolve.",
    "playUrl": "https://sausi-7.github.io/games/games/casual/fruit-merge/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/casual/fruit-merge"
  },
  {
    "id": "opensource-luma-bounce",
    "name": "LumaBounce",
    "category": "Arcade",
    "description": "Bouncy reflex arcade game.",
    "playUrl": "https://sausi-7.github.io/games/games/arcade/luma-bounce/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/arcade/luma-bounce"
  },
  {
    "id": "opensource-glass-step",
    "name": "Glass Step",
    "category": "Arcade",
    "description": "Pick the safe glass tile. Don't fall.",
    "playUrl": "https://sausi-7.github.io/games/games/arcade/glass-step/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/arcade/glass-step"
  },
  {
    "id": "opensource-hex-puzzle",
    "name": "Hex Puzzle",
    "category": "Puzzle",
    "description": "Place hex blocks to clear the board.",
    "playUrl": "https://sausi-7.github.io/games/games/puzzle/hex-puzzle/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/puzzle/hex-puzzle"
  },
  {
    "id": "opensource-hungry-player",
    "name": "Hungry Player",
    "category": "Arcade",
    "description": "Gobble food, dodge hazards, grow.",
    "playUrl": "https://sausi-7.github.io/games/games/arcade/hungry-player/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/arcade/hungry-player"
  },
  {
    "id": "opensource-jump-dot",
    "name": "Jump Dot",
    "category": "Arcade",
    "description": "Tap to jump the dot over rotating hazards.",
    "playUrl": "https://sausi-7.github.io/games/games/arcade/jump-dot/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/arcade/jump-dot"
  },
  {
    "id": "opensource-laser-bounce",
    "name": "Laser Bounce",
    "category": "Puzzle",
    "description": "Reflect lasers to hit all targets.",
    "playUrl": "https://sausi-7.github.io/games/games/puzzle/laser-bounce/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/puzzle/laser-bounce"
  },
  {
    "id": "opensource-link",
    "name": "Link",
    "category": "Puzzle",
    "description": "Link matching tiles by shortest path.",
    "playUrl": "https://sausi-7.github.io/games/games/puzzle/link/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/puzzle/link"
  },
  {
    "id": "opensource-ludo",
    "name": "Ludo",
    "category": "Board",
    "description": "Classic Ludo — you vs 3 AI opponents.",
    "playUrl": "https://sausi-7.github.io/games/games/board/ludo/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/board/ludo"
  },
  {
    "id": "opensource-mario",
    "name": "Mario-Like",
    "category": "Platformer",
    "description": "Side-scrolling platformer adventure.",
    "playUrl": "https://sausi-7.github.io/games/games/platformer/mario/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/platformer/mario"
  },
  {
    "id": "opensource-math-quest",
    "name": "Math Quest",
    "category": "Word & Quiz",
    "description": "Speed math challenge.",
    "playUrl": "https://sausi-7.github.io/games/games/word-quiz/math-quest/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/word-quiz/math-quest"
  },
  {
    "id": "opensource-memory",
    "name": "Memory",
    "category": "Puzzle",
    "description": "Flip cards. Find pairs.",
    "playUrl": "https://sausi-7.github.io/games/games/puzzle/memory/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/puzzle/memory"
  },
  {
    "id": "opensource-memory-cards",
    "name": "Memory Cards",
    "category": "Puzzle",
    "description": "Card-matching memory test.",
    "playUrl": "https://sausi-7.github.io/games/games/puzzle/memory-cards/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/puzzle/memory-cards"
  },
  {
    "id": "opensource-number-merge",
    "name": "Number Merge",
    "category": "Puzzle",
    "description": "Merge same numbers, climb the score.",
    "playUrl": "https://sausi-7.github.io/games/games/puzzle/number-merge/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/puzzle/number-merge"
  },
  {
    "id": "opensource-one-car",
    "name": "One Car",
    "category": "Racing",
    "description": "Steer one car through dense traffic.",
    "playUrl": "https://sausi-7.github.io/games/games/racing/one-car/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/racing/one-car"
  },
  {
    "id": "opensource-orbital-outpost",
    "name": "Orbital Outpost",
    "category": "3D",
    "description": "3D space-station defense.",
    "playUrl": "https://sausi-7.github.io/games/games/3d/orbital-outpost/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/3d/orbital-outpost"
  },
  {
    "id": "opensource-pairing",
    "name": "Pairing",
    "category": "Puzzle",
    "description": "Pair up matching items quickly.",
    "playUrl": "https://sausi-7.github.io/games/games/puzzle/pairing/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/puzzle/pairing"
  },
  {
    "id": "opensource-parkour",
    "name": "Parkour",
    "category": "Platformer",
    "description": "Wall-run, slide, and vault forward.",
    "playUrl": "https://sausi-7.github.io/games/games/platformer/parkour/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/platformer/parkour"
  },
  {
    "id": "opensource-pathfinder",
    "name": "Pathfinder",
    "category": "Puzzle",
    "description": "Solve maze paths under time pressure.",
    "playUrl": "https://sausi-7.github.io/games/games/puzzle/pathfinder/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/puzzle/pathfinder"
  },
  {
    "id": "opensource-perfect-square",
    "name": "Perfect Square",
    "category": "Puzzle",
    "description": "Tap when the square aligns perfectly.",
    "playUrl": "https://sausi-7.github.io/games/games/puzzle/perfect-square/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/puzzle/perfect-square"
  },
  {
    "id": "opensource-planet-visitor",
    "name": "Planet Visitor",
    "category": "3D",
    "description": "Land on alien planets in 3D.",
    "playUrl": "https://sausi-7.github.io/games/games/3d/planet-visitor/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/3d/planet-visitor"
  },
  {
    "id": "opensource-quiz",
    "name": "Quiz",
    "category": "Word & Quiz",
    "description": "Test your knowledge across categories.",
    "playUrl": "https://sausi-7.github.io/games/games/word-quiz/quiz/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/word-quiz/quiz"
  },
  {
    "id": "opensource-red-light-green-light",
    "name": "Red Light, Green Light",
    "category": "Arcade",
    "description": "Move on green. Freeze on red.",
    "playUrl": "https://sausi-7.github.io/games/games/arcade/red-light-green-light/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/arcade/red-light-green-light"
  },
  {
    "id": "opensource-road-cross",
    "name": "Road Cross",
    "category": "Arcade",
    "description": "Cross busy roads safely.",
    "playUrl": "https://sausi-7.github.io/games/games/arcade/road-cross/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/arcade/road-cross"
  },
  {
    "id": "opensource-road-fighter",
    "name": "Road Fighter",
    "category": "Racing",
    "description": "Top-down race weaving through traffic.",
    "playUrl": "https://sausi-7.github.io/games/games/racing/road-fighter/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/racing/road-fighter"
  },
  {
    "id": "opensource-screw-master",
    "name": "Screw Master",
    "category": "Puzzle",
    "description": "Unscrew and sort the metal pieces.",
    "playUrl": "https://sausi-7.github.io/games/games/puzzle/screw-master/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/puzzle/screw-master"
  },
  {
    "id": "opensource-shadow-runner",
    "name": "Shadow Runner",
    "category": "Racing",
    "description": "Sprint through a shadow world.",
    "playUrl": "https://sausi-7.github.io/games/games/racing/shadow-runner/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/racing/shadow-runner"
  },
  {
    "id": "opensource-shape-collector",
    "name": "Shape Collector",
    "category": "Arcade",
    "description": "Catch only the matching shapes.",
    "playUrl": "https://sausi-7.github.io/games/games/arcade/shape-collector/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/arcade/shape-collector"
  },
  {
    "id": "opensource-shape-fitter",
    "name": "Shape Fitter",
    "category": "Puzzle",
    "description": "Fit shapes into the right slots.",
    "playUrl": "https://sausi-7.github.io/games/games/puzzle/shape-fitter/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/puzzle/shape-fitter"
  },
  {
    "id": "opensource-signal-circuit",
    "name": "Signal Circuit",
    "category": "Puzzle",
    "description": "Route signals through circuit gates.",
    "playUrl": "https://sausi-7.github.io/games/games/puzzle/signal-circuit/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/puzzle/signal-circuit"
  },
  {
    "id": "opensource-sky-high",
    "name": "Sky High",
    "category": "Arcade",
    "description": "Climb endlessly into the sky.",
    "playUrl": "https://sausi-7.github.io/games/games/arcade/sky-high/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/arcade/sky-high"
  },
  {
    "id": "opensource-snake-and-ladder",
    "name": "Snake & Ladder",
    "category": "Board",
    "description": "Roll the dice. Climb. Slide. Win.",
    "playUrl": "https://sausi-7.github.io/games/games/board/snake-and-ladder/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/board/snake-and-ladder"
  },
  {
    "id": "opensource-spaceman",
    "name": "Spaceman",
    "category": "Arcade",
    "description": "Float and survive in zero gravity.",
    "playUrl": "https://sausi-7.github.io/games/games/arcade/spaceman/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/arcade/spaceman"
  },
  {
    "id": "opensource-space-waves",
    "name": "Space Waves",
    "category": "Arcade",
    "description": "Surf waves of space debris.",
    "playUrl": "https://sausi-7.github.io/games/games/arcade/space-waves/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/arcade/space-waves"
  },
  {
    "id": "opensource-square-one",
    "name": "Square One",
    "category": "Puzzle",
    "description": "Slide squares to clear the board.",
    "playUrl": "https://sausi-7.github.io/games/games/puzzle/square-one/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/puzzle/square-one"
  },
  {
    "id": "opensource-stick-game",
    "name": "Stick Game",
    "category": "Arcade",
    "description": "Draw sticks to bridge gaps.",
    "playUrl": "https://sausi-7.github.io/games/games/arcade/stick-game/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/arcade/stick-game"
  },
  {
    "id": "opensource-stick-toss",
    "name": "Stick Toss",
    "category": "Arcade",
    "description": "Toss sticks at the spinning target.",
    "playUrl": "https://sausi-7.github.io/games/games/arcade/stick-toss/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/arcade/stick-toss"
  },
  {
    "id": "opensource-straight-rush",
    "name": "Straight Rush",
    "category": "Racing",
    "description": "Sprint forward — react to oncoming hazards.",
    "playUrl": "https://sausi-7.github.io/games/games/racing/straight-rush/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/racing/straight-rush"
  },
  {
    "id": "opensource-survival-run",
    "name": "Survival Run",
    "category": "Racing",
    "description": "Outrun the danger as long as you can.",
    "playUrl": "https://sausi-7.github.io/games/games/racing/survival-run/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/racing/survival-run"
  },
  {
    "id": "opensource-table-tennis",
    "name": "Table Tennis",
    "category": "Sports",
    "description": "Volley the ping-pong ball.",
    "playUrl": "https://sausi-7.github.io/games/games/sports/table-tennis/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/sports/table-tennis"
  },
  {
    "id": "opensource-tap-target",
    "name": "Tap Target",
    "category": "Arcade",
    "description": "Tap targets before they vanish.",
    "playUrl": "https://sausi-7.github.io/games/games/arcade/tap-target/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/arcade/tap-target"
  },
  {
    "id": "opensource-tetris",
    "name": "Tetris",
    "category": "Puzzle",
    "description": "The classic falling-block puzzle.",
    "playUrl": "https://sausi-7.github.io/games/games/puzzle/tetris/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/puzzle/tetris"
  },
  {
    "id": "opensource-that-level-again-1",
    "name": "That Level Again — 1",
    "category": "Platformer",
    "description": "Trick-platformer level 1.",
    "playUrl": "https://sausi-7.github.io/games/games/platformer/that-level-again-1/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/platformer/that-level-again-1"
  },
  {
    "id": "opensource-that-level-again-2",
    "name": "That Level Again — 2",
    "category": "Platformer",
    "description": "Trick-platformer level 2.",
    "playUrl": "https://sausi-7.github.io/games/games/platformer/that-level-again-2/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/platformer/that-level-again-2"
  },
  {
    "id": "opensource-that-level-again-3",
    "name": "That Level Again — 3",
    "category": "Platformer",
    "description": "Trick-platformer level 3.",
    "playUrl": "https://sausi-7.github.io/games/games/platformer/that-level-again-3/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/platformer/that-level-again-3"
  },
  {
    "id": "opensource-that-level-again-4",
    "name": "That Level Again — 4",
    "category": "Platformer",
    "description": "Trick-platformer level 4.",
    "playUrl": "https://sausi-7.github.io/games/games/platformer/that-level-again-4/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/platformer/that-level-again-4"
  },
  {
    "id": "opensource-that-level-again-5",
    "name": "That Level Again — 5",
    "category": "Platformer",
    "description": "Trick-platformer level 5.",
    "playUrl": "https://sausi-7.github.io/games/games/platformer/that-level-again-5/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/platformer/that-level-again-5"
  },
  {
    "id": "opensource-tile-tap",
    "name": "Tile Tap",
    "category": "Puzzle",
    "description": "Tap only the dark tiles. Don't miss.",
    "playUrl": "https://sausi-7.github.io/games/games/puzzle/tile-tap/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/puzzle/tile-tap"
  },
  {
    "id": "opensource-two-cars",
    "name": "Two Cars",
    "category": "Racing",
    "description": "Steer two cars at once. Catch & dodge.",
    "playUrl": "https://sausi-7.github.io/games/games/racing/two-cars/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/racing/two-cars"
  },
  {
    "id": "opensource-two-cars-ai",
    "name": "Two Cars AI",
    "category": "Racing",
    "description": "AI-twist on the two-cars classic.",
    "playUrl": "https://sausi-7.github.io/games/games/racing/two-cars-ai/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/racing/two-cars-ai"
  },
  {
    "id": "opensource-unruly",
    "name": "Unruly",
    "category": "Puzzle",
    "description": "Place tiles by no-three-in-a-row rules.",
    "playUrl": "https://sausi-7.github.io/games/games/puzzle/unruly/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/puzzle/unruly"
  },
  {
    "id": "opensource-whack-a-bug",
    "name": "Whack-a-Bug",
    "category": "Arcade",
    "description": "Bonk the bugs as they pop up.",
    "playUrl": "https://sausi-7.github.io/games/games/arcade/whack-a-bug/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/arcade/whack-a-bug"
  },
  {
    "id": "opensource-wordle",
    "name": "Wordlee",
    "category": "Word & Quiz",
    "description": "Guess the 5-letter word in 6 tries.",
    "playUrl": "https://sausi-7.github.io/games/games/word-quiz/wordle/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/word-quiz/wordle"
  },
  {
    "id": "opensource-words-of-wonder",
    "name": "Words of Wonder",
    "category": "Word & Quiz",
    "description": "Build words from a wheel of letters.",
    "playUrl": "https://sausi-7.github.io/games/games/word-quiz/words-of-wonder/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/word-quiz/words-of-wonder"
  },
  {
    "id": "opensource-penalty",
    "name": "Penalty Shootout",
    "category": "Sports",
    "description": "One-on-one penalty kicks vs the keeper.",
    "playUrl": "https://sausi-7.github.io/games/games/sports/penalty/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/sports/penalty"
  },
  {
    "id": "opensource-level-devil",
    "name": "Level Devil",
    "category": "Platformer",
    "description": "Trickster platformer that hates you.",
    "playUrl": "https://sausi-7.github.io/games/games/platformer/level-devil/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/platformer/level-devil"
  },
  {
    "id": "opensource-line-trap",
    "name": "Line Trap",
    "category": "Puzzle",
    "description": "Trap the dot inside your line.",
    "playUrl": "https://sausi-7.github.io/games/games/puzzle/line-trap/index.html",
    "sourceUrl": "https://github.com/sausi-7/games/tree/main/games/puzzle/line-trap"
  },
  { id: "doge-clicker", name: "Doge Clicker", category: "Clicker", description: "Tap for coins, buy upgrades, and stack up Doge.", playUrl: "/games/mini-arcade/index.html?mode=doge-clicker" },
  { id: "donut-clicker", name: "Donut Clicker", category: "Clicker", description: "Bake your way from one donut to a whole production line.", playUrl: "/games/mini-arcade/index.html?mode=donut-clicker" },
  { id: "pizza-clicker", name: "Pizza Clicker", category: "Clicker", description: "Tap for slices and upgrade your pizza kitchen.", playUrl: "/games/mini-arcade/index.html?mode=pizza-clicker" },
  { id: "chicken-jockey-clicker", name: "Chicken Jockey Clicker", category: "Clicker", description: "Grow your crew and unlock faster taps.", playUrl: "/games/mini-arcade/index.html?mode=chicken-jockey-clicker" },
  { id: "planet-clicker", name: "Planet Clicker", category: "Clicker", description: "Collect cosmic energy and boost your output.", playUrl: "/games/mini-arcade/index.html?mode=planet-clicker" },
  { id: "italian-brainrot-clicker", name: "Italian Brainrot Clicker 2", category: "Clicker", description: "Tap for chaos and unlock ridiculous upgrades.", playUrl: "/games/mini-arcade/index.html?mode=italian-brainrot-clicker" },
  { id: "space-waves-local", name: "Space Waves", category: "Arcade", description: "Dodge the hazard walls and survive as long as possible.", playUrl: "/games/mini-arcade/index.html?mode=space-waves" },
  { id: "slope-local", name: "Slope", category: "Racing", description: "Stay on the track as speed keeps increasing.", playUrl: "/games/mini-arcade/index.html?mode=slope" },
  { id: "speed-stars-local", name: "Speed Stars", category: "Sports", description: "Alternate your stride to keep sprinting down the track.", playUrl: "/games/mini-arcade/index.html?mode=speed-stars" },
  { id: "level-devil-local", name: "Level Devil", category: "Platformer", description: "A tricky platform course with surprise hazards.", playUrl: "/games/mini-arcade/index.html?mode=level-devil" },
  { id: "crossy-road-local", name: "Crossy Road", category: "Arcade", description: "Hop across traffic lanes and keep moving.", playUrl: "/games/mini-arcade/index.html?mode=crossy-road" },
  { "id": "duck-clicker", "name": "Duck Clicker", "category": "Clicker", "description": "Collect ducks, buy upgrades, and grow your flock.", "playUrl": "/games/mini-arcade/index.html?mode=duck-clicker" },
  { "id": "space-clicker", "name": "Space Clicker", "category": "Clicker", "description": "Mine stardust and power up your cosmic factory.", "playUrl": "/games/mini-arcade/index.html?mode=space-clicker" },
  { "id": "bloodmoney-local", "name": "Bloodmoney", "category": "Clicker", "description": "A dark choice-based clicker about earning cash.", "playUrl": "/games/mini-arcade/index.html?mode=bloodmoney" },
  { "id": "kick-the-buddy-local", "name": "Kick the Buddy", "category": "Arcade", "description": "Tap the practice dummy and unlock silly effects.", "playUrl": "/games/mini-arcade/index.html?mode=kick-the-buddy" },
  { "id": "rocket-goal-local", "name": "Rocket Goal", "category": "Sports", "description": "Drive, boost, and shoot the ball into the goal.", "playUrl": "/games/mini-arcade/index.html?mode=rocket-goal" },
  { "id": "slither-arena-local", "name": "Slither Arena", "category": "Arcade", "description": "Collect orbs, grow longer, and avoid crashing.", "playUrl": "/games/mini-arcade/index.html?mode=slither-io" },
  { "id": "backyard-baseball-local", "name": "Backyard Baseball", "category": "Sports", "description": "Time your swing and hit the ball into the field.", "playUrl": "/games/mini-arcade/index.html?mode=backyard-baseball" }
];

const categories = ["All", ...new Set(games.map((game) => game.category))];

const symbols = {
  "pacman": "◉", "2048": "▦", "air-hockey": "◉", "ant-flap": "✳", "ant-jump": "↗",
  "battleship": "▤", "block-drop": "▦", "breakout": "▥", "bubble-shooter": "◌",
  "connect-four": "⊞", "cross-road": "↗", "dino-run": "♞", "fruit-slice": "✳",
  "gem-match": "◆", "helix-drop": "◉", "lights-out": "✦", "maze-muncher": "⌘",
  "memory-match": "▧", "merge-drop": "◉", "minesweeper": "▦", "paddle-duel": "◉",
  "piano-tap": "▥", "reversi": "◉", "slide-puzzle": "▦", "snake": "〰",
  "sokoban": "▣", "stack-tower": "▤", "star-defender": "✦", "sudoku": "▦",
  "tic-tac-toe": "×", "water-sort": "◍", "whack-a-mole": "✹"
};
const artThemes = ["violet", "blue", "mint", "amber", "rose"];

export default function GamesClient() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedGame, setSelectedGame] = useState(null);
  const featuredGame = games.find((game) => game.id === "pacman") || games[0];

  useEffect(() => {
    function openRequestedGame() {
      try {
        const requested = JSON.parse(localStorage.getItem("vehemence_featured_pick") || "null");
        if (!requested) return;
        localStorage.removeItem("vehemence_featured_pick");
        const match = games.find((game) => game.id === requested.id || game.name === requested.name);
        if (match) setSelectedGame(match);
      } catch {}
    }
    openRequestedGame();
    window.addEventListener("vehemence-open-game", openRequestedGame);
    return () => window.removeEventListener("vehemence-open-game", openRequestedGame);
  }, []);

  const filteredGames = useMemo(() => games.filter((game) =>
    (category === "All" || game.category === category) &&
    (game.name + " " + game.description + " " + game.category).toLowerCase().includes(query.toLowerCase().trim())
  ), [query, category]);

  function playGame(game) {
    setSelectedGame(game);
    try { const entry = { name: game.name, type: "game", id: game.id, playedAt: new Date().toISOString() }; localStorage.setItem("vehemence_last_played", JSON.stringify(entry)); const prior = JSON.parse(localStorage.getItem("vehemence_game_history") || "[]"); const history = Array.isArray(prior) ? prior : []; localStorage.setItem("vehemence_game_history", JSON.stringify([entry, ...history.filter((item) => item.id !== game.id)].slice(0, 50))); } catch {}
    window.dispatchEvent(new Event("vehemence-game-last-played"));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="games-page games-redesign">
      {!selectedGame && (
        <section className="games-spotlight">
          <div className="games-spotlight-copy">
            <span className="games-overline"><span className="games-live-dot" /> THE ARCADE</span>
            <h1>Find your<br /><span>next obsession.</span></h1>
            
            <div className="games-spotlight-actions">
              <button type="button" className="games-spotlight-play" onClick={() => playGame(featuredGame)}><span>▶</span> Play Pac-Man</button>
              <span className="games-spotlight-meta">{games.length} games <i /> no downloads</span>
            </div>
          </div>
          <div className="games-spotlight-art" aria-hidden="true">
            <div className="spotlight-orbit spotlight-orbit-one" />
            <div className="spotlight-orbit spotlight-orbit-two" />
            <div className="spotlight-game-symbol">◉</div>
            <div className="spotlight-dot spotlight-dot-one" />
            <div className="spotlight-dot spotlight-dot-two" />
            <div className="spotlight-dot spotlight-dot-three" />
            <div className="spotlight-caption"><span>FEATURED GAME</span><strong>Pac-Man</strong><small>CLASSIC · ARCADE</small></div>
          </div>
          <div className="games-spotlight-index">01 <span>/</span> {String(games.length).padStart(2, "0")}</div>
        </section>
      )}

      {selectedGame && (
        <header className="games-playing-heading">
          <div><span className="games-overline">NOW PLAYING</span><h1>{selectedGame.name}</h1></div>
          <button type="button" className="games-back-button" onClick={() => setSelectedGame(null)}>← Back to games</button>
        </header>
      )}

      <section className="game-section games-library">
        <div className="games-library-heading">
          <div><span className="games-overline">THE COLLECTION</span><h2>{selectedGame ? "Keep exploring" : "Browse games"}</h2></div>
          <span className="games-count"><b>{filteredGames.length}</b> / {games.length}</span>
        </div>
        <div className="games-toolbar">
          <label className="games-search">
            <span aria-hidden="true">⌕</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a game..." aria-label="Search games" />
            {query && <button type="button" className="games-clear-search" onClick={() => setQuery("")} aria-label="Clear search">×</button>}
          </label>
        </div>
        <div className="games-category-row" aria-label="Game categories">
          {categories.map((item) => <button key={item} type="button" className={category === item ? "games-category-chip active" : "games-category-chip"} onClick={() => setCategory(item)}>{item}</button>)}
        </div>

        {selectedGame && (
          <section className="games-player" aria-label={`Playing ${selectedGame.name}`}>
            <div className="games-player-header">
              <div><span className="games-player-live" /> <h2>{selectedGame.name}</h2></div>
              <div className="games-player-header-actions">
                <button type="button" onClick={() => setSelectedGame(null)} aria-label="Close game">Close ✕</button>
              </div>
            </div>
            <iframe className="games-player-frame" src={selectedGame.playUrl} title={selectedGame.name} allow="fullscreen; autoplay; gamepad" allowFullScreen />
          </section>
        )}

        <div className="games-grid">
          {filteredGames.map((game, index) => (
            <article className={`game-card games-card-modern theme-${artThemes[index % artThemes.length]}`} key={game.id}>
              <button type="button" className="games-card-open" onClick={() => playGame(game)} aria-label={`Play ${game.name}`}>
                <div className="games-card-art">
                  <span className="games-card-category">{game.category}</span>
                  <span className="games-card-symbol" aria-hidden="true">{symbols[game.id] || "✦"}</span>
                  <span className="games-card-arrow" aria-hidden="true">↗</span>
                  <span className="games-card-art-line" />
                </div>
                <div className="games-card-copy">
                  <h3>{game.name}</h3>
                  <p>{game.description}</p>
                </div>
                <div className="games-card-footer"><span>PLAY GAME</span><span>↗</span></div>
              </button>
            </article>
          ))}
        </div>
        {filteredGames.length === 0 && <div className="games-empty-modern"><span>⌕</span><h3>No games found</h3><p>Try another search or category.</p><button type="button" onClick={() => { setQuery(""); setCategory("All"); }}>Clear filters</button></div>}
      </section>
    </main>
  );
}
