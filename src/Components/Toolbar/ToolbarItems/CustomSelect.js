import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  ToolbarFilter,
  Select,
  SelectOption as PFSelectOption,
} from '@patternfly/react-core';

import { handleCheckboxChips, handleSingleChips } from '../helpers';
import { optionsForCategories } from '../constants';
import styled from 'styled-components';

const SelectOption = styled(PFSelectOption)`
  display: block;
  overflow-x: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
`;

const renderValues = (values) =>
  values &&
  values.map(({ key, value, description }) => (
    <SelectOption key={key} value={key} description={description}>
      <span style={{ marginLeft: 5 }}>{value} </span>
    </SelectOption>
  ));

const CustomSelect = ({
  categoryKey,
  value,
  selectOptions,
  isVisible = true,
  setValue,
}) => {
  const [expanded, setExpanded] = useState(false);
  const options = optionsForCategories[categoryKey];

  const onDelete = (_, valueToDelete) => {
    const single = optionsForCategories[categoryKey].isSingle;

    if (single) {
      setValue(null);
    } else {
      const keyToDelete = selectOptions.find(
        ({ value }) => value === valueToDelete
      ).key;
      const filteredArr = value.filter((value) => value !== keyToDelete);
      setValue(filteredArr);
    }
  };

  const onFilter = (_, textInput) => {
    if (textInput === '') {
      return renderValues(selectOptions);
    } else {
      return renderValues(
        selectOptions.filter(({ value }) =>
          value.toLowerCase().includes(textInput.toLowerCase())
        )
      );
    }
  };

  const handleChips = () => {
    if (options.isSingle) {
      return handleSingleChips(value, selectOptions);
    } else {
      return handleCheckboxChips(value, selectOptions);
    }
  };

  const onSelect = (_, selection) => {
    if (options.isSingle) {
      setValue(selection);
      setExpanded(false);
    } else {
      setValue(
        !value.includes(selection)
          ? [...value, selection]
          : value.filter((value) => value !== selection)
      );
    }
  };

  return (
    <ToolbarFilter
      data-cy={categoryKey}
      key={categoryKey}
      showToolbarItem={isVisible}
      chips={options.hasChips ? handleChips() : []}
      categoryName={options.name}
      deleteChip={options.hasChips ? onDelete : null}
    >
      <Select
        variant={options.isSingle ? 'single' : 'checkbox'}
        aria-label={options.name}
        onToggle={() => setExpanded(!expanded)}
        onSelect={onSelect}
        selections={value}
        isOpen={expanded}
        hasInlineFilter
        placeholderText={options.placeholder}
        onFilter={onFilter}
        maxHeight={'1000%'}
      >
        {renderValues(selectOptions)}
      </Select>
    </ToolbarFilter>
  );
};

CustomSelect.propTypes = {
  categoryKey: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
  selectOptions: PropTypes.array,
  isVisible: PropTypes.bool,
  setValue: PropTypes.func.isRequired,
};

export default CustomSelect;
