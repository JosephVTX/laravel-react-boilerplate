<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Support\Str;

#[Signature('make:crud {name : Nombre del modelo en singular (Product)} {--slug= : Slug/URL en plural (por defecto products)} {--no-model : No crear modelo/migracion/factory (ya existen)}')]
#[Description('Crea un recurso CRUD generico: modelo+migracion+factory, Definition, Data y lo registra en config/crud.php')]
class MakeCrud extends Command
{
    public function handle(Filesystem $files): int
    {
        $name = Str::studly($this->argument('name'));
        $slug = $this->option('slug') ?: Str::snake(Str::pluralStudly($name), '-');
        $label = Str::headline(Str::pluralStudly($name));
        $singular = Str::headline($name);

        if (! $this->option('no-model')) {
            $this->call('make:model', ['name' => $name, '--migration' => true, '--factory' => true]);
            $this->seedModelFiles($files, $name);
        }

        $definition = app_path("Crud/Definitions/{$name}Crud.php");
        $data = app_path("Data/{$name}Data.php");

        foreach ([$definition, $data] as $path) {
            if ($files->exists($path)) {
                $this->error("Ya existe: {$path}");

                return self::FAILURE;
            }
        }

        $files->put($definition, $this->definitionStub($name, $label, $singular));
        $files->put($data, $this->dataStub($name));
        $this->register($files, $slug, $name);

        $this->components->info("Recurso '{$slug}' creado.");
        $this->line(<<<TXT

        Siguientes pasos:
          1. Completar la migracion (database/migrations/*_create_{$slug}_table.php) y \$fillable en app/Models/{$name}.php
          2. Ajustar columns()/fields() en app/Crud/Definitions/{$name}Crud.php y las propiedades de app/Data/{$name}Data.php
          3. php artisan migrate && php artisan crud:sync && pnpm types:generate
          4. Listo: /{$slug} ya tiene listado, busqueda, orden, paginacion, crear, editar y eliminar con permisos.
        TXT);

        return self::SUCCESS;
    }

    /** Deja modelo y migracion funcionales con una columna `name` (punto de partida para editar). */
    private function seedModelFiles(Filesystem $files, string $name): void
    {
        $model = app_path("Models/{$name}.php");
        $files->put($model, str_replace(
            "    use HasFactory;\n",
            "    use HasFactory;\n\n    protected \$fillable = ['name'];\n",
            $files->get($model),
        ));

        $table = Str::snake(Str::pluralStudly($name));
        foreach ($files->glob(database_path("migrations/*_create_{$table}_table.php")) as $migration) {
            $files->put($migration, str_replace(
                "\$table->id();\n",
                "\$table->id();\n            \$table->string('name');\n",
                $files->get($migration),
            ));
        }
    }

    private function register(Filesystem $files, string $slug, string $name): void
    {
        $path = config_path('crud.php');
        $content = $files->get($path);

        $content = str_replace(
            'use App\\Crud\\Definitions\\RoleCrud;',
            "use App\\Crud\\Definitions\\{$name}Crud;\nuse App\\Crud\\Definitions\\RoleCrud;",
            $content,
        );
        $content = preg_replace(
            "/(\\'resources\\' => \\[\\n)/",
            "\$1        '{$slug}' => {$name}Crud::class,\n",
            $content,
            1,
        );

        $files->put($path, $content);
    }

    private function definitionStub(string $name, string $label, string $singular): string
    {
        return <<<PHP
        <?php

        namespace App\\Crud\\Definitions;

        use App\\Crud\\Column;
        use App\\Crud\\CrudDefinition;
        use App\\Crud\\Field;
        use App\\Data\\{$name}Data;
        use App\\Enums\\ColumnType;
        use App\\Models\\{$name};

        final class {$name}Crud extends CrudDefinition
        {
            public function model(): string
            {
                return {$name}::class;
            }

            public function data(): string
            {
                return {$name}Data::class;
            }

            public function label(): string
            {
                return '{$label}';
            }

            public function singular(): string
            {
                return '{$singular}';
            }

            public function columns(): array
            {
                return [
                    Column::make('name', 'Nombre')->sortable()->searchable(),
                    Column::make('created_at', 'Creado', ColumnType::DateTime)->sortable(),
                ];
            }

            public function fields(): array
            {
                return [
                    Field::make('name', 'Nombre')->rules(['string', 'max:255']),
                ];
            }
        }

        PHP;
    }

    private function dataStub(string $name): string
    {
        return <<<PHP
        <?php

        namespace App\\Data;

        use App\\Models\\{$name};
        use Spatie\\LaravelData\\Data;

        class {$name}Data extends Data
        {
            public function __construct(
                public int \$id,
                public string \$name,
                public string \$created_at,
            ) {}

            public static function fromModel({$name} \$model): self
            {
                return new self(
                    id: \$model->id,
                    name: \$model->name,
                    created_at: \$model->created_at->toIso8601String(),
                );
            }
        }

        PHP;
    }
}
