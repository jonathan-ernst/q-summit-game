# Q-Summit: Feel the Q Spirit

Ein Pixel-Art-Spiel im Browser: Du bist Chair der Q-Summit und läufst zwei Konferenztage lang durchs Schloss. Leute aus dem Team brauchen dich, das Handy klingelt ständig, und du musst Team, Erstis, Partner, Speaker, Participants und Budget bei Laune halten bis zur Afterparty. Fällt ein Wert auf 0, ist die Q vorbei.

## Spielen

Online: **https://jonathan-ernst.github.io/q-summit-game/** (läuft auch am Handy)

Oder `index.html` im Browser öffnen. Das ganze Spiel steckt in dieser einen Datei, ohne Installation. Nur die Pixel-Schriften werden von Google Fonts geladen, ohne Internet fällt es auf eine Standardschrift zurück.

**Steuerung:** Tippen oder klicken zum Laufen, WASD oder Pfeiltasten, E zum Reden, P fürs Handy, M für die Karte, Esc für Pause.

## Was drin ist

- **Intro:** Wecker am Q-Day (Schlummern oder Aufstehen), Fahrt mit der Linie 5, Ankunft an der Haltestelle Schloss, Kamerafahrt über den Ehrenhof
- **Karte nach dem echten Schloss:** Bismarckstraße mit Straßenbahn, Ehrenhof mit Statuen, Rasen und blauem Teppich, Mittelbau mit Fahne, Foyer im Ehrenhof Ost (Check-in, Treppenhaus, Infopoint, Garderobe), SO108 mit Mainstage, Speaker-Lounge, Hackathon-Raum, Hays Forum mit Koro-Müslibar, Qube und der Schneckenhof als geschlossener Innenhof mit Innovillage, Bühne, Bar, Essenszelten und Lichterketten
- **First-Person-Sicht:** Gespräche werden aus deiner Sicht gezeigt, mit großem Porträt und dem Ort im Hintergrund. Reden auf der Mainstage siehst du von der Bühne aus ins Publikum, das live reagiert
- **Echte Partner und Speaker 2026** (laut q-summit.com): Booths von PERI, Schwarz Gruppe, Dronivo, KPMG und weiteren, 20 Speaker laufen durchs Schloss. Was sie im Spiel sagen und wann sie da sind, ist ausgedacht
- **Minigames:** Goodie Bags, Badge-Ausgabe, Infopoint, Mic-Check, Opening- und Closing-Rede (Redezeilen wählen, Hype-Meter), Pitchbattle-Siegerehrung (Trommelwirbel-Timing), Dance-Off bei der Afterparty
- **Handy:** Homescreen mit Chats, Speaker-Album (Selfies sammeln), Q-App mit Ablauf und Erfolgen
- **Leben in der Welt:** Sprechblasen, Schlosstauben, Straßenbahnen, Energie und Kaffee, Tag-Nacht-Wechsel mit leuchtenden Fenstern, Musik
- **16 Erfolge**, die im Browser gespeichert bleiben, und ein Tutorial beim ersten Start
- **Pause & Dashboard** (⏸ oder Esc): Übersicht, Ersti-Schichtplan, Maßnahmen, Ablauf, Log
- **Ende:** Titelseite des „Quadrate-Kurier“ mit Foto von der Afterparty und Geschichten zu deinen Entscheidungen

## Inhalte ergänzen

Alles Inhaltliche steht oben im Script, vor dem Abschnitt `ENGINE`:

- `EVENTS`: Entscheidungen. Mit `loc` wartet die Person an diesem Ort, mit `chat` kommt die Frage aufs Handy
- `AMBIENT`: Chat-Nachrichten ohne Entscheidung. Mit `requires: "flag"` kommen sie nur nach einer bestimmten Entscheidung
- `SCENES`: Story-Szenen mit Uhrzeit
- `TEAM`: Namen, Rollen, Haarfarbe und Stammplatz der Teammitglieder
- `LOCS`: Orte auf der Karte
- `STATIONS`, `ACTIONS`, `AGENDA`: Schichtplan, Maßnahmen und Programm im Dashboard
- `SPEAKERS`, `BOOTH_SIGNS`, `SPEECHES`, `BARKS`, `ACHIEVEMENTS`, `NEWS_STORIES`: Speaker, Booth-Schilder, Reden, Sprechblasen, Erfolge und Zeitungsgeschichten

Ein Event sieht so aus:

```js
{ id: "eindeutiger_name", day: 1, from: 10, to: 14, loc: "innovillage", who: "Lennart",
  text: "Was passiert?",
  a: { label: "Option A", fx: { team: 5, budget: -10 } },
  b: { label: "Option B", fx: { participants: -5 } } },
```

- `day`: `1` oder `2`. Weglassen bedeutet, dass das Event an beiden Tagen kommen kann
- `from` / `to`: Uhrzeit (Stunden), in der das Event auftauchen kann
- `fx`: Stat-Änderungen. Möglich sind `team`, `erstis`, `partner`, `speaker`, `participants` und `budget`
- `sets: "flag"` an einer Option und `requires: "flag"` an einem anderen Event: Damit lassen sich Folge-Events bauen

## Balance testen

`tools/balance-sim.js` spielt die echte Engine im Zeitraffer mit Bots durch. Dafür das Spiel über einen lokalen Server öffnen (zum Beispiel `python3 -m http.server` im Projektordner), dann in der Browser-Konsole:

```js
await import("./tools/balance-sim.js");
simMany("human", 50);                  // normaler Spieler
simMany("human", 50, { skipRate: .2 }); // verpasst jede 5. Aufgabe
simMany("good", 30); simMany("random", 30); simMany("lazy", 20);
localStorage.removeItem("qs_best");     // Bot-Rekorde wieder löschen
```

Stand jetzt: Gut gespielt landet bei etwa 85 Punkten, normal bei etwa 80 („Starke Q“), wer jede fünfte Aufgabe verpasst bei etwa 67. Zufälliges Klicken überlebt nicht.
