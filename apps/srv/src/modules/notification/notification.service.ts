import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { NotificationPublisher } from '../../channels/notification/notification.publisher';
import { CarSaleVehicleModel } from '../car-sale/models/car-sale-vehicle.model';
import { getNewCarSaleMessage } from './messages/new-car-sale.message';
import { AppConfigFacade } from '@app/domains';
import { InternalLogger } from '@app/common';
import { CarSaleMailingConfigInterface } from './car-sale-mailing-config.interface';
import { plainToClass } from 'class-transformer';

@Injectable()
export class NotificationService implements OnApplicationBootstrap {
    constructor(private readonly publisher: NotificationPublisher, private readonly settingsFacade: AppConfigFacade) {}

    private readonly logger = new InternalLogger(NotificationService.name);

    async onApplicationBootstrap(): Promise<void> {
        const config = await this.settingsFacade.get<CarSaleMailingConfigInterface>({ ident: 'car-sale-mailing' }).catch(() => null);
        if (!config?.value) {
            this.logger.warn('car-sale-mailing config is empty, creating default...');
            await this.settingsFacade.create({
                ident: 'car-sale-mailing',
                name: 'car-sale-mailing',
                value: {
                    mailingList: ['e.shantar@tes.store'],
                    path: 'https://dealer.dev.mobility.hyundai.ru/tickets-byuouts',
                } as CarSaleMailingConfigInterface,
                group: 'setting',
                type: 'config',
            });
        }
    }

    async sendCarSaleMessage(entity: CarSaleVehicleModel): Promise<void> {
        const config = await this.settingsFacade.get<CarSaleMailingConfigInterface>({ ident: 'car-sale-mailing' });
        const dto = plainToClass(CarSaleMailingConfigInterface, config?.value);
        const text = getNewCarSaleMessage(entity, dto.path);
        await this.publisher.sendMail({
            target: {
                html: text,
                subject: 'Заявка о продаже авто',
                project: 'mobikey',
                toAddress: dto.mailingList,
            },
        });
    }
}
