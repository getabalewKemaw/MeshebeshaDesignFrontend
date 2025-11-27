interface SubmissionMessageProps {
    message: string;
    isSuccess: boolean;
}

export default function SubmissionMessage({ message, isSuccess }: SubmissionMessageProps) {
    return (
        <div
            className={`text-sm p-3 rounded ${isSuccess
                    ? "bg-green-50 text-green-800"
                    : "bg-red-50 text-red-800"
                }`}
        >
            {message}
        </div>
    );
}
