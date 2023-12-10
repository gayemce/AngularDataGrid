import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { HttpClient } from '@angular/common/http';
import { ButtonRenderComponent } from './button-render/button-render.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AgGridModule, ButtonRenderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  rowData: any = [];

  colDefs: any[] = [
    {
      headerName: "#",
      valueGetter: (params: any) => params.node.rowIndex + 1,
      width: 30,
      floatingFilter: false,
      sort: false
    },
    { field: "name" },
    { field: "summary" },
    { field: "author" },
    {
      field: "publishDate", valueFormatter: (params: any) => {
        return new Date(params.value).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
      },
    }
  ];

  autoSizeStrategy: any = {
    type: 'fitCellContents',
    defaultWidth: 100
  };

  // autoSizeStrategy: any = {
  //   type: 'fitGridWidth',
  //   defaultWidth: 100
  // };

  defaultColDef: any = {
    filter: true,
    defaultMinWidth: 300,
    floatingFilter: true,
  }

  constructor(private http: HttpClient) { }

  // Load data into grid when ready
  onGridReady(params: any) {
    this.http.get("https://localhost:7204/api/Values/GetAll").subscribe(res => {
      this.rowData = res;
    })
  }

  remove(id: any){
    console.log(id)
  }
}
