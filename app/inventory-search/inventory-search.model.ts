import {ContainerType} from './container-type.model';
import {Location} from './location.model';

export class InventorySearch {
    public TrackerTypeId: number;

    public TrackingId: number;

    public ExternalId: string;

    public OrderId: string;

    public LocationId: string;

    public ContainerTypeId: string;

    public aaData: any[];

    public Locations: Location[];

    public ContainerTypes: ContainerType[];
}