import {Component, OnInit, ViewChild} from '@angular/core';
import {FORM_DIRECTIVES, Control, ControlGroup, FormBuilder, Validators} from '@angular/common';
import {Router} from '@angular/router-deprecated';

import {InputSwitch} from 'primeng/primeng';

import {AppService, FocusElement} from '../shared/index';
import {ErrorHandler, ErrorHandlerComponent} from '../error-handler/index';

@Component({
    selector: 'repair-dashboard',
    templateUrl: 'app/dashboard/dashboard.component.html',
    styleUrls: [
        'app/dashboard/dashboard.component.css'
    ],
    directives: [
        ErrorHandlerComponent, FocusElement,
        FORM_DIRECTIVES, InputSwitch,
    ]
})

export class DashboardComponent implements OnInit {
    @ViewChild(FocusElement) TrackingIdFocus: FocusElement;

    public SearchForm: ControlGroup;
    public Errors: ErrorHandler;

    constructor(public Service: AppService,
                private _formBuilder: FormBuilder
    ) {
        this.SearchForm = _formBuilder.group({
            TrackingId: new Control('')
        });
        this.Errors = new ErrorHandler();
    }

    ngOnInit() {
        this.Service.ProcessingError$.subscribe((data: ErrorHandler) => {
            this.Errors = data;
            setTimeout(() => {
                this.TrackingIdFocus.setFocus();
            }, 100);
        });
    }

    OnEnableDiagnostics_Changed(event: any) {
        this.Service.Setup();
        this.Errors = new ErrorHandler();
        this.TrackingIdFocus.setFocus();
    }

    public IsTrackingIdValid(trackingIdControl: Control): boolean {
        return !trackingIdControl.valid && !trackingIdControl.pristine && trackingIdControl.value !== '';
    }

    public OnKeyUpEnter(trackingIdControl: Control): void {
        if (trackingIdControl.valid) {
            this.Service.GoToParts(trackingIdControl.value);
        }
    }
}