import React, { FunctionComponent } from 'react';
import {
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Title,
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { global_danger_color_200 as globalDangerColor200 } from '@patternfly/react-tokens';
import { FailResponseTypes } from '../Api';

interface Props {
  error: FailResponseTypes;
}

const ApiErrorState: FunctionComponent<Props> = ({ error }) => (
  <EmptyState variant={EmptyStateVariant.small}>
    <EmptyStateIcon
      icon={ExclamationCircleIcon}
      color={globalDangerColor200.value}
    />
    <Title headingLevel="h2" size="lg">
      Error
    </Title>
    <EmptyStateBody>{error.detail?.map((el) => el.msg)}</EmptyStateBody>
  </EmptyState>
);

export default ApiErrorState;
