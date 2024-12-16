import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { NavbarComponent } from '../navbar/navbar.component';
import { TripService } from '../services/trip.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-passenger-home',
  standalone: true,
  imports: [GoogleMap, GoogleMapsModule, FormsModule, CommonModule, NavbarComponent],
  templateUrl: './passenger-home.component.html',
  styleUrl: './passenger-home.component.css'
})
export class PassengerHomeComponent implements OnInit, AfterViewInit {
  userLocation: google.maps.LatLngLiteral | null = null;
  center: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  zoom = 16;
  origin: string = '';
  destination: string = '';
  selectingFor: 'origin' | 'destination' | null = null;
  dlat: number =  0;
  dlng: number = 0;
  olat: number = 0;
  olng: number = 0;

  selectedTrip: any | null = null; // Variable para almacenar el viaje seleccionado

  trips: any[] = []; // Lista de viajes encontrados
  
  accuracy = 50; // Radio en metros

  circleOptions: google.maps.CircleOptions = {
    strokeColor: '#4285F4', // Azul similar al de Google
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#4285F4',
    fillOpacity: 0.35,
    clickable: false,
    editable: false,
    draggable: false
  };

  mapStyle = [
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#aee2e0"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#abce83"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#769E72"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#7B8758"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#EBF4A4"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#8dab68"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#5B5B3F"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#ABCE83"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#A4C67D"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#9BBF72"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#EBF4A4"
            }
        ]
    },
    {
        "featureType": "transit",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#87ae79"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#7f2200"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "visibility": "on"
            },
            {
                "weight": 4.1
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#495421"
            }
        ]
    },
    {
        "featureType": "administrative.neighborhood",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    }
]

  @ViewChild(GoogleMap) googleMap!: GoogleMap; // Obtener la referencia del mapa

  map: google.maps.Map | null = null;
  autocompleteOrigin: google.maps.places.Autocomplete | null = null;
  autocompleteDestination: google.maps.places.Autocomplete | null = null;

  directionsService: google.maps.DirectionsService | null = null;
  directionsRenderer: google.maps.DirectionsRenderer | null = null;

  constructor(private tripService: TripService) {}

  ngOnInit() {
    this.getUserLocation();
    this.initializeAutocomplete();
    this.startCountdown();
  }

  ngAfterViewInit() {
    this.onMapLoad();

    if (this.googleMap?.googleMap) {
      this.googleMap.googleMap.addListener('click', (event: google.maps.MapMouseEvent) => {
        if (this.selectingFor && event.latLng) {
          const latLng = event.latLng;
          this.getAddressFromLatLng(latLng, this.selectingFor);
          this.selectingFor = null; // Resetea el estado después de seleccionar
        }
      });
    }
  }

  

  enableMapSelection(type: 'origin' | 'destination') {
    this.selectingFor = type;
    alert(`Click on the map to select ${type}`);
  }

  // Obtener ubicación del dispositivo
  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.center = this.userLocation; // Centra el mapa
        },
        (error) => {
          console.error('Error al obtener ubicación:', error);
        }
      );
    } else {
      console.error('Geolocalización no es soportada por el navegador.');
      this.userLocation = {
        lat: 21.912915,
        lng: -102.314706,
      };
      this.center = this.userLocation;
    }
  }

  initializeAutocomplete() {
    if (typeof google !== 'undefined' && google.maps && google.maps.places) {
      const inputOrigin = document.getElementById('origin') as HTMLInputElement;
      const inputDestination = document.getElementById('destination') as HTMLInputElement;
  
      this.autocompleteOrigin = new google.maps.places.Autocomplete(inputOrigin);
      this.autocompleteDestination = new google.maps.places.Autocomplete(inputDestination);
  
      // Cuando se selecciona un lugar en el autocomplete de origen
      this.autocompleteOrigin.addListener('place_changed', () => {
        const place = this.autocompleteOrigin!.getPlace();
        if (place.geometry && place.geometry.location) {
          const latLng = place.geometry.location;
  
          // Usamos Geocoding para obtener la dirección completa
          this.getAddressFromLatLng(latLng, 'origin');
        } else {
          console.error('No geometry found for the origin place');
        }
      });
  
      // Cuando se selecciona un lugar en el autocomplete de destino
      this.autocompleteDestination.addListener('place_changed', () => {
        const place = this.autocompleteDestination!.getPlace();
        if (place.geometry && place.geometry.location) {
          const latLng = place.geometry.location;
  
          // Usamos Geocoding para obtener la dirección completa
          this.getAddressFromLatLng(latLng, 'destination');
        } else {
          console.error('No geometry found for the destination place');
        }
      });
    } else {
      console.error('Google Maps o la librería Places no están disponibles.');
    }
  }
  
  getAddressFromLatLng(latLng: google.maps.LatLng, type: 'origin' | 'destination') {
    const geocoder = new google.maps.Geocoder();
  
    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results && results[0]) {
          // Asignar el nombre de la dirección al origen o destino
          const address = results[0].formatted_address;
  
          if (type === 'origin') {
            this.olat = latLng.lat();
            this.olng = latLng.lng();
            this.origin = address;
            const input = document.getElementById('origin') as HTMLInputElement;
            input.value = address; // Actualiza el valor del input
          } else {
            this.dlat = latLng.lat();
            this.dlng = latLng.lng();
            this.destination = address;
            const input = document.getElementById('destination') as HTMLInputElement;
            input.value = address; // Actualiza el valor del input
          }
  
          // También actualizamos la posición central del mapa
          this.center = {
            lat: latLng.lat(),
            lng: latLng.lng(),
          };
  
          // Llamamos a searchRoute después de actualizar la dirección
          this.searchRoute();
        } else {
          console.error('No results found for geocoding');
        }
      } else {
        console.error('Geocode failed due to: ' + status);
      }
    });
  }
  

  // Buscar ruta (llamado automáticamente cuando los valores cambian)
  searchRoute() {
    console.log('Searching route from', this.origin, 'to', this.destination);

    if (this.origin && this.destination) {
      const request: google.maps.DirectionsRequest = {
        origin: this.origin,
        destination: this.destination,
        travelMode: google.maps.TravelMode.DRIVING, // Puedes cambiar el modo de viaje (driving, walking, etc.)
      };

      if (this.directionsService && this.directionsRenderer) {
        console.log("ya se pusieron las direcciones");

        this.directionsService.route(request, (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            this.directionsRenderer?.setDirections(result);
            console.log("ya se pusieron las direcciones");
          } else {
            console.error('Error al obtener la ruta:', status);
          }
        });
      }
    } else {
      console.error('Por favor, ingrese ambos puntos de origen y destino.');
    }
  }

  onMapLoad() {
    if (this.googleMap && this.googleMap.googleMap) {
      // Crear el servicio de direcciones y el renderizador después de la carga del mapa
      this.directionsService = new google.maps.DirectionsService();
      this.directionsRenderer = new google.maps.DirectionsRenderer();
      this.directionsRenderer.setMap(this.googleMap.googleMap); // Asignamos el mapa a la dirección renderer
    


      this.googleMap.googleMap.setOptions({
        styles: this.mapStyle,
        disableDefaultUI: false,
        fullscreenControl: false,
        streetViewControl: false,
        mapTypeControl: false, 
      });
    
    }
  }

  startCountdown() {
    // Ejecutar cada segundo
    interval(1000).subscribe(() => {
      const currentTime = new Date().getTime();

      this.trips.forEach(trip => {
        const scheduleTime = new Date(trip.schedule).getTime();
        const timeDiff = scheduleTime + 15 * 60 * 1000 - currentTime; // 15 minutos en milisegundos

        // Si el tiempo restante es positivo, actualizarlo
        if (timeDiff > 0) {
          trip.remainingTime = timeDiff;
        } else {
          // Si ya no queda tiempo, ocultar el contador
          trip.remainingTime = 0;
        }
      });
    });
  }
  
  searchTrips() {
    if (!this.olat || !this.olng || !this.dlat || !this.dlng) {
      alert('Please select both origin and destination.');
      return;
    }
  
    const origin = { lat: this.olat, lng: this.olng };
    const destination = { lat: this.dlat, lng: this.dlng };
  
    this.tripService.findTrips(origin, destination).subscribe(
      (trips) => {
        console.log('Trips found:', trips);
        // alert(`${trips.length} trips found.`);
        this.trips = trips;
      },
      (error) => {
        console.error('Error finding trips:', error);
        // alert('Error finding trips. Please try again.');
      }
    );
  }


  addUserToTrip(tripId: string): void {
    // Obtén el userId del localStorage
    const userId = localStorage.getItem('token');
    
    if (!userId) {
      // alert('No se encontró el ID de usuario en el localStorage.');
      return;
    }
    console.log('userid', userId);
    console.log('tripid', tripId);
    // Llama al servicio para agregar al usuario al viaje
    this.tripService.addUserInTrip(tripId, userId).subscribe({
      next: (response) => {
        // alert('Te has unido al viaje con éxito.');
        this.selectedTrip = this.trips.find(trip => trip.tripId === tripId);
      },
      error: (error) => {
        console.error('Error al unirte al viaje:', error);
        // alert('Hubo un error al intentar unirte al viaje.');
      },
    });
  }

  clearSelection() {
    this.selectedTrip = null; // Limpia el viaje seleccionado
  }

}
