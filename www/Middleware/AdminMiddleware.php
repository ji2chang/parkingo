<?php
namespace parkingo\Middleware;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Slim\Psr7\Response;

class AdminMiddleware implements MiddlewareInterface
{
    /**
     * Example middleware invokable class
     *
     * @param  Request  $request  PSR-7 request
     * @param  RequestHandler $handler PSR-15 request handler
     *
     * @return Response
     */
    public function process(ServerRequestInterface $request,
                            RequestHandlerInterface $handler): ResponseInterface
    {
        // Check if 'utente' attribute exists
        if (!$request->getAttribute('utente')) {
            return $this->rispostaErrore(401,'Token mancante');
        }
        // echo 1;
        // Get the user data from the attribute
        $utente = $request->getAttribute('utente');

        // Check if ruolo exists and is 'Admin'
        // Based on your structure: $utente['data']['ruolo']
        if (!isset($utente['data']['ruolo']) || $utente['data']['ruolo'] !== 'Admin') {
            return $this->rispostaErrore(401,'Utente non autorizzato');
        }
        // echo 2;

        // User is admin, proceed to next middleware or route handler
        return $handler->handle($request);
    }

    private function rispostaErrore(int $status, string $messaggio): ResponseInterface
    {
        $response = new Response();
        $response->getBody()->write(json_encode([
            'success' => false,
            'message' => $messaggio
        ]));
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus($status);
    }
}