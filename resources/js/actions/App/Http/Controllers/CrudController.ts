import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CrudController::index
 * @see app/Http/Controllers/CrudController.php:21
 * @route '/users'
 */
const index6e8299a085c11017e62ab420951fb27c = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index6e8299a085c11017e62ab420951fb27c.url(options),
    method: 'get',
})

index6e8299a085c11017e62ab420951fb27c.definition = {
    methods: ["get","head"],
    url: '/users',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CrudController::index
 * @see app/Http/Controllers/CrudController.php:21
 * @route '/users'
 */
index6e8299a085c11017e62ab420951fb27c.url = (options?: RouteQueryOptions) => {
    return index6e8299a085c11017e62ab420951fb27c.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CrudController::index
 * @see app/Http/Controllers/CrudController.php:21
 * @route '/users'
 */
index6e8299a085c11017e62ab420951fb27c.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index6e8299a085c11017e62ab420951fb27c.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CrudController::index
 * @see app/Http/Controllers/CrudController.php:21
 * @route '/users'
 */
index6e8299a085c11017e62ab420951fb27c.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index6e8299a085c11017e62ab420951fb27c.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CrudController::index
 * @see app/Http/Controllers/CrudController.php:21
 * @route '/users'
 */
    const index6e8299a085c11017e62ab420951fb27cForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index6e8299a085c11017e62ab420951fb27c.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CrudController::index
 * @see app/Http/Controllers/CrudController.php:21
 * @route '/users'
 */
        index6e8299a085c11017e62ab420951fb27cForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index6e8299a085c11017e62ab420951fb27c.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CrudController::index
 * @see app/Http/Controllers/CrudController.php:21
 * @route '/users'
 */
        index6e8299a085c11017e62ab420951fb27cForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index6e8299a085c11017e62ab420951fb27c.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index6e8299a085c11017e62ab420951fb27c.form = index6e8299a085c11017e62ab420951fb27cForm
    /**
* @see \App\Http\Controllers\CrudController::index
 * @see app/Http/Controllers/CrudController.php:21
 * @route '/roles'
 */
const indexbe1fddd12d9a311af0360a2f8bcfa1e2 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexbe1fddd12d9a311af0360a2f8bcfa1e2.url(options),
    method: 'get',
})

indexbe1fddd12d9a311af0360a2f8bcfa1e2.definition = {
    methods: ["get","head"],
    url: '/roles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CrudController::index
 * @see app/Http/Controllers/CrudController.php:21
 * @route '/roles'
 */
indexbe1fddd12d9a311af0360a2f8bcfa1e2.url = (options?: RouteQueryOptions) => {
    return indexbe1fddd12d9a311af0360a2f8bcfa1e2.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CrudController::index
 * @see app/Http/Controllers/CrudController.php:21
 * @route '/roles'
 */
indexbe1fddd12d9a311af0360a2f8bcfa1e2.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexbe1fddd12d9a311af0360a2f8bcfa1e2.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CrudController::index
 * @see app/Http/Controllers/CrudController.php:21
 * @route '/roles'
 */
indexbe1fddd12d9a311af0360a2f8bcfa1e2.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: indexbe1fddd12d9a311af0360a2f8bcfa1e2.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CrudController::index
 * @see app/Http/Controllers/CrudController.php:21
 * @route '/roles'
 */
    const indexbe1fddd12d9a311af0360a2f8bcfa1e2Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: indexbe1fddd12d9a311af0360a2f8bcfa1e2.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CrudController::index
 * @see app/Http/Controllers/CrudController.php:21
 * @route '/roles'
 */
        indexbe1fddd12d9a311af0360a2f8bcfa1e2Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: indexbe1fddd12d9a311af0360a2f8bcfa1e2.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CrudController::index
 * @see app/Http/Controllers/CrudController.php:21
 * @route '/roles'
 */
        indexbe1fddd12d9a311af0360a2f8bcfa1e2Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: indexbe1fddd12d9a311af0360a2f8bcfa1e2.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    indexbe1fddd12d9a311af0360a2f8bcfa1e2.form = indexbe1fddd12d9a311af0360a2f8bcfa1e2Form

/**
* Multiple routes resolve to \App\Http\Controllers\CrudController::index, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `index['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
export const index = {
    '/users': index6e8299a085c11017e62ab420951fb27c,
    '/roles': indexbe1fddd12d9a311af0360a2f8bcfa1e2,
}

/**
* @see \App\Http\Controllers\CrudController::store
 * @see app/Http/Controllers/CrudController.php:36
 * @route '/users'
 */
const store6e8299a085c11017e62ab420951fb27c = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store6e8299a085c11017e62ab420951fb27c.url(options),
    method: 'post',
})

