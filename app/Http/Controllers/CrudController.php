<?php

namespace App\Http\Controllers;

use App\Crud\CrudDefinition;
use App\Crud\CrudRegistry;
use App\Support\Paginated;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controlador UNICO para todos los recursos CRUD (config/crud.php).
 * El slug llega como default de ruta (`resource`, ver routes/web.php). No crear controladores por recurso.
 */
class CrudController extends Controller
{
    public function __construct(private readonly CrudRegistry $registry) {}

    public function index(Request $request): Response
    {
        $definition = $this->authorized($request, 'view');

        return Inertia::render('crud/index', [
            'meta' => $definition->meta($request),
            'rows' => Paginated::from($definition->paginate($request)),
            'query' => [
                'search' => $request->query('filter')['search'] ?? '',
                'sort' => $request->query('sort', $definition->defaultSort()),
                'per_page' => min(max((int) $request->integer('per_page', 15), 1), CrudDefinition::MAX_PER_PAGE),
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $definition = $this->authorized($request, 'create');
        $definition->create($request->validate($definition->rules()));

        return back()->with('success', "{$definition->singular()} creado.");
    }

    public function update(Request $request, string $id): RedirectResponse
    {
        $definition = $this->authorized($request, 'update');
        $model = $definition->find($id);
        $definition->update($model, $request->validate($definition->rules($model)));

        return back()->with('success', "{$definition->singular()} actualizado.");
    }

    public function destroy(Request $request, string $id): RedirectResponse
    {
        $definition = $this->authorized($request, 'delete');
        $model = $definition->find($id);

        if ($reason = $definition->deleteBlockedReason($model)) {
            return back()->with('error', $reason);
        }

        $definition->delete($model);

        return back()->with('success', "{$definition->singular()} eliminado.");
    }

    /** Resuelve el recurso de la ruta y exige el permiso "{slug}.{ability}" (403 si falta). */
    private function authorized(Request $request, string $ability): CrudDefinition
    {
        $definition = $this->registry->get((string) $request->route('resource'));
        abort_unless($request->user()?->can($definition->permission($ability)), 403);

        return $definition;
    }
}
