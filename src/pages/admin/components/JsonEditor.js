import React, { useState } from 'react';
import { Box, Button, Typography, Alert } from '@mui/material';
import JSONEditor from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';

const JsonEditor = ({ content, onSave, filename }) => {
  const [jsonData, setJsonData] = useState(content);
  const [error, setError] = useState('');

  const handleJsonChange = (data) => {
    if (data.jsObject) {
      setJsonData(data.jsObject);
      setError('');
    } else {
      setError('Invalid JSON format');
    }
  };

  const handleSave = () => {
    try {
      onSave(jsonData);
      setError('');
    } catch (err) {
      setError('Failed to save changes');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">{filename}</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={!!error}
        >
          Save Changes
        </Button>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <JSONEditor
        placeholder={content}
        locale={locale}
        height="550px"
        width="100%"
        onChange={handleJsonChange}
        colors={{
          background: '#ffffff',
          default: '#000000',
          string: '#008000',
          number: '#0000ff',
          colon: '#000000',
          keys: '#800080',
          keys_whiteSpace: '#af00db',
          primitive: '#808080',
        }}
      />
    </Box>
  );
};

export default JsonEditor; 