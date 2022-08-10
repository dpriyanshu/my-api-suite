const { series } = require("gulp");
const Utils = require("../utilities/utils");
const DbUtils = require("../utilities/dbUtils");
const envPathDetails = require("./environmentPaths.json");

const dataSetupPath =
  "tests/global-data-setup/global-data-setup.postman_collection.json";
const collectionPath = require("../tests/r4e-tenant-actions/r4e-tenant-actions.postman_collection.json");
const suiteDataFileFolder = "tests/r4e-tenant-actions/setup/suite";
const localDataFileFolder = "tests/r4e-tenant-actions/setup/local";

const suiteEnvFilePath =
  "https://api.getpostman.com/environments/" +
  envPathDetails["suite"]["tenant_actions"] +
  "?apikey=" +
  envPathDetails["apiKey"];

const localEnvFilePath =
  "https://api.getpostman.com/environments/" +
  envPathDetails["local"]["tenant_actions"] +
  "?apikey=" +
  envPathDetails["apiKey"];

const e2e = "e2e";
const dev = "dev";
const qa = "qa";

var suiteTearDownData = {
  tenantID: [4001001, 4001002],
  agencyID: 103,
  reviewURLs: ["https://maps.google.com/maps?cid=40010011"],
};

var localTearDownData = {
  tenantID: [4002001],
  agencyID: 203,
  reviewURLs: ["https://maps.google.com/maps?cid=40020011"],
};

async function setup(envFilePath, dataFileFolder) {
  console.log("############# Setup Started ############### ");
  await Utils.executeCmd(
    Utils.getRunCmdWithDataFile(
      dataSetupPath,
      dataFileFolder + "/agencies.json",
      envFilePath,
      "SaveAgency"
    )
  );
  console.log("SaveAgency Done...!");
  await Utils.executeCmd(
    Utils.getRunCmdWithDataFile(
      dataSetupPath,
      dataFileFolder + "/skus.json",
      envFilePath,
      "SaveSku"
    )
  );
  console.log("Save Sku Done...!");
  await Utils.executeCmd(
    Utils.getRunCmdWithDataFile(
      dataSetupPath,
      dataFileFolder + "/tenants.json",
      envFilePath,
      "SaveTenant"
    )
  );
  console.log("Save Tenant Done...!");

  await Utils.executeCmd(
    Utils.getRunCmdWithDataFile(
      dataSetupPath,
      dataFileFolder + "/locations.json",
      envFilePath,
      "SaveLocation"
    )
  );
  console.log("Save Location Done...!");
  await Utils.executeCmd(
    Utils.getRunCmdWithDataFile(
      dataSetupPath,
      dataFileFolder + "/users.json",
      envFilePath,
      "SaveUser"
    )
  );
  console.log("Save User Done...!");
  await Utils.executeCmd(
    Utils.getRunCmdWithDataFile(
      dataSetupPath,
      dataFileFolder + "/agencyUsers.json",
      envFilePath,
      "saveAgencyUser"
    )
  );
  console.log("saveAgencyUser Done...!");
  console.log("----####-------Setup is Completed-----#####------");
}

