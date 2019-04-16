import {Component, Input, OnChanges, SimpleChange} from '@angular/core';
import {UnitInfo} from './unit-info.model';
import {DateTimeFormat} from '../shared/pipes/date-time-format.pipe';

@Component({
    selector: 'unit-info',
    templateUrl: 'app/unit-info/unit-info.component.html',
    styleUrls: ['app/unit-info/unit-info.component.css'],
    pipes: [DateTimeFormat]
})

export class UnitInfoComponent implements OnChanges {
    @Input() unitInfo: UnitInfo;

    Model: UnitInfo;

    // Subscribe to the change event and update the model
    ngOnChanges(changes: {[propName: string]: SimpleChange}) {
        let key = 'unitInfo';

        this.Model = changes[key].currentValue;
    }
}