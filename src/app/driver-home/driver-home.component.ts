import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-driver-home',
  standalone: true,
  imports: [GoogleMap, GoogleMapsModule, FormsModule, CommonModule, NavbarComponent],
  templateUrl: './driver-home.component.html',
  styleUrl: './driver-home.component.css'
})
export class DriverHomeComponent {
userLocation: google.maps.LatLngLiteral | null = null;
  center: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  zoom = 16;
  origin: string = '';
  passengers: number = 1; 
  fare: number = 0;
  destination: string = '';


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

  constructor() {}

  ngOnInit() {
    this.getUserLocation();
    this.initializeAutocomplete();
  }

  ngAfterViewInit() {
    this.onMapLoad();
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
            this.origin = address;
          } else {
            this.destination = address;
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
        console.log("passengers: ", this.passengers);
        console.log("Fare: ", this.fare);
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
}
