import React, { useState, useEffect } from 'react';
import { List } from 'lucide-react';
import { useAuth } from '@/context';
import { api } from '@/services';
import { Tray, CardNotification, Loading } from '@/components';

const InfoNotifications = () => {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        setIsLoading(true);
        const data = await api.get('/notifications', token);
        const formatted = data.map(item => ({
            raw: {
                notificationId: item.notification_id,
                title: item.title,
                content: item.content,
                createdAt: item.created_at
            },
            authorName: item.author_name
        }));
        setItems(formatted);
      } catch (err) { console.error(err); } finally { setIsLoading(false); }
    };
    if (token) fetchNotifs();
  }, [token]);

  return (
    <Tray 
        pos="col-start-2" size="col-span-10" variant="grid" 
        title={
            <div className="flex items-center gap-2 pb-4 mb-2 border-b border-gray-100 animate-fadeIn">
                <List className="text-primary-accent" />
                <h2 className="text-2xl font-bold font-outfit text-primary-accent">Notifications</h2>
            </div>
        }
    >
        {isLoading ? <div className="col-span-full"><Loading /></div> : items.length > 0 ? (
            items.map((item, idx) => (
                <div key={idx} className="animate-fadeIn w-full h-full">
                    <CardNotification 
                        notification={item.raw} 
                        authorName={item.authorName}
                        onAction={() => alert(`Mark read ${item.raw.notificationId}`)} 
                    />
                </div>
            ))
        ) : <div className="col-span-full text-center text-gray-400">No notifications.</div>}
    </Tray>
  );
};

export default InfoNotifications;