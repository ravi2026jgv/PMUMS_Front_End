import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import {
  Add,
  Assignment,
  Chat,
  Close,
  Refresh,
  Send,
  Visibility,
} from '@mui/icons-material';
import { managerAPI } from '../services/api';

const STATUS_LABELS = {
  PENDING: 'लंबित',
  RESOLVED: 'समाधानित',
  CANCEL: 'निरस्त',
  NEED_CLARIFICATION: 'स्पष्टीकरण आवश्यक',
};

const STATUS_COLORS = {
  PENDING: '#ff9800',
  RESOLVED: '#4caf50',
  CANCEL: '#f44336',
  NEED_CLARIFICATION: '#2196f3',
};

const PRIORITY_COLORS = {
  LOW: '#4caf50',
  MEDIUM: '#ff9800',
  HIGH: '#f57c00',
  URGENT: '#d32f2f',
};
const selectMenuProps = {
  PaperProps: {
    sx: {
      mt: 1,
      borderRadius: 3,
      boxShadow: '0 18px 45px rgba(15, 23, 42, 0.18)',
      border: '1px solid rgba(30, 58, 138, 0.12)',
      overflow: 'hidden',
      '& .MuiMenuItem-root': {
        fontSize: 14,
        fontWeight: 600,
        py: 1.15,
        px: 2,
        color: '#1F2937',
        '&:hover': {
          bgcolor: '#EEF4FF',
          color: '#1E3A8A',
        },
        '&.Mui-selected': {
          bgcolor: '#E8F0FF',
          color: '#1E3A8A',
          fontWeight: 800,
          '&:hover': {
            bgcolor: '#DCEAFF',
          },
        },
      },
    },
  },
};

const commonFormControlSx = {
  '& .MuiInputLabel-root': {
    color: '#64748B',
    fontWeight: 700,
    fontSize: 14,
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#1E3A8A',
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: 3,
    bgcolor: '#FFFFFF',
    fontWeight: 700,
    color: '#0F172A',
    boxShadow: '0 8px 20px rgba(15, 23, 42, 0.05)',
    transition: '0.2s ease',
    '& fieldset': {
      borderColor: '#D8E1F0',
    },
    '&:hover fieldset': {
      borderColor: '#FF9933',
    },
    '&.Mui-focused': {
      boxShadow: '0 0 0 4px rgba(30, 58, 138, 0.10)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#1E3A8A',
      borderWidth: '1.5px',
    },
    '& .MuiSelect-icon': {
      color: '#1E3A8A',
    },
  },
};

const commonTextFieldSx = {
  '& .MuiInputLabel-root': {
    color: '#64748B',
    fontWeight: 700,
    fontSize: 14,
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#1E3A8A',
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: 3,
    bgcolor: '#FFFFFF',
    fontWeight: 600,
    boxShadow: '0 8px 20px rgba(15, 23, 42, 0.05)',
    transition: '0.2s ease',
    '& fieldset': {
      borderColor: '#D8E1F0',
    },
    '&:hover fieldset': {
      borderColor: '#FF9933',
    },
    '&.Mui-focused': {
      boxShadow: '0 0 0 4px rgba(30, 58, 138, 0.10)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#1E3A8A',
      borderWidth: '1.5px',
    },
  },
};

const TicketSystemTab = ({
  mode = 'manager',
  currentUser,
  relatedUser = null,
}) => {
 const isAdminMode = mode === 'admin';
const isManagerMode = mode === 'manager';
const tableColumnCount = isAdminMode ? 7 : 6;
  const [tickets, setTickets] = useState([]);
  const [totalTickets, setTotalTickets] = useState(0);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const [filters, setFilters] = useState({
  search: '',
  ticketId: '',
  status: '',
  priority: '',
  type: isAdminMode ? 'all' : 'created',
  createdById: '',
  relatedUserId: '',
  fromDate: '',
  toDate: '',
  sortBy: 'createdAt',
  sortDir: 'desc',
});

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketMessages, setTicketMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [replySending, setReplySending] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [createSaving, setCreateSaving] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
  });

  const [error, setError] = useState('');

 const canCreateTicket = isManagerMode;
