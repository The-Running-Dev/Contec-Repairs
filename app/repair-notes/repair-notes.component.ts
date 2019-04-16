import {Component, OnInit} from '@angular/core';
import {RouteParams} from '@angular/router-deprecated';
import {FORM_DIRECTIVES, Control, ControlGroup, FormBuilder, Validators} from '@angular/common';

import {OperatorInfoComponent} from '../operator-info/operator-info.component';
import {UnitInfoComponent} from '../unit-info/unit-info.component';
import {Repairs, AppService, FocusElement} from '../shared/index';
import {ErrorHandler, ErrorHandlerComponent} from '../error-handler/index';
import {LoadingContainer, LoadingPage} from '../shared/loading-container';

@Component({
    selector: 'repair-notes',
    templateUrl: 'app/repair-notes/repair-notes.component.html',
    styleUrls: [
        'app/repair-notes/repair-notes.component.css'
    ],
    directives: [
        LoadingContainer,
        FORM_DIRECTIVES,
        OperatorInfoComponent,
        UnitInfoComponent,
        ErrorHandlerComponent,
        FocusElement
    ]
})

export class RepairNotesComponent extends LoadingPage implements OnInit {
    public Model: Repairs;
    public NotesForm: ControlGroup;
    public SaveButtonText: string;
    public IsError: boolean;

    constructor(
        public Service: AppService,
        private _routeParams: RouteParams,
        private _formBuidler: FormBuilder
    ) {
        super(true);

        this.SaveButtonText = 'Save';
        this.IsError = true;

        // Add a custom validator to check the values of the notes
        this.NotesForm = this._formBuidler.group({
            NotesControl: new Control('', Validators.compose([Validators.required, this.validateNotes]))
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

    Save() {
        this.SaveButtonText = 'Saving...';
        this.Service.SaveRepairs().subscribe(() => {
            this.SaveButtonText = 'Saved';
        });
    }

    private validateNotes(c: Control): {} {
        return /^(?!\s+$).*/.test(c.value) ? null : {
            validateNotes: {
                valid: false
            }
        };
    }
}