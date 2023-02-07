import { Injectable } from '@nestjs/common';
import { BluelinkRepository } from './repository/bluelink.repository';
import { HttpService } from '@nestjs/axios';
import { BluelinkCsvDumpEntryInterface } from './interfaces';
import { lastValueFrom } from 'rxjs';
import { parse } from 'csv-parse/sync';

@Injectable()
export class BluelinkDumpReaderService {
    constructor(private readonly repository: BluelinkRepository, private readonly httpService: HttpService) {}

    async parseFromUrl(url: string): Promise<BluelinkCsvDumpEntryInterface[]> {
        const data = await lastValueFrom(this.httpService.get(url));
        return this.parseFromCsv(data.data);
    }

    parseFromCsv(csvData: string): Promise<BluelinkCsvDumpEntryInterface[]> {
        return parse(csvData, { columns: true, delimiter: ';' });
    }
}
