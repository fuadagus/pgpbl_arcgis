import { Component, OnInit } from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import { Geolocation } from '@capacitor/geolocation';
import Graphic from '@arcgis/core/Graphic';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Point from '@arcgis/core/geometry/Point'; 
import ImageryLayer from '@arcgis/core/layers/ImageryLayer';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  private latitude: number | any;
  private longitude: number | any;
  private map: Map | any;
  private view: MapView | any;
  
  // Define available basemaps
  public basemaps: string[] = ['topo-vector', 'streets', 'dark-gray'];
  public selectedBasemap: string = 'topo-vector'; // Default basemap
  
  constructor() {}

  public async ngOnInit() {
    const position = await Geolocation.getCurrentPosition();
    this.latitude = position.coords.latitude;
    this.longitude = position.coords.longitude;

    this.initializeMap(this.selectedBasemap);
  }

  private initializeMap(basemap: string) {
    this.map = new Map({
      basemap: basemap
    });
    
    this.view = new MapView({
      container: 'container',
      map: this.map,
      zoom: 8,
      center: [this.longitude, this.latitude]
    });
    
    const graphicsLayer = new GraphicsLayer();
    this.map.add(graphicsLayer);

    const WeatherServiceUrl = 'https://mapservices.weather.noaa.gov/eventdriven/rest/services/radar/radar_base_reflectivity_time/ImageServer';
    let weatherServiceFL = new ImageryLayer({url: WeatherServiceUrl});
    this.map.add(weatherServiceFL);

    // Marker from geolocation
    const geoPoint = new Point({
      longitude: this.longitude,
      latitude: this.latitude
    });

    const geoMarkerSymbol = {
      type: "simple-marker",
      color: [226, 119, 40],
      outline: {
        color: [255, 255, 255],
        width: 2
      }
    };

    const geoPointGraphic = new Graphic({
      geometry: geoPoint,  
      symbol: geoMarkerSymbol
    });

    graphicsLayer.add(geoPointGraphic);

    // Marker at fixed coordinates
    const fixedPoint = new Point({
      longitude: -79.41245941352786,
      latitude: 43.701882607460945
    });

    const fixedMarkerSymbol = {
      type: "simple-marker",
      color: [255, 0, 255], 
      outline: {
        color: [255, 255, 255],
        width: 2
      }
    };

    const fixedPointGraphic = new Graphic({
      geometry: fixedPoint,
      symbol: fixedMarkerSymbol
    });

    graphicsLayer.add(fixedPointGraphic);
  }

  // Method to change basemap
  public changeBasemap(basemap: string) {
    this.view.map.basemap = basemap;
    this.selectedBasemap = basemap;
  }

}
