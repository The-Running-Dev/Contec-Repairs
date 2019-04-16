import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {RouteParams} from '@angular/router-deprecated';

import {DataTable, Column, ToggleButton} from 'primeng/primeng';
import {DateTimeFormat} from '../shared/pipes/date-time-format.pipe';

import {AppService} from '../shared/index';
import {Repairs, ApiResponse, RepairActivity, RepairPart} from '../shared/models/index';
import {UnitInfoComponent} from '../unit-info/unit-info.component';
import {OperatorInfoComponent} from '../operator-info/operator-info.component';
import {LoadingContainer, LoadingPage} from '../shared/loading-container';

@Component({
    selector: 'repair-activity',
    templateUrl: 'app/repair-activity/repair-activity.component.html',
    styleUrls: [
        'app/repair-activity/repair-activity.component.css'
    ],
    directives: [
        LoadingContainer,
        OperatorInfoComponent, UnitInfoComponent,
        DataTable, Column, ToggleButton
    ],
    pipes: [
        DateTimeFormat
    ],
    encapsulation: ViewEncapsulation.None
})

export class RepairActivityComponent extends LoadingPage implements OnInit {
    public Model: Repairs;
    public Activity: RepairActivity[];
    public Parts: RepairPart[];
    public ApiResponse: ApiResponse;

    constructor(
        public Service: AppService,
        private _routeParams: RouteParams) {
        super(true);

        this.Activity = [];
        this.Parts = [];
        this.ApiResponse = new ApiResponse();
    }

    ngOnInit() {
        this.Model = this.Service.Repairs;
        let id = +this._routeParams.get('id');
        let activityId = +this._routeParams.get('activityId');

        if (id) {
            this.Service.LoadUnitInfo(id).subscribe((data: Repairs) => {
                this.Model = data;

                this.Service.GetRepairActivity(activityId).subscribe((response: ApiResponse) => {
                    if (response.Data.RepairActivity != null) {
                        this.Activity.push(response.Data.RepairActivity);
                    }
                    this.Parts = response.Data.RepairParts;
                    this.Service.Status.IsProcessing = false;
                    this.Ready();
                });
            });
        } else {
            this.Service.GoToDone();
        }
    }

    public DeleteRepairActivity(confirmed: boolean, item: RepairActivity) {
        if (!confirmed) {
            setTimeout(() => {
                item.ConfirmDelete = !item.ConfirmDelete;                
            }, 2000);
            
            return;
        }

        this.Service.DeleteRepairActivity(item.Id).subscribe((response: ApiResponse) => {
            this.ApiResponse = response;

            if (!this.ApiResponse.IsError) {
                this.Activity = [];
                this.Parts = [];
            }
        });
    }

    public DeleteRepairPart(confirmed: boolean, item: RepairPart) {
        if (!confirmed) {
            setTimeout(() => {
                item.ConfirmDelete = !item.ConfirmDelete;         
            }, 2000);
            
            return;
        }

        this.Service.DeleteRepairPart(item.Id).subscribe((response: ApiResponse) => {
            this.ApiResponse = response;

            if (!this.ApiResponse.IsError) {
                this.Parts.splice(this.Parts.indexOf(item), 1);                
            }
        });
    }
}