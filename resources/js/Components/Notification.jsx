import { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";

export default function Notification() {
    const { flash, errors } = usePage().props;
    const [notifications, setNotifications] = useState([]);
    const [nextId, setNextId] = useState(1);

    useEffect(() => {
        const newNotifications = [];

        // Handle flash messages (success, error, message)
        if (flash?.success) {
            newNotifications.push({
                id: nextId,
                type: "success",
                title: "Berhasil!",
                message: flash.success,
                duration: 4000,
            });
            setNextId((prev) => prev + 1);
        }

        if (flash?.error) {
            newNotifications.push({
                id: nextId + newNotifications.length,
                type: "error",
                title: "Terjadi Kesalahan!",
                message: flash.error,
                duration: 6000,
            });
        }

        if (flash?.message) {
            newNotifications.push({
                id: nextId + newNotifications.length,
                type: "info",
                title: "Informasi",
                message: flash.message,
                duration: 4000,
            });
        }

        // Handle validation errors
        if (errors && Object.keys(errors).length > 0) {
            const errorMessages = Object.values(errors);
            newNotifications.push({
                id: nextId + newNotifications.length,
                type: "error",
                title: "Validation Error",
                message: errorMessages.join(". "),
                duration: 8000,
            });
        }

        if (newNotifications.length > 0) {
            setNotifications((prev) => [...prev, ...newNotifications]);
            setNextId((prev) => prev + newNotifications.length);
        }
    }, [flash, errors]);

    const removeNotification = (id) => {
        setNotifications((prev) =>
            prev.filter((notification) => notification.id !== id)
        );
    };

    const getIcon = (type) => {
        switch (type) {
            case "success":
                return (
                    <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                        />
                    </svg>
                );
            case "error":
                return (
                    <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                        />
                    </svg>
                );
            case "warning":
                return (
                    <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                );
            case "info":
            default:
                return (
                    <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                        />
                    </svg>
                );
        }
    };

    const getColorClasses = (type) => {
        switch (type) {
            case "success":
                return {
                    bg: "bg-green-50 border-green-200",
                    icon: "text-green-400",
                    title: "text-green-800",
                    text: "text-green-700",
                    button: "text-green-500 hover:text-green-600",
                };
            case "error":
                return {
                    bg: "bg-red-50 border-red-200",
                    icon: "text-red-400",
                    title: "text-red-800",
                    text: "text-red-700",
                    button: "text-red-500 hover:text-red-600",
                };
            case "warning":
                return {
                    bg: "bg-yellow-50 border-yellow-200",
                    icon: "text-yellow-400",
                    title: "text-yellow-800",
                    text: "text-yellow-700",
                    button: "text-yellow-500 hover:text-yellow-600",
                };
            case "info":
            default:
                return {
                    bg: "bg-blue-50 border-blue-200",
                    icon: "text-blue-400",
                    title: "text-blue-800",
                    text: "text-blue-700",
                    button: "text-blue-500 hover:text-blue-600",
                };
        }
    };

    return (
        <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full">
            {notifications.map((notification) => {
                const colors = getColorClasses(notification.type);

                return (
                    <NotificationItem
                        key={notification.id}
                        notification={notification}
                        colors={colors}
                        onRemove={() => removeNotification(notification.id)}
                        getIcon={getIcon}
                    />
                );
            })}
        </div>
    );
}

function NotificationItem({ notification, colors, onRemove, getIcon }) {
    const [isVisible, setIsVisible] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);

    useEffect(() => {
        // Animate in
        const timer = setTimeout(() => setIsVisible(true), 50);

        // Auto remove after duration
        const removeTimer = setTimeout(() => {
            handleRemove();
        }, notification.duration);

        return () => {
            clearTimeout(timer);
            clearTimeout(removeTimer);
        };
    }, [notification.duration]);

    const handleRemove = () => {
        setIsRemoving(true);
        setTimeout(() => {
            onRemove();
        }, 300);
    };

    return (
        <div
            className={`transform transition-all duration-300 ease-in-out ${
                isVisible && !isRemoving
                    ? "translate-x-0 opacity-100"
                    : "translate-x-full opacity-0"
            }`}
        >
            <div
                className={`rounded-lg border-l-4 p-4 shadow-lg backdrop-blur-sm ${colors.bg}`}
            >
                <div className="flex items-start">
                    <div className={`flex-shrink-0 ${colors.icon}`}>
                        {getIcon(notification.type)}
                    </div>
                    <div className="ml-3 flex-1">
                        <h3 className={`text-sm font-medium ${colors.title}`}>
                            {notification.title}
                        </h3>
                        <div className={`mt-1 text-sm ${colors.text}`}>
                            <p>{notification.message}</p>
                        </div>
                    </div>
                    <div className="ml-4 flex flex-shrink-0">
                        <button
                            className={`inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${colors.button}`}
                            onClick={handleRemove}
                        >
                            <span className="sr-only">Tutup</span>
                            <svg
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
