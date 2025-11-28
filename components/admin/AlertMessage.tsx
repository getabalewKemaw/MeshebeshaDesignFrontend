interface AlertMessageProps {
    message: string;
    type: 'success' | 'error';
}

export default function AlertMessage({ message, type }: AlertMessageProps) {
    const bgColor = type === 'success' ? 'bg-green-50' : 'bg-red-50';
    const textColor = type === 'success' ? 'text-green-700' : 'text-red-700';

    return (
        <div className={`mb-6 ${bgColor} ${textColor} px-4 py-3 rounded-lg shadow-sm`}>
            <div className="flex items-center">
                <div className="py-1">
                    <p className="text-sm font-medium">{message}</p>
                </div>
            </div>
        </div>
    );
}
