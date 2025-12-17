import React from 'react';
import { makeStyles } from '@mui/styles';
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Divider,
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

const useStyles = makeStyles((theme:any) => ({
  root: {
    width: '100%',
    backgroundColor: theme?.palette?.background?.paper,
    maxHeight: 600,
    overflow: 'auto',
  },
  listItem: {
    padding: theme?.spacing?.(2, 0) || "16px 0",
  },
  avatar: {
    backgroundColor: (props:any) => props?.color,
  },
  timeText: {
    color: theme?.palette?.text?.secondary,
    fontSize: '0.875rem',
  },
  divider: {
    margin: theme.spacing?.(2, 0) || "0 16px",
  },
}));

const activities = [
  {
    id: 1,
    type: 'email',
    title: 'Email sent to John Doe',
    description: 'Follow-up regarding product demo',
    time: '2 hours ago',
    icon: EmailIcon,
    color: '#2196F3',
  },
  {
    id: 2,
    type: 'call',
    title: 'Call with Sarah Smith',
    description: 'Discussed pricing options',
    time: '4 hours ago',
    icon: PhoneIcon,
    color: '#4CAF50',
  },
  {
    id: 3,
    type: 'task',
    title: 'Task assigned to team',
    description: 'Prepare presentation for client meeting',
    time: '6 hours ago',
    icon: AssignmentIcon,
    color: '#FF9800',
  },
  {
    id: 4,
    type: 'completed',
    title: 'Deal closed',
    description: 'Successfully closed deal with Tech Corp',
    time: '1 day ago',
    icon: CheckCircleIcon,
    color: '#9C27B0',
  },
  {
    id: 5,
    type: 'email',
    title: 'Email campaign sent',
    description: 'Q2 Newsletter sent to 2,500 subscribers',
    time: '1 day ago',
    icon: EmailIcon,
    color: '#2196F3',
  },
];

const ActivityItem = ({ activity }:{ activity:any }) => {
  const classes = useStyles({ color: activity.color });
  const Icon = activity.icon;

  return (
    <>
      <ListItem alignItems="flex-start" className={classes.listItem}>
        <ListItemAvatar>
          <Avatar className={classes.avatar}>
            <Icon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={activity.title}
          secondary={
            <>
              <Typography component="span" variant="body2" color="textPrimary">
                {activity.description}
              </Typography>
              <br />
              <Typography component="span" className={classes.timeText}>
                {activity.time}
              </Typography>
            </>
          }
        />
      </ListItem>
      <Divider component="li" className={classes.divider} />
    </>
  );
};

const RecentActivities = () => {
  const classes = useStyles({});

  return (
    <List className={classes.root}>
      {activities.map((activity) => (
        <ActivityItem key={activity.id} activity={activity} />
      ))}
    </List>
  );
};

export default RecentActivities;
