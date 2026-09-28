<?php

namespace App\Enums;

/** Tipos de campo soportados por el formulario CRUD generico (resources/js/components/crud/FieldInput.tsx). */
enum FieldType: string
{
    case Text = 'text';
    case Email = 'email';
    case Password = 'password';
    case Number = 'number';
    case Textarea = 'textarea';
    case Select = 'select';
    case Multiselect = 'multiselect';
    case Checkbox = 'checkbox';
}
