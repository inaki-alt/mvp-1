import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';

const TemplatesEditor = ({ templates, onTemplateSelect }) => {
  const options = templates.map((template) => ({
    value: template.id,
    label: template.subject || template.user_name,
    template, // include the full template object for callback
  }));

  const handleChange = (selectedOption) => {
    onTemplateSelect(selectedOption ? selectedOption.template : null);
  };

  return (
    <Select
      options={options}
      onChange={handleChange}
      placeholder="Select Template..."
      isClearable={true}
      styles={{
        container: provided => ({ ...provided, width: '300px' }),
      }}
    />
  );
};

TemplatesEditor.propTypes = {
  templates: PropTypes.array.isRequired,
  onTemplateSelect: PropTypes.func.isRequired,
};

export default TemplatesEditor; 