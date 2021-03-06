/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  EuiCallOut,
  EuiPanel,
  EuiForm,
  EuiFlexGroup,
  EuiFlexItem,
  EuiLink,
  EuiSpacer,
  EuiText,
} from '@elastic/eui';
import { CONFIG_TELEMETRY_DESC, PRIVACY_STATEMENT_URL } from '../../../common/constants';
import { OptInExampleFlyout } from './opt_in_details_component';
import './telemetry_form.less';
import { Field } from 'ui/management';

const SEARCH_TERMS = ['telemetry', 'usage', 'data', 'usage data'];

export class TelemetryForm extends Component {
  static propTypes = {
    telemetryOptInProvider: PropTypes.object.isRequired,
    query: PropTypes.object,
    onQueryMatchChange: PropTypes.func.isRequired,
    spacesEnabled: PropTypes.bool.isRequired,
    activeSpace: PropTypes.object,
  };

  state = {
    processing: false,
    showExample: false,
    queryMatches: null,
  }

  componentWillReceiveProps(nextProps) {
    const {
      query
    } = nextProps;

    const searchTerm = (query.text || '').toLowerCase();
    const searchTermMatches = SEARCH_TERMS.some(term => term.indexOf(searchTerm) >= 0);

    if (searchTermMatches !== this.state.queryMatches) {
      this.setState({
        queryMatches: searchTermMatches
      }, () => {
        this.props.onQueryMatchChange(searchTermMatches);
      });
    }
  }

  render() {
    const {
      telemetryOptInProvider,
    } = this.props;

    const {
      showExample,
      queryMatches,
    } = this.state;

    if (queryMatches !== null && !queryMatches) {
      return null;
    }

    return (
      <Fragment>
        {showExample &&
          <OptInExampleFlyout fetchTelemetry={() => telemetryOptInProvider.fetchExample()} onClose={this.toggleExample} />
        }
        <EuiPanel paddingSize="l">
          <EuiForm>
            <EuiText>
              <EuiFlexGroup alignItems="baseline">
                <EuiFlexItem grow={false}>
                  <h2>Usage Data</h2>
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiText>

            {this.maybeGetSpacesWarning()}
            <EuiSpacer size="s" />
            <Field
              setting={{
                type: 'boolean',
                value: telemetryOptInProvider.getOptIn() || false,
                description: this.renderDescription(),
                defVal: false,
              }}
              save={this.toggleOptIn}
              clear={this.toggleOptIn}
            />
          </EuiForm>
        </EuiPanel>
      </Fragment>
    );
  }

  maybeGetSpacesWarning = () => {
    if (!this.props.spacesEnabled) {
      return null;
    }
    return (
      <EuiCallOut
        color="primary"
        iconType="spacesApp"
        title={
          <p>This setting applies to <strong>all of Kibana.</strong></p>
        }
      />
    );
  }

  renderDescription = () => (
    <Fragment>
      <p>{CONFIG_TELEMETRY_DESC}</p>
      <p><EuiLink onClick={this.toggleExample}>See an example of what we collect</EuiLink></p>
      <p>
        <EuiLink href={PRIVACY_STATEMENT_URL} target="_blank">
          Read our usage data privacy statement
        </EuiLink>
      </p>
    </Fragment>
  )

  toggleOptIn = async () => {
    const newOptInValue = !this.props.telemetryOptInProvider.getOptIn();

    return new Promise((resolve, reject) => {
      this.setState({
        enabled: newOptInValue,
        processing: true
      }, () => {
        this.props.telemetryOptInProvider.setOptIn(newOptInValue).then(() => {
          this.setState({ processing: false });
          resolve();
        }, (e) => {
          // something went wrong
          this.setState({ processing: false });
          reject(e);
        });
      });
    });

  }

  toggleExample = () => {
    this.setState({
      showExample: !this.state.showExample
    });
  }
}