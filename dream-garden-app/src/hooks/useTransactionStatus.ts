import { useState, useCallback } from 'react';
import type { TransactionStatusType } from '../components/TransactionStatus';


export function useTransactionStatus() {
    const [status, setStatus] = useState<TransactionStatusType>('idle');
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [title, setTitle] = useState("");

    const updateStatus = useCallback((newStatus: TransactionStatusType, details?: { message?: string, error?: string, title?: string }) => {
        setStatus(newStatus);
        if (details?.error) setErrorMsg(details.error);
        if (details?.message) setSuccessMsg(details.message);
        if (details?.title) setTitle(details.title);
    }, []);

    const reset = useCallback(() => {
        setStatus('idle');
        setErrorMsg("");
        setSuccessMsg("");
        setTitle("");
    }, []);

    return {
        status,
        errorMsg,
        successMsg,
        title,
        updateStatus,
        reset
    };

}