const canChangeStatus = isAdminMode;

 const fetchTickets = async () => {
  try {
    setLoading(true);
    setError('');

    const params = {
      page,
      size: rowsPerPage,
      type: isAdminMode ? 'all' : filters.type,
      sortBy: filters.sortBy || 'createdAt',
      sortDir: filters.sortDir || 'desc',
    };

    if (filters.search?.trim()) {
      params.search = filters.search.trim();
    }

    if (filters.ticketId?.trim()) {
      params.ticketId = filters.ticketId.trim();
    }

    if (filters.status) {
      params.status = filters.status;
    }

    if (filters.priority) {
      params.priority = filters.priority;
    }

    if (filters.createdById?.trim()) {
      params.createdById = filters.createdById.trim();
    }

    if (filters.relatedUserId?.trim()) {
      params.relatedUserId = filters.relatedUserId.trim();
    }

    if (filters.fromDate) {
      params.fromDate = filters.fromDate;
    }

    if (filters.toDate) {
      params.toDate = filters.toDate;
    }

    const response = await managerAPI.getQueries(params);

    setTickets(response?.data?.content || []);
    setTotalTickets(response?.data?.totalElements || 0);
  } catch (err) {
    console.error('Error loading tickets:', err);
    setError(
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      'Failed to load tickets'
    );
    setTickets([]);
    setTotalTickets(0);
  } finally {
    setLoading(false);
  }
};
const handleFilterChange = (field, value) => {
  setPage(0);
  setFilters((prev) => ({
    ...prev,
    [field]: value,
  }));
};

const clearTicketFilters = () => {
  setPage(0);
  setFilters({
    search: '',
    ticketId: '',
    status: '',
    priority: '',
    type: isAdminMode ? 'all' : 'created',
    createdById: '',
    relatedUserId: '',
    fromDate: '',
    toDate: '',
    sortBy: 'createdAt',
    sortDir: 'desc',
  });
};

const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
  if (isAdminMode && key === 'type') return false;
  if (key === 'sortBy' && value === 'createdAt') return false;
  if (key === 'sortDir' && value === 'desc') return false;
  if (!isAdminMode && key === 'type' && value === 'created') return false;
  return value !== null && value !== undefined && String(value).trim() !== '';
}).length;

  const fetchMessages = async (ticket) => {
    if (!ticket?.id) return;

    try {
      setMessagesLoading(true);
      setError('');
      const response = await managerAPI.getQueryMessages(ticket.id);
      setTicketMessages(response?.data || []);
    } catch (err) {
      console.error('Error loading ticket messages:', err);
      setError(err?.response?.data?.message || err?.response?.data?.error || 'Failed to load messages');
      setTicketMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  };

  const openTicketChat = async (ticket) => {
    setSelectedTicket(ticket);
    setChatOpen(true);
    await fetchMessages(ticket);
  };

  const closeTicketChat = () => {
    setChatOpen(false);
    setSelectedTicket(null);
    setTicketMessages([]);
    setReplyMessage('');
  };

  const handleSendReply = async () => {
    if (!selectedTicket?.id) return;

    const cleanMessage = replyMessage.trim();
    if (!cleanMessage) return;

    try {
      setReplySending(true);
      await managerAPI.addQueryMessage(selectedTicket.id, cleanMessage);
      setReplyMessage('');
      await fetchMessages(selectedTicket);
      await fetchTickets();
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err?.response?.data?.message || err?.response?.data?.error || 'Failed to send message');
    } finally {
      setReplySending(false);
    }
  };

  const handleCreateTicket = async () => {
    if (!createForm.title.trim()) {
      setError('Title is required');
      return;
    }

    if (!createForm.description.trim()) {
      setError('Message is required');
      return;
    }

    try {
      setCreateSaving(true);
      setError('');

      const payload = {
        title: createForm.title.trim(),
        description: createForm.description.trim(),
        priority: createForm.priority,
        relatedUserId: relatedUser?.id || null,
      };

      await managerAPI.createQuery(payload);

      setCreateOpen(false);
      setCreateForm({
        title: '',
        description: '',
        priority: 'MEDIUM',
      });

      await fetchTickets();
    } catch (err) {
      console.error('Error creating ticket:', err);
      setError(err?.response?.data?.message || err?.response?.data?.error || 'Failed to create ticket');
    } finally {
      setCreateSaving(false);
    }
  };

  const handleStatusChange = async (ticket, status) => {
    if (!ticket?.id) return;

    try {
      setError('');
      await managerAPI.updateQueryStatus(ticket.id, status);
      await fetchTickets();

      if (selectedTicket?.id === ticket.id) {
        setSelectedTicket((prev) => ({
          ...prev,
          status,
          statusDisplay: STATUS_LABELS[status] || status,
        }));
      }
    } catch (err) {
      console.error('Error updating ticket status:', err);
      setError(err?.response?.data?.message || err?.response?.data?.error || 'Failed to update status');
    }
  };

