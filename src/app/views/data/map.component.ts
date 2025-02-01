import { Component, OnInit } from '@angular/core';

import {  CardComponent, CardHeaderComponent, CardBodyComponent } from '@coreui/angular';

@Component({
    templateUrl: 'map.component.html',
    imports: [ CardComponent, CardHeaderComponent, CardBodyComponent]
})
export class MapComponent implements OnInit {

  ngOnInit(): void {}

}



