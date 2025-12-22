import { Check, Mail, Trash2, X } from "lucide-react";
import { useState } from "react";
import "../App.css";
import MenuButton from "../components/MenuButton";
import MobileBanner from "../components/MobileBanner";
import ProfileStats from "../components/ProfileStats";
import { useAlertsQuery } from "../features/alerts/useAlertsQuery";
import { timeAgo } from "../utils/timeAgo";

type Alert = {
  id: number;
  title: string;
  body?: string;
  created_at: string;
  is_read?: boolean;
};

type AlertRowProps = {
  alert: Alert;
  isDragged: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onMarkRead: () => void;
  onDelete: () => void;
};

const AlertRow = ({
  alert,
  onDragStart,
  onDragEnd,
  onMarkRead,
  onDelete,
}: AlertRowProps) => {
  const [dragOffset, setDragOffset] = useState(0);
  const [showActions, setShowActions] = useState(false);

  const handleDragStart = (startX: number) => {
    let currentOffset = dragOffset;

    const handleDragMove = (moveX: number) => {
      const offset = startX - moveX;
      currentOffset = Math.max(0, Math.min(offset, 140));
      setDragOffset(currentOffset);
    };

    const handleDragEnd = () => {
      if (currentOffset > 60) {
        setShowActions(true);
        setDragOffset(140);
      } else {
        setDragOffset(0);
        setShowActions(false);
      }
      onDragEnd();
    };

    return { handleDragMove, handleDragEnd };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const startX = e.clientX;
    onDragStart();
    const { handleDragMove, handleDragEnd } = handleDragStart(startX);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      handleDragMove(moveEvent.clientX);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      handleDragEnd();
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const startX = e.touches[0].clientX;
    onDragStart();
    const { handleDragMove, handleDragEnd } = handleDragStart(startX);

    const handleTouchMove = (moveEvent: TouchEvent) => {
      handleDragMove(moveEvent.touches[0].clientX);
    };

    const handleTouchEnd = () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      handleDragEnd();
    };

    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
  };

  const handleMarkRead = () => {
    onMarkRead();
    setShowActions(false);
    setDragOffset(0);
  };

  const handleDelete = () => {
    onDelete();
    setShowActions(false);
    setDragOffset(0);
  };

  return (
    <div className="relative rounded-lg overflow-hidden group">
      {/* Action buttons - Always in DOM but behind content */}
      <div className="absolute inset-0 flex items-center justify-end gap-2 px-2 bg-gray-50 z-0 pointer-events-none">
        {!alert.is_read && (
          <button
            onClick={handleMarkRead}
            disabled={!showActions}
            title="Mark as read"
            className={`p-2 rounded-lg transition-colors pointer-events-auto flex items-center justify-center ${
              showActions
                ? "bg-blue-500 hover:bg-blue-600 cursor-pointer"
                : "bg-blue-300 cursor-not-allowed"
            }`}
          >
            <Mail size={20} className="text-white" />
          </button>
        )}
        <button
          onClick={handleDelete}
          disabled={!showActions}
          title="Delete alert"
          className={`p-2 rounded-lg transition-colors pointer-events-auto flex items-center justify-center ${
            showActions
              ? "bg-red-500 hover:bg-red-600 cursor-pointer"
              : "bg-red-300 cursor-not-allowed"
          }`}
        >
          <Trash2 size={20} className="text-white" />
        </button>
      </div>

      {/* Main content */}
      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className={`flex items-start gap-3 w-full relative bg-white p-3 transition-all ${
          showActions ? "cursor-default" : "cursor-grab active:cursor-grabbing"
        } hover:bg-gray-50`}
        style={{
          transform: `translateX(-${dragOffset}px)`,
          zIndex: 10,
        }}
      >
        <img
          src="/alien-svgrepo-com.png"
          alt="alert source"
          className="w-10 h-10 object-contain shrink-0"
        />
        <div
          className={`flex flex-col flex-1 ${alert.is_read ? "opacity-50" : ""}`}
        >
          <span className="text-xs text-gray-400">
            {timeAgo(alert.created_at)}
          </span>
          <div className="text-sm lg:text-base">
            <span className="font-semibold">{alert.title}</span>
            <span className="ml-1 text-gray-700">{alert.body}</span>
          </div>
        </div>
        {!alert.is_read && (
          <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-2" />
        )}
      </div>
    </div>
  );
};

