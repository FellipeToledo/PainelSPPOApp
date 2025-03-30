import { Component, OnDestroy, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { CardComponent, CardHeaderComponent, CardBodyComponent, ButtonDirective, FormControlDirective, InputGroupComponent, TextColorDirective, ColComponent } from '@coreui/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { GeodataService } from '../../../services/geodata.service';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-map',
  imports: [
            CommonModule,
            AsyncPipe,
            ColComponent, 
            CardComponent, 
            CardHeaderComponent, 
            CardBodyComponent, 
            TextColorDirective, 
            CardComponent, 
            CardHeaderComponent, 
            CardBodyComponent, 
            InputGroupComponent,
            FormControlDirective,
            ButtonDirective,
            ReactiveFormsModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent implements OnInit, OnDestroy {
private map!: L.Map;
  private busMarkers: L.LayerGroup = L.layerGroup();
  private dataSubscription!: Subscription;
  private connectionSubscription!: Subscription;
  isConnected: Observable<boolean>;

  constructor(private geoDataService: GeodataService) {
    this.isConnected = this.geoDataService.isConnected();
  }

  ngOnInit(): void {
    this.initMap();
    this.setupDataSubscription();
    this.setupConnectionStatus();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
    this.dataSubscription?.unsubscribe();
    this.connectionSubscription?.unsubscribe();
    this.geoDataService.closeConnection();
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
    this.busMarkers.addTo(this.map);
  }

  private setupDataSubscription(): void {
    this.dataSubscription = this.geoDataService.getFilteredData().subscribe(
      features => this.updateBusMarkers(features)
    );
  }

  private setupConnectionStatus(): void {
    this.connectionSubscription = this.isConnected.subscribe(connected => {
      console.log('Connection status:', connected);
    });
  }

  private updateBusMarkers(features: any[]): void {
    this.busMarkers.clearLayers();

    features.forEach(feature => {
      const { geometry, properties } = feature;
      const [lng, lat] = geometry.coordinates;
      
      const busIcon = L.divIcon({
        html: `<div class="bus-marker" style="background-color: ${this.getColorByLine(properties.linha)}">
                 <span>${properties.linha}</span>
               </div>`,
        className: '',
        iconSize: [24, 24]
      });

      L.marker([lat, lng], { icon: busIcon })
        .bindPopup(`
          <b>Linha:</b> ${properties.linha}<br>
          <b>Ônibus:</b> ${properties.ordem}<br>
          <b>Velocidade:</b> ${properties.velocidade} km/h
        `)
        .addTo(this.busMarkers);
    });
  }

  filterByLine(event: Event): void {
    const input = event.target as HTMLInputElement;
    const lineFilter = input.value.trim();
    this.geoDataService.filterData(lineFilter);
  }

  onSearchClick(): void {
    const input = document.querySelector('input[cFormControl]') as HTMLInputElement;
    this.geoDataService.filterData(input.value.trim());
  }

  clearMap(): void {
    this.busMarkers.clearLayers();
    this.geoDataService.clearData();
  }

  resetView(): void {
    this.map.setView([-22.9068, -43.1729], 13);
  }

  private getColorByLine(line: string): string {
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];
    const index = parseInt(line) % colors.length;
    return colors[index];
  }
}
