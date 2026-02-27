import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [activities, setActivities] = useState([]);

  const addNotification = (notification) => {
    setNotifications((prev) => [notification, ...prev]);
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n._id === notificationId ? { ...n, isRead: true } : n
      )
    );
  };

  const value = {
    notifications,
    setNotifications,
    addNotification,
    markNotificationAsRead,
    activities,
    setActivities,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
