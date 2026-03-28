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

    public function login(Request $request, Response $response): Response
    {
        $dati = $request->getParsedBody();

        // Validazione minima: i campi devono esserci
        if (empty($dati['username']) || empty($dati['password'])) {
            return $this->rispostaJson($response, [
                'errore' => 'Username e password sono obbligatori'
            ], 400);
        }
        $passwordHash = password_hash($dati['password'], PASSWORD_BCRYPT);
        $token = $this->$repository->verificaCredenziali($dati['username'], $passwordHash);

        if ($token === null) {
            return $this->rispostaJson($response, [
                'errore' => 'Credenziali non valide'
            ], 401);
        }

        return $this->rispostaJson($response, [
            'token' => $token
        ]);
    }

    public function profilo(Request $request, Response $response): Response
    {
        // I dati dell'utente sono stati iniettati dal JwtMiddleware
        $utente = $request->getAttribute('utente');

        return $this->rispostaJson($response, [
            'id'       => $utente->id,
            'username' => $utente->username,
        ]);
    }

    public function logout(Request $request, Response $response): Response
    {
        // JWT è stateless: il backend non ha nulla da invalidare.
        // Il client dovrà semplicemente eliminare il token in suo possesso.
        return $this->rispostaJson($response, [
            'messaggio' => 'Logout effettuato. Elimina il token lato client.'
        ]);
    }
}