import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripService } from '../services/trip.service';

@Component({
  standalone: true,
  selector: 'app-trip-list',
  imports: [CommonModule],
  template: `
    <h2>Lista de Viajes</h2>
    <ul>
      <li *ngFor="let trip of trips">
        {{ trip.id_viaje }} → {{ trip.id_conductor }} | {{ trip.estado }}
      </li>
    </ul>
  `
})
export class TripListComponent implements OnInit {
  private tripService = inject(TripService);
  trips: any[] = [];

  ngOnInit(): void {
    this.tripService.getTrips().subscribe(data => this.trips = data);
  }
}
