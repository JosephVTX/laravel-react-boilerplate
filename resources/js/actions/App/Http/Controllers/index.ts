import Auth from './Auth'
import DashboardController from './DashboardController'
import MeController from './MeController'
import CrudController from './CrudController'
const Controllers = {
    Auth: Object.assign(Auth, Auth),
DashboardController: Object.assign(DashboardController, DashboardController),
MeController: Object.assign(MeController, MeController),
CrudController: Object.assign(CrudController, CrudController),
}

export default Controllers