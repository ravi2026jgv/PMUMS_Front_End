import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Alert
} from '@mui/material';
import { managerAPI } from '../services/api';

const CreateQueryDialog = ({ open, onClose, onSuccess }) => {
  const [queryData, setQueryData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    relatedSambhagId: null,
    relatedDistrictId: null,
    relatedBlockId: null,
    relatedUserId: '',
    assignToManagerId: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const priorityOptions = [
    { value: 'LOW', label: 'कम प्राथमिकता', color: '#4caf50' },
    { value: 'MEDIUM', label: 'सामान्य प्राथमिकता', color: '#ff9800' },
    { value: 'HIGH', label: 'उच्च प्राथमिकता', color: '#ff5722' },
    { value: 'URGENT', label: 'तत्काल', color: '#d32f2f' }
  ];

  const handleInputChange = (field, value) => {
    setQueryData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!queryData.title.trim() || !queryData.description.trim()) {
      setError('कृपया शीर्षक और विवरण दर्ज करें।');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const submitData = {
        ...queryData,
        relatedUserId: queryData.relatedUserId || null,
        assignToManagerId: queryData.assignToManagerId || null
      };
      
      await managerAPI.createQuery(submitData);
      
      // Reset form
      setQueryData({
        title: '',
        description: '',
        priority: 'MEDIUM',
        relatedSambhagId: null,
        relatedDistrictId: null,
        relatedBlockId: null,
        relatedUserId: '',
        assignToManagerId: null
      });
      
      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating query:', error);
      setError(error.response?.data?.error || 'क्वेरी बनाने में त्रुटि हुई।');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle sx={{ bgcolor: '#1976d2', color: 'white', fontWeight: 'bold' }}>
        नई क्वेरी बनाएं
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="क्वेरी शीर्षक"
            fullWidth
            required
            value={queryData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="उदा: उपयोगकर्ता पंजीकरण में समस्या"
          />
          
          <TextField
            label="विस्तृत विवरण"
            fullWidth
            required
            multiline
            rows={4}
            value={queryData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="समस्या का विस्तृत विवरण दर्ज करें..."
          />
          
          <FormControl fullWidth>
            <InputLabel>प्राथमिकता स्तर</InputLabel>
            <Select
              value={queryData.priority}
              label="प्राथमिकता स्तर"
              onChange={(e) => handleInputChange('priority', e.target.value)}
            >
              {priorityOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box 
                      sx={{ 
                        width: 12, 
                        height: 12, 
                        borderRadius: '50%', 
                        bgcolor: option.color 
                      }} 
                    />
                    {option.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            label="संबंधित उपयोगकर्ता ID (वैकल्पिक)"
            fullWidth
            value={queryData.relatedUserId}
            onChange={(e) => handleInputChange('relatedUserId', e.target.value)}
            placeholder="उदा: user123"
            helperText="यदि यह क्वेरी किसी विशिष्ट उपयोगकर्ता से संबंधित है"
          />
          
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            💡 यह क्वेरी आपके प्रबंधन स्तर के अनुसार स्वचालित रूप से असाइन की जाएगी।
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button 
          onClick={handleClose}
          disabled={loading}
        >
          रद्द करें
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !queryData.title.trim() || !queryData.description.trim()}
          sx={{ bgcolor: '#1976d2' }}
        >
          {loading ? 'बनाई जा रही है...' : 'क्वेरी बनाएं'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ResolveQueryDialog = ({ open, onClose, query, onSuccess }) => {
  const [resolution, setResolution] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!resolution.trim()) {
      setError('कृपया समाधान विवरण दर्ज करें।');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await managerAPI.resolveQuery(query.id, resolution);
      
      setResolution('');
      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      console.error('Error resolving query:', error);
      setError(error.response?.data?.error || 'क्वेरी हल करने में त्रुटि हुई।');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setResolution('');
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle sx={{ bgcolor: '#4caf50', color: 'white', fontWeight: 'bold' }}>
        क्वेरी का समाधान
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {query && (
          <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {query.title}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {query.description}
            </Typography>
          </Box>
        )}
        
        <TextField
          label="समाधान विवरण"
          fullWidth
          required
          multiline
          rows={5}
          value={resolution}
          onChange={(e) => setResolution(e.target.value)}
          placeholder="इस क्वेरी का समाधान विस्तार से बताएं..."
        />
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button 
          onClick={handleClose}
          disabled={loading}
        >
          रद्द करें
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !resolution.trim()}
          sx={{ bgcolor: '#4caf50' }}
        >
          {loading ? 'हल की जा रही है...' : 'क्वेरी हल करें'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export { CreateQueryDialog, ResolveQueryDialog };