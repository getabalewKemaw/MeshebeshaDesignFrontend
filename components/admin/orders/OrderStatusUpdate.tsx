const STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
] as const;

interface OrderStatusUpdateProps {
    currentStatus: string;
    pendingStatus: string;
    statusNote: string;
    updating: boolean;
    onStatusChange: (status: string) => void;
    onNoteChange: (note: string) => void;
    onUpdate: () => void;
}

export default function OrderStatusUpdate({
    currentStatus,
    pendingStatus,
    statusNote,
    updating,
    onStatusChange,
    onNoteChange,
    onUpdate,
}: OrderStatusUpdateProps) {
    return (
        <div className="space-y-3">
            <div>
                <label className="text-xs font-medium text-gray-500">
                    Update Status
                </label>
                <select
                    value={pendingStatus}
                    onChange={(event) => onStatusChange(event.target.value)}
                    className="form-input-base mt-1 py-2 text-sm"
                >
                    {STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label className="text-xs font-medium text-gray-500">
                    Internal Note (optional)
                </label>
                <textarea
                    value={statusNote}
                    onChange={(event) => onNoteChange(event.target.value)}
                    rows={3}
                    placeholder="Visible to admins for auditing"
                    className="form-input-base mt-1 py-2 text-sm"
                />
            </div>
            <button
                type="button"
                onClick={onUpdate}
                disabled={updating || pendingStatus === currentStatus}
                className="form-button-primary w-full justify-center text-sm"
            >
                {updating ? "Updating..." : "Save Status"}
            </button>
        </div>
    );
}
