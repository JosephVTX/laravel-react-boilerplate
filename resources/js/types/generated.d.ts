declare namespace App {
namespace Data {
export type RoleData = {
id: number,
name: string,
permissions: string[],
created_at: string,
};
export type UserData = {
id: number,
name: string,
email: string,
roles: string[],
created_at: string,
};
namespace Auth {
export type LoginData = {
email: string,
password: string,
remember: boolean,
};
export type RegisterData = {
name: string,
email: string,
password: string,
password_confirmation: string,
};
}
namespace Crud {
export type ColumnData = {
key: string,
label: string,
type: App.Enums.ColumnType,
sortable: boolean,
};
export type CrudMetaData = {
slug: string,
label: string,
singular: string,
baseUrl: string,
columns: App.Data.Crud.ColumnData[],
fields: App.Data.Crud.FieldData[],
searchable: boolean,
canCreate: boolean,
canUpdate: boolean,
canDelete: boolean,
defaultSort: string,
};
export type FieldData = {
name: string,
label: string,
type: App.Enums.FieldType,
required: boolean,
requiredOnCreateOnly: boolean,
options: App.Data.Crud.OptionData[],
placeholder: string | null,
hint: string | null,
};
export type OptionData = {
value: string,
label: string,
};
}
namespace Shared {
export type AuthData = {
user: App.Data.UserData | null,
permissions: string[],
};
export type FlashData = {
success: string | null,
error: string | null,
};
export type NavItemData = {
label: string,
href: string,
icon: string,
};
export type SharedData = {
appName: string,
auth: App.Data.Shared.AuthData,
flash: App.Data.Shared.FlashData,
navigation: App.Data.Shared.NavItemData[],
};
}
}
namespace Enums {
export type ColumnType = 'text' | 'badge' | 'badges' | 'boolean' | 'date' | 'datetime';
export type FieldType = 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'multiselect' | 'checkbox';
}
}
