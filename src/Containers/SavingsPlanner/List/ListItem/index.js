import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import {
  Card,
  CardHeader,
  CardHeaderMain,
  CardActions,
  CardTitle as PFCardTitle,
  CardBody,
  CardFooter,
  Checkbox as PFCheckbox,
  Dropdown,
  DropdownItem,
  KebabToggle,
  Label,
  Tooltip,
  TooltipPosition,
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';

import { Paths } from '../../../../paths';
import { createUrl, DEFAULT_NAMESPACE } from '../../../../QueryParams/';
import { jobExplorer } from '../../../../Utilities/constants';

import currencyFormatter from '../../../../Utilities/currencyFormatter';
import { formatDateTime } from '../../../../Utilities/helpers';

import JobStatus from '../../../../Components/JobStatus';

const CardTitle = styled(PFCardTitle)`
  word-break: break-word;
`;

const CardLabel = styled.span`
  margin-right: 5px;
  font-weight: bold;
`;

const Small = styled.small`
  display: block;
  margin-bottom: 10px;
  color: #6a6e73;
`;

const Checkbox = styled(PFCheckbox)`
  &.pf-c-check.pf-m-standalone {
    margin-top: -3px;
  }
`;

const CardDetail = styled.div`
  display: flex;
  min-height: 30px;
  align-items: center;
`;

const ListItem = ({
  isSuccess,
  plan,
  selected = [],
  handleSelect = () => {},
  canWrite,
  options,
}) => {
  const {
    id,
    automation_status,
    category,
    description,
    frequency_period,
    modified,
    name,
    template_details,
    projections,
  } = plan;

  const navigate = useNavigate();

  const projectedSavings =
    projections?.series_stats[projections.series_stats.length - 1]
      .cumulative_net_benefits;

  const [isCardKebabOpen, setIsCardKebabOpen] = useState(false);

  const navigateToJobExplorer = (templateId) => {
    const initialQueryParams = {
      [DEFAULT_NAMESPACE]: {
        ...jobExplorer.defaultParams,
        quick_date_range: 'last_30_days',
        status: ['failed', 'successful'],
        template_id: [templateId],
      },
    };
    navigate(createUrl(Paths.jobExplorer, true, initialQueryParams));
  };

  const renderTemplateLink = (template) => {
    return template && isSuccess ? (
      <a onClick={() => navigateToJobExplorer(template.id)}>{template.name}</a>
    ) : null;
  };

  const renderOptionsBasedValue = (key, val) => {
    return options[key]
      ? options[key].find(({ key: apiValue }) => apiValue === val).value
      : val;
  };

  const kebabDropDownItems = [
    <React.Fragment key={id}>
      <DropdownItem
        key="edit"
        onClick={() => navigate(`${id}/edit`)}
        position="right"
      >
        Edit
      </DropdownItem>
      <DropdownItem
        key="link"
        onClick={() => navigate(`${id}/edit#tasks`)}
        position="right"
      >
        Manage tasks
      </DropdownItem>
      <DropdownItem
        key="link"
        onClick={() => navigate(`${id}/edit#link_template`)}
        position="right"
      >
        Link template
      </DropdownItem>
    </React.Fragment>,
  ];

  return (
    <Card>
      <CardHeader>
        <CardHeaderMain>
          <CardTitle>
            <Link to={`${id}`}>{name}</Link>
          </CardTitle>
        </CardHeaderMain>
        {canWrite && (
          <CardActions>
            <Dropdown
              onSelect={() => {}}
              toggle={
                <KebabToggle
                  onToggle={() => setIsCardKebabOpen(!isCardKebabOpen)}
                />
              }
              isOpen={isCardKebabOpen}
              isPlain
              dropdownItems={kebabDropDownItems}
              position={'right'}
            />
            <Checkbox
              onChange={() => handleSelect(plan.id)}
              isChecked={selected.includes(plan.id)}
              aria-label="card checkbox"
              id="check-1"
              name="check1"
            />
          </CardActions>
        )}
      </CardHeader>
      <CardBody>
        {description ? <Small>{description}</Small> : null}
        <CardDetail>
          <CardLabel>Frequency</CardLabel>{' '}
          {frequency_period ? (
            renderOptionsBasedValue('frequency_period', frequency_period)
          ) : (
            <span>None</span>
          )}
        </CardDetail>
        <CardDetail>
          <CardLabel>Template</CardLabel>{' '}
          {Object.keys(template_details || {}).length !== 0 ? (
            renderTemplateLink(template_details)
          ) : (
            <span>
              None - <Link to={`${id}/edit#link_template`}>Link template</Link>
            </span>
          )}
        </CardDetail>
        <CardDetail>
          <Tooltip
            key={'last_job_status_tooltip'}
            position={TooltipPosition.top}
            content={
              automation_status.last_known_day
                ? `Status last reported on: ${automation_status.last_known_day}`
                : automation_status.last_known_month
                ? `Status last reported on: ${automation_status.last_known_month}`
                : automation_status.last_known_year
                ? `Status last reported on: ${automation_status.last_known_year}`
                : `Status last reported on: ${automation_status.last_known_date}`
            }
          >
            <CardLabel>Last job status</CardLabel>
          </Tooltip>
          {Array.isArray(automation_status.status) ? (
            automation_status.status.map((item) => {
              return item !== 'None' ? (
                <JobStatus status={item} />
              ) : (
                <Label
                  variant="outline"
                  color="red"
                  icon={<ExclamationCircleIcon />}
                  style={{ marginRight: '0.5rem', marginBottom: '0.5rem' }}
                >
                  Not Running
                </Label>
              );
            })
          ) : automation_status.status !== 'None' ? (
            <JobStatus status={automation_status.status} />
          ) : (
            <Label
              variant="outline"
              color="red"
              icon={<ExclamationCircleIcon />}
              style={{ marginRight: '0.5rem', marginBottom: '0.5rem' }}
            >
              Not Running
            </Label>
          )}
        </CardDetail>
        {projectedSavings && (
          <CardDetail>
            <CardLabel>Projected savings</CardLabel>
            <Link to={`${id}/statistics`}>
              {currencyFormatter(+projectedSavings)}
            </Link>
          </CardDetail>
        )}
        <CardDetail>
          <CardLabel>Last updated</CardLabel>{' '}
          <span>{formatDateTime(modified)}</span>
        </CardDetail>
      </CardBody>
      <CardFooter>
        <Label>{renderOptionsBasedValue('category', category)}</Label>
      </CardFooter>
    </Card>
  );
};

ListItem.propTypes = {
  isSuccess: PropTypes.bool.isRequired,
  canWrite: PropTypes.bool.isRequired,
  selected: PropTypes.array,
  handleSelect: PropTypes.func,
  plan: PropTypes.object,
  options: PropTypes.object,
};

export default ListItem;
