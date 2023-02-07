export interface NamedPropertyModel {
    scope: string;
    value: string | null;
    code: string | null;
    namedProperty: {
        name: string;
        code: string | null;
        color: string | null;
    };
    localizedProperty: {
        en: string;
        ru: string;
    };
}