store6e8299a085c11017e62ab420951fb27c.definition = {
    methods: ["post"],
    url: '/users',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CrudController::store
 * @see app/Http/Controllers/CrudController.php:36
 * @route '/users'
 */
store6e8299a085c11017e62ab420951fb27c.url = (options?: RouteQueryOptions) => {
    return store6e8299a085c11017e62ab420951fb27c.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CrudController::store
 * @see app/Http/Controllers/CrudController.php:36
 * @route '/users'
 */
store6e8299a085c11017e62ab420951fb27c.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store6e8299a085c11017e62ab420951fb27c.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CrudController::store
 * @see app/Http/Controllers/CrudController.php:36
 * @route '/users'
 */
    const store6e8299a085c11017e62ab420951fb27cForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store6e8299a085c11017e62ab420951fb27c.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CrudController::store
 * @see app/Http/Controllers/CrudController.php:36
 * @route '/users'
 */
        store6e8299a085c11017e62ab420951fb27cForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store6e8299a085c11017e62ab420951fb27c.url(options),
            method: 'post',
        })
    
    store6e8299a085c11017e62ab420951fb27c.form = store6e8299a085c11017e62ab420951fb27cForm
    /**
* @see \App\Http\Controllers\CrudController::store
 * @see app/Http/Controllers/CrudController.php:36
 * @route '/roles'
 */
const storebe1fddd12d9a311af0360a2f8bcfa1e2 = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storebe1fddd12d9a311af0360a2f8bcfa1e2.url(options),
    method: 'post',
})

storebe1fddd12d9a311af0360a2f8bcfa1e2.definition = {
    methods: ["post"],
    url: '/roles',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CrudController::store
 * @see app/Http/Controllers/CrudController.php:36
 * @route '/roles'
 */
storebe1fddd12d9a311af0360a2f8bcfa1e2.url = (options?: RouteQueryOptions) => {
    return storebe1fddd12d9a311af0360a2f8bcfa1e2.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CrudController::store
 * @see app/Http/Controllers/CrudController.php:36
 * @route '/roles'
 */
storebe1fddd12d9a311af0360a2f8bcfa1e2.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storebe1fddd12d9a311af0360a2f8bcfa1e2.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CrudController::store
 * @see app/Http/Controllers/CrudController.php:36
 * @route '/roles'
 */
    const storebe1fddd12d9a311af0360a2f8bcfa1e2Form = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storebe1fddd12d9a311af0360a2f8bcfa1e2.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CrudController::store
 * @see app/Http/Controllers/CrudController.php:36
 * @route '/roles'
 */
        storebe1fddd12d9a311af0360a2f8bcfa1e2Form.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storebe1fddd12d9a311af0360a2f8bcfa1e2.url(options),
            method: 'post',
        })
    
    storebe1fddd12d9a311af0360a2f8bcfa1e2.form = storebe1fddd12d9a311af0360a2f8bcfa1e2Form

/**
* Multiple routes resolve to \App\Http\Controllers\CrudController::store, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `store['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
export const store = {
    '/users': store6e8299a085c11017e62ab420951fb27c,
    '/roles': storebe1fddd12d9a311af0360a2f8bcfa1e2,
}

/**
* @see \App\Http\Controllers\CrudController::update
 * @see app/Http/Controllers/CrudController.php:44
 * @route '/users/{id}'
 */
const update3d7aae258ed911ef8bd3b1d2fc6768ef = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update3d7aae258ed911ef8bd3b1d2fc6768ef.url(args, options),
    method: 'put',
})

update3d7aae258ed911ef8bd3b1d2fc6768ef.definition = {
    methods: ["put"],
    url: '/users/{id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\CrudController::update
 * @see app/Http/Controllers/CrudController.php:44
 * @route '/users/{id}'
 */
update3d7aae258ed911ef8bd3b1d2fc6768ef.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return update3d7aae258ed911ef8bd3b1d2fc6768ef.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CrudController::update
 * @see app/Http/Controllers/CrudController.php:44
 * @route '/users/{id}'
 */
update3d7aae258ed911ef8bd3b1d2fc6768ef.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update3d7aae258ed911ef8bd3b1d2fc6768ef.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\CrudController::update
 * @see app/Http/Controllers/CrudController.php:44
 * @route '/users/{id}'
 */
    const update3d7aae258ed911ef8bd3b1d2fc6768efForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update3d7aae258ed911ef8bd3b1d2fc6768ef.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CrudController::update
 * @see app/Http/Controllers/CrudController.php:44
 * @route '/users/{id}'
 */
        update3d7aae258ed911ef8bd3b1d2fc6768efForm.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update3d7aae258ed911ef8bd3b1d2fc6768ef.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update3d7aae258ed911ef8bd3b1d2fc6768ef.form = update3d7aae258ed911ef8bd3b1d2fc6768efForm
    /**
* @see \App\Http\Controllers\CrudController::update
 * @see app/Http/Controllers/CrudController.php:44
 * @route '/roles/{id}'
 */
const updated50f4f721441f9bd72e364db092999ff = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updated50f4f721441f9bd72e364db092999ff.url(args, options),
    method: 'put',
})

