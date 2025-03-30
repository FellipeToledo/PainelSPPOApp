import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { catchError, retry, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })
export class GeodataService {
  private socket$!: WebSocketSubject<any>;
  private connected = new BehaviorSubject<boolean>(false);
  private filteredData = new BehaviorSubject<any[]>([]);
  private allData: any[] = [];


  constructor() {
    this.connect();
  }

  public connect(): void {
    this.socket$ = webSocket({
      url: 'ws://localhost:8081/geo-data-updates',
      deserializer: (e) => JSON.parse(e.data),
      serializer: (value) => JSON.stringify(value)
    });

    this.socket$.subscribe({
        next: (data) => {
          // Armazena os novos dados sem exibi-los
          this.allData = [...this.allData, ...data.features];
          this.connected.next(true);
        },
        error: (err) => {
          console.error('WebSocket error:', err);
          this.connected.next(false);
          this.reconnect();
        },
        complete: () => {
          this.connected.next(false);
          this.reconnect();
        }
      });
    }
  
    private reconnect(): void {
      setTimeout(() => this.connect(), 5000);
    }
  
    public filterData(lineFilter: string): void {
      if (!lineFilter) {
        this.filteredData.next([]); // Não mostra nada se não houver filtro
        return;
      }
  
      const filtered = this.allData.filter(feature => 
        feature.properties.linha.includes(lineFilter)
      );
      this.filteredData.next(filtered);
    }
  
    public getFilteredData(): Observable<any[]> {
      return this.filteredData.asObservable();
    }
  
    public isConnected(): Observable<boolean> {
      return this.connected.asObservable();
    }
  
    public clearData(): void {
      this.allData = [];
      this.filteredData.next([]);
    }
  
    public closeConnection(): void {
      if (this.socket$) {
        this.socket$.complete();
      }
    }
}