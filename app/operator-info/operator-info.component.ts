import {Component, Input, OnInit, OnChanges, SimpleChange} from '@angular/core';
import {OperatorInfo} from '../shared/index';

@Component({
    selector: 'operator-info',
    templateUrl: 'app/operator-info/operator-info.component.html'
})

export class OperatorInfoComponent implements OnChanges {
    @Input() Data: OperatorInfo;
    public Model: OperatorInfo;

    ngOnInit() {
    }

    // Subscribe to the change event and update the model
    ngOnChanges(changes: {[propName: string]: SimpleChange}) {
        let key = 'Data';
        this.Model = changes[key].currentValue;
    }
}