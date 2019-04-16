export interface RepairPart {
    Id: number;

    TrackingId: number;

    RepairActivityId: number;

    OrderId: number;

    SerialNumber: string;

    PartId: string;

    Designator: number;

    QuantityRequested: number;

    QuantityInstalled: number;

    QuantityAwap: number;

    RequestedOn: string;

    RequestedBy: string;

    ChangedOn: string;

    InstalledPn: string;

    UserId: string;

    StationId: number;

    IsInstalled: boolean;

    IsRecovered: boolean;

    ActionComplete: boolean;

    InvoiceStatus: string;

    // View model column to confirm the delete 
    ConfirmDelete: boolean;
}