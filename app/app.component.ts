import {Component, ViewContainerRef, OnInit} from '@angular/core';
import { ROUTER_DIRECTIVES, ROUTER_PROVIDERS, RouteConfig} from '@angular/router-deprecated';
import {Location} from '@angular/common';
import {HTTP_PROVIDERS} from '@angular/http';

import {
    DashboardComponent,
    RepairNotesComponent,
    RepairStatusComponent,
    RepairPartsComponent,
    RepairActivityComponent
} from './index';
import {AppService, ConfigService} from './shared/index';

@RouteConfig([
    {
        path: 'dashboard',
        as: 'Dashboard',
        component: DashboardComponent,
        useAsDefault: true
    },
    {
        path: 'repair-notes/:id',
        as: 'RepairNotes',
        component: RepairNotesComponent
    },
    {
        path: 'repair-status/:id',
        as: 'RepairStatus',
        component: RepairStatusComponent
    },
    {
        path: 'repair-parts/:id',
        as: 'RepairParts',
        component: RepairPartsComponent
    },
    {
        path: 'repair-activity/:id',
        as: 'RepairActivity',
        component: RepairActivityComponent
    }
])

@Component({
    selector: 'repair-app',
    templateUrl: 'app/app.component.html',
    directives: [
        ROUTER_DIRECTIVES
    ],
    providers: [
        ROUTER_PROVIDERS,
        HTTP_PROVIDERS,
        ConfigService,
        AppService
    ]
})

export class AppComponent implements OnInit {
    trackingId: number;
    isTrackingIdValid: boolean;

    private viewContainerRef: ViewContainerRef;

    constructor(private _location: Location,
                private _viewContainerRef: ViewContainerRef) {
        // You need this small hack in order to catch application root view container ref
        this.viewContainerRef = _viewContainerRef;
    }

    ngOnInit() {
        this.isTrackingIdValid = false;
    }

    isRouteActive(routePath: string) {
        let path = this._location.path();
        let isCurrentPath = path.match(new RegExp(`${routePath}/`, 'gi'));
        let isDefaultRoute = path === '' || routePath.match(new RegExp('dashboard', 'gi')) !== null;

        if (isDefaultRoute) {
            return true;
        } else if (isCurrentPath != null) {
            return true;
        }

        return false;
    }
}