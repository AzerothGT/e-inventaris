import { Bell, Check, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNotifications, getUnreadNotificationCount, markAsRead } from '../../server/functions/notifications';
import { useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Poll for unread count
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['notifications', 'unreadCount'],
    queryFn: () => getUnreadNotificationCount(),
    refetchInterval: 30000, // Every 30 seconds
  });

  const { data: list, isLoading } = useQuery({
    queryKey: ['notifications', 'list'],
    queryFn: () => getNotifications(),
    enabled: isOpen, // Only fetch list when open
  });

  const mutation = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-surface-500 hover:text-surface-900 hover:bg-surface-100 rounded-lg transition-colors ring-offset-2 focus:ring-2 focus:ring-primary-500 outline-none"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 flex items-center justify-center rounded-full bg-danger-500 text-[10px] font-bold text-white ring-2 ring-white animate-in fade-in zoom-in">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/40 z-50 overflow-hidden animate-in slide-in-from-top-2 duration-300">
          <div className="p-4 border-b border-surface-100 flex items-center justify-between bg-white/50">
            <h3 className="font-bold text-surface-900">Notifikasi</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button 
                  onClick={() => mutation.mutate({ data: {} })}
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                >
                  <Check size={14} /> Tandai semua dibaca
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className="text-surface-400 hover:text-surface-600 lg:hidden">
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto py-2">
            {isLoading ? (
              <div className="p-8 text-center text-surface-400">Memuat...</div>
            ) : list?.length === 0 ? (
              <div className="p-8 text-center text-surface-400">Tidak ada notifikasi</div>
            ) : (
              list?.map((notif) => (
                <div 
                  key={notif.id} 
                  className={cn(
                    "px-4 py-3 flex flex-col gap-1 transition-colors hover:bg-white/60 relative group",
                    !notif.dibaca && "bg-primary-50/30 after:absolute after:left-0 after:top-0 after:bottom-0 after:w-1 after:bg-primary-500"
                  )}
                  onClick={() => !notif.dibaca && mutation.mutate({ data: { id: notif.id } })}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-primary-600 uppercase tracking-tighter">{notif.tipe}</span>
                    <span className="text-[10px] text-surface-400 font-medium">
                      {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: id })}
                    </span>
                  </div>
                  <p className={cn("text-sm transition-colors", notif.dibaca ? "text-surface-500" : "text-surface-900 font-medium")}>
                    {notif.pesan}
                  </p>
                </div>
              ))
            )}
          </div>
          
          <div className="p-3 border-t border-surface-100 bg-surface-50/50 text-center">
             <button className="text-xs font-semibold text-surface-500 hover:text-primary-600 transition-colors">
               Lihat Semua Notifikasi
             </button>
          </div>
        </div>
      )}
    </div>
  );
}
