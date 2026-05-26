# Rookie Board

## What this app is

**Rookie Board** is a fast, frontend-only web app for building and maintaining a personal dynasty fantasy football rookie draft board.

It is designed to be:

- **Manual** — you control the rankings, tiers, and position views
- **Fast** — instant load, instant editing, no account setup
- **Focused** — built specifically for rookie draft prep, not general league management
- **Flexible** — useful before, during, and after rookie drafts

The app lets you:

- Build a tier-based rookie Big Board
- Reorder players via drag-and-drop
- Add, edit, delete, and move prospects across tiers
- View prospects by position across QB, RB, WR, and TE tabs
- Track position-specific context such as ZAP score, RP rank, and category
- Add player notes through a dedicated notes drawer
- Export and import the board as JSON
- Copy a clean text version of the board
- Persist your board locally in the browser

This tool is meant to mirror how dynasty players actually prepare for rookie drafts:  
as a personal board built around tiers, player conviction, and draft-room decision making.

## What this app intentionally does **not** do

Rookie Board is opinionated. The following omissions are deliberate.

- **No projections or automatic rankings**  
  It does not generate rankings, assign player values, or decide tiers for you.

- **No consensus ranking feed**  
  There is no external rankings API or live market feed built into the app.

- **No draft room integration**  
  The app does not connect to Sleeper, MFL, ESPN, or any live draft platform.

- **No backend or accounts**  
  There is no server, no database, and no user login. Your board lives in your browser unless you export it.

- **No automatic board management**  
  The app will not auto-sort, auto-tier, or auto-adjust your rankings based on news, landing spots, or ADP.

- **No attempt to be a full dynasty tool**  
  This is not a trade calculator, team analyzer, lineup tool, or league hub.

If a feature would add noise, slow down the workflow, or take control away from the user, it does not belong here.

> This app exists to make rookie draft prep cleaner, faster, and more intentional — not to replace your judgment.