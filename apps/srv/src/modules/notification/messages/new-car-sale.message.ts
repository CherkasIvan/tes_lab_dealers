import { CarSaleVehicleModel } from '../../car-sale/models/car-sale-vehicle.model';
import * as moment from 'moment';

export function getNewCarSaleMessage(entity: CarSaleVehicleModel, domain: string): string {
    const link = `${domain}/${entity.applicationId}`;
    const publicationDate = moment(entity.publicationDate).format('DD-MM-YYYY');
    const publicationTime = moment(entity.publicationDate).format('HH:MM');
    return `<html>Добрый день,<br>
<br>
Вам поступила новая заявка о продаже авто<br>
Ссылка на карточку автомобиля:    <a href="${link}">${link}</a><br>
Дата создания заявки:  ${publicationDate} в ${publicationTime}<br>
Модель:  ${entity.getBrand()} ${entity.model}<br>
VIN номер:  ${entity.vin}<br>
Клиент:  ${entity.customerPhone}<br>
Пробег:  ${entity.getMileage() || 'Нет данных'}<br>
Год выпуска:  ${entity.getProductionYear()}<br>
<hr>
<i>Данное сообщение было сгенерировано автоматически, ответа на него не требуется</i></html>`;
}
