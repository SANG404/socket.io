const ABSPATH = process.env.ABSPATH;

const LOGIN = `${ABSPATH}login.php`;
const CHANGE_PASSWORD = `${ABSPATH}changepassword.php`;
const FORGOT_PASSWORD = `${ABSPATH}forgotpassword.php`;
const COACHINGMODULE = `${ABSPATH}coachingmodule.php`;
const RESOURCE = `${ABSPATH}resources.php`;
const VISITREPORTS = `${ABSPATH}dealershipvisitreportstemplate.php`;
const DELEARSHIP_VISIT_REPORTS = `${ABSPATH}incomplete_dealershipvisitreportstemplate.php`;
const INCOMPLETE_DEALERSHIP = `${ABSPATH}incomplete_dealership.php`;
const INCOMPLETE_ACTION = `${ABSPATH}incomplete_reportlist.php`;
const INCOMPLETE_UPDATEACTION_STATUS = `${ABSPATH}incomplete_updateactionstatus.php`;
// const VISITREPORTS = `https://192.168.200.6:11443/~sangeeth/santenderbdm/ipadapp/dealershipvisitreportstemplate.php`;
const DEALERSHIP = `${ABSPATH}dealership.php`;

module.exports = {
  LOGIN,
  CHANGE_PASSWORD,
  FORGOT_PASSWORD,
  COACHINGMODULE,
  RESOURCE,
  VISITREPORTS,
  DEALERSHIP,
  DELEARSHIP_VISIT_REPORTS,
  INCOMPLETE_DEALERSHIP,
  INCOMPLETE_ACTION,
  INCOMPLETE_UPDATEACTION_STATUS
};
