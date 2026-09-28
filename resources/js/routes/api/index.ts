import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\MeController::__invoke
 * @see app/Http/Controllers/MeController.php:12
 * @route '/api/me'
 */
export const me = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: me.url(options),
    method: 'get',
})

me.definition = {
    methods: ["get","head"],
    url: '/api/me',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MeController::__invoke
 * @see app/Http/Controllers/MeController.php:12
 * @route '/api/me'
 */
me.url = (options?: RouteQueryOptions) => {
    return me.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MeController::__invoke
 * @see app/Http/Controllers/MeController.php:12
 * @route '/api/me'
 */
me.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: me.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MeController::__invoke
 * @see app/Http/Controllers/MeController.php:12
 * @route '/api/me'
 */
me.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: me.url(options),
    method: 'head',
})
const api = {
    me: Object.assign(me, me),
}

export default api