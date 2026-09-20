# People — master index

This file is the single source of truth for the **People** tab. Edit it here on
GitHub to correct names; the site rebuilds from it. The photo importer
(`import-docx.py`) never touches this file, so your corrections survive re-imports.

It is an **allow-list**: only people listed in the roster below become links, so
place/event names in captions (e.g. "London", "Cape Town", "Onion Ring") are
ignored automatically. To review who was matched, and to find people to add or
ambiguities to resolve, run `npm run build` and read `scripts/people-report.md`.

## How to edit

**Roster** — one row per real person:

- **Name** — the person's display name; the URL and grouping are derived from it.
- **Aliases** — `;`-separated other spellings/nicknames that mean the same person
  (e.g. `Stephen; Margot`). Case-insensitive. Full names or single words both work.
- **Primary** — put `yes` when several different people share a first name, to mark
  who a bare mention of that first name (just "Peter") should default to. Leave
  blank when the first name is unique. A blank shared first name is reported as
  ambiguous rather than guessed.

**Overrides** — the definitive people for one specific photo, to fix an ambiguous
or mis-named shot. `Section` is the section slug (e.g. `80s`, `the-stardust`),
`File` is the image name from `site-data.mjs` (e.g. `image123`), `People` is a
`;`-separated list of display names (each must exist in the roster). An override
replaces whatever the caption auto-matched for that photo.

## Roster

