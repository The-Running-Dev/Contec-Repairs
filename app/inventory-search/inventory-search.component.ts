import {Component, OnInit} from '@angular/core';
import {Router, RouteParams} from '@angular/router-deprecated';

import {DataTable} from 'primeng/primeng';
import {Column} from 'primeng/primeng';

import {InventorySearch, InventorySearchCriteria, InventorySearchService} from './index';

@Component({
    selector: 'inventory-search',
    templateUrl: 'app/inventory-search/inventory-search.component.html',
    providers: [
        InventorySearchService
    ],
    directives: [
        DataTable,
        Column
    ]
})

export class InventorySearchComponent implements OnInit {
    public Model: InventorySearch;
    public IsProcessing: boolean = false;
    public SearchButtonText: string = 'Search';
    public SearchResults: any;

    constructor(private _router: Router,
                private _routeParams: RouteParams,
                private _service: InventorySearchService) {
        this.Model = new InventorySearch();
    }

    ngOnInit() {
        // Set the default tracker type
        this.Model.TrackerTypeId = 1;

        this._service.getSearchCriteria().subscribe((data: InventorySearchCriteria) => {
            this.Model.ContainerTypes = data.ContainerTypes;
            this.Model.Locations = data.Locations;

            this.IsProcessing = false;
        });

        let trackingId = +this._routeParams.get('id');
        if (trackingId) {
            this.Model.TrackingId = trackingId;
        }
    }

    search() {
        this._service.search(this.Model).subscribe((data: InventorySearch) => {
            this.SearchResults = data.aaData;
            this.IsProcessing = false;
        });
    }

    back() {
        this._router.navigate(['Repairs', {id: this.Model.TrackingId}]);
    }
}