<?php

namespace parkingo\Repository;

use parkingo\Utils\Connection;
use Firebase\JWT\JWT;

class UtenteRepository
{
    /**
     * Verifica le credenziali e restituisce i dati dell'utente, o null se non valide.
     * La password è confrontata con password_verify(), quindi nel db va memorizzato
     * l'hash prodotto da password_hash().
     */
    public static function verificaCredenziali(string $nome_utente, string $password_hash): ?string
    {
        $pdo = Connection::get();
        $stmt = $pdo->prepare('SELECT * FROM utenti WHERE nome_utente = :nome_utente AND password_hash = :password_hash');
        $stmt->execute(['nome_utente' => $nome_utente,'password_hash' => $password_hash]);
        $user = $stmt->fetch();

        if ($user) {
            return self::generaToken($user['id'], $nome_utente);
        }
        return null;
    }

    public static function creaUtente($dati): bool
    {
        try {
            // Connessione al DB (usa la tua funzione o istanza PDO)
            $pdo = Connection::get();

            $dati['password'] = password_hash($dati['password'], PASSWORD_DEFAULT);

            $sql = "INSERT INTO utenti (nome_utente, password, email, nome, cognome)
                VALUES (:nome_utente, :password, :email, :nome, :cognome)";

            $stmt = $pdo->prepare($sql);

            // Esecuzione
            return $stmt->execute($dati);

        } catch (PDOException $e) {
            // Logga l’errore se necessario
            error_log("Errore creazione utente: " . $e->getMessage());
            return false;
        }
    }
    public static function esisteNomeUtente(string $nome_utente): bool
    {
        try {
            $pdo = Connection::get();

            $sql = "SELECT COUNT(*) FROM utenti WHERE nome_utente = :nome_utente";
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':nome_utente', $nome_utente);
            $stmt->execute();

            return $stmt->fetchColumn() > 0;

        } catch (PDOException $e) {
            error_log("Errore verifica nome_utente: " . $e->getMessage());
            return false;
        }
    }

    public static function esisteEmail(string $email): bool
    {
        try {
            $pdo = Connection::get();

            $sql = "SELECT COUNT(*) FROM utenti WHERE email = :email";
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':email', $email);
            $stmt->execute();

            return $stmt->fetchColumn() > 0;

        } catch (PDOException $e) {
            error_log("Errore verifica email: " . $e->getMessage());
            return false;
        }
    }

    private static function generaToken(int $id, string $nome_utente): string
    {
        $emissione = new \DateTimeImmutable();
        $scadenza = $emissione->modify('+' . JWT_EXPIRE_MINUTES . ' minutes');

        $payload = [
            'iat'  => $emissione->getTimestamp(),   // Issued at: quando è stato emesso
            'exp'  => $scadenza->getTimestamp(),    // Expiration: quando scade
            'data' => [                             // Dati applicativi
                'id'       => $id,
                'nome_utente' => $nome_utente,
            ]
        ];

        return JWT::encode($payload, JWT_SECRET, JWT_ALGO);
    }
}