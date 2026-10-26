# Q-Summit: Feel the Q Spirit

Ein kleines Browser-Spiel: Du bist Chair der Q-Summit. Zwei Konferenztage im Schloss, sechs Divisions, und alle wollen etwas von dir. Halte Team, Erstis, Partner, Speaker, Participants und Budget bei Laune bis zur Afterparty. Fällt ein Wert auf 0, ist die Q vorbei.

## Spielen

`index.html` im Browser öffnen. Das ganze Spiel steckt in dieser einen Datei, ohne Server und ohne Installation.

## Ablauf

- **Tag 1** (07:30–22:00): Aufbau, Check-in, Opening Speech in SO108, Innovillage, Formate, Flagship Dinner und Themenabend
- **Über Nacht:** Team, Erstis und Budget erholen sich etwas
- **Tag 2** (08:00–20:00): Female Brunch, Qube, Pitchbattle, Closing Speech, dann die Afterparty als Abschluss

## Neue Events hinzufügen

In `index.html` gibt es oben im Script die Liste `EVENTS`. Ein neues Event sieht so aus:

```js
{ id: "eindeutiger_name", day: 1, from: 10, to: 14, avatar: "🙃", who: "Lennart", role: "Head of Partner",
  text: "Was passiert?",
  a: { label: "Option A", fx: { team: 5, budget: -10 } },
  b: { label: "Option B", fx: { participants: -5 } } },
```

- `day`: `1` oder `2`. Weglassen bedeutet, dass das Event an beiden Tagen kommen kann.
- `from` / `to`: Uhrzeit (Stunden), in der das Event auftauchen kann
- `fx`: Stat-Änderungen. Möglich sind `team`, `erstis`, `partner`, `speaker`, `participants` und `budget`
- `sets: "flag"` an einer Option und `requires: "flag"` an einem anderen Event: Damit lassen sich Folge-Events bauen

## Mini-Games

- **Goodie Bags packen** (Tag 1, ca. 07:50): die richtigen Sachen in die Bag
- **Badge-Ausgabe** (Tag 1, ca. 08:30): jeder Person das richtige Badge geben
- **Mic-Check Opening** (Tag 1, ca. 09:30) und **Mic-Check Pitchbattle** (Tag 2, ca. 14:30): Regler im grünen Bereich stoppen
