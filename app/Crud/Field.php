<?php

namespace App\Crud;

use App\Data\Crud\FieldData;
use App\Data\Crud\OptionData;
use App\Enums\FieldType;
use Closure;
use Illuminate\Database\Eloquent\Model;

/**
 * Builder fluido de campos de formulario.
 * `rules()` y `virtual()` son solo backend; el resto viaja al frontend via toData().
 */
final class Field
{
    private bool $required = true;

    private bool $requiredOnCreateOnly = false;

    private bool $virtual = false;

    private ?string $placeholder = null;

    private ?string $hint = null;

    /** @var list<OptionData> */
    private array $options = [];

    /** @var array<int, mixed>|Closure(?Model): array<int, mixed> */
    private array|Closure $rules = [];

    private function __construct(
        public readonly string $name,
        private readonly string $label,
        private readonly FieldType $type,
    ) {}

    public static function make(string $name, string $label, FieldType $type = FieldType::Text): self
    {
        return new self($name, $label, $type);
    }

    /** @param  array<string, string>|list<OptionData>  $options  value => label */
    public function options(array $options): self
    {
        $this->options = collect($options)
            ->map(fn ($label, $value) => $label instanceof OptionData ? $label : new OptionData((string) $value, (string) $label))
            ->values()
            ->all();

        return $this;
    }

    /** @param  array<int, mixed>|Closure(?Model): array<int, mixed>  $rules  Closure recibe el modelo (null al crear). */
    public function rules(array|Closure $rules): self
    {
        $this->rules = $rules;

        return $this;
    }

    public function optional(): self
    {
        $this->required = false;

        return $this;
    }

    /** Obligatorio al crear, opcional al editar (vacio = no cambia). Ej: password. */
    public function requiredOnCreate(): self
    {
        $this->requiredOnCreateOnly = true;

        return $this;
    }

    /** No es columna del modelo: se ignora al hacer fill() y se maneja en CrudDefinition::saved(). */
    public function virtual(): self
    {
        $this->virtual = true;

        return $this;
    }

    public function placeholder(string $placeholder): self
    {
        $this->placeholder = $placeholder;

        return $this;
    }

    public function hint(string $hint): self
    {
        $this->hint = $hint;

        return $this;
    }

    public function isVirtual(): bool
    {
        return $this->virtual;
    }

    public function isRequiredOnCreateOnly(): bool
    {
        return $this->requiredOnCreateOnly;
    }

    /** @return array<int, mixed> Reglas de validacion Laravel para crear (`$model` null) o editar. */
    public function validationRules(?Model $model): array
    {
        $rules = $this->rules instanceof Closure ? ($this->rules)($model) : $this->rules;

        $presence = match (true) {
            $this->requiredOnCreateOnly => $model === null ? 'required' : 'nullable',
            $this->required => 'required',
            default => 'nullable',
        };

        return [$presence, ...$rules];
    }

    public function toData(): FieldData
    {
        return new FieldData(
            name: $this->name,
            label: $this->label,
            type: $this->type,
            required: $this->required && ! $this->requiredOnCreateOnly,
            requiredOnCreateOnly: $this->requiredOnCreateOnly,
            options: $this->options,
            placeholder: $this->placeholder,
            hint: $this->hint,
        );
    }
}
