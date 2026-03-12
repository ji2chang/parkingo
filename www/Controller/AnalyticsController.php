<?php

namespace parkingo\Controller;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use parkingo\Repository\AnalyticsRepository;

class AnalyticsController
{
    private AnalyticsRepository $repository;

    public function __construct()
    {
        $this->repository = new AnalyticsRepository();
    }

    // GET /api/analytics
    public function getStats(Request $request, Response $response, array $args): Response
    {
        $stats = $this->repository->getGlobalStats();
        $performance = $this->repository->getParkingPerformance();

        $payload = json_encode([
            'success' => true,
            'data'    => [
                'global'      => $stats,
                'parcheggi'   => $performance,
            ]
        ]);

        $response->getBody()->write($payload);
        return $response
            ->withStatus(200)
            ->withHeader('Content-Type', 'application/json');
    }

    // GET /api/analytics/heatmap
    public function getHeatmap(Request $request, Response $response, array $args): Response
    {
        $data = $this->repository->getHeatmapData();

        $payload = json_encode([
            'success' => true,
            'data'    => $data,
        ]);

        $response->getBody()->write($payload);
        return $response
            ->withStatus(200)
            ->withHeader('Content-Type', 'application/json');
    }
}
