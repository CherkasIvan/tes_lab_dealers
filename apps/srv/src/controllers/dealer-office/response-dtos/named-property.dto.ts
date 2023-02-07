import { NamedPropertyInterface } from '@mobility/apps-dto/dist/services/dealers';

export class NamedPropertyDto implements NamedPropertyInterface {
    /** enum код значения */
    code!: string | null;
    /** Цвет для выделения */
    color!: string | null;
    /** Отображаемый текст */
    name!: string;
}