useEffect(() => {
  fetchTickets();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [
  page,
  rowsPerPage,
  filters.search,
  filters.ticketId,
  filters.status,
  filters.priority,
  filters.type,
  filters.createdById,
  filters.relatedUserId,
  filters.fromDate,
  filters.toDate,
  filters.sortBy,
  filters.sortDir,
]);
const title = useMemo(() => {
  return isAdminMode
    ? 'Admin Ticket Control Center'
    : 'My Tickets / Admin Support';
}, [isAdminMode]);

const subtitle = useMemo(() => {
  return isAdminMode
    ? 'Managers द्वारा भेजे गए सभी tickets, replies और status यहाँ manage होंगे.'
    : 'Admin को query भेजें, reply देखें और अपने tickets track करें.';
}, [isAdminMode]);

  return (
    <>
      <Paper elevation={6} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Box
          sx={{
            p: 3,
background: isAdminMode
  ? 'linear-gradient(135deg, #4C1D95 0%, #1E1B4B 55%, #111827 100%)'
  : 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 55%, #0F766E 100%)',            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              <Assignment sx={{ mr: 1, verticalAlign: 'middle' }} />
              {title}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
{subtitle}            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={fetchTickets}
              sx={{
                bgcolor: 'rgba(255,255,255,0.18)',
                color: 'white',
                boxShadow: 'none',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.28)' },
              }}
            >
              Refresh
            </Button>

            {canCreateTicket && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setCreateOpen(true)}
                sx={{
                  bgcolor: '#ff9800',
                  color: 'white',
                  '&:hover': { bgcolor: '#f57c00' },
                }}
              >
                New Ticket
              </Button>
            )}
          </Box>
        </Box>

        <Box
  sx={{
    p: { xs: 2, md: 3 },
    background:
      'linear-gradient(180deg, #F8FAFF 0%, #FFFFFF 100%)',
    borderBottom: '1px solid #E2E8F0',
  }}
>
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      mb: 2,
      flexWrap: 'wrap',
      gap: 1,
    }}
  >
   <Box>
  <Typography
    variant="subtitle1"
    sx={{
      fontWeight: 900,
      color: '#1E3A8A',
      display: 'flex',
      alignItems: 'center',
      gap: 1,
    }}
  >
    <Assignment sx={{ fontSize: 20, color: '#FF9933' }} />
    Filters / फ़िल्टर
  </Typography>

  <Typography
    variant="caption"
    sx={{
      color: '#64748B',
      fontWeight: 600,
    }}
  >
{isAdminMode
  ? 'Ticket ID, manager, related user, status, priority और date के अनुसार search करें.'
  : 'अपने created/assigned tickets को status, priority, user और date से filter करें.'}  </Typography>
