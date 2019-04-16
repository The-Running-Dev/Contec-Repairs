import {ContainerType} from './container-type.model';
import {Location} from './location.model';

export interface InventorySearchCriteria {
    ContainerTypes: ContainerType[];

    Locations: Location[];
}