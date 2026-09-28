<?php

namespace App\Data\Crud;

use App\Enums\FieldType;
use Spatie\LaravelData\Data;

class FieldData extends Data
{
    /**
     * @param  OptionData[]  $options
     */
    public function __construct(
        public string $name,
        public string $label,
        public FieldType $type,
        public bool $required,
        public bool $requiredOnCreateOnly,
        public array $options,
        public ?string $placeholder,
        public ?string $hint,
    ) {}
}
