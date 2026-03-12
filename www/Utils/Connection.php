<?php
namespace parkingo\Utils;
use PDO;
use \PDOException;
class Connection {
    private static $pdo = null;

    public static function get(): PDO {
        if (self::$pdo === null) {
            require_once __DIR__ . '/../config/config.php';

            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";

            try {
                self::$pdo = new PDO($dsn, DB_USER, DB_PASS, [
                    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES   => false,
                ]);
                // Forza collation unicode per allinearsi alla tabella prenotazioni
                self::$pdo->exec("SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci");
            } catch (PDOException $e) {
                die("Errore connessione: " . $e->getMessage());
            }
        }
        return self::$pdo;
    }
}