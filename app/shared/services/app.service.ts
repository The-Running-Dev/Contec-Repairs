import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import {Router} from '@angular/router-deprecated';
import {Observable} from 'rxjs/Rx';
import {Subject} from 'rxjs/Subject';
import {NextObserver} from 'rxjs/Observer';

import {AppConfig} from '../../app.config';
import {ConfigService} from './config.service';

import {Repairs, ApiResponse} from '../models/index';
import {UnitInfo} from '../../unit-info/unit-info.model';
import {ErrorHandler} from '../../error-handler/error-handler.model';

@Injectable()

export class AppService {
    public Status = { IsProcessing: false, Message: '' };
    public Repairs: Repairs;
    public UnitInfo$: Observable<UnitInfo>;
    public ProcessingError$: Observable<ErrorHandler>;
    public ProcessingSuccess$: Observable<string>;

    public RepairStatusDoesNotExists: string = 'You Cannot Record Repairs for This Unit Because Repair Status Does Not Exist';
    public CannotRecordRepairs: string = 'You Cannot Record Repairs for Unit With No Inventory';
    public CannotRecordRepairsForMultipleUnits: string = 'You Cannot Record Repairs for Multiple Units';
    public NoDataFoundForTrackingId: string = 'No Data Found for This Tracking ID';
    public GenericError: string = 'Something Went Wrong';

    private _errorMessage: string;
    private _unitInfo: Subject<UnitInfo>;   
    private _processingError: Subject<ErrorHandler>;
    private _processingSuccess: Subject<string>;

    constructor(private _http: Http,
        private _router: Router,
        private _configService: ConfigService
    ) {
        this._unitInfo = new Subject<UnitInfo>();
        this._processingError = new Subject<ErrorHandler>();
        this._processingSuccess = new Subject<string>();

        this.UnitInfo$ = this._unitInfo.asObservable();
        this.ProcessingError$ = this._processingError.asObservable();
        this.ProcessingSuccess$ = this._processingSuccess.asObservable();

        this.Setup();
    }

    public Config(): AppConfig {
        return this._configService.AppConfig;
    }

    public OnUnitInfoChanged(unitInfo: UnitInfo): void {
        this._unitInfo.next(unitInfo);
    }

    public Setup(): void {
        this.Repairs = new Repairs();
        this.Repairs.OperatorInfo = this._configService.GetOperatorInfo();
    }

    public LoadUnitInfo(id: number): Observable<Repairs> {
        if (this.Repairs.UnitInfo.TrackingId && this.Repairs.UnitInfo.TrackingId == id) {
            this._unitInfo.next(this.Repairs.UnitInfo);
            this._processingSuccess.next('');

            return Observable.of(this.Repairs);
        }
        else {
            this.Setup();

            return Observable.create((observer: NextObserver<Repairs>) => {
                this.GetUnitInfoByTrackingId(id)
                    .subscribe((unitInfo: UnitInfo) => {
                        this.Status.IsProcessing = false;
                        this.Repairs.UnitInfo = unitInfo;
                        this.Repairs.Errors = this.HandleErrors(unitInfo);

                        if (this.Repairs.Errors.IsError) {
                            this._processingError.next(this.Repairs.Errors);
                        }

                        this._processingSuccess.next('');
                        observer.next(this.Repairs);
                        observer.complete();
                    }, (error: any) => {
                        this.Status.IsProcessing = false;
                        this.Repairs.Errors.IsError = true;
                        this.Repairs.Errors.Message = this.NoDataFoundForTrackingId;

                        this._processingError.next(this.Repairs.Errors);
                        observer.next(this.Repairs);
                        observer.complete();
                    });
            });
        }
    }

    public GetUnitInfoByTrackingId(id: number): Observable<UnitInfo> {
        this.StartProcessing('Finding Unit');
        this.Repairs.UnitInfo.TrackingId = id;

        return this._http.get(`${this.GetApiUrl('GetUnitInfoByTrackingId')}/${id}`)
            .map(response => <UnitInfo>(<ApiResponse>response.json()).Data)
            .catch((error: any) => this.HandleHttpError(error));
    }

    public SaveRepairs(): Observable<ApiResponse> {
        this.StartProcessing('Saving Repairs');

        return Observable.create((observer: NextObserver<ApiResponse>) => {
            let body = JSON.stringify(this.Repairs);
            let headers = new Headers({ 'Content-Type': 'application/json' });
            let options = new RequestOptions({ headers: headers });

            this._http.post(`${this.GetApiUrl('SaveRepairs')}`, body, options)
                .map((response: Response) => (<ApiResponse>response.json()))
                .catch((error: any) => this.HandleHttpError(error))
                .subscribe((response: ApiResponse) => {
                    if (response.IsError) {
                        this.Repairs.Errors.Message = response.Message;

                        this._processingError.next(this.Repairs.Errors);
                    } else {
                        this._processingSuccess.next('');

                        if (this.IsActivityEnabled()) {
                            this.GoToActivity(this.Repairs.UnitInfo.TrackingId, response.Data);
                        }
                        else {
                            this.GoToDone();
                        }
                    }

                    this.Status.IsProcessing = false;
                }, error => {
                    this.Repairs.Errors.IsError = true;
                    this.Repairs.Errors.Message = error.Message;

                    this._processingError.next(this.Repairs.Errors);
                });
        });
    }

