import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

// under SystemJs, moment is actually exported as the default export, account for that
const m: (value?: any) => moment.Moment = (<any>moment).default || moment;

@Pipe({name: 'dateTimeFormat'})
export class DateTimeFormat implements PipeTransform {
    transform(value: Date | moment.Moment, dateFormat: string, timeFormat: string): any {
        // The date/moment should always be in UTC
        // so append 'Z' to the end of the date if it's not there
        let v = (value.toString().match(/z$/gi)) ? value : `${value}Z`;
        let df = (dateFormat) ? dateFormat : 'L';
        let tf = (timeFormat) ? timeFormat : 'h:mm A';
        let date = m(m(v).utc().toDate());

        return `${date.format(df)} ${date.format(tf)}`;
    }
}