const STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
] as const;

interface BulkActionsBarProps {
    selectedCount: number;
    bulkStatus: string;
    updating: boolean;
    onBulkStatusChange: (status: string) => void;
    onBulkUpdate: () => void;
    onCancel: () => void;
}

export default function BulkActionsBar({
    selectedCount,
    bulkStatus,
    updating,
    onBulkStatusChange,
    onBulkUpdate,
    onCancel,
}: BulkActionsBarProps) {
    return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-blue-900">
                    {selectedCount} order{selectedCount !== 1 ? "s" : ""} selected
                </span>
                <select
                    value={bulkStatus}
                    onChange={(e) => onBulkStatusChange(e.target.value)}
                    className="rounded-lg border border-blue-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                >
                    <option value="">Select status...</option>
                    {STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <button
                    onClick={onBulkUpdate}
                    disabled={!bulkStatus || updating}
                    className="form-button-primary rounded-none text-sm"
                >
                    {updating ? "Updating..." : "Update Selected"}
                </button>
                <button
                    onClick={onCancel}
                    className="form-button-secondary rounded-none text-sm"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
