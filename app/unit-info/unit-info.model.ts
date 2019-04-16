export class UnitInfo {
    public TrackingId: number;

    public OrderId: number;

    public OrderDate: string;

    public CustomerId: number;

    public CustomerName: string;

    public InventoryQuantity: number;

    public RepairStatusExists: boolean;

    public NumberOfPassingTests: number;

    public NumberOfFailingTests: number;

    public AllowSingleTest: boolean;

    public AllowBatchTest: boolean;

    public AllowBatchTestNumber: number;

    constructor() {
    }
}