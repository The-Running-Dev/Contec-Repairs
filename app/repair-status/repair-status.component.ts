import {Component, OnInit} from '@angular/core';
import {Router, RouteParams} from '@angular/router-deprecated';
import {Control, ControlGroup, FormBuilder, Validators} from '@angular/common';

import {OperatorInfoComponent} from '../operator-info/operator-info.component';
import {UnitInfoComponent} from '../unit-info/unit-info.component';
import {ErrorHandler, ErrorHandlerComponent} from '../error-handler/index';

import {Repairs, AppService, FocusElement, ButtonRadioDirective} from '../shared/index';
import {LoadingContainer, LoadingPage} from '../shared/loading-container';

@Component({
    selector: 'repair-status',
    templateUrl: 'app/repair-status/repair-status.component.html',
    styleUrls: [
        'app/repair-status/repair-status.component.css'
    ],
    directives: [
        LoadingContainer,
        OperatorInfoComponent,
        UnitInfoComponent,
        ErrorHandlerComponent,
        FocusElement,
        ButtonRadioDirective
    ]
})

export class RepairStatusComponent extends LoadingPage implements OnInit {
    public Model: Repairs;
    public StatusForm: ControlGroup;
    public FinishButtonText: string;
    public IsError: boolean;

    constructor(
        public Service: AppService,
        private _routeParams: RouteParams,
        private _formBuidler: FormBuilder
    ) {
        super(true);

        this.StatusForm = this._formBuidler.group({});
        this.FinishButtonText = 'Finish';
    }

    ngOnInit() {
        this.Model = this.Service.Repairs;
        let trackingId = +this._routeParams.get('id');

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

    IsFormEnabled() {
        return !this.Service.Status.IsProcessing && this.StatusForm.valid && this.Model.Status != null;
    }

    Finish() {
        this.FinishButtonText = 'Saving...';
        this.Service.Status.IsProcessing = true;

        /*
        this.Service.saveRepairs().subscribe((response: ApiResponse) => {
            if (response.IsError) {
                this.ErrorOccurred = true;
                this.ErrorMessage = response.Message;
            } else {
                this.FinishButtonText = 'Saved';

                // Back to the Dashboard
                this._router.navigate(['Dashboard']);
            }

            this.Service.Status.IsProcessing = false;
        }, error => {
            this.ErrorOccurred = true;
            this.ErrorMessage = error.ErrorMessage;

            this.Service.Status.IsProcessing = false;
            this.FinishButtonText = 'Finish';
        });
        */
    }
}