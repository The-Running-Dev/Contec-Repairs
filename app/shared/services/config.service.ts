import {Injectable, Inject} from '@angular/core';
import {AppConfig} from '../../app.config';
import {OperatorInfo} from '../models/operator-info.model';

@Injectable()

export class ConfigService {
    private _operatorInfo: OperatorInfo;

    constructor(@Inject('app.config') public AppConfig: AppConfig) {
        this._operatorInfo = new OperatorInfo(
            this.AppConfig.SiteId,
            this.AppConfig.StationId,
            this.AppConfig.StationName,
            this.AppConfig.OperatorId,
            this.AppConfig.OperatorName
        );
    }

    public GetOperatorInfo(): OperatorInfo {
        return this._operatorInfo;
    }
}