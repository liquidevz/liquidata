import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
} from '@mui/material';
import ServicesManager from './content/ServicesManager';
import PortfolioManager from './content/PortfolioManager';
import TeamManager from './content/TeamManager';
import TestimonialsManager from './content/TestimonialsManager';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`content-tabpanel-${index}`}
      aria-labelledby={`content-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ContentManager = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Services" />
          <Tab label="Portfolio" />
          <Tab label="Team" />
          <Tab label="Testimonials" />
        </Tabs>
      </Paper>

      <TabPanel value={currentTab} index={0}>
        <ServicesManager />
      </TabPanel>
      <TabPanel value={currentTab} index={1}>
        <PortfolioManager />
      </TabPanel>
      <TabPanel value={currentTab} index={2}>
        <TeamManager />
      </TabPanel>
      <TabPanel value={currentTab} index={3}>
        <TestimonialsManager />
      </TabPanel>
    </Box>
  );
};

export default ContentManager; 