"use strict"

const Route = use("Route")
const { RedisHelper, ResponseParser, AesUtil } = use("App/Helpers")
const Env = use("Env")
const User = use("App/Models/User")

Route.get("/", "DocumentController.intro")

Route.get("/docs", "DocumentController.index")

Route.group(() => {
  Route.post("/login", "LoginController.login").validator("Login")
  Route.post("/refresh", "LoginController.refresh").middleware(["auth:jwt"])
  Route.post("/reset", "PasswordController.postReset").validator(
    "Auth/GetForgot"
  )
})
  .prefix("api/v1")
  .namespace("Auth")
  .formats(["json"])

/**
 * Auth:jwt Route
 */

Route.group(() => {
  /**
   * Redis
   */

  Route.get("redis/clear", async ({ response }) => {
    await RedisHelper.clear()
    return response
      .status(200)
      .send(ResponseParser.successResponse("Redis Clear"))
  }).middleware(["can:clear-redis"])

  Route.post("make-token", async ({ request, response }) => {
    const date = Math.floor(Date.now() / 1000).toString()
    const CLIENT_TOKEN = Env.get("CLIENT_TOKEN")
    const body = {
      date,
    }
    const encrypted = AesUtil.encrypt(JSON.stringify(body), date + CLIENT_TOKEN)
    return response.status(200).send(
      ResponseParser.successResponse(
        {
          encrypted,
          date,
        },
        "Token"
      )
    )
  })

  /**
   * Dashboard
   */

  Route.get("dashboard-data", "DashboardController.index")
  Route.post("dashboard-data", "DashboardController.store")

  /**
   * Activities
   */
  Route.get("activities", "ActivityController.index")

  /**
   * Users
   */
  Route.resource("users", "UserController")
    .apiOnly()
    .validator(
      new Map([
        [["users.store"], ["User"]],
        [["users.update"], ["UserUpdate"]],
        [["users.index"], ["List"]],
      ])
    )
    .middleware(
      new Map([
        [["users.index"], ["can:read-user"]],
        [["users.store"], ["can:create-user"]],
        [["users.update"], ["can:update-user"]],
        [["users.destroy"], ["can:delete-user"]],
      ])
    )

  /**
   * Roles
   */
  Route.resource("roles", "RoleController")
    .apiOnly()
    .validator(
      new Map([
        [["roles.store"], ["StoreRole"]],
        [["roles.update"], ["UpdateRole"]],
      ])
    )
    .middleware(
      new Map([
        [["roles.index"], ["can:read-role"]],
        [["roles.store"], ["can:create-role"]],
        [["roles.update"], ["can:update-role"]],
        [["roles.destroy"], ["can:delete-role"]],
      ])
    )

  Route.get(
    "/role/:id/permissions",
    "RoleController.getPermissions"
  ).middleware("can:read-role")
  Route.put("/role/permissions", "RoleController.attachPermissions")
    .validator("AttachPermissions")
    .middleware("can:create-role")

  /**
   * Roles
   */
  Route.resource("permissions", "PermissionController")
    .apiOnly()
    .validator(
      new Map([
        [["permissions.store"], ["StorePermission"]],
        [["permissions.update"], ["UpdatePermission"]],
      ])
    )
    .middleware(
      new Map([
        [["permissions.index"], ["can:read-permission"]],
        [["permissions.store"], ["can:create-permission"]],
        [["permissions.update"], ["can:update-permission"]],
        [["permissions.destroy"], ["can:delete-permission"]],
      ])
    )

  /**
   * Me
   */
  Route.get("me", "ProfileController.me")

  /**
   * Supervisor
   */

  Route.resource("supervisors", "SupervisorController")
    .apiOnly()
    .validator(
      new Map([
        [["supervisors.store"], ["Supervisor"]],
        [["supervisors.update"], ["Supervisor"]],
        [["supervisors.index"], ["List"]],
      ])
    )
    .middleware(
      new Map([
        [["supervisors.index"], ["can:read-supervisor"]],
        [["supervisors.store"], ["can:create-supervisor"]],
        [["supervisors.update"], ["can:update-supervisor"]],
        [["supervisors.destroy"], ["can:delete-supervisor"]],
      ])
    )

  Route.post(
    "supervisor/attach-marketing",
    "SupervisorController.attachMarketing"
  )
    .validator("AddMarketing")
    .middleware("can:create-supervisor")

  Route.put(
    "supervisor/detach-marketing",
    "SupervisorController.detachMarketing"
  )
    .validator("AddMarketing")
    .middleware("can:read-supervisor")

  Route.get(
    "supervisor/search-marketing",
    "SupervisorController.searchMarketing"
  ).middleware("admin")

  /**
   * Marketing
   */

  Route.resource("marketings", "MarketingController")
    .apiOnly()
    .validator(
      new Map([
        [["marketings.store"], ["Supervisor"]],
        [["marketings.update"], ["Supervisor"]],
        [["marketings.index"], ["List"]],
      ])
    )
    .middleware(
      new Map([
        [["marketings.index"], ["can:read-marketing"]],
        [["marketings.store"], ["can:create-marketing"]],
        [["marketings.update"], ["can:update-marketing"]],
        [["marketings.destroy"], ["can:delete-marketing"]],
      ])
    )

  Route.put(
    "marketings/:id/change-password",
    "MarketingController.changePassword"
  )
    .validator("ChangePassword")
    .middleware("can:update-marketing")

  /**
   * Marketing Actions
   */

  Route.resource("marketing-actions", "MarketingActionController")
    .apiOnly()
    .validator(
      new Map([
        [["marketing-actions.store"], ["StoreMarketingAction"]],
        [["marketing-actions.update"], ["UpdateMarketingAction"]],
        [["marketing-actions.index"], ["List"]],
      ])
    )
    .middleware(
      new Map([
        [["marketing-actions.index"], ["can:read-marketing-action"]],
        [["marketing-actions.store"], ["can:create-marketing-action"]],
        [["marketing-actions.update"], ["can:update-marketing-action"]],
        [["marketing-actions.destroy"], ["can:delete-marketing-action"]],
      ])
    )

  /**
   * Marketing Targets
   */

  Route.resource("marketing-targets", "MarketingTargetController")
    .apiOnly()
    .validator(
      new Map([
        [["marketing-targets.store"], ["StoreMarketingTarget"]],
        [["marketing-targets.update"], ["UpdateMarketingTarget"]],
        [["marketing-targets.index"], ["List"]],
      ])
    )
    .middleware(
      new Map([
        [["marketing-targets.index"], ["can:read-marketing-target"]],
        [["marketing-targets.store"], ["can:create-marketing-target"]],
        [["marketing-targets.update"], ["can:update-marketing-target"]],
        [["marketing-targets.destroy"], ["can:delete-marketing-target"]],
      ])
    )

  /**
   * Marketing Reports
   */

  Route.resource("marketing-reports", "MarketingReportController")
    .apiOnly()
    .validator(
      new Map([
        [["marketing-reports.store"], ["StoreMarketingReport"]],
        [["marketing-reports.update"], ["UpdateMarketingReport"]],
        [["marketing-reports.index"], ["List"]],
      ])
    )
    .middleware(
      new Map([
        [["marketing-reports.index"], ["can:read-marketing-report"]],
        [["marketing-reports.store"], ["can:create-marketing-report"]],
        [["marketing-reports.update"], ["can:update-marketing-report"]],
        [["marketing-reports.destroy"], ["can:delete-marketing-report"]],
      ])
    )

  /**
   * Marketing Report Attachments
   */

  Route.resource("attachments", "TargetAttachmentController")
    .apiOnly()
    .validator(
      new Map([
        [["attachments.store"], ["StoreMarketingReportAttachment"]],
        [["attachments.update"], ["StoreMarketingReportAttachment"]],
        [["attachments.index"], ["List"]],
      ])
    )
    .middleware(
      new Map([
        [["attachments.index"], ["can:read-marketing-report-attachment"]],
        [["attachments.store"], ["can:create-marketing-report-attachment"]],
        [["attachments.update"], ["can:update-marketing-report-attachment"]],
        [["attachments.destroy"], ["can:delete-marketing-report-attachment"]],
      ])
    )

  /**
   * Universities
   */

  Route.resource("universities", "UniversityController")
    .apiOnly()
    .validator(
      new Map([
        [["universities.store"], ["StoreUniversity"]],
        [["universities.update"], ["UpdateUniversity"]],
        [["universities.index"], ["List"]],
      ])
    )
    .middleware(
      new Map([
        [["universities.index"], ["can:read-university"]],
        [["universities.store"], ["can:create-university"]],
        [["universities.update"], ["can:update-university"]],
        [["universities.destroy"], ["can:delete-university"]],
      ])
    )

  /**
   * Study Names
   */
  Route.resource("study-names", "StudyNameController")
    .apiOnly()
    .validator(
      new Map([
        [["study-names.store"], ["StoreStudyName"]],
        [["study-names.update"], ["UpdateStudyName"]],
      ])
    )
    .middleware(
      new Map([
        [["study-names.index"], ["can:read-study-name"]],
        [["study-names.store"], ["can:create-study-name"]],
        [["study-names.update"], ["can:update-study-name"]],
        [["study-names.destroy"], ["can:delete-study-name"]],
      ])
    )

  /**
   * Study Years
   */
  Route.resource("study-years", "StudyYearController")
    .apiOnly()
    .validator(
      new Map([
        [["study-years.store", "study-years.update"], ["StoreStudyYear"]],
      ])
    )
    .middleware(
      new Map([
        [["study-years.index"], ["can:read-study-year"]],
        [["study-years.store"], ["can:create-study-year"]],
        [["study-years.update"], ["can:update-study-year"]],
        [["study-years.destroy"], ["can:delete-study-year"]],
      ])
    )

  /**
   * Study Programs
   */

  Route.resource("studies", "StudyProgramController")
    .apiOnly()
    .validator(
      new Map([
        [["studies.store"], ["StoreStudyProgram"]],
        [["studies.update"], ["UpdateStudyProgram"]],
        [["studies.index"], ["List"]],
      ])
    )
    .middleware(
      new Map([
        [["studies.index"], ["can:read-study-program"]],
        [["studies.store"], ["can:create-study-program"]],
        [["studies.update"], ["can:update-study-program"]],
        [["studies.destroy"], ["can:delete-study-program"]],
      ])
    )

  /**
   * Schedulle
   */
  Route.resource("schedulles", "SchedulleController")
    .apiOnly()
    .validator(
      new Map([
        [["schedulles.store"], ["StoreSchedulle"]],
        [["schedulles.update"], ["UpdateSchedulle"]],

        [["schedulles.index"], ["List"]],
      ])
    )
    .middleware(
      new Map([
        [["schedulles.index"], ["can:read-schedulle"]],
        [["schedulles.store"], ["can:create-schedulle"]],
        [["schedulles.update"], ["can:update-schedulle"]],
        [["schedulles.destroy"], ["can:delete-schedulle"]],
      ])
    )

  /**
   * Product
   */
  Route.resource("products", "ProductController")
    .apiOnly()
    .validator(
      new Map([
        [["products.store", "products.update"], ["StoreProduct"]],
        [["products.index"], ["List"]],
      ])
    )
    .middleware(
      new Map([
        [["products.index"], ["can:read-product"]],
        [["products.store"], ["can:create-product"]],
        [["products.update"], ["can:update-product"]],
        [["products.destroy"], ["can:delete-product"]],
      ])
    )

  /**
   * For Combo Box / Select Box
   */
  Route.get("combo-data", "ComboDataController.index")

  /**
   * Export Data
   */

  Route.get("export-data", "DataExportController.index").validator("ExportData")

  /**
   * Get Permission by role id
   */

  Route.get(
    "/role/:id/permissions",
    "RoleController.getPermissions"
  ).middleware("can:read-role")
  Route.put("/role/permissions", "RoleController.attachPermissions")
    .validator("AttachPermissions")
    .middleware("can:create-role")

  /**
   * Marketing Target Contact Person
   */

  Route.resource("contacts", "MarketingTargetContactController")
    .apiOnly()
    .validator(
      new Map([
        [["contacts.store"], ["StoreMarketingTargetContact"]],
        [["contacts.update"], ["StoreMarketingTargetContact"]],
      ])
    )
    .middleware(
      new Map([
        [["contacts.index"], ["can:read-contact-person"]],
        [["contacts.store"], ["can:create-contact-person"]],
        [["contacts.update"], ["can:update-contact-person"]],
        [["contacts.destroy"], ["can:delete-contact-person"]],
      ])
    )

  /**
   * Traget Years
   */

  Route.resource("target-years", "TargetYearController")
    .apiOnly()
    .validator(
      new Map([
        [["target-years.store"], ["StoreMarketingReportYear"]],
        [["target-years.update"], ["StoreMarketingReportYear"]],
      ])
    )
    .middleware(
      new Map([
        [["target-years.index"], ["can:read-marketing-report-year"]],
        [["target-years.store"], ["can:create-marketing-report-year"]],
        [["target-years.update"], ["can:update-marketing-report-year"]],
        [["target-years.destroy"], ["can:delete-marketing-report-year"]],
      ])
    )

  /**
   * DownPayment
   */

  Route.resource("down-payments", "DownPaymentController")
    .apiOnly()
    .validator(
      new Map([
        [["down-payments.store"], ["StoreDownPayment"]],
        [["down-payments.update"], ["StoreDownPayment"]],
      ])
    )
    .middleware(
      new Map([
        [["down-payments.index"], ["can:read-down-payment"]],
        [["down-payments.store"], ["can:create-down-payment"]],
        [["down-payments.update"], ["can:update-down-payment"]],
        [["down-payments.destroy"], ["can:delete-down-payment"]],
      ])
    )
})
  .prefix("api/v1")
  .formats(["json"])
  .middleware(["auth:jwt"])

/**
 * Auth:jwt, me Routes
 */

Route.group(() => {
  Route.put("profile/:id", "ProfileController.update").validator(
    "ProfileUpdate"
  )
  Route.put(
    "profile/:id/change-password",
    "ProfileController.changePassword"
  ).validator("ChangePassword")
  Route.post("profile/upload/:id", "ProfileController.uploadPhoto")
})
  .prefix("api/v1")
  .formats(["json"])
  .middleware(["auth:jwt", "me"])

/**
 * No Middleware
 */
Route.group(() => {
  Route.get("check-target-code/:code", "MarketingTargetController.checkCode")
  Route.post("post-down-payment", "DownPaymentController.storeFromStudent")
})
  .prefix("api/v1")
  .middleware(["client"])
