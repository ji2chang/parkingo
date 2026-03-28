<?php

namespace parkingo\Model;

use parkingo\Utils\Connection;
use Firebase\JWT\JWT;

class UtenteRepository
{
    /**
     * Verifica le credenziali e restituisce i dati dell'utente, o null se non valide.
     * La password è confrontata con password_verify(), quindi nel db va memorizzato
     * l'hash prodotto da password_hash().
     */
    public static function verificaCredenziali(string $username, string $password_hash): ?string
    {
        $pdo = Connection::get();
        $stmt = $pdo->prepare('SELECT * FROM utenti WHERE nome_utente = :username AND password_hash = :password_hash');
        $stmt->execute(['nome_utente' => $username,'password_hash' => $password_hash]);
        $user = $stmt->fetch();

        if ($user) {
            return self::generaToken($user['id'], $username);
        }
        return null;
    }
    
    private static function generaToken(int $id, string $username): string
    {
        $emissione = new \DateTimeImmutable();
        $scadenza = $emissione->modify('+' . JWT_EXPIRE_MINUTES . ' minutes');

        $payload = [
            'iat'  => $emissione->getTimestamp(),   // Issued at: quando è stato emesso
            'exp'  => $scadenza->getTimestamp(),    // Expiration: quando scade
            'data' => [                             // Dati applicativi
                'id'       => $id,
                'username' => $username,
            ]
        ];

        return JWT::encode($payload, JWT_SECRET, JWT_ALGO);
    }
}