</Box>

    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      {activeFilterCount > 0 && (
        <Chip
          label={`${activeFilterCount} active filter${activeFilterCount > 1 ? 's' : ''}`}
          size="small"
          sx={{
            bgcolor: '#1E3A8A',
            color: 'white',
            fontWeight: 700,
          }}
        />
      )}

     <Button
  variant="contained"
  size="small"
  startIcon={<Refresh />}
  onClick={fetchTickets}
  sx={{
    borderRadius: 3,
    textTransform: 'none',
    fontWeight: 800,
    px: 2,
    bgcolor: '#1E3A8A',
    boxShadow: '0 8px 18px rgba(30, 58, 138, 0.22)',
    '&:hover': {
      bgcolor: '#132B68',
      boxShadow: '0 10px 24px rgba(30, 58, 138, 0.30)',
    },
  }}
>
  Apply
</Button>

<Button
  variant="outlined"
  color="error"
  size="small"
  onClick={clearTicketFilters}
  sx={{
    borderRadius: 3,
    textTransform: 'none',
    fontWeight: 800,
    px: 2,
    bgcolor: '#fff',
    borderColor: '#FCA5A5',
    color: '#DC2626',
    '&:hover': {
      bgcolor: '#FEF2F2',
      borderColor: '#DC2626',
    },
  }}
>
  Clear
</Button>
    </Box>
  </Box>

  <Grid container spacing={2}>
    <Grid item xs={12} md={4}>
      <TextField
        fullWidth
        
        size="small"
        label="Search"
        sx={commonTextFieldSx}
        placeholder="Title, message, manager, user..."
        value={filters.search}
        onChange={(e) => handleFilterChange('search', e.target.value)}
      />
    </Grid>

    <Grid item xs={12} sm={6} md={2}>
      <TextField
        fullWidth
        size="small"
        sx={commonTextFieldSx}
        label="Ticket ID"
        placeholder="e.g. 3"
        value={filters.ticketId}
        onChange={(e) =>
          handleFilterChange('ticketId', e.target.value.replace(/\D/g, ''))
        }
      />
    </Grid>

   <Grid item xs={12} sm={6} md={4}>
  <FormControl
    fullWidth
    size="small"
    sx={{
      ...commonFormControlSx,
      minWidth: 240,
    }}
  >
    <InputLabel>Status</InputLabel>
    <Select
      value={filters.status}
      label="Status"
      MenuProps={selectMenuProps}
      onChange={(e) => handleFilterChange('status', e.target.value)}
      sx={{
        minWidth: 240,
        '& .MuiSelect-select': {
          whiteSpace: 'nowrap',
          overflow: 'visible',
          textOverflow: 'unset',
        },
      }}
    >
      <MenuItem value="">All Status</MenuItem>
      <MenuItem value="PENDING">Pending / लंबित</MenuItem>
      <MenuItem value="NEED_CLARIFICATION">
        Need Clarification / स्पष्टीकरण आवश्यक
      </MenuItem>
      <MenuItem value="RESOLVED">Resolved / समाधानित</MenuItem>
      <MenuItem value="CANCEL">Cancel / निरस्त</MenuItem>
    </Select>
  </FormControl>
</Grid>

<Grid item xs={12} sm={6} md={4}>
  <FormControl
    fullWidth
    size="small"
    sx={{
      ...commonFormControlSx,
      minWidth: 240,
    }}
  >
    <InputLabel>Priority</InputLabel>
    <Select
      value={filters.priority}
      label="Priority"
      MenuProps={selectMenuProps}
      onChange={(e) => handleFilterChange('priority', e.target.value)}
      sx={{
        minWidth: 240,
        '& .MuiSelect-select': {
          whiteSpace: 'nowrap',
          overflow: 'visible',
          textOverflow: 'unset',
        },
      }}
    >
      <MenuItem value="">All Priority</MenuItem>
      <MenuItem value="LOW">Low</MenuItem>
      <MenuItem value="MEDIUM">Medium</MenuItem>
      <MenuItem value="HIGH">High</MenuItem>
      <MenuItem value="URGENT">Urgent</MenuItem>
    </Select>
  </FormControl>
