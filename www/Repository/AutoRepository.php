<?php

namespace parkingo\Repository;

use parkingo\Utils\Connection;

class AutoRepository
{
    public function getAutoByUser(int $userId): array
    {
        $pdo = Connection::get();
        $stmt = $pdo->prepare('SELECT id, targa FROM auto WHERE id_utente = :id_utente ORDER BY id');
        $stmt->execute(['id_utente' => $userId]);

        return $stmt->fetchAll();
    }

    public function findById(int $id, int $userId): ?array
    {
        $pdo = Connection::get();
        $stmt = $pdo->prepare('SELECT id, targa FROM auto WHERE id = :id AND id_utente = :id_utente');
        $stmt->execute(['id' => $id, 'id_utente' => $userId]);
        $auto = $stmt->fetch();

        return $auto ?: null;
    }

    public function findByTarga(string $targa): ?array
    {
        $pdo = Connection::get();
        $stmt = $pdo->prepare('SELECT id, targa, id_utente FROM auto WHERE targa = :targa');
        $stmt->execute(['targa' => $targa]);
        $auto = $stmt->fetch();

        return $auto ?: null;
    }

    public function findByTargaAndUser(string $targa, int $userId): ?array
    {
        $pdo = Connection::get();
        $stmt = $pdo->prepare('SELECT id, targa, id_utente FROM auto WHERE targa = :targa AND id_utente = :id_utente');
        $stmt->execute(['targa' => $targa, 'id_utente' => $userId]);
        $auto = $stmt->fetch();

        return $auto ?: null;
    }

    public function existsTarga(string $targa, ?int $excludeId = null): bool
    {
        $pdo = Connection::get();
        if ($excludeId === null) {
            $stmt = $pdo->prepare('SELECT COUNT(*) FROM auto WHERE targa = :targa');
            $stmt->execute(['targa' => $targa]);
        } else {
            $stmt = $pdo->prepare('SELECT COUNT(*) FROM auto WHERE targa = :targa AND id != :id');
            $stmt->execute(['targa' => $targa, 'id' => $excludeId]);
        }

        return $stmt->fetchColumn() > 0;
    }

    public function createAuto(int $userId, string $targa): bool
    {
        $pdo = Connection::get();
        $stmt = $pdo->prepare('INSERT INTO auto (targa, id_utente) VALUES (:targa, :id_utente)');
        return $stmt->execute(['targa' => $targa, 'id_utente' => $userId]);
    }

    public function updateAuto(int $id, int $userId, string $targa): bool
    {
        $pdo = Connection::get();
        $stmt = $pdo->prepare('UPDATE auto SET targa = :targa WHERE id = :id AND id_utente = :id_utente');
        return $stmt->execute(['targa' => $targa, 'id' => $id, 'id_utente' => $userId]);
    }

    public function deleteAuto(int $id, int $userId): bool
    {
        $pdo = Connection::get();
        $stmt = $pdo->prepare('DELETE FROM auto WHERE id = :id AND id_utente = :id_utente');
        return $stmt->execute(['id' => $id, 'id_utente' => $userId]);
    }
}
