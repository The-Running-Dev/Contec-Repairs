import {Component, Input, OnChanges, SimpleChange} from '@angular/core';
import {ErrorHandler} from './error-handler.model';
import {AppService} from '../shared/services/app.service';

@Component({
    selector: 'error-handler',
    templateUrl: 'app/error-handler/error-handler.component.html'
})

export class ErrorHandlerComponent implements OnChanges {
    @Input() Data: ErrorHandler;
    public Model: ErrorHandler;

    constructor(public Service: AppService) {}

    // Subscribe to the change event and update the model
    ngOnChanges(changes: {[propName: string]: SimpleChange}) {
        let key = 'Data';
        this.Model = changes[key].currentValue;
    }
}