| Name | Aliases | Primary |
|------|---------|---------|
| Steven Roche | Margot | yes |
| Steven Kent |  |  |
| Adi Coetzee | Aydee; Adee; Adi |  |
| Henri Davies | Henry Davies; Henry |  |
| Patrick Brill |  | yes |
| Michael Crouch |  |  |
| Michael Hunter Smith | Michael Hunter | yes |
| Mark Griffin |  | yes |
| Mark Lowe |  |  |
| Mark Davis |  |  |
| Mark Cioli |  |  |
| Sally Fisher |  | yes |
| Sally Chance |  |  |
| Lauren Shipton |  | yes |
| Lauren Estagarribia |  |  |
| Rene Kent |  | yes |
| Gillian Lenton |  | yes |
| Seyton Machattie | Seaton |  |
| Barrie Hadfield |  | yes |
| Garth Gething |  | yes |
| Garth Marquard |  |  |
| Peter Moffat |  | yes |
| Peter White |  |  |
| Peter Wishart |  |  |
| Peter Wheeler |  |  |
| Peter Pienaar |  |  |
| Peter Harris |  |  |
| Peter Amsden |  |  |
| Kevin Rogers |  |  |
| Kevin Botha |  |  |
| Kevin MacInnes | Kevin McInnes; Kevin Mac; Kevin Mc | yes |
| Louis Card |  | yes |
| Neil Starr |  | yes |
| Neil Dundas |  |  |
| Neil Farrelly |  |  |
| Ian Perry |  | yes |
| Ian Swan |  |  |
| Cindy West |  | yes |
| Kerry Bennett |  | yes |
| Jackie Bryant |  | yes |
| Trevor Norris |  | yes |
| Karen Ward |  | yes |
| David Goudge |  | yes |
| David Davies |  |  |
| David Ralphs |  |  |
| David Ross |  |  |
| David Wannamaker |  |  |
| Douglas |  |  |
| Richard Rufus Ellis | Rufus Ellis | yes |
| Richard Lawton |  |  |
| Richard Yell |  |  |
| Arthur |  |  |
| Cheryl Johnson | Cheryl Johhnson | yes |
| Cheryl Schultz |  |  |
| Jenna |  |  |
| Brettlee | Bretlee |  |
| Joan Dickman |  | yes |
| Darryl Rogers |  | yes |
| Illana Woolf |  | yes |
| Rory West |  | yes |
| Spencer Pillay |  | yes |
| Stephen Pritchard |  | yes |
| Stephen Doubell |  |  |
| Colin Hutt |  | yes |
| Gary Halfpenny |  | yes |
| Gary Moore |  |  |
| Gary Searle |  |  |
| Treva Norris | Treva |  |
| Noel Osborne |  | yes |
| Leigh Downing |  | yes |
| Alan Whitehead |  | yes |
| Alan Horn |  |  |
| Alan Morrison |  |  |
| Alan Froneman |  |  |
| Alan Watt |  |  |
| Maxi Spazzoli |  | yes |
| Leonardo Lupini | Leonardo |  |
| Gavin Woolf |  | yes |
| Marcel Wishura |  | yes |
| Mathew Kelly |  | yes |
| Heather Roche |  | yes |
| Luke Davies |  | yes |
| Rowan |  |  |
| Jamie |  |  |
| Keith Schultz |  | yes |
| Dale Schultz | Dale Shultz |  |
| Craig Peetz |  | yes |
| Graham Moore |  | yes |
| Tom Collins |  | yes |
| Murray Scannell |  | yes |
| Carolyn |  |  |
| Penny Brill | Pennay | yes |
| Penny Rey |  |  |
| Frank Melman |  | yes |
| Tanya van Agthoven | Tanya |  |
| Lisa Owen |  | yes |
| Rodney Symes |  | yes |
| Vanessa |  |  |
| Pam Harmse |  | yes |
| Sophie Symes |  | yes |
| Thelma |  |  |
| Tony Gois | Toni Gois |  |
| Wally Hayward | Wally Haywood |  |
| Janet Doby | Janet Dobey |  |
| Bernard Hatch |  | yes |
| Linda Basson |  | yes |
| Adele Shandel |  | yes |
| Duncan Good | Duncan |  |
| Liz Good |  | yes |
| Liz Staniford |  |  |
| Rafe Brown |  | yes |
| Neville Letard |  | yes |
| Glenda Holmes |  | yes |
| Herb Klein |  | yes |
| Stephane |  |  |
| Francois |  |  |
| James Moffat |  | yes |
| Chloe Rolfes |  | yes |
| Guy Woods |  | yes |
| Eric Reeves |  | yes |
| Lesley Wallace | Leslie Wallace |  |
| Ronnie Botha |  | yes |
| Elaine Welsh |  | yes |
| Mario Rodrigues |  | yes |
| Sharon Coetsee |  |  |
| Sharon Spradbury |  |  |
| Gail Butler |  | yes |
| Alfie Saville |  |  |
| Alfie Bosman |  |  |
| Lianne Basson |  | yes |
| Myra Cowell |  | yes |
| Cecil Sagorin |  |  |
| Cecil Lyons |  |  |
| Lee Fine |  | yes |
| Christine Popoff |  | yes |
| Jonathan Arun |  | yes |
| Priscilla Blackie |  | yes |
| Nicola Blackie |  | yes |
| Megan Blackie |  | yes |
| Ruben Singer |  | yes |
| Roy Weir |  | yes |
| Dickie Conradie |  | yes |
| Margaret Mott Adams | Margaret Mott |  |
| Conrad Coward | Conrad |  |
| Lawrence Potgieter |  | yes |
| Mirco Broggian |  | yes |
| Tamar Marquard |  | yes |
| Wayne Kobusch |  | yes |
| Jenny Bear |  | yes |
| Bryan Brett |  | yes |
| Albert Eloff |  | yes |
| Barbara Lindsey |  | yes |
| Terry Scott |  | yes |
| Jeffery Sanker |  | yes |
| Phillip Schaffer |  | yes |
| Andries Botha |  | yes |
| Derek Lavarack |  | yes |
| Anina Cummings |  | yes |
| Boyd Ferguson |  | yes |
| Carl Isaacs |  | yes |
| Carmen Laurier |  | yes |
| Greg Davies |  | yes |
| Oliver Ellis |  | yes |
| Sean Keegan |  | yes |
| Robbie Pfister |  | yes |
| June Schmarmen |  | yes |
| John Truex |  | yes |
| Gregory Pierrotti |  | yes |
| Chris Weir |  | yes |
| Carla Thompson |  | yes |
| Robert Johnson |  | yes |
| Chin Soon |  | yes |
| Bruce Walsh |  |  |
| Grant Patterson |  |  |
| Jeanette Roche |  |  |
| Tom Roche |  |  |
| Anick Norris |  |  |
| Anthony Kenney |  |  |
| Tony |  |  |
| Rocky Farren |  |  |
| Louis de Araujo |  |  |
| Michael van Rensburg |  |  |
| Steve Lawrence |  |  |
| Chi Chi La Rue |  |  |
| Mark Dingley |  |  |
| Grace Jones |  |  |
| Neville Ward |  |  |
| Glenda Halfpenny |  |  |
| Debbie Reynolds |  |  |
| Carrie |  |  |
| Marcus |  |  |
| Sandra Scott |  |  |
| Elsa Pretorius |  |  |
| Eddie Da Lima |  |  |
| Bruce Patterson |  |  |
| Jenny Jarvis |  |  |
| Jackie Woolf |  |  |
| Noel von Wildenrath |  |  |
| Alex Botha |  |  |
| Lynton Lefevre |  |  |

