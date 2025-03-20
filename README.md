# Digitaler Lebenslauf - Webseite

Eine professionelle, responsive Website zur Präsentation deines Lebenslaufs, deiner Projekte und Kontaktinformationen. Die Seite funktioniert als digitale Visitenkarte und Portfolio.

## Funktionen

- Responsive Design für alle Geräte
- Kreative, animierte Timeline für den Lebenslauf
- Projektseite mit Filterfunktion
- Kontaktformular mit Backend-Verarbeitung
- Login-System für zukünftige Verwaltungsfunktionen
- Animationen mit GSAP und ScrollTrigger
- Datenbankunterstützung für dynamische Inhalte

## Farbschema

- Primärfarbe: `#002366` (Dunkelblau)
- Sekundärfarbe: `#ffffff` (Weiß)
- Akzentfarbe: `#ffde21` (Gelb)

## Projektstruktur

```
/
├── index.html                # Startseite
├── lebenslauf.html           # Lebenslauf-Seite mit Timeline
├── projekte.html             # Projektübersicht mit Filterung
├── kontakt.html              # Kontaktformular und Informationen
├── css/
│   └── style.css             # Hauptstilblatt
├── js/
│   ├── main.js               # Allgemeine Funktionen
│   ├── timeline.js           # Lebenslauf-Timeline
│   ├── projects.js           # Projektfilterung
│   └── contact.js            # Kontaktformular
├── backend/
│   ├── contact_form.php      # Verarbeitung des Kontaktformulars
│   └── login.php             # Login-System
└── db/
    └── db_setup.sql          # Datenbankschema
```

## Installation

### Voraussetzungen

- Webserver mit PHP-Unterstützung (Apache, Nginx, etc.)
- MySQL/MariaDB-Datenbank
- PHP 7.4 oder höher

### Schritte

1. **Dateien hochladen**
   - Lade alle Dateien in das Wurzelverzeichnis deines Webservers hoch

2. **Datenbankeinrichtung**
   - Erstelle eine MySQL-Datenbank für die Website
   - Importiere die Datei `db/db_setup.sql` in deine Datenbank

3. **Datenbankverbindung konfigurieren**
   - Öffne die PHP-Dateien im `backend`-Verzeichnis
   - Aktualisiere die Datenbankverbindungsinformationen (Server, Benutzername, Passwort, Datenbankname)

4. **E-Mail-Konfiguration**
   - Bearbeite die Datei `backend/contact_form.php`
   - Aktualisiere die E-Mail-Adresse, an die Kontaktformular-Nachrichten gesendet werden sollen

5. **Anpassen der Inhalte**
   - Bearbeite die HTML-Dateien, um deine eigenen Informationen hinzuzufügen
   - Aktualisiere die Projekte, Lebenslaufdaten und Kontaktinformationen

## Anpassung

### Inhalte ändern

1. **Persönliche Informationen**
   - Öffne die HTML-Dateien und bearbeite die Texte und Links
   - Aktualisiere die Informationen im Footer auf allen Seiten

2. **Lebenslauf**
   - Bearbeite die `lebenslauf.html`-Datei, um deine eigenen Bildungs- und Berufserfahrungen hinzuzufügen
   - Passe die Timeline-Einträge an deine Karriere an

3. **Projekte**
   - Füge deine eigenen Projekte in der `projekte.html`-Datei hinzu oder entferne die Beispielprojekte
   - Aktualisiere die Projektbeschreibungen, Tags und Links

### Design anpassen

1. **Farbschema ändern**
   - Öffne `css/style.css` und suche nach den CSS-Variablen am Anfang der Datei
   - Ändere die Farben nach deinen Wünschen

2. **Schriftarten**
   - Du kannst die Schriftarten im CSS ändern oder Google Fonts einbinden

3. **Layout**
   - Passe die CSS-Regeln an, um das Layout an deine Bedürfnisse anzupassen

## Zukünftige Entwicklung

Die Website ist bereits für eine zukünftige Erweiterung mit einem Login-System vorbereitet. Mit dem Login können später folgende Funktionen implementiert werden:

- Admin-Dashboard zur Verwaltung von Inhalten
- Bearbeitung des Lebenslaufs über ein Formular
- Verwaltung von Projekten ohne Codeänderungen
- Anzeige und Verwaltung von Kontaktformular-Nachrichten

## Technologien

- HTML5
- CSS3
- JavaScript (ES6+)
- PHP für Backend-Funktionalität
- MySQL/MariaDB für Datenbankunterstützung
- GSAP für Animationen
- Font Awesome für Icons

## Lizenz

Dieses Projekt kann frei für persönliche und kommerzielle Zwecke verwendet werden. Eine Namensnennung ist nicht erforderlich.

## Kontakt

Bei Fragen oder Problemen kannst du mich unter der auf der Kontaktseite angegebenen E-Mail-Adresse erreichen.