async function tearDown(data) {
  console.log("-----------TearDown Started-----------");
  await DbUtils.deleteRecords("r4e-ticket", "tickets", { aID: data.agencyID });
  await DbUtils.deleteRecords("r4e-ticket", "changelog", {
    tID: { $in: data.tenantID },
  });
  await DbUtils.deleteRecords("r4e-ticket", "custom_fields", {
    tID: { $in: data.tenantID },
  });
  await DbUtils.deleteRecords("r4e-ticket", "ticket_type_configs", {
    aID: data.agencyID,
  });
  await DbUtils.deleteRecords("r4e-ticket", "notes", { aID: data.agencyID });
  await DbUtils.deleteRecords("r4e-ticket", "instruction", {
    aID: data.agencyID,
  });
  await DbUtils.deleteRecords("r4e-ticket", "ticket_definitions", {
    tID: { $in: data.tenantID },
  });
  await DbUtils.deleteRecords("r4e-ticket", "field_metas", {
    tID: { $in: data.tenantID },
  });
  await DbUtils.deleteRecords("r4e-ticket", "field_groups", {
    tID: { $in: data.tenantID },
  });
  await DbUtils.deleteRecords("r4e-ticket", "stages", { aID: data.agencyID });
  await DbUtils.deleteRecords("r4e-ticket", "queues", { aID: data.agencyID });
  await DbUtils.deleteRecords("r4e-ticket", "tags", { aID: data.agencyID });
  await DbUtils.deleteRecords("r4e-ticket", "escalations", {
    tID: { $in: data.tenantID },
  });
  await DbUtils.deleteRecords("r4e-ticket", "root_causes", {
    tID: { $in: data.tenantID },
  });
  await DbUtils.deleteRecords("r4e-ticket", "closing_reasons", {
    tID: { $in: data.tenantID },
  });
  await DbUtils.deleteRecords("r4e-lambda", "lambdas", {
    tID: { $in: data.tenantID },
  });
  await DbUtils.deleteRecords("r4e-lambda", "lambda_history", {
    tID: { $in: data.tenantID },
  });
  await DbUtils.deleteRecords("r4e-lambda", "lambdas", { aID: data.agencyID });
  await DbUtils.deleteRecords("r4e-location", "locations", {
    aID: data.agencyID,
  });
  await DbUtils.deleteRecords("r4e-entity-page", "entity_pages", {
    aID: data.agencyID,
  });
  await DbUtils.deleteRecords("repbizChainsaw", "ratings", {
    url: { $in: data.reviewURLs },
  });
  await DbUtils.deleteRecords("r4e-comment", "comments", {
    url: { $in: data.reviewURLs },
  });
  await DbUtils.deleteRecords("r4e-survey", "survey-templates", {
    tID: { $in: data.tenantID },
  });
  await DbUtils.deleteRecords("r4e-credential", "credentials", {
    aID: data.agencyID,
  });

  await DbUtils.deleteRecords("r4e-admin", "roles", { aID: data.agencyID });
  await DbUtils.deleteRecords("r4e-user", "users", { aID: data.agencyID });
  await DbUtils.deleteRecords("r4e-admin", "tenants", { aID: data.agencyID });
  await DbUtils.deleteRecords("r4e-admin", "skus", { aID: data.agencyID });
  await DbUtils.deleteRecords("r4e-admin", "agencies", { _id: data.agencyID });

  console.log("-----------TearDown Completed-----------");
}

// Setup
async function setupE2ESuite() {
  await Utils.setEnv("e2e");
  await setup(suiteEnvFilePath, suiteDataFileFolder);
}

async function setupQASuite() {
  await Utils.setEnv("qa");
  await setup(suiteEnvFilePath, suiteDataFileFolder);
}

async function setupDevSuite() {
  await Utils.setEnv("dev");
  await setup(suiteEnvFilePath, suiteDataFileFolder);
}

// Test
async function testE2ESuite() {
  await Utils.setEnv("e2e");
  await Utils.executeCmd(
    Utils.getRunCmdWithoutDataFile(
      collectionPath,
      suiteEnvFilePath,
      "tests",
      true
    )
  );
}

async function testQASuite() {
  await Utils.setEnv("qa");
  await Utils.executeCmd(
    Utils.getRunCmdWithoutDataFile(
      collectionPath,
      suiteEnvFilePath,
      "tests",
      true
    )
  );
}

async function testDevSuite() {
  await Utils.setEnv("dev");
  await Utils.executeCmd(
    Utils.getRunCmdWithoutDataFile(
      collectionPath,
      suiteEnvFilePath,
      "tests",
      true
    )
  );
}

// Tear Down
async function teardownE2ESuite() {
  await Utils.setEnv("e2e");
  await teardown(suiteTearDownData);
}

async function teardownQASuite() {
  await Utils.setEnv("qa");
  await teardown(suiteTearDownData);
}

async function teardownDevSuite() {
  await Utils.setEnv("dev");
  await teardown(suiteTearDownData);
}

exports.dataSetupE2ELocal = series(teardownE2ESuite, setupE2ESuite);
exports.runE2ESuite = series(setupE2ESuite, testE2ESuite, teardownE2ESuite);
exports.deleteE2ESuiteSetup = series(teardownE2ESuite);

exports.dataSetupQALocal = series(teardownQASuite, setupQASuite);
exports.runQASuite = series(setupQASuite, testQASuite, teardownQASuite);
exports.deleteQASuiteSetup = series(teardownQASuite);

exports.dataSetupDevLocal = series(teardownDevSuite, setupDevSuite);
exports.runDevSuite = series(setupDevSuite, testDevSuite, teardownDevSuite);
exports.deleteDevSuiteSetup = series(teardownDevSuite);
