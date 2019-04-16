import {Component, Input, Output, EventEmitter, ViewEncapsulation} from '@angular/core';
import {Control, Validators} from '@angular/common';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {Pipe, PipeTransform} from '@angular/core';
import {AutoComplete} from 'primeng/primeng';

@Pipe({ name: 'highlight' })
export class HighlightPipe implements PipeTransform {
    transform(text: string, searchText: string): string {
        return searchText ? text.replace(new RegExp(searchText, 'i'),
            `<span class="highlight">${searchText.toUpperCase()}</span>`) : text;
    }
}

@Component({
    selector: 'part-search',
    styles: [`
.part-search-input { text-transform: uppercase; }
.highlight { background-color: yellow; }
`],
    encapsulation: ViewEncapsulation.None,
    template: `
<p-autoComplete [(ngModel)]="Id"
                [suggestions]="ItemsStartingWithId"
                (completeMethod)="FindItemStartingWithId($event.query)"
                minLength="3"
                [disabled]="IsDisabled"
                (onSelect)="KeyUp($event)"
                (keyup)="KeyUp($event)"
                (keyup.enter)="KeyUpEnter($event)"
                [ngFormControl]="IdControl"
                placeholder="Find Part"
                inputStyleClass="part-search-input"
                required>
    <template let-itemId>
        <li [innerHtml]="itemId | highlight : Id"
            class="ui-autocomplete-list-item ui-helper-clearfix"
            style="border-bottom:1px solid #D5D5D5">
        </li>
    </template>
</p-autoComplete>
<span class="invalid-entry" *ngIf="IsValidItemId(IdControl)">
    <span class="glyphicon glyphicon-exclamation-sign text-danger" title="Invalid Part Id"></span>
    <span class="text-danger">Invalid Part Id</span>
</span>
`,
    directives: [
        AutoComplete
    ],
    pipes: [
        HighlightPipe
    ]
})

export class PartSearchComponent {
    @Input() IsDisabled: boolean = false;
    @Input() BaseUrl: string = '';
    @Input() set PartID(value: string){
         if (value != null || value !== '') {
              this.Id = value;
         }
    }
    @Output('keyup') OnKeyUp = new EventEmitter<string>();
    @Output('keyup.enter') OnKeyUpEnter = new EventEmitter<string>();

    public ItemsStartingWithId: string[];
    public Id: string;
    public IdControl: Control;

    private _errorMessage: string;
    private _getPartByIdUrl: string = '/api/inventory/part';
    private _partSearchUrl: string = '/api/inventory/partSearch';

    constructor(
        private _http: Http
    ) {
        this.IdControl = new Control('',
            Validators.required,
            Validators.composeAsync([(control: Control) => this.IsPartIdValid(control.value)])
        );
    }

    Reset() {
        this.Id = '';
    }

    IsValidItemId(control: Control) {
        return !control.valid && !control.pristine && control.value !== '';
    }

    KeyUp() {
        // Need a small timeout so the control validity updates
        setTimeout(() => {
            if (this.IdControl.valid) {
                this.OnKeyUp.emit(this.Id);
            }
            else {
                this.OnKeyUp.emit('');
            }
        }, 200);
    }

    KeyUpEnter() {
        // Need a small timeout so the control validity updates
        setTimeout(() => {
            if (this.IdControl.valid) {
                this.OnKeyUpEnter.emit(this.Id);
            }
        }, 200);
    }

    FindItemStartingWithId(value: string) {
        this.ItemsStartingWithId = [];

        this.FindParts(value).subscribe((data: string[]) => {
            this.ItemsStartingWithId = data;
        });
    }

    // Validates the part given its ID
    // by calling the api/GetPartById method
    public IsPartIdValid(id: string): Promise<any> {
        if (id.length > 2) {
            return new Promise(resolve => {
                this.GetPartById(id)
                    .subscribe((data: Part) => {
                        if (!data) {
                            resolve({dataExists: false});
                        } else {
                            // need to return null if ok
                            resolve(null);
                        }
                    }, (error: any) => {
                    });
            });
        }
    }

    private GetPartById(id: string): Observable<Part> {
        return this._http.get(`${this.BaseUrl}${this._getPartByIdUrl}/${id}`)
            .map((response: Response) => <Part>(<ApiResponse>response.json()).Data)
            .catch(this.HandleError);
    }

    private FindParts(searchCriteria: string): Observable<string[]> {
        return this._http.get(`${this.BaseUrl}${this._partSearchUrl}/${searchCriteria}`)
            .map((response: Response) => <Part[]>(<ApiResponse>response.json()).Data)
            .map((data: Part[]) => {
                let arrayOfIds: string[] = [];

                data.forEach((item: Part) => {
                    arrayOfIds.push(item.Id);
                });

                return arrayOfIds;
            })
            .catch(this.HandleError);
    }

    private ExtractData(res: Response): any {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad Response Status: ' + res.status);
        }

        let body = res.json();

        return body || {};
    }

    private HandleError(response: Response) {
        let handledResponse = {};

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
                    ErrorMessage: responseJson.Message
                };
            }
            else {
                let responseJson = <any>response.json();
                this._errorMessage = <any>response;

                handledResponse = {
                    IsError: true,
                    ErrorMessage: (responseJson.Message) ? responseJson.Message : response.json()
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

export interface ApiResponse {
    IsError: boolean;
    Message: string;
    Data: any;
}

export interface Part {
    Id: string;
    Description: string;
}