## Overrides

| Section | File | People |
|---------|------|--------|
| the-stardust | image73 | Bruce Walsh; Henri Davies |
| the-stardust | image74 | Bruce Walsh; Henri Davies |
| the-stardust | image226 | Gillian Lenton; Jackie Bryant; Steven Roche |
| the-stardust | image374 | Steven Roche; Vanessa; Gillian Lenton; Eric Reeves |
| the-stardust | image228 | Steven Roche; Grant Patterson |
| the-stardust | image213 | Steven Roche |
| the-stardust | image877 |  |
| the-boudoir | image370 | Henri Davies; Mark Griffin; Trevor Norris |
| the-boudoir | image447 | Elaine Welsh; Henri Davies; Jackie Bryant; Karen Ward; Mark Griffin; Michael Hunter Smith; Patrick Brill; Rodney Symes; Steven Kent; Steven Roche; Trevor Norris |
| the-boudoir | image437 | Conrad Coward; Henri Davies; Jackie Bryant; Pam Harmse; Steven Roche |
| the-boudoir | image181 | Jackie Bryant; Rene Kent; Jeanette Roche |
| the-boudoir | image658 | Gillian Lenton; Jackie Bryant; Mark Griffin; Steven Roche; Steven Kent |
| the-boudoir | image290 | Gillian Lenton; Thelma; Tom Roche |
| the-boudoir | image668 | Steven Roche |
| steven | image916 | Adi Coetzee; Steven Roche |
| steven | image469 | Steven Roche |
| steven | image5 | Steven Roche |
| steven | image274 | Steven Roche |
| steven | image529 | Adi Coetzee; Steven Roche |
| steven | image728 | Steven Roche |
| steven | image289 | Steven Roche; Rene Kent |
| steven | image396 | Steven Roche; Rene Kent |
| steven | image270 | Steven Roche |
| 70s | image358 | Michael Hunter Smith; Trevor Norris; Anick Norris |
| 70s | image593 | Illana Woolf; Cindy West; Lawrence Potgieter |
| 70s | image836 | Cindy West; Henri Davies; Patrick Brill; Anthony Kenney |
| 70s | image155 | Henri Davies |
| 70s | image697 | Henri Davies |
| 70s | image122 | Mark Griffin; Treva Norris |
| 70s | image806 | Michael Hunter Smith; Steven Roche |
| 70s | image773 | Thelma; Tony |
| 70s | image736 | Richard Rufus Ellis; Steven Roche; Treva Norris |
| 70s | image29 | Lauren Shipton; Rocky Farren |
| 70s | image616 | Henri Davies |
| 70s | image443 | Illana Woolf; Louis de Araujo; Michael van Rensburg |
| 70s | image355 |  |
| 70s | image487 |  |
| 70s | image841 |  |
| 70s | image758 | Illana Woolf |
| 70s | image256 |  |
| 70s | image363 | Henri Davies |
| 70s | image918 |  |
| 70s | image285 |  |
| 70s | image252 | Cheryl Johnson; Henri Davies; Kerry Bennett; Sharon Coetsee; Stephen Pritchard; Louis de Araujo |
| 80s | image875 | Graham Moore; Peter Moffat; Steven Roche |
| 80s | image764 | Dale Schultz; Gail Butler; Gary Halfpenny; Henri Davies; Kerry Bennett; Steve Lawrence |
| 80s | image84 | Steven Roche; Chi Chi La Rue |
| 80s | image907 | Henri Davies; Louis de Araujo |
| 80s | image112 | Steven Roche; Mark Dingley |
| 80s | image265 | Garth Gething; Ian Perry; Patrick Brill; Rene Kent; Steven Roche |
| 80s | image715 | Richard Rufus Ellis |
| 80s | image824 | Mark Griffin; Mathew Kelly; Steven Roche |
| 80s | image716 | Alan Froneman |
| 80s | image922 | Henri Davies; Patrick Brill; Steven Roche |
| 80s | image59 | Mathew Kelly; Alan Froneman |
| 80s | image812 | Duncan Good; Liz Good |
| 80s | image482 | Gary Halfpenny; Henri Davies; Mark Dingley |
| 80s | image803 | Gary Halfpenny; Henri Davies; Mark Dingley |
| 80s | image216 | Henri Davies; Maxi Spazzoli; Patrick Brill |
| 80s | image194 | Murray Scannell; Henri Davies; Ian Swan; Patrick Brill; Maxi Spazzoli |
| 80s | image13 | Adele Shandel; Carolyn; Henri Davies; Patrick Brill; Stephen Pritchard |
| 80s | image699 | Adele Shandel; Carolyn; Jenny Bear |
| 80s | image654 | Cheryl Schultz |
| 80s | image393 | Patrick Brill; Cheryl Schultz |
| 80s | image455 | Henri Davies; Patrick Brill; Cheryl Schultz |
| 80s | image75 | Henri Davies |
| 80s | image301 | Lauren Shipton; Grace Jones |
| 80s | image845 | Kerry Bennett; Patrick Brill; Neville Ward |
| 80s | image640 | Mark Dingley |
| 80s | image491 | Henri Davies; Kerry Bennett; Rene Kent; Leigh Downing |
| 80s | image182 | Henri Davies; Steven Roche; Mark Dingley |
| 80s | image161 | Garth Gething; Gary Halfpenny; Henri Davies; Mark Dingley |
| 80s | image143 | Leigh Downing; Peter Moffat; Rene Kent; Steven Roche; Glenda Halfpenny |
| 80s | image793 | Henri Davies; Dale Schultz; Debbie Reynolds; Carrie; Marcus |
| 80s | image537 | Penny Rey; Terry Scott; Sandra Scott |
| 80s | image238 | Cecil Sagorin; Henri Davies; Leigh Downing; Elsa Pretorius; Eddie Da Lima |
| 80s | image360 | Lauren Shipton; Jeffery Sanker |
| 80s | image507 | Lauren Shipton; Steven Roche; Sally Fisher |
| 80s | image144 | Liz Good; Duncan Good |
| 80s | image894 | Noel Osborne; Garth Gething |
| 80s | image486 | Bernard Hatch |
| 80s | image634 | Patrick Brill; Mark Griffin |
| 80s | image342 | Ian Perry; Mark Griffin; Patrick Brill; Rene Kent; Steven Roche; Henri Davies; Bruce Patterson |
| 80s | image56 | Garth Gething; Henri Davies; Steven Roche; Mark Dingley |
| 80s | image383 | Garth Gething; Ronnie Botha |
| 80s | image514 | Mark Griffin |
| 80s | image106 | Mark Griffin |
| 80s | image167 | Michael van Rensburg |
| 80s | image89 |  |
| 80s | image596 | Cecil Lyons; Alan Froneman; Michael van Rensburg |
| 80s | image795 | Michael van Rensburg |
| 80s | image15 | Phillip Schaffer; Michael van Rensburg |
| 80s | image549 | Michael van Rensburg |
| 80s | image267 | Michael van Rensburg |
| 80s | image631 | Michael van Rensburg |
| 80s | image402 | Steven Roche; Neil Dundas |
| 80s | image350 | Michael van Rensburg |
| 80s | image145 | Spencer Pillay |
| 80s | image508 | Michael van Rensburg |
| 80s | image677 | Seyton Machattie; Leonardo Lupini |
| 80s | image45 | Leigh Downing; Henri Davies; Jenny Jarvis |
| 80s | image397 | Louis de Araujo; Michael van Rensburg |
| 80s | image184 | Michael van Rensburg |
| 80s | image809 | Louis de Araujo |
| 80s | image781 | Louis de Araujo |
| 80s | image71 | Tanya van Agthoven |
| 80s | image147 | Steven Roche; Trevor Norris; Neil Dundas |
| 80s | image730 | Mark Griffin; Spencer Pillay; Seyton Machattie |
| 80s | image137 | Peter Moffat; Steven Roche |
| 80s | image219 | Murray Scannell; Peter Harris; Patrick Brill |
| 80s | image125 | Patrick Brill; Maxi Spazzoli |
| 80s | image324 | Mark Griffin; Gavin Woolf; Spencer Pillay |
| 80s | image620 | Mark Griffin; Seyton Machattie |
| 80s | image802 | Gillian Lenton; Mark Griffin; Seyton Machattie |
| 80s | image566 | Alan Watt; Derek Lavarack; Noel Osborne; Patrick Brill; Stephen Pritchard; Henri Davies |
| 80s | image11 | Gavin Woolf; Jackie Woolf |
| 80s | image586 | Rene Kent; Noel von Wildenrath |
| 80s | image23 | Anina Cummings; Christine Popoff; Kerry Bennett; Patrick Brill |
| 80s | image116 | Thelma |
| 80s | image747 | Henri Davies; Kerry Bennett; Lianne Basson; Linda Basson; Marcel Wishura; Alex Botha |
| 80s | image424 | Tanya van Agthoven; Eddie Da Lima |
| 80s | image185 | Maxi Spazzoli; Patrick Brill; Stephen Doubell |
| 80s | image378 | Louis de Araujo |
| 80s | image257 | Henri Davies; Patrick Brill; Louis de Araujo |
| 80s | image477 | Gillian Lenton |
| 80s | image720 | Louis de Araujo |
| 80s | image276 | Treva Norris |
| 80s | image440 | Maxi Spazzoli; Patrick Brill; Lynton Lefevre |
| 80s | image9 | Patrick Brill; Lynton Lefevre |
| 80s | image865 | Henri Davies; Noel Osborne; Wayne Kobusch; Mark Dingley |
| 80s | image327 | Ian Perry |
| 80s | image703 | Henri Davies |
| 80s | image708 | Barbara Lindsey; Kerry Bennett; Maxi Spazzoli; Patrick Brill |
| 80s | image12 | Henri Davies |
| 80s | image68 | Mark Griffin |
| 80s | image31 | Leigh Downing; Tanya van Agthoven |
| 80s | image478 | Treva Norris |
| 80s | image410 | Trevor Norris; Michael Hunter Smith |
| 80s | image707 | Trevor Norris; Michael Hunter Smith; Mark Griffin |
| 80s | image286 | Louis Card; Louis de Araujo |
