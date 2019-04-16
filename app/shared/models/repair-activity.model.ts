export interface RepairActivity {
    Id: number;

    TrackingId: number;

    Notes: string;

    CreateDate: string;

    CreatedBy: string;

    // View model column to confirm the delete 
    ConfirmDelete: boolean;
}