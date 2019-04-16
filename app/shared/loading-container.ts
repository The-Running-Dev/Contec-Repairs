import {Component, Input} from '@angular/core';
import {NgSwitch, NgSwitchWhen} from '@angular/common';

@Component({
    selector: 'loading-container',
    templateUrl: 'app/shared/loading-container.html',
    directives: [NgSwitch, NgSwitchWhen]
})
export class LoadingContainer {
    @Input() loading: boolean;

    constructor() {
    }
}

export class LoadingPage {
    public loading: boolean;

    constructor(private _val: boolean) {
        this.loading = _val;
    }

    Standby() {
        this.loading = true;
    }

    Ready() {
        this.loading = false;
    }
}