interface AlertsPanelProps {
  showMobileMenu: boolean;
  setShowMobileMenu: (show: boolean) => void;
}

const AlertsPanel = ({
  showMobileMenu,
  setShowMobileMenu,
}: AlertsPanelProps) => {
  const {
    alerts,
    loading,
    error,
    markReadMutation,
    deleteAlertMutation,
    markAllReadMutation,
    deleteAllMutation,
  } = useAlertsQuery();
  const [draggedAlert, setDraggedAlert] = useState<number | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleMarkAllRead = () => {
    markAllReadMutation.mutate();
    setShowMenu(false);
    setShowMobileMenu(false);
  };

  const handleDeleteAll = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAll = () => {
    deleteAllMutation.mutate(alerts);
    setShowDeleteConfirm(false);
    setShowMenu(false);
    setShowMobileMenu(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  // Group alerts by time period
  const groupAlertsByTime = (alertsList: Alert[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const groups = {
      today: [] as Alert[],
      yesterday: [] as Alert[],
      thisWeek: [] as Alert[],
      older: [] as Alert[],
    };

    alertsList.forEach((alert) => {
      const alertDate = new Date(alert.created_at);
      const alertDay = new Date(
        alertDate.getFullYear(),
        alertDate.getMonth(),
        alertDate.getDate(),
      );

      if (alertDay.getTime() === today.getTime()) {
        groups.today.push(alert);
      } else if (alertDay.getTime() === yesterday.getTime()) {
        groups.yesterday.push(alert);
      } else if (alertDay.getTime() >= weekAgo.getTime()) {
        groups.thisWeek.push(alert);
      } else {
        groups.older.push(alert);
      }
    });

    return groups;
  };

  const groupedAlerts = groupAlertsByTime(alerts);
  const hasUnread = alerts.some((a) => !a.is_read);

  return (
    <div className="flex flex-col items-center lg:w-full text-[var(--dark-def)] ">
      {/* Fixed-height container only for desktop */}
      <div className="bg-white w-full mr-2 lg:w-[75vw] lg:h-[93vh] lg:rounded-2xl shadow-sm flex flex-col">
        {/* Header (desktop only) */}
        <div className="p-4 sm:p-6 border-b hidden sm:block border-gray-100 shrink-0 relative">
          <h2 className="sm:text-center sm:text-3xl sm:font-semibold">
            Alerts
          </h2>
          {/* Three-dot menu for desktop */}
          {alerts.length > 0 && (
            <div className="absolute top-4 right-6">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                    <button
                      onClick={handleMarkAllRead}
                      disabled={markAllReadMutation.isPending || !hasUnread}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Check size={18} />
                      Mark all as read
                    </button>
                    <button
                      onClick={handleDeleteAll}
                      disabled={deleteAllMutation.isPending}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <X size={18} />
                      Delete all
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Desktop alerts */}
        <div className="hidden lg:flex flex-1 overflow-y-auto no-scrollbar p-4 lg:p-6 pb-24">
          <div className="space-y-6 w-full">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-2 rounded-lg bg-gray-100 animate-pulse w-full"
                >
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gray-300 shrink-0" />
                  <div className="flex flex-col w-full gap-2">
                    <span className="text-xs bg-gray-400 w-[100px] h-2.5 rounded-full" />
                    <div className="text-sm lg:text-base bg-gray-400 w-[300px] h-2.5 rounded-full" />
                  </div>
                </div>
              ))
            ) : error ? (
              <div className="w-full flex justify-center">
                <p className="text-center max-lg:hidden">
                  There was an error retrieving your alerts.
                </p>
              </div>
            ) : alerts.length === 0 ? (
              <div className="w-full h-full flex justify-center text-(--dark-def) flex-col items-center gap-4">
                <img className="h-25 w-25 md:h-35 md:w-35 lg:h-40 lg:w-40" src="/alert-bell.svg" alt="No alerts" />
                <div className="flex flex-col items-center justify-center">
                  <p className="font-semibold text-xl md:text-2xl lg:text-[1.5vw]">
                    No notifications to show
                  </p>
                  <p className="text-center text-base max-lg:font-light md:text-xl lg:text-[1.2vw]">
                    You currently do not have any notification yet.<br />
                    we're going to notify you when
                    something new happens
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Today */}
                {groupedAlerts.today.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-3 text-center">
                      Today
                    </h3>
                    <div className="space-y-2">
                      {groupedAlerts.today.map((alert) => (
                        <AlertRow
                          key={alert.id}
                          alert={alert}
                          isDragged={draggedAlert === alert.id}
                          onDragStart={() => setDraggedAlert(alert.id)}
                          onDragEnd={() => setDraggedAlert(null)}
                          onMarkRead={() => markReadMutation.mutate(alert.id)}
                          onDelete={() => deleteAlertMutation.mutate(alert.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Yesterday */}
                {groupedAlerts.yesterday.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-3 text-center">
                      Yesterday
                    </h3>
                    <div className="space-y-2">
                      {groupedAlerts.yesterday.map((alert) => (
                        <AlertRow
                          key={alert.id}
                          alert={alert}
                          isDragged={draggedAlert === alert.id}
                          onDragStart={() => setDraggedAlert(alert.id)}
                          onDragEnd={() => setDraggedAlert(null)}
                          onMarkRead={() => markReadMutation.mutate(alert.id)}
                          onDelete={() => deleteAlertMutation.mutate(alert.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* This week */}
                {groupedAlerts.thisWeek.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-3 text-center">
                      This week
                    </h3>
                    <div className="space-y-2">
                      {groupedAlerts.thisWeek.map((alert) => (
                        <AlertRow
                          key={alert.id}
                          alert={alert}
                          isDragged={draggedAlert === alert.id}
                          onDragStart={() => setDraggedAlert(alert.id)}
                          onDragEnd={() => setDraggedAlert(null)}
                          onMarkRead={() => markReadMutation.mutate(alert.id)}
                          onDelete={() => deleteAlertMutation.mutate(alert.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Older */}
                {groupedAlerts.older.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-3 text-center">
                      Older
                    </h3>
                    <div className="space-y-2">
                      {groupedAlerts.older.map((alert) => (
                        <AlertRow
                          key={alert.id}
                          alert={alert}
                          isDragged={draggedAlert === alert.id}
                          onDragStart={() => setDraggedAlert(alert.id)}
                          onDragEnd={() => setDraggedAlert(null)}
                          onMarkRead={() => markReadMutation.mutate(alert.id)}
                          onDelete={() => deleteAlertMutation.mutate(alert.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Mobile alerts */}
        <div className="flex lg:hidden flex-col w-screen md:w-screen p-4 bg-white h-[87vh] overflow-y-auto no-scrollbar relative">
          {loading ? (
            <div className="flex flex-col gap-2 p-2 w-screen justify-center items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2 h-15 rounded-lg bg-gray-100 w-full animate-pulse"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-300 shrink-0" />
                  <span className="font-semibold text-gray-600 text-sm h-full mt-7">
                    Loading...
                  </span>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="w-full flex justify-center">
              <p className="text-center lg:hidden">
                There was an error retrieving your alerts.
              </p>
            </div>
          ) : alerts.length === 0 ? (
              <div className="w-full h-full flex justify-center text-(--dark-def) flex-col items-center gap-4">
                <img className="h-25 w-25 md:h-35 md:w-35 lg:h-40 lg:w-40" src="/alert-bell.svg" alt="No alerts" />
                <div className="flex flex-col items-center justify-center">
                  <p className="font-semibold text-xl md:text-2xl lg:text-[1.5vw]">
                    No notifications to show
                  </p>
                  <p className="text-center text-base max-lg:font-light md:text-xl lg:text-[1.2vw]">
                    You currently do not have any notification yet.<br />
                    we're going to notify you when
                    something new happens
                  </p>
                </div>
              </div>
          ) : (
            <div className="space-y-6 w-full">
              {/* Today */}
              {groupedAlerts.today.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 mb-3 text-center">
                    Today
                  </h3>
                  <div className="space-y-2">
                    {groupedAlerts.today.map((alert) => (
                      <AlertRow
                        key={alert.id}
                        alert={alert}
                        isDragged={draggedAlert === alert.id}
                        onDragStart={() => setDraggedAlert(alert.id)}
                        onDragEnd={() => setDraggedAlert(null)}
                        onMarkRead={() => markReadMutation.mutate(alert.id)}
                        onDelete={() => deleteAlertMutation.mutate(alert.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Yesterday */}
              {groupedAlerts.yesterday.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 mb-3 text-center">
                    Yesterday
                  </h3>
                  <div className="space-y-2">
                    {groupedAlerts.yesterday.map((alert) => (
                      <AlertRow
                        key={alert.id}
                        alert={alert}
                        isDragged={draggedAlert === alert.id}
                        onDragStart={() => setDraggedAlert(alert.id)}
                        onDragEnd={() => setDraggedAlert(null)}
                        onMarkRead={() => markReadMutation.mutate(alert.id)}
                        onDelete={() => deleteAlertMutation.mutate(alert.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* This week */}
              {groupedAlerts.thisWeek.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 mb-3 text-center">
                    This week
                  </h3>
                  <div className="space-y-2">
                    {groupedAlerts.thisWeek.map((alert) => (
                      <AlertRow
                        key={alert.id}
                        alert={alert}
                        isDragged={draggedAlert === alert.id}
                        onDragStart={() => setDraggedAlert(alert.id)}
                        onDragEnd={() => setDraggedAlert(null)}
                        onMarkRead={() => markReadMutation.mutate(alert.id)}
                        onDelete={() => deleteAlertMutation.mutate(alert.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Older */}
              {groupedAlerts.older.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 mb-3 text-center">
                    Older
                  </h3>
                  <div className="space-y-2">
                    {groupedAlerts.older.map((alert) => (
                      <AlertRow
                        key={alert.id}
                        alert={alert}
                        isDragged={draggedAlert === alert.id}
                        onDragStart={() => setDraggedAlert(alert.id)}
                        onDragEnd={() => setDraggedAlert(null)}
                        onMarkRead={() => markReadMutation.mutate(alert.id)}
                        onDelete={() => deleteAlertMutation.mutate(alert.id)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="h-15" />
      </div>

      {/* Mobile menu popup */}
      {showMobileMenu && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end lg:hidden">
          <div
            className="absolute inset-0"
            onClick={() => setShowMobileMenu(false)}
          />
          <div className="relative bg-white w-full rounded-t-3xl p-6 animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Alert Options</h3>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="space-y-2">
              <button
                onClick={handleMarkAllRead}
                disabled={markAllReadMutation.isPending || !hasUnread}
                className="w-full flex items-center gap-3 px-4 py-3 text-base bg-gray-50 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <Check size={20} />
                Mark all as read
              </button>
              <button
                onClick={handleDeleteAll}
                disabled={deleteAllMutation.isPending}
                className="w-full flex items-center gap-3 px-4 py-3 text-base text-red-600 bg-red-50 rounded-lg hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <X size={20} />
                Delete all
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-2">Delete All Alerts?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete all alerts? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={cancelDelete}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAll}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AlertsPage = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { alerts } = useAlertsQuery();

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center w-[100vw] min-h-screen bg-[#ededed]">
      <div className="sm:hidden w-full">
        <MobileBanner
          page="Alerts"
          showMenuButton={alerts.length > 0}
          onMenuClick={() => setShowMobileMenu(true)}
        />
      </div>

      <div className="hidden lg:flex w-[25vw] h-[100vh] items-center justify-center pl-2">
        <ProfileStats />
      </div>

      <div className="flex items-center justify-center w-full lg:w-[75vw] lg:h-full">
        <AlertsPanel
          showMobileMenu={showMobileMenu}
          setShowMobileMenu={setShowMobileMenu}
        />
      </div>

      <MenuButton />
    </div>
  );
};

export default AlertsPage;
