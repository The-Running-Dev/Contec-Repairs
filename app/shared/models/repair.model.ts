import {Part} from './part.model';
import {OperatorInfo} from './operator-info.model';
import {UnitInfo} from '../../unit-info/unit-info.model';
import {ErrorHandler} from '../../error-handler/error-handler.model';

export class Repairs {
    public UnitInfo: UnitInfo;

    public OperatorInfo: OperatorInfo;
    
    public Notes: string;

    public Status: number;

    public Parts: Part[];

    public Errors: ErrorHandler;

    constructor() {
        this.UnitInfo = new UnitInfo();
        this.OperatorInfo = new OperatorInfo();
        this.Notes = '';
        this.Parts = [];
        this.Errors = new ErrorHandler();
    }
}