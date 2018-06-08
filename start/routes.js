'use strict'

const Route = use('Route')
const User = use('App/Models/User')
const Env = use('Env')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})

Route.get('/docs', 'DocumentController.index')
Route.get('/email', async({ view }) => {
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
        [
          ['users.store'],
          ['User']
        ],
        [
          ['users.update'],
          ['UserUpdate']
        ],
        [
          ['users.index'],
          ['List']
        ]
      ]))
      .middleware(new Map([
        [
          ['users.store', 'users.update', 'users.delete'],
          ['admin']
        ]
      ]))

    /**
     * Roles
     */
    Route
      .resource('roles', 'RoleController')
      .apiOnly()
      .validator(new Map([
        [
          ['roles.store'],
          ['Role']
        ],
        [
          ['roles.update'],
          ['Role']
        ]
      ]))
      .middleware(new Map([
        [
          ['roles.store', 'roles.update', 'roles.delete'],
          ['super']
        ]
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
        [
          ['supervisors.store'],
          ['Supervisor']
        ],
        [
          ['supervisors.update'],
          ['Supervisor']
        ],
        [
          ['supervisors.index'],
          ['List']
        ]
      ]))
      .middleware(new Map([
        [
          ['supervisors.store', 'supervisors.update', 'supervisors.delete'],
          ['admin']
        ]
      ]))

    Route.post('supervisor/attach-marketing', 'SupervisorController.attachMarketing')
      .validator('AddMarketing')
      .middleware('admin')
    Route.put('supervisor/detach-marketing', 'SupervisorController.detachMarketing')
      .validator('AddMarketing')
      .middleware('admin')
    Route.get('supervisor/search-marketing', 'SupervisorController.searchMarketing')
      .middleware('admin')

    /**
     * Marketing
     */

    Route.post('marketing/add-supervisor', 'MarketingController.searchMarketing')
      .middleware('supervisor')

    /**
     * Universities
     */

    Route
      .resource('universities', 'UniversityController')
      .apiOnly()
      .validator(new Map([
        [
          ['universities.store'],
          ['StoreUniversity']
        ],
        [
          ['universities.update'],
          ['UpdateUniversity']
        ],
        [
          ['universities.index'],
          ['List']
        ]
      ]))
      .middleware(new Map([
        [
          ['universities.store', 'universities.update', 'universities.delete'],
          ['admin']
        ]
      ]))

    /**
     * Study Programs
     */

    Route
      .resource('studies', 'StudyProgramController')
      .apiOnly()
      .validator(new Map([
        [
          ['studies.store', 'studies.update'],
          ['StoreStudyProgram']
        ],
        [
          ['studies.index'],
          ['List']
        ]
      ]))
      .middleware(new Map([
        [
          ['studies.store', 'studies.update', 'studies.delete'],
          ['admin']
        ]
      ]))

    /**
     * Schedule
     */
    Route
      .resource('schedules', 'ScheduleController')
      .apiOnly()
      .validator(new Map([
        [
          ['schedules.store', 'schedules.update'],
          ['StoreSchedule']
        ],
        [
          ['schedules.index'],
          ['List']
        ]
      ]))
      .middleware(new Map([
        [
          ['schedules.store', 'schedules.update', 'schedules.delete'],
          ['admin']
        ]
      ]))

    /**
     * Product
     */
    Route
      .resource('products', 'ProductController')
      .apiOnly()
      .validator(new Map([
        [
          ['products.store', 'products.update'],
          ['StoreProduct']
        ],
        [
          ['products.index'],
          ['List']
        ]
      ]))
      .middleware(new Map([
        [
          ['products.store', 'products.update', 'products.delete'],
          ['admin']
        ]
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
