-- Datenbank für die CV-Website erstellen
CREATE DATABASE IF NOT EXISTS cv_website;
USE cv_website;

-- Benutzer-Tabelle für das Login-System
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'editor', 'viewer') NOT NULL DEFAULT 'viewer',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login DATETIME,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Kontaktformular-Nachrichten
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Projekte-Tabelle
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    category ENUM('web', 'app', 'design') NOT NULL,
    image_url VARCHAR(255),
    icon_class VARCHAR(50),
    features TEXT,
    demo_url VARCHAR(255),
    code_url VARCHAR(255),
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Projekt-Tags
CREATE TABLE IF NOT EXISTS project_tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    tag_name VARCHAR(50) NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Lebenslauf-Einträge
CREATE TABLE IF NOT EXISTS cv_entries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    organization VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN NOT NULL DEFAULT FALSE,
    description TEXT,
    achievements TEXT,
    entry_type ENUM('education', 'employment', 'certificate') NOT NULL,
    position VARCHAR(50) NOT NULL DEFAULT 'left',
    display_order INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Fähigkeiten
CREATE TABLE IF NOT EXISTS skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    level INT NOT NULL DEFAULT 0,
    display_order INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Einstellungen für die Website
CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(50) NOT NULL UNIQUE,
    setting_value TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Beispieldaten einfügen (nur für Demonstrationszwecke)

-- Admin-Benutzer (Passwort sollte in der Realität gehashed sein)
INSERT INTO users (username, password, email, full_name, role)
VALUES ('admin', '$2y$10$eImiOhL5PtH1scxVXmF5IOZ9JUU3XoKIFgeUb.mMTJ6D8X0PbIaQC', 'admin@meine-domain.de', 'Admin User', 'admin');
-- Das Passwort ist 'password123', gehashed mit bcrypt

-- Beispiel-Projekte
INSERT INTO projects (title, description, category, icon_class, features, is_featured, display_order)
VALUES 
('E-Commerce Platform', 'Vollständige Webshop-Lösung mit Benutzerauthentifizierung, Produktkatalog, Warenkorb und Zahlungsabwicklung.', 
'web', 'fas fa-shopping-cart', 'Responsive Design für mobile und Desktop-Geräte\nSicheres Authentifizierungssystem\nIntegrierte Zahlungsabwicklung\nProduktverwaltungssystem für Administratoren', 
TRUE, 1),

('Responsive Portfolio', 'Dynamisches Portfolio für einen Fotografen mit anpassungsfähigem Layout für alle Geräte.', 
'design', 'fas fa-images', 'Dynamische Bildergalerie mit Filteroptionen\nLazy-Loading für optimale Performance\nKontaktformular mit Dateiupload-Möglichkeit\nBackend zur Verwaltung von Fotokategorien', 
TRUE, 2),

('Dashboard App', 'Interaktives Dashboard zur Visualisierung von Geschäftsdaten und Metriken.', 
'web', 'fas fa-chart-line', 'Echtzeit-Datenvisualisierung mit D3.js\nBenutzerdefinierte Filteroptionen und Zeiträume\nExport-Funktionalität für Berichte\nRollenbasiertes Zugriffsmanagement', 
TRUE, 3);

-- Projekt-Tags
INSERT INTO project_tags (project_id, tag_name) VALUES 
(1, 'HTML/CSS'), (1, 'JavaScript'), (1, 'PHP'),
(2, 'HTML/CSS'), (2, 'JavaScript'), (2, 'Python'),
(3, 'HTML/CSS'), (3, 'JavaScript'), (3, 'Python');

-- Lebenslauf-Einträge
INSERT INTO cv_entries (title, organization, location, start_date, end_date, is_current, description, entry_type, position, display_order)
VALUES 
('Senior Webentwickler', 'Tech Solutions GmbH', 'Berlin', '2023-01-01', NULL, TRUE, 
'Leitung eines Teams von Webentwicklern bei der Erstellung von Enterprise-Lösungen.', 
'employment', 'right', 1),

('Frontend-Entwickler', 'Digital Creatives', 'München', '2021-02-01', '2022-12-31', FALSE, 
'Gestaltung und Implementierung von benutzerfreundlichen Webinterfaces.', 
'employment', 'left', 2),

('Webdesigner', 'WebVision', 'Hamburg', '2019-05-01', '2021-01-31', FALSE, 
'Erstellung visuell ansprechender Website-Designs und Umsetzung in HTML/CSS.', 
'employment', 'right', 3),

('Informatik (B.Sc.)', 'Technische Universität Berlin', 'Berlin', '2013-10-01', '2017-09-30', FALSE, 
'Studium der Informatik mit Schwerpunkt auf Webentwicklung und Benutzerinterface-Design.', 
'education', 'right', 5);

-- Fähigkeiten
INSERT INTO skills (name, category, level, display_order)
VALUES 
('HTML5/CSS3', 'Programmiersprachen', 95, 1),
('JavaScript', 'Programmiersprachen', 90, 2),
('Python', 'Programmiersprachen', 85, 3),
('PHP', 'Programmiersprachen', 80, 4),
('React', 'Frameworks & Bibliotheken', 85, 5),
('Vue.js', 'Frameworks & Bibliotheken', 80, 6),
('Bootstrap', 'Frameworks & Bibliotheken', 95, 7),
('Django', 'Frameworks & Bibliotheken', 75, 8),
('Git', 'Tools & Software', 90, 9),
('Adobe XD', 'Tools & Software', 85, 10),
('VS Code', 'Tools & Software', 95, 11),
('Docker', 'Tools & Software', 70, 12),
('Projektmanagement', 'Softskills', 85, 13),
('Teamarbeit', 'Softskills', 90, 14),
('Kommunikation', 'Softskills', 85, 15),
('Problemlösung', 'Softskills', 95, 16);

-- Website-Einstellungen
INSERT INTO settings (setting_key, setting_value)
VALUES 
('site_title', 'Mein digitaler Lebenslauf'),
('contact_email', 'info@meine-domain.de'),
('contact_phone', '+49 123 456789'),
('contact_location', 'Berlin, Deutschland'),
('hero_title', 'Willkommen auf meiner Website'),
('hero_subtitle', 'Frontend-Entwickler & UI/UX Designer'),
('about_text', 'Herzlich willkommen auf meiner digitalen Visitenkarte! Ich bin ein leidenschaftlicher Webentwickler mit Expertise in modernen Technologien und einem Auge für Design.');