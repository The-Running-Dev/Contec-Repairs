export class OperatorInfo {
    public SiteId: number;

    public StationId: number;

    public StationName: string;

    public OperatorId: string;

    public OperatorName: string;

    public TimeZone: string;

    constructor(siteId?: number,
                stationId?: number,
                stationName?: string,
                operatorId?: string,
                operatorName?: string,
                timeZone?: string) {
        this.SiteId = siteId;
        this.StationId = stationId;
        this.StationName = stationName;
        this.OperatorId = operatorId;
        this.OperatorName = operatorName;
    }
}