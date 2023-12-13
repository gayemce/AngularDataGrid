import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { GetContextMenuItemsParams, MenuItemDef, ColDef } from 'ag-grid-community'
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { buttonRendererComponent } from './button-renderer.component';
import 'ag-grid-enterprise'
import { GridApi, RowModelType } from 'ag-grid-enterprise';
import { ServerSideComponent } from './server-side/server-side.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AgGridModule, ServerSideComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  rowData: any = [];
  frameworkComponents: any;
  gridApi: any;
  rowModelType: RowModelType | undefined = "serverSide";

  constructor(private http: HttpClient) {
    this.frameworkComponents = {
      buttonRenderer: buttonRendererComponent
    }
  }

  colDefs: ColDef[] = [
    {
      headerName: "#",
      valueGetter: (params: any) => params.node.rowIndex + 1,
      width: 30,
      floatingFilter: false,
    },
    { field: "name" },
    { field: "summary" },
    { field: "author" },
    {
      field: "publishDate", valueFormatter: (params: any) => {
        return new Date(params.value).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
      },
    },
    {
      headerName: "Operations",
      cellRenderer: "buttonRenderer",
      cellRendererParams: {
        onClick: this.remove.bind(this),
        label: 'Remove'
      }
    }
  ];

  gridOptions: any = {
    overlayLoadingTemplate:
      `<span class="ag-overlay-loading-center">Yükleniyor...</span>`,
    overlayNoRowsTemplate:
      `<span style="padding: 10px;">No data available to display</span>`,
  };

  autoSizeStrategy: any = {
    type: 'fitCellContents',
    defaultWidth: 100
  };

  // autoSizeStrategy: any = {
  //   type: 'fitGridWidth',
  //   defaultWidth: 100
  // };

  defaultColDef: any = {
    editable: this.checkAuthorization(),
    filter: true,
    defaultMinWidth: 300,
    floatingFilter: true,
    onCellValueChanged: (params: any) => this.update(params)
  }

  // Load data into grid when ready
  onGridReady(params: any) {
    this.gridApi = params.api;
    params.api.showLoadingOverlay();
    this.getAll(params);
  }

  //Right Click
  getContextMenuItems(params: GetContextMenuItemsParams): (string | MenuItemDef)[] {
    var result: (string | MenuItemDef)[] = [
      {
        name: "Example Action",
        action: () => {
          console.log("Örnek aksiyon çalıştırıldı...");
          console.log(params?.node?.data);
        }
      },
      {
        icon: `<i class="fa-solid fa-download"></i>`,
        name: "Example Export",
        subMenu: [
          {
            name: 'Excel Export',
            action: () => {
              params.api.exportDataAsExcel();
            }
          }
        ]

      },
      'copy',
      'paste',
      'seperator'
    ]

    return result;

  }

    onFilterTextBoxChanged() {
    this.gridApi.setGridOption(
      'quickFilterText',
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  // Double Click
  onRowDoubleClicked(event: any) {
    console.log(event.data);
  }

  remove(event: any) {
    console.log(event.rowData);
  }

  checkAuthorization() {
    return true;
  }

  getAll(params: any = null) {
    this.http.get("https://localhost:7204/api/Values/GetAll")
      .subscribe({
        next: (res: any) => {
          this.rowData = res
        },
        error: (err: HttpErrorResponse) => {
          params?.api?.showNoRowsOverlay();
        }
      })
  }

  update(params: any) {
    console.log(params.data);
    this.http.post("https://localhost:7204/api/Values/Update", params.data)
      .subscribe(res => {
        this.getAll();
      })
  }

}