updated50f4f721441f9bd72e364db092999ff.definition = {
    methods: ["put"],
    url: '/roles/{id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\CrudController::update
 * @see app/Http/Controllers/CrudController.php:44
 * @route '/roles/{id}'
 */
updated50f4f721441f9bd72e364db092999ff.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return updated50f4f721441f9bd72e364db092999ff.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CrudController::update
 * @see app/Http/Controllers/CrudController.php:44
 * @route '/roles/{id}'
 */
updated50f4f721441f9bd72e364db092999ff.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updated50f4f721441f9bd72e364db092999ff.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\CrudController::update
 * @see app/Http/Controllers/CrudController.php:44
 * @route '/roles/{id}'
 */
    const updated50f4f721441f9bd72e364db092999ffForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updated50f4f721441f9bd72e364db092999ff.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CrudController::update
 * @see app/Http/Controllers/CrudController.php:44
 * @route '/roles/{id}'
 */
        updated50f4f721441f9bd72e364db092999ffForm.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updated50f4f721441f9bd72e364db092999ff.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updated50f4f721441f9bd72e364db092999ff.form = updated50f4f721441f9bd72e364db092999ffForm

/**
* Multiple routes resolve to \App\Http\Controllers\CrudController::update, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `update['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
export const update = {
    '/users/{id}': update3d7aae258ed911ef8bd3b1d2fc6768ef,
    '/roles/{id}': updated50f4f721441f9bd72e364db092999ff,
}

/**
* @see \App\Http\Controllers\CrudController::destroy
 * @see app/Http/Controllers/CrudController.php:53
 * @route '/users/{id}'
 */
const destroy3d7aae258ed911ef8bd3b1d2fc6768ef = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy3d7aae258ed911ef8bd3b1d2fc6768ef.url(args, options),
    method: 'delete',
})

destroy3d7aae258ed911ef8bd3b1d2fc6768ef.definition = {
    methods: ["delete"],
    url: '/users/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CrudController::destroy
 * @see app/Http/Controllers/CrudController.php:53
 * @route '/users/{id}'
 */
destroy3d7aae258ed911ef8bd3b1d2fc6768ef.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return destroy3d7aae258ed911ef8bd3b1d2fc6768ef.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CrudController::destroy
 * @see app/Http/Controllers/CrudController.php:53
 * @route '/users/{id}'
 */
destroy3d7aae258ed911ef8bd3b1d2fc6768ef.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy3d7aae258ed911ef8bd3b1d2fc6768ef.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\CrudController::destroy
 * @see app/Http/Controllers/CrudController.php:53
 * @route '/users/{id}'
 */
    const destroy3d7aae258ed911ef8bd3b1d2fc6768efForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy3d7aae258ed911ef8bd3b1d2fc6768ef.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CrudController::destroy
 * @see app/Http/Controllers/CrudController.php:53
 * @route '/users/{id}'
 */
        destroy3d7aae258ed911ef8bd3b1d2fc6768efForm.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy3d7aae258ed911ef8bd3b1d2fc6768ef.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy3d7aae258ed911ef8bd3b1d2fc6768ef.form = destroy3d7aae258ed911ef8bd3b1d2fc6768efForm
    /**
* @see \App\Http\Controllers\CrudController::destroy
 * @see app/Http/Controllers/CrudController.php:53
 * @route '/roles/{id}'
 */
const destroyd50f4f721441f9bd72e364db092999ff = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyd50f4f721441f9bd72e364db092999ff.url(args, options),
    method: 'delete',
})

destroyd50f4f721441f9bd72e364db092999ff.definition = {
    methods: ["delete"],
    url: '/roles/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CrudController::destroy
 * @see app/Http/Controllers/CrudController.php:53
 * @route '/roles/{id}'
 */
destroyd50f4f721441f9bd72e364db092999ff.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return destroyd50f4f721441f9bd72e364db092999ff.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CrudController::destroy
 * @see app/Http/Controllers/CrudController.php:53
 * @route '/roles/{id}'
 */
destroyd50f4f721441f9bd72e364db092999ff.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyd50f4f721441f9bd72e364db092999ff.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\CrudController::destroy
 * @see app/Http/Controllers/CrudController.php:53
 * @route '/roles/{id}'
 */
    const destroyd50f4f721441f9bd72e364db092999ffForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyd50f4f721441f9bd72e364db092999ff.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CrudController::destroy
 * @see app/Http/Controllers/CrudController.php:53
 * @route '/roles/{id}'
 */
        destroyd50f4f721441f9bd72e364db092999ffForm.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyd50f4f721441f9bd72e364db092999ff.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyd50f4f721441f9bd72e364db092999ff.form = destroyd50f4f721441f9bd72e364db092999ffForm

/**
* Multiple routes resolve to \App\Http\Controllers\CrudController::destroy, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `destroy['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
export const destroy = {
    '/users/{id}': destroy3d7aae258ed911ef8bd3b1d2fc6768ef,
    '/roles/{id}': destroyd50f4f721441f9bd72e364db092999ff,
}

const CrudController = { index, store, update, destroy }

export default CrudController