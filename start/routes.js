'use strict'

const Route = use('Route')
const User = use('App/Models/User')
const Env = use('Env')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})

Route.get('/docs', 'DocumentController.index')
Route.get('/email', async ({ view }) => {
  const user = await User.find(1)
  const baseUrl = Env.get('APP_URL')
  user.baseUrl = baseUrl
  return view.render('emails/forgot_password', {
    user: user.toJSON()
  })
})


Route
  .group(() => {
    Route.post('/login', 'LoginController.login').validator('Login')
    Route.post('/refresh', 'Auth/LoginController.refresh').middleware(['auth:jwt'])

    Route.get('/forgot-password', 'PasswordController.getForgot').validator('Auth/GetForgot')

    Route.get('/reset', 'PasswordController.showPasswordForm').as('reset')
    Route.post('/reset', 'PasswordController.postReset')
  })
  .prefix('api/v1')
  .namespace('Auth')
  .formats(['json'])

/**
 * Auth:jwt Route
 */

Route
  .group(() => {
    /**
     * Users
     */
    Route
      .resource('users', 'UserController')
      .apiOnly()
      .validator(new Map([
        [['users.store'],['User']],
        [['users.update'],['UserUpdate']],
        [['users.index'],['List']]
      ]))
      .middleware(new Map([
        [['users.index'],['can:read_user']],
        [['users.store'],['can:create_user']],
        [['users.update'],['can:update_user']],
        [['users.delete'],['can:delete_user']]
      ]))

    /**
     * Roles
     */
    Route
      .resource('roles', 'RoleController')
      .apiOnly()
      .validator(new Map([
        [['roles.store'],['Role']],
        [['roles.update'],['Role']]
      ]))
      .middleware(new Map([
        [['roles.index'],['can:read_role']],
        [['roles.store'],['can:create_role']],
        [['roles.update'],['can:update_role']],
        [['roles.delete'],['can:delete_role']]
      ]))

    /**
     * Me
     */
    Route.get('me', 'ProfileController.me')

    /**
     * Supervisor
     */

    Route
      .resource('supervisors', 'SupervisorController')
      .apiOnly()
      .validator(new Map([
        [['supervisors.store'],['Supervisor']],
        [['supervisors.update'],['Supervisor']],
        [['supervisors.index'],['List']]
      ]))
      .middleware(new Map([
        [['supervisors.index'],['can:read_supervisor']],
        [['supervisors.store'],['can:create_supervisor']],
        [['supervisors.update'],['can:update_supervisor']],
        [['supervisors.delete'],['can:delete_supervisor']]
      ]))

    Route.post('supervisor/attach-marketing', 'SupervisorController.attachMarketing')
      .validator('AddMarketing')
      .middleware('admin')

    Route.put('supervisor/detach-marketing', 'SupervisorController.detachMarketing')
      .validator('AddMarketing')
      .middleware('admin')


    Route.get('supervisors/search-marketing', 'SupervisorController.searchMarketing')
      .middleware('admin')

    /**
     * Marketing
     */

    Route
      .resource('marketings', 'MarketingController')
      .apiOnly()
      .validator(new Map([
        [['marketings.store'],['Supervisor']],
        [['marketings.update'],['Supervisor']],
        [['marketings.index'],['List']]]))
      .middleware(new Map([
        [['marketings.index'],['can:read_marketing']],
        [['marketings.store'],['can:create_marketing']],
        [['marketings.update'],['can:update_marketing']],
        [['marketings.delete'],['can:delete_marketing']]
      ]))

    /**
     * Universities
     */

    Route
      .resource('universities', 'UniversityController')
      .apiOnly()
      .validator(new Map([
        [['universities.store'],['StoreUniversity']],
        [['universities.update'],['UpdateUniversity']],
        [['universities.index'],['List']]
      ]))
      .middleware(new Map([
        [['universities.index'],['can:read_university']],
        [['universities.store'],['can:create_university']],
        [['universities.update'],['can:update_university']],
        [['universities.delete'],['can:delete_university']]
      ]))

    /**
     * Study Programs
     */

    Route
      .resource('studies', 'StudyProgramController')
      .apiOnly()
      .validator(new Map([
        [['studies.store', 'studies.update'],['StoreStudyProgram']],
        [['studies.index'],['List']]
      ]))
      .middleware(new Map([
        [['studies.index'],['can:create_study_program']],
        [['studies.store'],['can:create_study_program']],
        [['studies.update'],['can:update_study_program']],
        [['studies.delete'],['can:delete_study_program']]
      ]))

    /**
     * Schedule
     */
    Route
      .resource('schedules', 'ScheduleController')
      .apiOnly()
      .validator(new Map([
        [['schedules.store', 'schedules.update'],['StoreSchedule']],
        [['schedules.index'],['List']]
      ]))
      .middleware(new Map([
        [['schedules.index'],['can:create_schedule']],
        [['schedules.store'],['can:create_schedule']],
        [['schedules.update'],['can:update_schedule']],
        [['schedules.delete'],['can:delete_schedule']]
      ]))

    /**
     * Product
     */
    Route
      .resource('products', 'ProductController')
      .apiOnly()
      .validator(new Map([
        [['products.store', 'products.update'],['StoreProduct']],
        [['products.index'],['List']]
      ]))
      .middleware(new Map([
        [['products.index'],['can:create_product']],
        [['products.store'],['can:create_product']],
        [['products.update'],['can:update_product']],
        [['products.delete'],['can:delete_product']]
      ]))
    /**
     * For Combo Box / Select Box
     */
    Route.get('combo-data', 'ComboDataController.index')
  })
  .prefix('api/v1')
  .formats(['json'])
  .middleware(['auth:jwt'])

/**
 * Auth:jwt, me Routes
 */

Route
  .group(() => {
    Route.put('profile/:id', 'ProfileController.update').validator('ProfileUpdate')
    Route.put('profile/:id/change-password', 'ProfileController.changePassword').validator('ChangePassword')
    Route.post('profile/upload/:id', 'ProfileController.uploadPhoto')

  })
  .prefix('api/v1')
  .formats(['json'])
  .middleware(['auth:jwt', 'me'])
