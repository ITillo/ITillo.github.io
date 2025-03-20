<?php
/**
 * Backend für das Login-System
 * Verarbeitet Login-Anfragen und erstellt Sessions für authentifizierte Benutzer
 */

// Starten oder Fortsetzen der Session
session_start();

// Fehlerberichterstattung für Debugging aktivieren (im Produktiveinsatz deaktivieren)
// error_reporting(E_ALL);
// ini_set('display_errors', 1);

// Definiere Header für JSON-Antwort
header('Content-Type: application/json');

// Überprüfe, ob die Anfrage per POST gesendet wurde
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'success' => false,
        'message' => 'Ungültige Anfragemethode. Bitte verwenden Sie POST.'
    ]);
    exit;
}

// Erforderliche Felder überprüfen
if (!isset($_POST['username']) || !isset($_POST['password']) || 
    empty($_POST['username']) || empty($_POST['password'])) {
    
    echo json_encode([
        'success' => false,
        'message' => 'Benutzername und Passwort sind erforderlich.'
    ]);
    exit;
}

// Benutzername und Passwort aus dem Formular holen und bereinigen
$username = filter_input(INPUT_POST, 'username', FILTER_SANITIZE_STRING);
$password = $_POST['password']; // Passwort nicht sanitisieren, da es gehashed wird

// Schutz vor Brute-Force-Angriffen
// Fehlgeschlagene Login-Versuche verfolgen
if (!isset($_SESSION['login_attempts'])) {
    $_SESSION['login_attempts'] = 0;
    $_SESSION['last_attempt'] = 0;
}

// Prüfen, ob maximale Anzahl an Versuchen überschritten wurde
$max_attempts = 5; // Maximale Anzahl von Versuchen
$lockout_time = 300; // Sperrzeit in Sekunden (5 Minuten)
$current_time = time();

if ($_SESSION['login_attempts'] >= $max_attempts && 
    ($current_time - $_SESSION['last_attempt']) < $lockout_time) {
    
    $remaining_time = $lockout_time - ($current_time - $_SESSION['last_attempt']);
    
    echo json_encode([
        'success' => false,
        'message' => 'Zu viele fehlgeschlagene Login-Versuche. Bitte versuchen Sie es in ' . 
                    ceil($remaining_time / 60) . ' Minuten erneut.'
    ]);
    exit;
}

// Hier beginnt die tatsächliche Authentifizierung

// In einer echten Anwendung würdest du hier eine Datenbankverbindung herstellen
// und die Benutzeranmeldedaten überprüfen.
// Der folgende Code ist ein einfaches Beispiel und sollte in einer Produktionsumgebung
// durch eine ordnungsgemäße Datenbankabfrage ersetzt werden.

/*
try {
    $db = new PDO('mysql:host=localhost;dbname=deine_datenbank', 'benutzername', 'passwort');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $stmt = $db->prepare("SELECT id, username, password FROM users WHERE username = :username");
    $stmt->bindParam(':username', $username);
    $stmt->execute();
    
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user || !password_verify($password, $user['password'])) {
        // Fehlgeschlagener Login-Versuch
        $_SESSION['login_attempts']++;
        $_SESSION['last_attempt'] = $current_time;
        
        echo json_encode([
            'success' => false,
            'message' => 'Ungültiger Benutzername oder Passwort.'
        ]);
        exit;
    }
    
    // Erfolgreicher Login
    // Login-Versuche zurücksetzen
    $_SESSION['login_attempts'] = 0;
    
    // Benutzerdaten in der Session speichern (ohne Passwort)
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['username'] = $user['username'];
    $_SESSION['logged_in'] = true;
    
    // Optional: Letzte Login-Zeit in der Datenbank aktualisieren
    $updateStmt = $db->prepare("UPDATE users SET last_login = NOW() WHERE id = :id");
    $updateStmt->bindParam(':id', $user['id']);
    $updateStmt->execute();
    
    echo json_encode([
        'success' => true,
        'message' => 'Login erfolgreich.'
    ]);
    
} catch (PDOException $e) {
    error_log("Datenbankfehler: " . $e->getMessage());
    
    echo json_encode([
        'success' => false,
        'message' => 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.'
    ]);
    exit;
}
*/

// FÜR DEMONSTRATIONSZWECKE: Hardcoded Benutzeranmeldedaten
// In einer echten Anwendung NIEMALS so implementieren!
// Passwörter sollten immer gehashed und gesalzen in einer Datenbank gespeichert werden.
$demo_username = 'admin';
$demo_password = 'password123'; // In einer echten Anwendung wäre dies ein gehashter Wert

if ($username === $demo_username && $password === $demo_password) {
    // Erfolgreicher Login
    
    // Login-Versuche zurücksetzen
    $_SESSION['login_attempts'] = 0;
    
    // Benutzerdaten in der Session speichern
    $_SESSION['user_id'] = 1;
    $_SESSION['username'] = $username;
    $_SESSION['logged_in'] = true;
    $_SESSION['login_time'] = time();
    
    echo json_encode([
        'success' => true,
        'message' => 'Login erfolgreich.',
        'user' => [
            'username' => $username,
            'role' => 'admin'
        ]
    ]);
} else {
    // Fehlgeschlagener Login-Versuch
    $_SESSION['login_attempts']++;
    $_SESSION['last_attempt'] = $current_time;
    
    echo json_encode([
        'success' => false,
        'message' => 'Ungültiger Benutzername oder Passwort.',
        'attempts_left' => $max_attempts - $_SESSION['login_attempts']
    ]);
}