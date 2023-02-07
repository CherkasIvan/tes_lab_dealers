export class GetProposalFiltersDto {
    /** идентификатор */
    id?: string;
    /** id клиента */
    customerId?: string;
    /** Начало промежутка дат публикации */
    publicationDateStart?: string;
    /** Конец промежутка дат публикации */
    publicationDateEnd?: string;
}
