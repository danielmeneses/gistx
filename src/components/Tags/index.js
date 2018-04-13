import React from 'react';
import PropTypes from 'prop-types';
import MultipleSelect from 'react-select';

import './styles.scss';

const renderOption = option => {
  return (
    <span
      className="Tags__tag-style"
      style={{
        backgroundColor: option.color
      }}>
      {option.label}
    </span>
  );
};

const Tags = props => {
  const { tags, currentSelectedTags: value, changeCurrentTags } = props;
  const listItems = Object.keys(tags).map(id => {
    const { name, color } = tags[id];
    return {
      value: id,
      label: name,
      color
    };
  });

  return (
    listItems &&
    listItems.length && (
      <MultipleSelect
        className="Tags"
        name="tags-field"
        placeholder="Tags filters..."
        optionRenderer={renderOption}
        valueRenderer={renderOption}
        onChange={changeCurrentTags}
        options={listItems}
        value={value}
        rtl={false}
      />
    )
  );
};

Tags.propTypes = {
  tags: PropTypes.object,
  gistTags: PropTypes.object,
  currentSelectedTags: PropTypes.object,
  changeCurrentTags: PropTypes.func.isRequired
};

export default Tags;
