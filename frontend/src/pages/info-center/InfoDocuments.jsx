import React, { useState, useEffect } from 'react';
import { Layers } from 'lucide-react';
import { useAuth } from '@/context';
import { api } from '@/services';
import { Tray, CardDocument, Loading } from '@/components';

const InfoDocuments = () => {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        setIsLoading(true);
        const data = await api.get('/documents', token);
        const formatted = data.map(item => ({
            raw: {
                documentId: item.document_id,
                title: item.title,
                type: item.type, 
                createdAt: item.created_at
            },
            authorName: item.author_name
        }));
        setItems(formatted);
      } catch (err) { console.error(err); } finally { setIsLoading(false); }
    };
    if (token) fetchDocs();
  }, [token]);

  return (
    <Tray 
        pos="col-start-2" size="col-span-10" variant="grid" 
        title={
            <div className="flex items-center gap-2 pb-4 mb-2 border-b border-gray-100 animate-fadeIn">
                <Layers className="text-primary-accent" />
                <h2 className="text-2xl font-bold font-outfit text-primary-accent">Documents</h2>
            </div>
        }
    >
        {isLoading ? <div className="col-span-full"><Loading /></div> : items.length > 0 ? (
            items.map((item, idx) => (
                <div key={idx} className="animate-fadeIn w-full h-full">
                    <CardDocument 
                        doc={item.raw} 
                        authorName={item.authorName}
                        onAction={() => alert(`View doc ${item.raw.documentId}`)} 
                    />
                </div>
            ))
        ) : <div className="col-span-full text-center text-gray-400">No documents available.</div>}
    </Tray>
  );
};

export default InfoDocuments;