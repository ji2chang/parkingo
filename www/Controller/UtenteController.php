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
        if (empty($dati['nome_utente']) || empty($dati['password'])) {
            return $this->rispostaJson($response, [
                'errore' => 'Nome utente e password sono obbligatori'
            ], 400);
        }
        $passwordHash = password_hash($dati['password'], PASSWORD_BCRYPT);
        $token = $this->repository->verificaCredenziali($dati['nome_utente'], $passwordHash);

        if ($token === null) {
            return $this->rispostaJson($response, [
                'errore' => 'Credenziali non valide'
            ], 401);
        }

        return $this->rispostaJson($response, [
            'token' => $token
        ]);
    }

    public function signin(Request $request, Response $response): Response
    {
        $dati = $request->getParsedBody();
        $required = [
            'nome_utente', 'password', 'email', 'nome', 'cognome'
        ];
        foreach ($required as $field) {
            if (empty($dati[$field])) {
                return $this->rispostaJson($response, [
                    'errore' => $field . ' è obbligatorio'
                ], 400);
            }
        }
        if($this->repository->esisteNomeUtente($dati['nome_utente'])){
            return $this->rispostaJson($response, [
                'errore' => 'Nome utente esiste già'
            ]);
        }
        if($this->repository->esisteEmail($dati['email'])){
            return $this->rispostaJson($response, [
                'errore' => 'Email già usato'
            ]);
        }
        $success = $this->repository->creaUtente($dati);
        if ($success) {
            return $this->rispostaJson($response, [
                'success' => 'Utente creato'
            ]);
        } else {
            return $this->rispostaJson($response, [
                'errore' => 'Errore creazione utente'
            ]);
        }
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
}