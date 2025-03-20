<?php
/**
 * Backend für das Kontaktformular
 * Verarbeitet die vom Frontend gesendeten Daten und sendet eine E-Mail
 */

// Fehlerberichterstattung für Debugging aktivieren (im Produktiveinsatz deaktivieren)
// error_reporting(E_ALL);
// ini_set('display_errors', 1);

// Starten der Session, falls benötigt
session_start();

// Definiere Header für JSON-Antwort
header('Content-Type: application/json');

// Überprüfe, ob das Formular per POST gesendet wurde
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'success' => false,
        'message' => 'Ungültige Anfragemethode. Bitte verwenden Sie POST.'
    ]);
    exit;
}

// Erforderliche Felder überprüfen
$required_fields = ['firstname', 'lastname', 'email', 'message'];
$missing_fields = [];

foreach ($required_fields as $field) {
    if (empty($_POST[$field])) {
        $missing_fields[] = $field;
    }
}

if (!empty($missing_fields)) {
    echo json_encode([
        'success' => false,
        'message' => 'Bitte füllen Sie alle Pflichtfelder aus.',
        'missing_fields' => $missing_fields
    ]);
    exit;
}

// Datenschutz-Checkbox überprüfen
if (!isset($_POST['privacy']) || $_POST['privacy'] !== 'true') {
    echo json_encode([
        'success' => false,
        'message' => 'Bitte stimmen Sie der Verarbeitung Ihrer Daten zu.'
    ]);
    exit;
}

// Daten aus dem Formular holen und bereinigen
$firstname = filter_input(INPUT_POST, 'firstname', FILTER_SANITIZE_STRING);
$lastname = filter_input(INPUT_POST, 'lastname', FILTER_SANITIZE_STRING);
$email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
$message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_STRING);

// E-Mail-Validierung
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        'success' => false,
        'message' => 'Bitte geben Sie eine gültige E-Mail-Adresse ein.'
    ]);
    exit;
}

// Schutz vor CSRF-Angriffen (Cross-Site Request Forgery)
// In einer echten Anwendung sollte hier ein CSRF-Token überprüft werden

// Schutz vor Spam durch einfachen Honeypot
// Im Frontend könnte man ein verstecktes Feld hinzufügen, das nur von Bots ausgefüllt wird
if (isset($_POST['honeypot']) && !empty($_POST['honeypot'])) {
    // Scheinbar erfolgreiche Antwort zurückgeben, aber nichts tun
    echo json_encode(['success' => true]);
    exit;
}

// Optional: Einfachen Spam-Schutz durch Überprüfung, wie schnell das Formular abgeschickt wurde
// Ein Bot würde das Formular sehr schnell abschicken
$submission_time = time();
$min_time = 3; // Mindestzeit in Sekunden zum Ausfüllen des Formulars

if (isset($_SESSION['form_started']) && ($submission_time - $_SESSION['form_started'] < $min_time)) {
    // Zu schnell ausgefüllt, wahrscheinlich ein Bot
    echo json_encode(['success' => false, 'message' => 'Das Formular wurde zu schnell abgesendet. Bitte versuchen Sie es erneut.']);
    exit;
}

// Setze die Startzeit zurück
$_SESSION['form_started'] = $submission_time;

// Daten in Datenbank speichern (optional)
// Hier könnte eine Datenbankverbindung und INSERT-Query erfolgen
// Für Einfachheit hier auskommentiert

/*
try {
    $db = new PDO('mysql:host=localhost;dbname=deine_datenbank', 'benutzername', 'passwort');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $stmt = $db->prepare("INSERT INTO contact_messages (firstname, lastname, email, message, created_at) 
                         VALUES (:firstname, :lastname, :email, :message, NOW())");
    
    $stmt->bindParam(':firstname', $firstname);
    $stmt->bindParam(':lastname', $lastname);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':message', $message);
    
    $stmt->execute();
} catch (PDOException $e) {
    error_log("Datenbankfehler: " . $e->getMessage());
    // Für Produktivumgebung nur generische Fehlermeldung anzeigen
    echo json_encode(['success' => false, 'message' => 'Es ist ein Problem aufgetreten. Bitte versuchen Sie es später erneut.']);
    exit;
}
*/

// E-Mail erstellen und senden
$to = 'info@meine-domain.de'; // Ändere dies zu deiner E-Mail-Adresse
$subject = 'Neue Kontaktanfrage von ' . $firstname . ' ' . $lastname;

// E-Mail-Header für bessere Kompatibilität und Spam-Schutz
$headers = [
    'From' => $email,
    'Reply-To' => $email,
    'X-Mailer' => 'PHP/' . phpversion(),
    'MIME-Version' => '1.0',
    'Content-Type' => 'text/html; charset=UTF-8'
];

// E-Mail-Inhalt (HTML)
$email_content = '
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Neue Kontaktanfrage</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        h1 { color: #002366; border-bottom: 2px solid #ffde21; padding-bottom: 10px; }
        .info { margin-bottom: 20px; }
        .message { background-color: #f5f5f5; padding: 15px; border-radius: 5px; }
        .footer { margin-top: 30px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Neue Kontaktanfrage</h1>
        <div class="info">
            <p><strong>Name:</strong> ' . htmlspecialchars($firstname) . ' ' . htmlspecialchars($lastname) . '</p>
            <p><strong>E-Mail:</strong> ' . htmlspecialchars($email) . '</p>
            <p><strong>Datum:</strong> ' . date('d.m.Y H:i') . '</p>
        </div>
        <div class="message">
            <p><strong>Nachricht:</strong></p>
            <p>' . nl2br(htmlspecialchars($message)) . '</p>
        </div>
        <div class="footer">
            <p>Diese E-Mail wurde automatisch vom Kontaktformular Ihrer Website gesendet.</p>
        </div>
    </div>
</body>
</html>';

// E-Mail versenden
$mail_sent = mail($to, $subject, $email_content, $headers);

// Ergebnisbehandlung
if ($mail_sent) {
    // Erfolg
    echo json_encode([
        'success' => true,
        'message' => 'Vielen Dank für Ihre Nachricht! Ich werde mich so bald wie möglich bei Ihnen melden.'
    ]);
} else {
    // Fehler beim Senden der E-Mail
    error_log("E-Mail konnte nicht gesendet werden.");
    echo json_encode([
        'success' => false,
        'message' => 'Beim Senden Ihrer Nachricht ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut oder kontaktieren Sie mich direkt unter ' . $to
    ]);
}