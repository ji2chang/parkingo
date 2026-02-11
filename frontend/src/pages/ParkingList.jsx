import React from 'react'

export default function ParkingList() {
  // placeholder static list for now
  const parkings = [
    { id: 1, name: 'Central Parking', spaces: 120 },
    { id: 2, name: 'North Lot', spaces: 45 },
  ]

  return (
    <div>
      <h2>Parking Locations</h2>
      <ul>
        {parkings.map((p) => (
          <li key={p.id}>
            {p.name} — {p.spaces} spaces
          </li>
        ))}
      </ul>
    </div>
  )
}