</Grid>

    {!isAdminMode && (
      <Grid item xs={12} sm={6} md={3}>
        <FormControl fullWidth size="small" sx={commonFormControlSx}>
        <InputLabel>My Ticket View</InputLabel>
          <Select
            value={filters.type}
            label="Ticket Type"
            MenuProps={selectMenuProps}
            onChange={(e) => handleFilterChange('type', e.target.value)}
          >
            <MenuItem value="created">मेरे द्वारा बनाए गए / Created By Me</MenuItem>
<MenuItem value="assigned">मुझे Assigned Tickets</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    )}

    {isAdminMode && (
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          size="small"
          sx={commonTextFieldSx}
          label="Manager ID / Created By"
          placeholder="PMUMS..."
          value={filters.createdById}
          onChange={(e) => handleFilterChange('createdById', e.target.value)}
        />
      </Grid>
    )}

    <Grid item xs={12} sm={6} md={3}>
      <TextField
        fullWidth
        size="small"
        sx={commonTextFieldSx}
        label="Related User ID"
        placeholder="PMUMS..."
        value={filters.relatedUserId}
        onChange={(e) => handleFilterChange('relatedUserId', e.target.value)}
      />
    </Grid>

    <Grid item xs={12} sm={6} md={3}>
      <TextField
        fullWidth
        size="small"
        sx={commonTextFieldSx}
        type="date"
        label="From Date"
        InputLabelProps={{ shrink: true }}
        value={filters.fromDate}
        onChange={(e) => handleFilterChange('fromDate', e.target.value)}
      />
    </Grid>

    <Grid item xs={12} sm={6} md={3}>
      <TextField
        fullWidth
        sx={commonTextFieldSx}
        size="small"
        type="date"
        label="To Date"
        InputLabelProps={{ shrink: true }}
        value={filters.toDate}
        onChange={(e) => handleFilterChange('toDate', e.target.value)}
      />
    </Grid>

    <Grid item xs={12} sm={6} md={3}>
      <FormControl fullWidth size="small" sx={commonFormControlSx}>
        <InputLabel>Sort By</InputLabel>
        <Select
          value={filters.sortBy}
          label="Sort By"
          MenuProps={selectMenuProps}
          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
        >
          <MenuItem value="createdAt">Created Date</MenuItem>
          <MenuItem value="updatedAt">Updated Date</MenuItem>
          <MenuItem value="id">Ticket ID</MenuItem>
          <MenuItem value="priority">Priority</MenuItem>
          <MenuItem value="status">Status</MenuItem>
          <MenuItem value="title">Title</MenuItem>
        </Select>
      </FormControl>
    </Grid>

    <Grid item xs={12} sm={6} md={3}>
      <FormControl fullWidth size="small" sx={commonFormControlSx}>
        <InputLabel>Sort Direction</InputLabel>
        <Select
          value={filters.sortDir}
          label="Sort Direction"
          MenuProps={selectMenuProps}
          onChange={(e) => handleFilterChange('sortDir', e.target.value)}
        >
          <MenuItem value="desc">Newest / Descending</MenuItem>
          <MenuItem value="asc">Oldest / Ascending</MenuItem>
        </Select>
      </FormControl>
    </Grid>
  </Grid>
