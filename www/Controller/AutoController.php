<?php

namespace parkingo\Controller;

use parkingo\Repository\AutoRepository;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class AutoController
{
    private AutoRepository $repository;

    public function __construct()
    {
        $this->repository = new AutoRepository();
    }

    private function rispostaJson(Response $response, array $data, int $status = 200): Response
    {
        $response->getBody()->write(json_encode($data));
        return $response->withHeader('Content-Type', 'application/json')->withStatus($status);
    }

    private function normalizeTarga(mixed $targa): string
    {
        return strtoupper(trim((string)$targa));
    }

    private function checkAccess($utente, $targetUserId = null): void
    {
        if ($utente->ruolo === 'Admin') {
            return;
        }
        if ($utente->ruolo === 'User' && ($targetUserId === null || $utente->id == $targetUserId)) {
            return;
        }
        throw new \Exception('Accesso negato', 403);
    }

    public function listAuto(Request $request, Response $response): Response
    {
        $utente = $request->getAttribute('utente');
        try {
            $this->checkAccess($utente, $utente->id);
        } catch (\Exception $e) {
            return $this->rispostaJson($response, ['errore' => $e->getMessage()], 403);
        }
        $cars = $this->repository->getAutoByUser($utente->id);
        return $this->rispostaJson($response, ['cars' => $cars]);
    }

    public function createAuto(Request $request, Response $response): Response
    {
        $utente = $request->getAttribute('utente');
        try {
            $this->checkAccess($utente, $utente->id);
        } catch (\Exception $e) {
            return $this->rispostaJson($response, ['errore' => $e->getMessage()], 403);
        }
        $dati = $request->getParsedBody();

        if (empty($dati['targa'])) {
            return $this->rispostaJson($response, ['errore' => 'La targa è obbligatoria'], 400);
        }

        $targa = $this->normalizeTarga($dati['targa']);

        if ($this->repository->existsTarga($targa)) {
            return $this->rispostaJson($response, ['errore' => 'Targa già presente'], 409);
        }

        $success = $this->repository->createAuto($utente->id, $targa);
        if ($success) {
            $auto = $this->repository->findByTargaAndUser($targa, $utente->id);
            return $this->rispostaJson($response, ['success' => 'Auto aggiunta', 'auto' => $auto], 201);
        }

        return $this->rispostaJson($response, ['errore' => 'Errore durante la creazione dell\'auto'], 500);
    }

    public function updateAuto(Request $request, Response $response, array $args): Response
    {
        $utente = $request->getAttribute('utente');
        $id = (int)$args['id'];
        try {
            $this->checkAccess($utente, $utente->id);
        } catch (\Exception $e) {
            return $this->rispostaJson($response, ['errore' => $e->getMessage()], 403);
        }
        $dati = $request->getParsedBody();

        if (empty($dati['targa'])) {
            return $this->rispostaJson($response, ['errore' => 'La targa è obbligatoria'], 400);
        }

        $auto = $this->repository->findById($id, $utente->id);
        if ($auto === null) {
            return $this->rispostaJson($response, ['errore' => 'Auto non trovata'], 404);
        }

        $targa = $this->normalizeTarga($dati['targa']);
        if ($this->repository->existsTarga($targa, $id)) {
            return $this->rispostaJson($response, ['errore' => 'Targa già usata da un altro veicolo'], 409);
        }

        $success = $this->repository->updateAuto($id, $utente->id, $targa);
        if ($success) {
            $auto = $this->repository->findById($id, $utente->id);
            return $this->rispostaJson($response, ['success' => 'Auto aggiornata', 'auto' => $auto]);
        }

        return $this->rispostaJson($response, ['errore' => 'Errore durante l\'aggiornamento dell\'auto'], 500);
    }

    public function deleteAuto(Request $request, Response $response, array $args): Response
    {
        $utente = $request->getAttribute('utente');
        $id = (int)$args['id'];
        try {
            $this->checkAccess($utente, $utente->id);
        } catch (\Exception $e) {
            return $this->rispostaJson($response, ['errore' => $e->getMessage()], 403);
        }

        $auto = $this->repository->findById($id, $utente->id);
        if ($auto === null) {
            return $this->rispostaJson($response, ['errore' => 'Auto non trovata'], 404);
        }

        $success = $this->repository->deleteAuto($id, $utente->id);
        if ($success) {
            return $this->rispostaJson($response, ['success' => 'Auto rimossa']);
        }

        return $this->rispostaJson($response, ['errore' => 'Errore durante la rimozione dell\'auto'], 500);
    }
}
