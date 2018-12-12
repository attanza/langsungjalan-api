"use strict"

const Route = use("Route")
const { RedisHelper, ResponseParser } = use("App/Helpers")

Route.get("/", "DocumentController.intro")

Route.get("/docs", "DocumentController.index")

Route.on("/test-email").render("emails.new_dp")

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
  }).middleware(["can:clear_redis"])

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
        [["users.index"], ["can:read_user"]],
        [["users.store"], ["can:create_user"]],
        [["users.update"], ["can:update_user"]],
        [["users.destroy"], ["can:delete_user"]],
      ])
    )

  /**
   * Roles
   */
  Route.resource("roles", "RoleController")
    .apiOnly()
    .validator(
      new Map([[["roles.store"], ["Role"]], [["roles.update"], ["Role"]]])
    )
    .middleware(
      new Map([
        [["roles.index"], ["can:read_role"]],
        [["roles.store"], ["can:create_role"]],
        [["roles.update"], ["can:update_role"]],
        [["roles.destroy"], ["can:delete_role"]],
      ])
    )

  Route.get(
    "/role/:id/permissions",
    "RoleController.getPermissions"
  ).middleware("can:read_role")
  Route.put("/role/permissions", "RoleController.attachPermissions")
    .validator("AttachPermissions")
    .middleware("can:create_role")

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
        [["permissions.index"], ["can:read_permission"]],
        [["permissions.store"], ["can:create_permission"]],
        [["permissions.update"], ["can:update_permission"]],
        [["permissions.destroy"], ["can:delete_permission"]],
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
        [["supervisors.index"], ["can:read_supervisor"]],
        [["supervisors.store"], ["can:create_supervisor"]],
        [["supervisors.update"], ["can:update_supervisor"]],
        [["supervisors.destroy"], ["can:delete_supervisor"]],
      ])
    )

  Route.post(
    "supervisor/attach-marketing",
    "SupervisorController.attachMarketing"
  )
    .validator("AddMarketing")
    .middleware("can:create_supervisor")

  Route.put(
    "supervisor/detach-marketing",
    "SupervisorController.detachMarketing"
  )
    .validator("AddMarketing")
    .middleware("can:read_supervisor")

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
        [["marketings.index"], ["can:read_marketing"]],
        [["marketings.store"], ["can:create_marketing"]],
        [["marketings.update"], ["can:update_marketing"]],
        [["marketings.destroy"], ["can:delete_marketing"]],
      ])
    )

  Route.put(
    "marketings/:id/change-password",
    "MarketingController.changePassword"
  )
    .validator("ChangePassword")
    .middleware("can:update_marketing")

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
        [["marketing-actions.index"], ["can:read_marketing_action"]],
        [["marketing-actions.store"], ["can:create_marketing_action"]],
        [["marketing-actions.update"], ["can:update_marketing_action"]],
        [["marketing-actions.destroy"], ["can:delete_marketing_action"]],
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
        [["marketing-targets.index"], ["can:read_marketing_target"]],
        [["marketing-targets.store"], ["can:create_marketing_target"]],
        [["marketing-targets.update"], ["can:update_marketing_target"]],
        [["marketing-targets.destroy"], ["can:delete_marketing_target"]],
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
        [["marketing-reports.index"], ["can:read_marketing_report"]],
        [["marketing-reports.store"], ["can:create_marketing_report"]],
        [["marketing-reports.update"], ["can:update_marketing_report"]],
        [["marketing-reports.destroy"], ["can:delete_marketing_report"]],
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
        [["attachments.index"], ["can:read_marketing_report_attachment"]],
        [["attachments.store"], ["can:create_marketing_report_attachment"]],
        [["attachments.update"], ["can:update_marketing_report_attachment"]],
        [["attachments.destroy"], ["can:delete_marketing_report_attachment"]],
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
        [["universities.index"], ["can:read_university"]],
        [["universities.store"], ["can:create_university"]],
        [["universities.update"], ["can:update_university"]],
        [["universities.destroy"], ["can:delete_university"]],
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
        [["study-names.index"], ["can:read_study_name"]],
        [["study-names.store"], ["can:create_study_name"]],
        [["study-names.update"], ["can:update_study_name"]],
        [["study-names.destroy"], ["can:delete_study_name"]],
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
        [["study-years.index"], ["can:read_study_year"]],
        [["study-years.store"], ["can:create_study_year"]],
        [["study-years.update"], ["can:update_study_year"]],
        [["study-years.destroy"], ["can:delete_study_year"]],
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
        [["studies.index"], ["can:read_study_program"]],
        [["studies.store"], ["can:create_study_program"]],
        [["studies.update"], ["can:update_study_program"]],
        [["studies.destroy"], ["can:delete_study_program"]],
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
        [["schedulles.index"], ["can:read_schedulle"]],
        [["schedulles.store"], ["can:create_schedulle"]],
        [["schedulles.update"], ["can:update_schedulle"]],
        [["schedulles.destroy"], ["can:delete_schedulle"]],
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
        [["products.index"], ["can:read_product"]],
        [["products.store"], ["can:create_product"]],
        [["products.update"], ["can:update_product"]],
        [["products.destroy"], ["can:delete_product"]],
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
  ).middleware("can:read_role")
  Route.put("/role/permissions", "RoleController.attachPermissions")
    .validator("AttachPermissions")
    .middleware("can:create_role")

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
        [["contacts.index"], ["can:read_contact_person"]],
        [["contacts.store"], ["can:create_contact_person"]],
        [["contacts.update"], ["can:update_contact_person"]],
        [["contacts.destroy"], ["can:delete_contact_person"]],
      ])
    )

  /**
   * Contact Reports
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
        [["target-years.index"], ["can:read_marketing_report_year"]],
        [["target-years.store"], ["can:create_marketing_report_year"]],
        [["target-years.update"], ["can:update_marketing_report_year"]],
        [["target-years.destroy"], ["can:delete_marketing_report_year"]],
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
        [["down-payments.index"], ["can:read_down_payment"]],
        [["down-payments.store"], ["can:create_down_payment"]],
        [["down-payments.update"], ["can:update_down_payment"]],
        [["down-payments.destroy"], ["can:delete_down_payment"]],
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
