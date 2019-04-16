import {Component, OnInit, ViewChild} from '@angular/core';
import {RouteParams} from '@angular/router-deprecated';
import {FormBuilder, Control, ControlGroup, Validators} from '@angular/common';

import {DataTable, Column} from 'primeng/primeng';

import {AppService, FocusElement, Repairs, Part} from '../shared/index';

import {OperatorInfoComponent} from '../operator-info/operator-info.component';
import {UnitInfoComponent} from '../unit-info/unit-info.component';
import {PartSearchComponent} from '../part-search/part-search.component';
import {ErrorHandler, ErrorHandlerComponent} from '../error-handler/index';
import {LoadingContainer, LoadingPage} from '../shared/loading-container';

@Component({
    selector: 'repair-parts',
    templateUrl: 'app/repair-parts/repair-parts.component.html',
    directives: [
        LoadingContainer,
        OperatorInfoComponent, UnitInfoComponent, ErrorHandlerComponent,
        PartSearchComponent,
        FocusElement, DataTable, Column
    ]
})

export class RepairPartsComponent extends LoadingPage implements OnInit {
    public Model: Repairs;
    public ItemsStartingWithId: string[];
    public Id: string;
    public Quantity: number;
    public PartsForm: ControlGroup;
    public SaveButtonText: string;
    public IsError: boolean;
    @ViewChild(PartSearchComponent) private _partSearch: PartSearchComponent;

    constructor(
        public Service: AppService,
        private _routeParams: RouteParams,
        private _formBuidler: FormBuilder
    ) {
        super(true);

        this.Id = '';
        this.Quantity = 1;
        this.SaveButtonText = 'Save';
        this.IsError = true;

        this.PartsForm = this._formBuidler.group({
            PartSearchControl: new Control(''),
            QuantityControl: new Control('', Validators.required),
        });

        this.Service.ProcessingError$.subscribe((data: ErrorHandler) => {
            this.SaveButtonText = 'Save';
        });
    }

    ngOnInit() {
        let trackingId = +this._routeParams.get('id');
        this.Model = this.Service.Repairs;

        if (trackingId) {
            this.Service.LoadUnitInfo(trackingId).subscribe((data: Repairs) => {
                this.IsError = data.Errors.IsError;
                this.Model = data;
                this.Ready();
            });
        } else {
            this.Service.GoToDone();
        }
    }

    OnPartKeyUp(partId: string) {
        // Hack: Check for the partId being a string
        // because it would also pass back the event
        this.Id = (typeof(partId) === 'string') ? partId : '';
    }

    OnPartKeyUpEnter(partId: string) {
        // Hack: Check for the partId being a string
        // because it would also pass back the event
        if (typeof(partId) === 'string') {
            this.Id = partId;
            this.AddItem();
        }
    }

    AddPartIsValid() {
        return this.PartsForm.valid && this.Id !== '';
    }

    AddItem() {
        if (!this.PartsForm.valid) { return; };

        let newItem = new Part();
        newItem.Id = this.Id;
        newItem.Quantity = this.Quantity;

        let existingItem = this.Model.Parts.find((item: Part) => item.Id == this.Id);

        if (!existingItem) {
            this.Model.Parts.push(newItem);
        }
        else {
            let q = parseInt(existingItem.Quantity.toString(), 9);
            existingItem.Quantity = q + parseInt(newItem.Quantity.toString(), 0);
        }

        this.Id = '';
        this.Quantity = 1;
        this._partSearch.Reset();
    }

    RemoveItem(item: Part) {
        this.Model.Parts.splice(this.Model.Parts.indexOf(item), 1);
    }

    Save() {
        this.SaveButtonText = 'Saving...';
        this.Service.SaveRepairs().subscribe(() => {
            this.SaveButtonText = 'Saved';
        });
    }
}