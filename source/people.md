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
| Patrick Brill | Patrick Brilland | yes |
| Michael Crouch |  |  |
| Michael Hunter Smith | Michael Hunter |  |
| Mark Griffin |  |  |
| Mark Lowe |  |  |
| Mark Davis |  |  |
| Mark Cioli |  |  |
| Sally Fisher | Sally Fiisher |  |
| Sally Chance |  |  |
| Lauren Shipton |  |  |
| Lauren Estagarribia | Lauren Estagaribia |  |
| Rene Kent |  |  |
| Gillian Lenton |  |  |
| Seyton Machattie | Seaton |  |
| Barrie Hadfield | Barrie Hdafield; Barrie Hdfield |  |
| Garth Gething |  |  |
| Garth Marquard |  |  |
| Peter Moffat | Peter Moffatt; Petal |  |
| Peter White |  |  |
| Peter Wishart |  |  |
| Peter Wheeler |  |  |
| Peter Pienaar |  |  |
| Peter Harris |  |  |
| Peter Amsden |  |  |
| Kevin Rogers |  |  |
| Kevin Botha |  |  |
| Kevin MacInnes | Kevin McInnes; Kevin Mac; Kevin Mc |  |
| Louis Card |  |  |
| Neil Starr |  |  |
| Neil Dundas |  |  |
| Neil Farrelly |  |  |
| Ian Perry |  |  |
| Ian Swan |  |  |
| Cindy West |  |  |
| Kerry Bennett |  |  |
| Jackie Bryant |  |  |
| Trevor Norris |  |  |
| Karen Ward |  |  |
| David Goudge |  |  |
| David Davies |  |  |
| David Ralphs |  |  |
| David Ross |  |  |
| David Wannamaker |  |  |
| Douglas Austin | Douglas |  |
| Richard Rufus Ellis | Rufus Ellis |  |
| Richard Lawton |  |  |
| Richard Yell |  |  |
| Arthur Garrod | Arthur |  |
| Cheryl Johnson | Cheryl Johhnson |  |
| Cheryl Schultz |  |  |
| Jenna |  |  |
| Brettlee Walker | Bretlee; Brettlee |  |
| Joan Dickman |  |  |
| Darryl Rogers |  |  |
| Illana Woolf | Illana Woolfe |  |
| Rory West |  |  |
| Spencer Pillay |  |  |
| Stephen Pritchard |  |  |
| Stephen Doubell |  |  |
| Colin Hutt |  |  |
| Gary Halfpenny |  |  |
| Gary Moore |  |  |
| Gary Searle |  |  |
| Treva Norris | Treva |  |
| Noel Osborne |  |  |
| Leigh Downing |  |  |
| Alan Whitehead |  |  |
| Alan Horn |  |  |
| Alan Morrison |  |  |
| Alan Froneman | Alice |  |
| Alan Watt |  |  |
| Maxi Spazzoli |  |  |
| Leonardo Lupini | Leonardo |  |
| Gavin Woolf | Gavin Woolfe |  |
| Marcel Wishura |  |  |
| Mathew Kelly |  |  |
| Heather Roche |  |  |
| Luke Davies |  |  |
| Rowan |  |  |
| Keith Schultz |  |  |
| Dale Schultz | Dale Shultz |  |
| Craig Peetz |  |  |
| Graham Moore |  |  |
| Tom Collins |  |  |
| Murray Scannell | Murray Scanell |  |
| Carolyn de Beyer | Carolyn |  |
| Penny Brill | Pennay |  |
| Penny Rey |  |  |
| Frank Melman |  |  |
| Tanya van Agthoven | Tanya |  |
| Lisa Owen |  |  |
| Rodney Symes |  |  |
| Vanessa |  |  |
| Pam Harmse |  |  |
| Sophie Symes |  |  |
| Thelma |  |  |
| Tony Gois | Toni Gois |  |
| Wally Hayward | Wally Haywood; Wally Hatward |  |
| Janet Doby | Janet Dobey |  |
| Bernard Hatch |  |  |
| Linda Basson |  |  |
| Adele Shandel |  |  |
| Duncan Good | Duncan |  |
| Liz Good |  |  |
| Liz Staniford |  |  |
| Rafe Brown |  |  |
| Neville Letard |  |  |
| Glenda Holmes |  |  |
| Herb Klein |  |  |
| Stephane |  |  |
| Francois |  |  |
| James Moffat | James Moffatt |  |
| Chloe Rolfes |  |  |
| Guy Woods |  |  |
| Eric Reeves |  |  |
| Lesley Wallace | Leslie Wallace; Leslie |  |
| Ronnie Botha |  |  |
| Elaine Welsh |  |  |
| Mario Rodrigues |  |  |
| Sharon Coetsee |  |  |
| Sharon Spradbury |  |  |
| Gail Butler | Gael Butler |  |
| Lianne Basson |  |  |
| Myra Cowell |  |  |
| Cecil Sagorin |  |  |
| Cecil Lyons |  |  |
| Lee Fine |  |  |
| Christine Popoff |  |  |
| Jonathan Arun |  |  |
| Priscilla Blackie |  |  |
| Nicola Blackie |  |  |
| Megan Blackie |  |  |
| Ruben Singer |  |  |
| Roy Weir |  |  |
| Dickie Conradie |  |  |
| Margaret Mott Adams | Margaret Mott |  |
| Conrad Coward | Conrad |  |
| Lawrence Potgieter |  |  |
| Mirco Broggian |  |  |
| Tamar Marquard | Tamar Marqaud |  |
| Wayne Kobusch |  |  |
| Jenny Bear |  |  |
| Bryan Brett |  |  |
| Albert Eloff |  |  |
| Barbara Lindsey |  |  |
| Terry Scott |  |  |
| Jeffery Sanker |  |  |
| Phillip Schaffer |  |  |
| Andries Botha |  |  |
| Derek Lavarack | Derek Lavarak |  |
| Anina Cummings |  |  |
| Boyd Ferguson |  |  |
| Carl Isaacs |  |  |
| Carmen Laurier |  |  |
| Greg Davies |  |  |
| Oliver Ellis |  |  |
| Sean Keegan |  |  |
| Robbie Pfister |  |  |
| June Schmarmen |  |  |
| John Truex |  |  |
| Gregory Pierrotti |  |  |
| Chris Weir |  |  |
| Carla Thompson |  |  |
| Robert Johnson |  |  |
| Chin Soon |  |  |
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
| Steve Lawrence | Steven Lawrence; Steven Lawrences |  |
| Chi Chi La Rue | Chi Chi |  |
| Mark Dingley |  |  |
| Grace Jones |  |  |
| Neville Ward |  |  |
| Glenda Halfpenny |  |  |
| Debbie Reynolds |  |  |
| Carrie |  |  |
| Marcus |  |  |
| Sandra Scott |  |  |
| Elsa Pretorius |  |  |
| Eddie Da Lima | Eddy de Lima |  |
| Bruce Patterson |  |  |
| Jenny Jarvis |  |  |
| Jackie Woolf |  |  |
| Noel von Wildenrath |  |  |
| Alex Botha |  |  |
| Lynton Lefevre |  |  |
| Michael Cheze | Micheal Cheze |  |
| Kim Prue | Kim Pru; Kim |  |
| Patrick Talmadge | Doris |  |
| Michael McCann | Michael Mc Cann |  |
| Colin McGree | Colin Mc Gree |  |
| Jamie & Alfie | Jamie; Alfie |  |
| Greg Reichman |  |  |
| Peter Cole |  |  |
| Joan Johnson |  |  |
| Graham Doubell |  |  |
| Karen Hollister |  |  |
| Nicola Pritchard |  |  |
| Graham Simpson |  |  |
| Anthony Harris |  |  |
| Richard Plank |  |  |
| Wayne Gates |  |  |
| Derek Butler |  |  |
| Peter Wasp |  |  |
| Peter Shanley |  |  |
| Mark Estagaribia |  |  |
| Gary Williams |  |  |
| Michael Rhodes |  |  |
| John Bekker |  |  |
| Chris Levin |  |  |
| Wayne Saville |  |  |
| Jackie Woolfe |  |  |
| Garth Falkner |  |  |
| Kevin Halcut |  |  |
| Darryl Roffey |  |  |
| Jeremy Taylor |  |  |
| Hilton Davis |  |  |
| Brian Haddock |  |  |
| Aubrey Walsh |  |  |
| Butch Loggenberg |  |  |
| Blane Mackintosh |  |  |
| Peet Coetzee |  |  |
| Dudu Mkhize |  |  |
| Brian Hirst |  |  |
| Dudley Manicom |  |  |
| Eddy Palland |  |  |
| Leanne Basson |  |  |
| Warwick May |  |  |
| Charlie Brown |  |  |
| Ivan Kruger |  |  |
| Simon Trace |  |  |
| Rod Gallagher |  |  |
| Fred Prior |  |  |
| Philip Lee |  |  |
| Andre Naude |  |  |
| Granny Lee |  |  |
| Carol Doubell |  |  |
| Michelle Barfoot |  |  |
| Deanne Halfon |  |  |
| Denise Britz |  |  |
| Gordon Seaman |  |  |
| Daniel Woolfe |  |  |
| Josef Talotta |  |  |
| Andrew Irving |  |  |
| Martie Malan |  |  |
| Elsie Davies |  |  |
| Todd Barry |  |  |
| Jean de Cruz |  |  |
| Paul du Plessis |  |  |
| Chantal de Vries |  |  |
| Tony de Klerk |  |  |
| Choo |  |  |
| Danny |  |  |
| Alwyn |  |  |
| Horst |  |  |
| Casper |  |  |
| Karl |  |  |
| Suzie |  |  |
| Shaun |  |  |
| Johann |  |  |
| Ricky |  |  |
| Albie |  |  |
| Miguel |  |  |
| Simone |  |  |
| Lindi |  |  |
| Susie |  |  |
| Cristina |  |  |
| Hayley |  |  |
| Jayshree |  |  |
| Spiro |  |  |
| Nicky |  |  |
| Caroline |  |  |
| Breda |  |  |
| Dada |  |  |
| Shlommie |  |  |
| Brad |  |  |
| Nicole |  |  |
| Allen |  |  |
| Jessie |  |  |
| Janiece |  |  |
| Didier |  |  |
| Jeneanne |  |  |
| Stephan |  |  |
| Barry |  |  |
| Carol |  |  |
| Brian Louis |  |  |
| Alfie Saville |  |  |
| Alfie Bosman |  |  |
| Karen |  |  |
| Marc Watson |  |  |
| Greg Hammond |  |  |
| Cyril Shevitz |  |  |
| John Simpson |  |  |
| Lee |  |  |
| Lyn van Wildenrath |  |  |

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
| 2000 | image18 | Graham Moore; Marc Watson; James Moffat; Peter Moffat |
| the-stardust | image348 | Lauren Shipton |
| the-stardust | image659 | Henri Davies; Darryl Rogers |
| the-stardust | image902 | Ian Perry; Lauren Shipton |
| the-stardust | image550 | Lauren Shipton |
| the-stardust | image759 | Peter Pienaar; Ian Perry |
| the-boudoir | image302 | Steven Roche; Jackie Bryant; Mark Griffin |
| the-boudoir | image909 | Margaret Mott Adams; Patrick Brill; Steven Roche; Joan Johnson |
| 70s | image910 | Michael Hunter Smith |
| 70s | image462 | Trevor Norris; Sally Fisher |
| 70s | image607 | Richard Rufus Ellis; Steven Roche; Sally Fisher |
| 70s | image683 | Karen; Sally Fisher |
| 70s | image242 | Michael Hunter Smith |
| 70s | image718 | Lauren Shipton |
| 70s | image763 | Lauren Shipton |
| 70s | image403 | Darryl Rogers |
| 70s | image1106 | Craig Peetz; Greg Reichman; Ian Perry; Noel von Wildenrath |
| 70s | image975 | Ian Perry; Noel von Wildenrath |
| 70s | image356-2 | Craig Peetz; Greg Reichman; Noel von Wildenrath |
| 80s | image606 | Steven Roche; Lauren Shipton |
| 80s | image65 | Ian Perry; Steven Roche |
| 80s | image872 | Lauren Shipton |
| 80s | image776 | Patrick Brill; Garth Gething |
| 80s | image461 | David Goudge |
| 80s | image273 | Rene Kent; Spencer Pillay; Lauren Shipton |
| 80s | image489 | Patrick Brill; Greg Hammond |
| 80s | image309 | Peter Moffat |
| 80s | image124 | Michael Hunter Smith; Cyril Shevitz |
| 80s | image322 | Stephen Pritchard |
| 80s | image58 | Gillian Lenton; Stephen Pritchard |
| 80s | image864 | Garth Gething |
| 80s | image63 | Steven Roche; Lauren Shipton |
| 80s | image754-2 | Patrick Brill; Lauren Shipton |
| 80s | image435 | Mark Griffin |
| 80s | image712 | Mark Griffin |
| 80s | image190 | Mark Griffin |
| 80s | image669 | Mark Griffin |
| 80s | image711 | Peter Moffat |
| 80s | image524 | Lauren Shipton; Sally Fisher |
| 80s | image519 | Steven Roche; Lauren Shipton |
| 80s | image520 | Ian Perry |
| 80s | image546 | Ian Perry |
| 80s | image305 | Mark Griffin |
| 80s | image124-2 | Lauren Shipton; Ian Perry |
| 80s | image1090 | Eddie Da Lima; Garth Gething; Tanya van Agthoven; Mark Dingley |
| 80s | image199 | Graham Moore; John Simpson |
| 80s | image2 | Rene Kent; Noel von Wildenrath |
| 90s | image250 | Steven Roche; Michael Hunter Smith |
| 90s | image275 | Neil Dundas; Michael Hunter Smith |
| 90s | image321 | Steven Roche; Sally Fisher |
| 90s | image205 | Karen Ward; Richard Rufus Ellis |
| 90s | image311 | Deanne Halfon; Michelle Barfoot; Sally Chance; Mark Dingley |
| 90s | image232 | Carmen Laurier; Carrie; Rafe Brown; Mark Dingley |
| 90s | image874 | Patrick Brill; Steven Roche; Michael Hunter Smith |
| 90s | image231 | Robert Johnson; Cheryl Johnson |
| 90s | image113 | Steven Roche; Jackie Bryant |
| 90s | image696 | Choo; Michael Hunter Smith; Steven Roche; Kevin MacInnes |
| 90s | image813 | Steven Roche; Sally Fisher |
| 90s | image534 | Sally Fisher; Patrick Brill; Kevin MacInnes |
| 90s | image717 | Steven Roche; Kevin MacInnes |
| 90s | image691 | Michael Hunter Smith |
| 90s | image599 | Peter Amsden; Lauren Shipton |
| 90s | image722 | Louis de Araujo |
| 90s | image628 | Louis de Araujo |
| 90s | image468 | Michael Hunter Smith |
| 90s | image680-2 | Michael Hunter Smith |
| 90s | image390 | Patrick Brill; Michael Hunter Smith |
| 90s | image119 | Sally Fisher |
| 90s | image42 | Michael Hunter Smith; Patrick Brill; Neil Dundas |
| 90s | image721 | Michael Hunter Smith |
| 90s | image414 | Gillian Lenton; Michael Hunter Smith |
| 90s | image471 | Lisa Owen; Sally Fisher; Lee |
| 90s | image760 | Louis de Araujo |
| 90s | image241 | Louis de Araujo |
| 90s | image496 | Louis de Araujo |
| 90s | image826 | Patrick Brill; Louis de Araujo |
| 90s | image674 | Michael Hunter Smith |
| 90s | image2 | Rene Kent; Noel von Wildenrath |
| 90s | image76 | Noel von Wildenrath; Lyn van Wildenrath |
| 90s | image543 | Spencer Pillay; Michael Hunter Smith |
| 90s | image34 | Keith Schultz; Neil Dundas; Sally Fisher |
| 90s | image900 | Kevin MacInnes |
| 90s | image488 | Kevin MacInnes |
| 90s | image637 | Steven Roche; Sally Fisher; Richard Rufus Ellis |
| 90s | image531 | Peter Wishart; Garth Gething |
| 90s | image917 | Peter Wishart |
| 90s | image577 | Rafe Brown; Garth Gething |
| 90s | image417 | Adi Coetzee; Joan Dickman; Karen; Pam Harmse; Trevor Norris; Ian Perry; Peter Moffat; Sally Fisher; Jeanette Roche |
| 90s | image706 | Sean Keegan; Peter Moffat |
| 90s | image512 | Patrick Brill; Steven Roche; Kevin MacInnes |
| 90s | image723 | Todd Barry; Garth Gething |
| 90s | image343 | Steven Roche; Kevin MacInnes |
| 90s | image690 | Patrick Brill; Cheryl Johnson |
| 90s | image259 | Michael Hunter Smith; Neil Dundas; Arthur |
| 90s | image206 | Alan Whitehead; Choo; Colin Hutt |
| 90s | image207 | Mark Dingley |
| 90s | image511 | Jackie Bryant |
| 90s | image395 | Jackie Bryant |
| 90s | image551 | Michael van Rensburg |
| 90s | image123 | Robbie Pfister; Michael van Rensburg |
| 90s | image753 | Michael van Rensburg |
| 90s | image248 | Jackie Bryant |
| 90s | image923 | Neil Dundas |
| 90s | image237 | Ian Perry |
| 2000 | image495 | Garth Gething |
| 2000 | image626 | Michael Hunter Smith; Seyton Machattie; Noel von Wildenrath |
| 70s | image201-2 | Danny; Alan Whitehead |
