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
        // Fetch global statistics from VIEW
        $globalStats = $this->repository->getGlobalStats();
        
        // If VIEW fails, calculate stats manually
        if (!$globalStats) {
            try {
                $stmt = $this->repository->getPdo()->query(
                    "SELECT 
                        COUNT(*) as totale,
                        SUM(CASE WHEN stato = 'attiva' THEN 1 ELSE 0 END) as attive,
                        SUM(CASE WHEN stato = 'annullata' THEN 1 ELSE 0 END) as cancellate,
                        COALESCE(SUM(CASE WHEN stato != 'annullata' THEN importo_totale ELSE 0 END), 0) as spesa_totale,
                        ROUND(COALESCE(AVG(CASE WHEN stato != 'annullata' THEN importo_totale END), 0), 2) as costo_medio
                    FROM prenotazioni"
                );
                $globalStats = $stmt->fetch(\PDO::FETCH_ASSOC);
            } catch (\Exception $e) {
                $globalStats = [
                    'totale' => 0,
                    'attive' => 0,
                    'cancellate' => 0,
                    'spesa_totale' => 0,
                    'costo_medio' => 0
                ];
            }
        }
        
        // Fetch recent bookings
        $bookings = $this->repository->getRecentBookings(6);
        
        // Format bookings with nested parking info
        $formattedBookings = array_map(function($booking) {
            return [
                'code' => $booking['code'],
                'codice' => $booking['code'],
                'created_at' => $booking['created_at'],
                'stato' => $booking['stato'],
                'importo' => (float)$booking['importo'],
                'parcheggio' => [
                    'id' => $booking['parcheggio_id'],
                    'nome' => $booking['parcheggio_nome']
                ]
            ];
        }, $bookings);
        
        // Fetch parking usage statistics
        $parkingUsage = $this->repository->getParkingUsageStats();
        
        // Format parking usage data
        $formattedUsage = array_map(function($item) {
            return [
                'id' => $item['id'],
                'nome' => $item['nome'],
                'prenotazioni' => (int)$item['prenotazioni']
            ];
        }, $parkingUsage);

        $payload = json_encode([
            'success' => true,
            'data'    => [
                'stats'         => $globalStats,
                'prenotazioni'  => $formattedBookings,
                'parcheggi_top' => $formattedUsage,
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
