import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';

function SidebarItem({ item, collapsed, currentPath }) {
  const navigate = useNavigate();
  const isActive = currentPath === item.path;

  const handleClick = () => {
    navigate(item.path);
  };

  const listItem = (
    <ListItem disablePadding>
      <ListItemButton
        onClick={handleClick}
        selected={isActive}
        sx={{
          borderRadius: 2,
          mx: 1,
          mb: 0.5,
          '&.Mui-selected': {
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
            '& .MuiListItemIcon-root': {
              color: 'primary.contrastText',
            },
          },
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: collapsed ? 'auto' : 40,
            justifyContent: 'center',
            color: isActive ? 'primary.contrastText' : 'text.secondary',
          }}
        >
          {item.icon}
        </ListItemIcon>
        {!collapsed && (
          <ListItemText
            primary={item.text}
            sx={{
              '& .MuiListItemText-primary': {
                fontWeight: isActive ? 600 : 400,
              },
            }}
          />
        )}
      </ListItemButton>
    </ListItem>
  );

  if (collapsed) {
    return (
      <Tooltip title={item.text} placement="right">
        {listItem}
      </Tooltip>
    );
  }

  return listItem;
}

export default SidebarItem;
