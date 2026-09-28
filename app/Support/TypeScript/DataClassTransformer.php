<?php

namespace App\Support\TypeScript;

use Spatie\LaravelData\Contracts\BaseData;
use Spatie\TypeScriptTransformer\PhpNodes\PhpClassNode;
use Spatie\TypeScriptTransformer\Transformers\ClassTransformer;

/**
 * Convierte a TypeScript TODA clase que extienda Spatie\LaravelData\Data (sin necesidad de #[TypeScript]).
 * Salida: resources/js/types/generated.d.ts (namespace global `App.Data.*`).
 */
class DataClassTransformer extends ClassTransformer
{
    protected function shouldTransform(PhpClassNode $phpClassNode): bool
    {
        return ! $phpClassNode->isAbstract() && $phpClassNode->implementsInterface(BaseData::class);
    }
}
