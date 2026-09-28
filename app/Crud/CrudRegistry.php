<?php

namespace App\Crud;

use App\Data\Shared\NavItemData;
use Illuminate\Contracts\Auth\Access\Authorizable;
use Illuminate\Contracts\Auth\Authenticatable;

/** Registro de recursos CRUD (config/crud.php: slug => clase). */
final class CrudRegistry
{
    /** @var array<string, CrudDefinition> */
    private array $resolved = [];

    /** @param  array<string, class-string<CrudDefinition>>  $map */
    public function __construct(private readonly array $map) {}

    public function has(string $slug): bool
    {
        return isset($this->map[$slug]);
    }

    public function get(string $slug): CrudDefinition
    {
        abort_unless($this->has($slug), 404);

        return $this->resolved[$slug] ??= new ($this->map[$slug])($slug);
    }

    /** @return list<string> */
    public function slugs(): array
    {
        return array_keys($this->map);
    }

    /** @return list<CrudDefinition> */
    public function all(): array
    {
        return array_map(fn (string $slug) => $this->get($slug), $this->slugs());
    }

    /** @return list<NavItemData> Menu lateral: solo recursos que el usuario puede ver. */
    public function navigationFor(Authenticatable|Authorizable|null $user): array
    {
        if ($user === null) {
            return [];
        }

        return collect($this->all())
            ->filter(fn (CrudDefinition $d) => $user->can($d->permission('view')))
            ->map(fn (CrudDefinition $d) => new NavItemData($d->label(), '/'.$d->slug, $d->icon()))
            ->values()
            ->all();
    }
}