    public GetRepairActivity(id: number): Observable<ApiResponse> {
        this.StartProcessing('Getting Repair Activity');

        return this._http.get(`${this.GetApiUrl('GetRepairActivity')}/${id}`)
            .map(response => <ApiResponse>response.json())
            .catch((error: any) => this.HandleHttpError(error));
    }

    public DeleteRepairActivity(id: number): Observable<ApiResponse> {
        this.StartProcessing('Deleting Repair Activity');

        return Observable.create((observer: NextObserver<ApiResponse>) => {
            return this._http.delete(`${this.GetApiUrl('DeleteRepairActivity')}/${id}`)
                .map(response => <ApiResponse>response.json())
                .catch((error: any) => this.HandleHttpError(error))
                .subscribe((response: ApiResponse) => {
                    this.Status.IsProcessing = false;

                    observer.next(response);
                    observer.complete();
                }, error => {
                    observer.next(error);
                    observer.complete();
                });
        });
    }

     public DeleteRepairPart(id: number): Observable<ApiResponse> {
        this.StartProcessing('Deleting Repair Activity');

        return Observable.create((observer: NextObserver<ApiResponse>) => {
            return this._http.delete(`${this.GetApiUrl('DeleteRepairPart')}/${id}`)
                .map(response => <ApiResponse>response.json())
                .catch((error: any) => this.HandleHttpError(error))
                .subscribe((response: ApiResponse) => {
                    this.Status.IsProcessing = false;

                    observer.next(response);
                    observer.complete();
                }, error => {
                    observer.next(error);
                    observer.complete();
                });
        });
    }

    public GoToParts(id: number): void {
        this.LoadUnitInfo(id).subscribe((data: Repairs) => {
            if (!data.Errors.IsError) {
                this._router.navigate(['RepairParts', { id: id }]);
            }
        });
    }

    public GoToNotes(id: number): void {
        this.LoadUnitInfo(id).subscribe((data: Repairs) => {
            if (!data.Errors.IsError) {
                this._router.navigate(['RepairNotes', {id: id }]);
            }
        });
    }

    public GoToStatus(id: number): void {
        this.LoadUnitInfo(id).subscribe((data: Repairs) => {
            if (!data.Errors.IsError) {
                this._router.navigate(['RepairStatus', {id: id }]);
            }
        });
    }

    public GoToActivity(trackingId: number, id: number): void {
        this._router.navigate(['RepairActivity', { id: trackingId, activityId: id }]);
    }

    public GoToDone(): void {
        if (this.Config().ReturnUrl !== '') {
            window.location.href = this.Config().ReturnUrl;
        }
        else {
            this._router.navigate(['Dashboard']);
        }
    }

    public AllowSave(): boolean {
        // Allow save if nothing is processing, and parts or notes exist
        return this.Repairs.Parts.length > 0 || this.Repairs.Notes.length > 0;
    }

    public AreDiagnositcsEnabled(): boolean {
        return this.Config().AllowDiagnostics && this.Config().EnableDiagnostics;
    }

    public IsActivityEnabled(): boolean {
        return this.Config().EnableActivity;
    }

    public HandleErrors(unitInfo: UnitInfo): ErrorHandler {
        let errorHandler = new ErrorHandler();

        if (!unitInfo.RepairStatusExists && !this.AreDiagnositcsEnabled()) {
            errorHandler.IsError = true;
            errorHandler.Message = this.RepairStatusDoesNotExists;
        }
        else if (unitInfo.InventoryQuantity == 0 && !this.AreDiagnositcsEnabled()) {
            errorHandler.IsError = true;
            errorHandler.Message = this.CannotRecordRepairs;
        }
        else if (unitInfo.InventoryQuantity > 1 && !this.AreDiagnositcsEnabled()) {
            errorHandler.IsError = true;
            errorHandler.Message = this.CannotRecordRepairsForMultipleUnits;
        }

        return errorHandler;
    }

    public HandleError(condition: boolean, message: string): ErrorHandler {
        let errorHandler = new ErrorHandler();

        if (!condition && !this.AreDiagnositcsEnabled()) {
            errorHandler.IsError = true;
            errorHandler.Message = message;
        }

        return errorHandler;
    }

    private StartProcessing(message: string): void {
        this.Status.IsProcessing = true;
        this.Status.Message = message;
    }

    private GetApiUrl(apiEndPoint: string): string {
        return this.Config().ApiUrls.BaseUrl
            + '/' + this.Config().ApiUrls[apiEndPoint];
    }

    private ExtractData(res: Response): any {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad Response Status: ' + res.status);
        }

        let body = res.json();

        return body || {};
    }

    private HandleHttpError(response: Response) {
        let handledResponse = {};
        this.Status.IsProcessing = false;

        try {
            if (response.status == 404) {
                handledResponse = {
                    code: 404,
                    message: 'Data Not Found'
                };
            }
            else if (response.status == 500) {
                let responseJson = <any>response.json();

                handledResponse = {
                    IsError: true,
                    Message: responseJson.Message
                };
            }
            else {
                let responseJson = <any>response.json();
                this._errorMessage = <any>response;

                handledResponse = {
                    IsError: true,
                    Message: (responseJson.Message) ? responseJson.Message : response.json()
                };
            }
        } catch (jsonError) {
            handledResponse = {
                code: -1,
                message: 'Something Went Wrong.'
            };
        }

        return Observable.throw(handledResponse);
    }
}