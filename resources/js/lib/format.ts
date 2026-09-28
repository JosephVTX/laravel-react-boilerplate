const dateFormat = new Intl.DateTimeFormat('es', { dateStyle: 'medium' });
const dateTimeFormat = new Intl.DateTimeFormat('es', { dateStyle: 'medium', timeStyle: 'short' });

export const formatDate = (value: string) => dateFormat.format(new Date(value));
export const formatDateTime = (value: string) => dateTimeFormat.format(new Date(value));
