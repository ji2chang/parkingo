<?php

namespace parkingo\Controller;

use parkingo\Repository\UtenteRepository;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class UtenteController
{

    private UtenteRepository $repository;

    public function __construct()
    {
        $this->repository = new UtenteRepository();
    }


    private function rispostaJson(Response $response, array $dati, int $status = 200): Response
    {
        $response->getBody()->write(json_encode($dati));
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus($status);
    }

    public static function checkAccess($utente, $targetUserId = null, $allowAdmin = true): bool
    {
        // Se l'utente è admin e l'azione è permessa agli admin, consenti
        if ($utente->ruolo === 'Admin' && $allowAdmin) {
            return true;
        }
        // Se l'utente è user e sta agendo su se stesso
        if ($utente->ruolo === 'User' && $utente->id == $targetUserId) {
            return true;
        }
        // Altrimenti accesso negato
        return false;
    }

    public function login(Request $request, Response $response): Response
    {
        $dati = $request->getParsedBody();

        if (empty($dati['username']) || empty($dati['password'])) {
            return $this->rispostaJson($response, [
                'success' => false,
                'message' => 'Nome utente e password sono obbligatori'
            ], 400);
        }

        $result = $this->repository->verificaCredenziali($dati['username'], $dati['password']);

        if ($result === null) {
            return $this->rispostaJson($response, [
                'success' => false,
                'message' => 'Nome utente o password non validi'
            ], 401);
        }

        return $this->rispostaJson($response, [
            'success' => true,
            'data' => $result
        ]);
    }

    public function signin(Request $request, Response $response): Response
    {
        $utente = $request->getAttribute('utente');
        // Solo utenti non autenticati possono registrarsi, oppure nessuno (se vuoi bloccare anche agli admin)
        if ($utente && $utente->ruolo === 'Admin') {
            return $this->rispostaJson($response, [
                'success' => false,
                'message' => 'Gli admin non possono creare utenti.'
            ], 403);
        }

        $dati = $request->getParsedBody();
        $required = ['email', 'password', 'firstName', 'lastName', 'username'];
        
        foreach ($required as $field) {
            if (empty($dati[$field])) {
                return $this->rispostaJson($response, [
                    'success' => false,
                    'message' => $field . ' è obbligatorio'
                ], 400);
            }
        }

        if ($this->repository->esisteEmail($dati['email'])) {
            return $this->rispostaJson($response, [
                'success' => false,
                'message' => 'Email già registrata'
            ], 400);
        }

        if ($this->repository->esisteNomeUtente($dati['username'])) {
            return $this->rispostaJson($response, [
                'success' => false,
                'message' => 'Nome utente già in uso'
            ], 400);
        }

        $success = $this->repository->creaUtente($dati);
        if ($success) {
            return $this->rispostaJson($response, [
                'success' => true,
                'message' => 'Utente creato con successo'
            ], 201);
        } else {
            return $this->rispostaJson($response, [
                'success' => false,
                'message' => 'Errore durante la creazione dell\'utente'
            ], 500);
        }
    }

    public function profilo(Request $request, Response $response): Response
    {
        $utente = $request->getAttribute('utente');
        try {
            $this->checkAccess($utente, $utente->id); // Solo se stesso o admin
        } catch (\Exception $e) {
            return $this->rispostaJson($response, [
                'success' => false,
                'message' => $e->getMessage()
            ], 403);
        }
        $dati = $this->repository->getById($utente->id);

        if (!$dati) {
            return $this->rispostaJson($response, [
                'success' => false,
                'message' => 'Utente non trovato'
            ], 404);
        }

        return $this->rispostaJson($response, [
            'success' => true,
            'data' => [
                'id' => $dati['id'],
                'nome' => $dati['nome'],
                'cognome' => $dati['cognome'],
                'email' => $dati['email'],
                'nome_utente' => $dati['nome_utente'],
                'data_registrazione' => $dati['created_at'],
            ]
        ]);
    }

    public function updateProfile(Request $request, Response $response): Response
    {
        $utente = $request->getAttribute('utente');
        try {
            $this->checkAccess($utente, $utente->id); // Solo se stesso o admin
        } catch (\Exception $e) {
            return $this->rispostaJson($response, [
                'success' => false,
                'message' => $e->getMessage()
            ], 403);
        }
        $dati = $request->getParsedBody();

        if (empty($dati['nome']) || empty($dati['cognome'])) {
            return $this->rispostaJson($response, [
                'success' => false,
                'message' => 'Nome e cognome sono obbligatori'
            ], 400);
        }

        $success = $this->repository->updateProfile($utente->id, [
            'nome' => trim((string)$dati['nome']),
            'cognome' => trim((string)$dati['cognome']),
        ]);

        if (!$success) {
            return $this->rispostaJson($response, [
                'success' => false,
                'message' => 'Impossibile aggiornare il profilo'
            ], 500);
        }

        return $this->rispostaJson($response, [
            'success' => true,
            'message' => 'Profilo aggiornato'
        ]);
    }
}
