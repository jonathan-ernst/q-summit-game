# Q-Summit: Konferenztag

Ein kleines Browser-Spiel: Du bist im Vorstand, heute ist Konferenz, und von 8 bis 19 Uhr musst du Team, Erstis, Partner, Speaker, Gäste und Budget bei Laune halten. Fällt ein Wert auf 0, ist der Tag gelaufen.

## Spielen

`index.html` im Browser öffnen. Das ganze Spiel steckt in dieser einen Datei, ohne Server und ohne Installation.

## Neue Events hinzufügen

In `index.html` gibt es oben im Script die Liste `EVENTS`. Ein neues Event sieht so aus:

```js
{ id: "eindeutiger_name", from: 10, to: 14, avatar: "🙃", who: "Name", role: "Rolle",
  text: "Was passiert?",
  a: { label: "Option A", fx: { team: 5, budget: -10 } },
  b: { label: "Option B", fx: { gaeste: -5 } } },
```

- `from` / `to`: Uhrzeit (Stunden), in der das Event auftauchen kann
- `fx`: Stat-Änderungen. Möglich sind `team`, `erstis`, `partner`, `speaker`, `gaeste` und `budget`
- `sets: "flag"` an einer Option und `requires: "flag"` an einem anderen Event: Damit lassen sich Folge-Events bauen

## Mini-Games

- **Einlass-Rush** (ca. 8:20): Gäste mit Ticket antippen
- **Mic-Check** (ca. 13:30): Regler im grünen Bereich stoppen
