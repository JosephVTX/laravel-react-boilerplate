import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\MeController::__invoke
 * @see app/Http/Controllers/MeController.php:12
 * @route '/api/me'
 */
const MeController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: MeController.url(options),
    method: 'get',
})

MeController.definition = {
    methods: ["get","head"],
    url: '/api/me',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MeController::__invoke
 * @see app/Http/Controllers/MeController.php:12
 * @route '/api/me'
 */
MeController.url = (options?: RouteQueryOptions) => {
    return MeController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MeController::__invoke
 * @see app/Http/Controllers/MeController.php:12
 * @route '/api/me'
 */
MeController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: MeController.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MeController::__invoke
 * @see app/Http/Controllers/MeController.php:12
 * @route '/api/me'
 */
MeController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: MeController.url(options),
    method: 'head',
})
export default MeController