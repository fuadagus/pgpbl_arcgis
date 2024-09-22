import { Component, OnInit } from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import { Geolocation } from '@capacitor/geolocation';
import Graphic from '@arcgis/core/Graphic';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Point from '@arcgis/core/geometry/Point'; // Import the Point class

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  private latitude: number | any;
  private longitude: number | any;

  constructor() {}

  public async ngOnInit() {
    const position = await Geolocation.getCurrentPosition();
    this.latitude = position.coords.latitude;
    this.longitude = position.coords.longitude;

    const map = new Map({
      basemap: 'topo-vector'
    });

    const view = new MapView({
      container: 'container',
      map: map,
      zoom: 8,
      center: [this.longitude, this.latitude]
    });


    const graphicsLayer = new GraphicsLayer();
    map.add(graphicsLayer);

   
    const point = new Point({
      longitude: this.longitude,
      latitude: this.latitude
    });

    const markerSymbol = {
      type: "simple-marker",
      color: [226, 119, 40],  // orange
      outline: {
        color: [255, 255, 255],  // white
        width: 1
      }
    };


    const pointGraphic = new Graphic({
      geometry: point,  
      symbol: markerSymbol
    });

    graphicsLayer.add(pointGraphic);
  }
}
