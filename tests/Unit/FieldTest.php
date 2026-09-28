<?php

namespace Tests\Unit;

use App\Crud\Column;
use App\Crud\Field;
use App\Enums\ColumnType;
use App\Enums\FieldType;
use App\Models\User;
use PHPUnit\Framework\TestCase;

class FieldTest extends TestCase
{
    public function test_required_field_prepends_required_rule(): void
    {
        $field = Field::make('name', 'Nombre')->rules(['string', 'max:255']);

        $this->assertSame(['required', 'string', 'max:255'], $field->validationRules(null));
    }

    public function test_optional_field_is_nullable(): void
    {
        $this->assertSame(['nullable'], Field::make('bio', 'Bio', FieldType::Textarea)->optional()->validationRules(null));
    }

    public function test_required_on_create_only_changes_between_create_and_edit(): void
    {
        $field = Field::make('password', 'Clave', FieldType::Password)->requiredOnCreate();

        $this->assertSame('required', $field->validationRules(null)[0]);
        $this->assertSame('nullable', $field->validationRules(new User)[0]);
        $this->assertFalse($field->toData()->required);
        $this->assertTrue($field->toData()->requiredOnCreateOnly);
    }

    public function test_rules_closure_receives_the_model(): void
    {
        $seen = 'sin-llamar';
        $field = Field::make('email', 'Correo', FieldType::Email)->rules(function (?User $model) use (&$seen) {
            $seen = $model;

            return ['email'];
        });

        $field->validationRules(null);
        $this->assertNull($seen);
    }

    public function test_options_accept_value_label_map(): void
    {
        $data = Field::make('role', 'Rol', FieldType::Select)->options(['a' => 'Alfa', 'b' => 'Beta'])->toData();

        $this->assertSame(['a', 'b'], array_map(fn ($o) => $o->value, $data->options));
        $this->assertSame(['Alfa', 'Beta'], array_map(fn ($o) => $o->label, $data->options));
    }

    public function test_column_flags(): void
    {
        $column = Column::make('created_at', 'Creado', ColumnType::DateTime)->sortable()->searchable();

        $this->assertTrue($column->isSortable());
        $this->assertTrue($column->isSearchable());
        $this->assertSame(ColumnType::DateTime, $column->toData()->type);
        $this->assertFalse(Column::make('x', 'X')->isSortable());
    }
}
