import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';

declare var ol: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  latitude: number = -12.069365349567674;
  longitude: number = -76.97196321958597;
  
  cuadrillas = [
    [-12.140563324030122, -77.0277561363916],
    [-12.081475134251116, -77.1068223703325],
    [-12.066423099405096, -77.03423438446717],
    [-12.17477882277052, -76.985950410837],
    [-12.030379511128215, -76.96525973043235]
  ]

  map: any;
  marker: any;
  selectInteraction: any

  constructor(public authService: AuthService) {
    
  }
  ngOnInit() {
    this.map = new ol.Map({
      target: 'map',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([this.longitude,this.latitude]),
        zoom: 13
      })
    });
    this.addPoint(this.latitude,this.longitude)
    this.addCuadrillasPoint()
  }
  
  addMarker(lat: number, lng: number){
    this.marker = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.transform([lng, lat], 'EPSG:4326', 'EPSG:3857')),
    })
  }
  addPoint(lat: number, lng: number, src:string = "assets/alfiler.png") {
    this.addMarker(lat,lng)
    var vectorLayer = new ol.layer.Vector({
      source: new ol.source.Vector({
        /*features: [new ol.Feature({
          geometry: new ol.geom.Point(ol.proj.transform([lng, lat], 'EPSG:4326', 'EPSG:3857')),
        })]*/
        features: [this.marker]
      }),
      style: new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 1],
          //anchorXUnits: "fraction",
          //anchorYUnits: "fraction",
          src: src
        })
      })
    });
    this.selectInteraction = new ol.interaction.Select({
      condition: ol.events.condition.pointerMove || ol.events.condition.click,
      //addCondition: ol.events.condition.click,
      layers: [vectorLayer],
      style: new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 1],
          //anchorXUnits: "fraction",
          //anchorYUnits: "fraction",
          src: src
        })
      })
    });
    // Agregar evento de selección al marcador
    this.selectInteraction.on('select', (event: { target: { getFeatures: () => any; getActive: () => any }; }) => {
      const selectedFeatures = event.target.getFeatures();
      if (selectedFeatures.getLength() > 0) {
        alert("Marcador seleccionado2")
        // Aquí puedes realizar acciones adicionales cuando el marcador sea seleccionado
        console.log(event.target.getActive())  
      }
    });
    this.map.addLayer(vectorLayer);
    this.map.addInteraction(this.selectInteraction)
  }
  addCuadrillasPoint(){
    this.cuadrillas.forEach((element,index) => {
      this.addPoint(element[0],element[1],"assets/alfiler2.png")
    })
  }
}

