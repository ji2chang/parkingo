<?php

namespace parkingo\Repository;

use parkingo\Utils\Connection;
use Firebase\JWT\JWT;

class UtenteRepository
{
    /**
     * Verifica le credenziali tramite nome utente/email e password e restituisce token + dati utente.
     */
    public static function verificaCredenziali(string $identifier, string $password): ?array
    {
        $pdo = Connection::get();
        
        // First try to find the user
        $stmt = $pdo->prepare('SELECT id, nome, cognome, email, nome_utente, password_hash,ruolo FROM utenti WHERE nome_utente = ?');
        $stmt->execute([$identifier]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password_hash'])) {
            $token = self::generaToken((int)$user['id'],$user['ruolo']);
            return [
                'token' => $token,
                'user' => [
                    'id' => (int)$user['id'],
                    'nome' => $user['nome'],
                    'cognome' => $user['cognome'],
                    'email' => $user['email'],
                    'nome_utente' => $user['nome_utente'],
                ]
            ];
        }
        return null;
    }

    public static function creaUtente($dati): bool
    {
        try {
            $pdo = Connection::get();

            $password_hash = password_hash($dati['password'], PASSWORD_DEFAULT);

            $sql = "INSERT INTO utenti (nome_utente, password_hash, email, nome, cognome)
                VALUES (:nome_utente, :password_hash, :email, :nome, :cognome)";

            $stmt = $pdo->prepare($sql);
            return $stmt->execute([
                'nome_utente' => $dati['username'],
                'password_hash' => $password_hash,
                'email' => $dati['email'],
                'nome' => $dati['firstName'],
                'cognome' => $dati['lastName'],
            ]);

        } catch (PDOException $e) {
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

    public static function getById(int $id): ?array
    {
        try {
            $pdo = Connection::get();
            $stmt = $pdo->prepare('SELECT id, nome_utente, email, nome, cognome, created_at FROM utenti WHERE id = :id');
            $stmt->execute(['id' => $id]);
            $user = $stmt->fetch();

            return $user ?: null;
        } catch (PDOException $e) {
            error_log("Errore recupero utente: " . $e->getMessage());
            return null;
        }
    }

    public static function updateProfile(int $id, array $data): bool
    {
        try {
            $pdo = Connection::get();
            $sql = "UPDATE utenti SET nome = :nome, cognome = :cognome WHERE id = :id";
            $stmt = $pdo->prepare($sql);
            return $stmt->execute([
                'nome' => $data['nome'],
                'cognome' => $data['cognome'],
                'id' => $id,
            ]);
        } catch (PDOException $e) {
            error_log("Errore aggiornamento profilo: " . $e->getMessage());
            return false;
        }
    }

    private static function generaToken(int $id, string $ruolo): string
    {
        $emissione = new \DateTimeImmutable();
        $scadenza = $emissione->modify('+' . JWT_EXPIRE_MINUTES . ' minutes');

        $payload = [
            'iat'  => $emissione->getTimestamp(),   // Issued at: quando è stato emesso
            'exp'  => $scadenza->getTimestamp(),    // Expiration: quando scade
            'data' => [                             // Dati applicativi
                'id' => $id,
                'ruolo' => $ruolo,
            ]
        ];

        return JWT::encode($payload, JWT_SECRET, JWT_ALGO);
    }
}