</Box>

        {error && (
          <Alert severity="error" sx={{ borderRadius: 0 }}>
            {error}
          </Alert>
        )}

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f3f4f6' }}>
                <TableCell><strong>Ticket</strong></TableCell>
                <TableCell><strong>Related User</strong></TableCell>
{isAdminMode && (
  <TableCell><strong>Created By</strong></TableCell>
)}                <TableCell><strong>Priority</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Updated</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={tableColumnCount} align="center" sx={{ py: 5 }}>
                    <CircularProgress />
                    <Typography sx={{ mt: 1 }}>Tickets loading...</Typography>
                  </TableCell>
                </TableRow>
              ) : tickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={tableColumnCount} align="center" sx={{ py: 5 }}>
                    <Chat sx={{ fontSize: 48, color: '#bbb', mb: 1 }} />
                    <Typography variant="h6" color="text.secondary">
                      No tickets found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                tickets.map((ticket) => (
                  <TableRow key={ticket.id} hover>
                    <TableCell>
                     <Typography variant="body2" sx={{ fontWeight: 800, color: '#1E3A8A' }}>
  #{ticket.id} - {ticket.title}
</Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: 'block',
                          maxWidth: 360,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {ticket.description || '-'}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
  {ticket.relatedUserName || '-'}
</Typography>

{ticket.relatedUserId && (
  <Typography variant="caption" color="text.secondary">
    ID: {ticket.relatedUserId}
  </Typography>
)}
                    </TableCell>

                   {isAdminMode && (
  <TableCell>
    <Typography variant="body2" sx={{ fontWeight: 700 }}>
      {ticket.createdByName || '-'}
    </Typography>

    <Typography variant="caption" color="text.secondary" display="block">
      {ticket.createdById || ''}
    </Typography>

    <Typography variant="caption" color="text.secondary" display="block">
      {ticket.createdByEmail || ''}
    </Typography>
  </TableCell>
)}

                    <TableCell>
                      <Chip
                        label={ticket.priorityDisplay || ticket.priority || '-'}
                        size="small"
                        sx={{
                          bgcolor: PRIORITY_COLORS[ticket.priority] || '#757575',
                          color: 'white',
                          fontWeight: 700,
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={ticket.statusDisplay || STATUS_LABELS[ticket.status] || ticket.status}
                        size="small"
                        sx={{
                          bgcolor: STATUS_COLORS[ticket.status] || '#757575',
                          color: 'white',
                          fontWeight: 700,
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Typography variant="caption">
                        {ticket.updatedAt
                          ? new Date(ticket.updatedAt).toLocaleString('en-IN')
                          : ticket.createdAt
                            ? new Date(ticket.createdAt).toLocaleString('en-IN')
                            : '-'}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <IconButton
                        size="small"
                        title="Open Chat"
                        onClick={() => openTicketChat(ticket)}
                        sx={{
                          bgcolor: '#1976d220',
                          mr: 0.5,
                          '&:hover': { bgcolor: '#1976d240' },
                        }}
                      >
                        <Visibility fontSize="small" sx={{ color: '#1976d2' }} />
                      </IconButton>
{isManagerMode && (
  <Typography
    variant="caption"
    sx={{
      display: 'block',
      mt: 0.5,
      color: '#64748B',
      fontWeight: 600,
    }}
  >
    Admin will update status
  </Typography>
)}
                      {canChangeStatus && (
                       <FormControl
  size="small"
  sx={{
    minWidth: 165,
    ...commonFormControlSx,
    '& .MuiOutlinedInput-root': {
      ...commonFormControlSx['& .MuiOutlinedInput-root'],
      borderRadius: 2.5,
      fontSize: 13,
      bgcolor: '#FFFFFF',
    },
  }}
>
    
                          <Select
                            value={ticket.status || 'PENDING'}
                            MenuProps={selectMenuProps}
                            onChange={(e) => handleStatusChange(ticket, e.target.value)}
                          >
                            <MenuItem value="PENDING">Pending</MenuItem>
                            <MenuItem value="NEED_CLARIFICATION">Need Clarification</MenuItem>
                            <MenuItem value="RESOLVED">Resolved</MenuItem>
                            <MenuItem value="CANCEL">Cancel</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={totalTickets}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[10, 20, 50]}
        />
      </Paper>

      <Dialog open={chatOpen} onClose={closeTicketChat} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            bgcolor: '#1E3A8A',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Ticket Chat #{selectedTicket?.id}
            </Typography>
            <Typography variant="caption">
              {selectedTicket?.title}
            </Typography>
          </Box>

          <IconButton onClick={closeTicketChat} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ bgcolor: '#f8fafc', p: 0 }}>
          {selectedTicket && (
            <Box sx={{ p: 2, bgcolor: 'white', borderBottom: '1px solid #e0e0e0' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="caption" color="text.secondary">Status</Typography>
                  <Box>
                    <Chip
  label={isAdminMode ? 'Admin View' : 'Manager View'}
  size="small"
  sx={{
    bgcolor: 'rgba(255,255,255,0.18)',
    color: 'white',
    fontWeight: 800,
    border: '1px solid rgba(255,255,255,0.25)',
  }}
/>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Typography variant="caption" color="text.secondary">Related User</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {selectedTicket.relatedUserName || '-'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Typography variant="caption" color="text.secondary">Created By</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {selectedTicket.createdByName || '-'}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}

          <Box sx={{ height: 420, overflowY: 'auto', p: 2 }}>
            {messagesLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                <CircularProgress />
              </Box>
            ) : ticketMessages.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 5 }}>
                <Chat sx={{ fontSize: 48, color: '#bbb' }} />
                <Typography color="text.secondary">No messages yet.</Typography>
              </Box>
            ) : (
              ticketMessages.map((msg) => {
                const isMine = msg.senderId === currentUser?.id;

                return (
                  <Box
                    key={msg.id}
                    sx={{
                      display: 'flex',
                      justifyContent: isMine ? 'flex-end' : 'flex-start',
                      mb: 1.5,
                    }}
                  >
                    {!isMine && (
                      <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: '#6a1b9a' }}>
                        {msg.senderName?.charAt(0) || 'A'}
                      </Avatar>
                    )}

                    <Box
                      sx={{
                        maxWidth: '72%',
                        p: 1.5,
                        borderRadius: 3,
                        bgcolor: isMine ? '#1E3A8A' : 'white',
                        color: isMine ? 'white' : 'text.primary',
                        border: isMine ? 'none' : '1px solid #e0e0e0',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
                      }}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 800, opacity: 0.85 }}>
                        {msg.senderName || '-'} • {msg.senderRole || '-'}
                      </Typography>

                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mt: 0.5 }}>
                        {msg.message}
                      </Typography>

                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          mt: 0.75,
                          opacity: 0.7,
                          textAlign: 'right',
                        }}
                      >
                        {msg.createdAt ? new Date(msg.createdAt).toLocaleString('en-IN') : ''}
                      </Typography>
                    </Box>
                  </Box>
                );
              })
            )}
          </Box>

          <Divider />

          <Box sx={{ p: 2, bgcolor: 'white', display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              multiline
              minRows={1}
              maxRows={4}
              sx={commonTextFieldSx}
              placeholder="Type your message..."
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendReply();
                }
              }}
            />

            <Button
              variant="contained"
              onClick={handleSendReply}
              disabled={replySending || !replyMessage.trim()}
              startIcon={replySending ? <CircularProgress size={16} color="inherit" /> : <Send />}
              sx={{ minWidth: 120, bgcolor: '#1E3A8A' }}
            >
              Send
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#1E3A8A', color: 'white', fontWeight: 800 }}>
          New Ticket / Query
        </DialogTitle>

        <DialogContent dividers sx={{ pt: 3 }}>
          {relatedUser && (
            <Alert severity="info" sx={{ mb: 2 }}>
              यह ticket user <strong>{relatedUser.name}</strong> के लिए admin को भेजी जाएगी.
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Title / Subject"
              sx={commonTextFieldSx}
              value={createForm.title}
              onChange={(e) => setCreateForm((prev) => ({ ...prev, title: e.target.value }))}
            />

           <FormControl fullWidth sx={commonFormControlSx}>
              <InputLabel>Priority</InputLabel>
             <Select
  value={createForm.priority}
  label="Priority"
  MenuProps={selectMenuProps}
  onChange={(e) => setCreateForm((prev) => ({ ...prev, priority: e.target.value }))}
>
                <MenuItem value="LOW">Low</MenuItem>
                <MenuItem value="MEDIUM">Medium</MenuItem>
                <MenuItem value="HIGH">High</MenuItem>
                <MenuItem value="URGENT">Urgent</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              multiline
              minRows={5}
              sx={commonTextFieldSx}
              label="Message / Comment"
              value={createForm.description}
              onChange={(e) => setCreateForm((prev) => ({ ...prev, description: e.target.value }))}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setCreateOpen(false)} disabled={createSaving}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateTicket}
            disabled={createSaving}
            startIcon={createSaving ? <CircularProgress size={16} color="inherit" /> : <Send />}
            sx={{ bgcolor: '#1E3A8A' }}
          >
            {createSaving ? 'Sending...' : 'Submit Ticket'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TicketSystemTab;