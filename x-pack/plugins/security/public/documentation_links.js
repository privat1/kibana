/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { ELASTIC_WEBSITE_URL, DOC_LINK_VERSION } from 'ui/documentation_links';

export const documentationLinks = {
  dashboardViewMode: `${ELASTIC_WEBSITE_URL}guide/en/kibana/${DOC_LINK_VERSION}/xpack-view-modes.html`,
  esClusterPrivileges: `${ELASTIC_WEBSITE_URL}guide/en/x-pack/${DOC_LINK_VERSION}/security-privileges.html#security-privileges`,
  esIndicesPrivileges: `${ELASTIC_WEBSITE_URL}guide/en/x-pack/${DOC_LINK_VERSION}/security-privileges.html#privileges-list-indices`,
  esRunAsPrivileges: `${ELASTIC_WEBSITE_URL}guide/en/x-pack/${DOC_LINK_VERSION}/security-privileges.html#_run_as_privilege`,
};
