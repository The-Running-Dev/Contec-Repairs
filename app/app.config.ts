// Provides the base configuration for the application 
export class AppConfig {
    public CustomerId: number;

    public SiteId: number;

    public StationId: number;

    public StationName: string;

    public StationTypeId: number;

    public StationType: string;

    public EventTypeId: number;

    public StatusCode: number;

    public OperatorId: string;

    public OperatorName: string;

    public ProductionMode: boolean;

    public ReturnUrl: string;

    public AllowDiagnostics: boolean;

    public EnableDiagnostics: boolean;

    public EnableActivity: boolean;
    
    public ApiUrls = {
        BaseUrl: 'http://services.crs.local.com',
        SampleUrl: 'api/tracker/',
        InventorySearchCriteria: 'api/inventory/searchCriteria',
        SearchInventory: 'api/inventory/inventorySearch',
        GetPartById: 'api/inventory/part',
        PartSearch: 'api/inventory/partSearch',
        GetUnitInfoByTrackingId: 'api/tracker/UnitInfo',
        SaveRepairs: 'api/repairs',
        GetRepairActivity: 'api/repairs/activity',
        DeleteRepairActivity: 'api/repairs/activity',
        DeleteRepairPart: 'api/repairs/part'
    };

    constructor() {
        this.ProductionMode = false;
        this.ReturnUrl = document.referrer;
        this.AllowDiagnostics = true;
        this.EnableDiagnostics = true;
        this.EnableActivity = true;

        this.CustomerId = 0;
        this.SiteId = 0;
        this.StationId = 0;
        this.StationName = 'Dev';
        this.StationTypeId = 0;
        this.StationType = 'Type';
        this.EventTypeId = 0;
        this.StatusCode = 0;
        this.OperatorId = 'Dev';
        this.OperatorName = 'Dev';
    }
};