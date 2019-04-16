import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, URLSearchParams, Response, RequestOptionsArgs} from '@angular/http';
import {isPrimitive} from '@angular/core/src/facade/lang';
import {Observable} from 'rxjs/Rx';
import {Subject} from 'rxjs/Subject';

import {ConfigService} from '../shared/index';
import {InventorySearch, InventorySearchCriteria} from './index';

@Injectable()

export class InventorySearchService {
    private _errorMessage: string;
    private _searchCriteria: InventorySearchCriteria;
    private _searchCriteriaObservable: Observable<any>;

    constructor(private _http: Http, private _configService: ConfigService) {
    }

    getApiUrl(apiEndPoint: string) {
        return this._configService.AppConfig.ApiUrls.BaseUrl
            + '/' + this._configService.AppConfig.ApiUrls[apiEndPoint];
    }

    getSearchCriteria() {
        if (this._searchCriteria) {
            return Observable.of(this._searchCriteria);
        } else if (this._searchCriteriaObservable) {
            return this._searchCriteriaObservable;
        } else {
            this._searchCriteriaObservable = this._http.get(`${this.getApiUrl('InventorySearchCriteria')}`)
                .map((response: Response) => {
                    return <InventorySearchCriteria>response.json();
                })
                .do((data: InventorySearchCriteria) => {
                    this._searchCriteria = data;

                    this._searchCriteriaObservable = null;
                })
                .share();

            return this._searchCriteriaObservable;
        }
    }

    search(params: InventorySearch) {
        let searchParams: URLSearchParams = new URLSearchParams();

        this.setParam(searchParams, 'TrackerTypeId', params.TrackerTypeId);
        this.setParam(searchParams, 'TrackingId', params.TrackingId);
        this.setParam(searchParams, 'ExternalId', params.ExternalId);
        this.setParam(searchParams, 'OrderId', params.OrderId);
        this.setParam(searchParams, 'LocationId', params.LocationId);
        this.setParam(searchParams, 'ContainerTypeId', params.ContainerTypeId);

        return this._http.get(`${this.getApiUrl('SearchInventory')}`, { search: searchParams })
            .map(this.extractData)
            .catch(this.handleError);
    }

    private setParam(searchParams: URLSearchParams, key: string, value: Object) {
        searchParams.set(key, (typeof value === 'undefined') ? '' : value.toString());
    }

    private objectToParams(object: Object): string {
        return Object.keys(object).map((value) => {
            let objectValue = isPrimitive(object[value]) ? object[value] : JSON.stringify(object[value]);
            return `${value}=${objectValue}`;
        }).join('&');
    }

    private extractData(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad Response Status: ' + res.status);
        }

        let body = res.json();

        return body || { };
    }

    private handleError(response: Response) {
        let handledResponse = {};

        try {
            if (response.status == 404) {
                handledResponse = {
                    code: 404,
                    message: 'Data Not Found'
                };
            }
            if (response.status == 500) {
                let responseJson = <any>response.json();

                handledResponse = {
                    IsError: true,
                    ErrorMessage: responseJson.Message
                };
            }
            else {
                this._errorMessage = <any>response;

                handledResponse = response.json();
            }
            // If the body wasn't JSON, something else went wrong -
            // provide a normalized default error body.
        } catch (jsonError) {
            handledResponse = {
                code: -1,
                message: 'Something Went Wrong.'
            };
        }

        return Observable.throw(handledResponse);
    }
}