import { Component, OnDestroy, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { CardComponent, CardHeaderComponent, CardBodyComponent, ButtonDirective, FormControlDirective, InputGroupComponent, TextColorDirective, ColComponent } from '@coreui/angular';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-map',
  imports: [ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, InputGroupComponent, FormControlDirective, ButtonDirective, ReactiveFormsModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit, OnDestroy {
  private map!: L.Map;
  ngOnInit(): void {
    this.initMap();
  
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap(): void {
    this.map = L.map('map-container', {
      center: [-22.908333, -43.196388], 
      zoom: 11,
      preferCanvas: true
    });

    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    });

    osmLayer.addTo(this.map);
    L.control.scale().addTo(this.map);
   
  }

  resetView(): void {
    this.map.setView([-22.9068, -43.1729], 13);
  }
}
