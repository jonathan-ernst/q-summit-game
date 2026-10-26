# Q-Summit: Feel the Q Spirit

Ein Pixel-Art-Spiel im Browser: Du bist Chair der Q-Summit und läufst zwei Konferenztage lang durchs Schloss. Leute aus dem Team brauchen dich, das Handy klingelt ständig, und du musst Team, Erstis, Partner, Speaker, Participants und Budget bei Laune halten bis zur Afterparty. Fällt ein Wert auf 0, ist die Q vorbei.

## Spielen

`index.html` im Browser öffnen. Das ganze Spiel steckt in dieser einen Datei, ohne Installation. Nur die Pixel-Schriften werden von Google Fonts geladen, ohne Internet fällt es auf eine Standardschrift zurück.

**Steuerung:** Tippen oder klicken zum Laufen, WASD oder Pfeiltasten, E zum Reden, P fürs Handy, Esc für Pause.

## Was drin ist

- **Karte:** Ehrenhof mit blauem Teppich, Foyer mit Check-in, Goodie Bags und Garderobe, SO108 mit Mainstage, Hays Forum mit Müslibar, Qube, Speaker-Lounge, Hackathon-Raum und das Innovillage mit Booths, Essenszelten, Entertainment-Ecke und Themenabend-Bühne
- **Leute:** das Team aus dem Organigramm, Participants, Investoren und Partner an den Booths. Sie laufen nach Tagesablauf: morgens am Check-in, zur Opening Speech in SO108, mittags an den Essenszelten, abends am Themenabend
- **Aufgaben:** Wer ein ❗ über dem Kopf hat, braucht eine Entscheidung. Wer zu lange wartet, entscheidet selbst, und zwar schlechter
- **Handy:** Gruppenchats (Board, Team, Erstis, Partner, Finance, Marketing, Mama) mit Hintergrund-Nachrichten und Entscheidungen per Antwort
- **Szenen:** Intro, Opening Speech, Themenabend, Pitchbattle-Siegerehrung, Closing Speech und Afterparty
- **Minigames:** Goodie Bags packen, Badge-Ausgabe, Mic-Check (Opening und Pitchbattle)
- **Pause & Dashboard** (⏸ oder Esc): Übersicht mit Score und Verlauf aller Werte, Ersti-Schichtplan (8 Gruppen auf Check-in, Garderobe, Booths, Speaker, Catering und Pause verteilen), Maßnahmen einmal pro Tag, Tagesablauf und Log aller Entscheidungen
- **Tag und Nacht:** Abends wird es dunkel, Lichterketten und Bühnenlicht gehen an, bei der Afterparty gibt es Disco-Licht

## Inhalte ergänzen

Alles Inhaltliche steht oben im Script, vor dem Abschnitt `ENGINE`:

- `EVENTS`: Entscheidungen. Mit `loc` wartet die Person an diesem Ort, mit `chat` kommt die Frage aufs Handy
- `AMBIENT`: Chat-Nachrichten ohne Entscheidung
- `SCENES`: Story-Szenen mit Uhrzeit
- `TEAM`: Namen, Rollen, Haarfarbe und Stammplatz der Teammitglieder
- `LOCS`: Orte auf der Karte
- `STATIONS`, `ACTIONS`, `AGENDA`: Schichtplan, Maßnahmen und Programm im Dashboard

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
