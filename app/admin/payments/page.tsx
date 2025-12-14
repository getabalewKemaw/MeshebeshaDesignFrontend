"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, CreditCard, CheckCircle, XCircle, RefreshCw, DollarSign } from "lucide-react";

import { useAuth } from "@/lib/hooks/useAuth";
import {
  listAdminPayments,
  getAdminPayment,
  markPaymentPaid,
  markPaymentRefunded,
} from "@/lib/api/admin/payments";
import type { AdminPayment } from "@/lib/api/admin/payments";

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
] as const;

const STATUS_BADGE_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-emerald-100 text-emerald-700",
  failed: "bg-rose-100 text-rose-700",
  refunded: "bg-gray-100 text-gray-700",
};

const formatCurrency = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(amount);

export default function AdminPaymentsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<AdminPayment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    provider: "",
    search: "",
    page: 1,
    limit: 20,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
  });

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/");
      return;
    }

    if (user?.role === "admin") {
      fetchPayments();
    }
  }, [user, authLoading, filters, router]);

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const response = await listAdminPayments({
        status: filters.status !== "all" ? filters.status : undefined,
        provider: filters.provider || undefined,
        page: filters.page,
        limit: filters.limit,
      });

      if (response.success && response.data) {
        setPayments(response.data);
        // Note: pagination would come from response.pagination if API returns it
      }
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewPayment = async (paymentId: string) => {
    try {
      const response = await getAdminPayment(paymentId);
      if (response.success && response.data) {
        setSelectedPayment(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch payment details:", error);
    }
  };

  const handleMarkPaid = async (paymentId: string) => {
    if (!confirm("Mark this payment as paid?")) return;

    setIsActionLoading(true);
    try {
      const response = await markPaymentPaid(paymentId);
      if (response.success) {
        await fetchPayments();
        if (selectedPayment?.id === paymentId) {
          await handleViewPayment(paymentId);
        }
        alert("Payment marked as paid successfully");
      } else {
        alert(response.error || "Failed to mark payment as paid");
      }
    } catch (error) {
      console.error("Failed to mark payment as paid:", error);
      alert("Failed to mark payment as paid");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleRefund = async (paymentId: string) => {
    const refundAmount = prompt("Enter refund amount (leave empty for full refund):");
    if (refundAmount === null) return;

    const amount = refundAmount ? parseFloat(refundAmount) : undefined;
    if (refundAmount && (isNaN(amount!) || amount! <= 0)) {
      alert("Invalid refund amount");
      return;
    }

    if (!confirm(`Refund ${amount ? formatCurrency(amount, "USD") : "full amount"}?`)) return;

    setIsActionLoading(true);
    try {
      const response = await markPaymentRefunded(paymentId, amount);
      if (response.success) {
        await fetchPayments();
        if (selectedPayment?.id === paymentId) {
          await handleViewPayment(paymentId);
        }
        alert("Payment refunded successfully");
      } else {
        alert(response.error || "Failed to refund payment");
      }
    } catch (error) {
      console.error("Failed to refund payment:", error);
      alert("Failed to refund payment");
    } finally {
      setIsActionLoading(false);
    }
  };

  if (authLoading || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const filteredPayments = payments.filter((payment) => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        payment.order.orderNumber.toLowerCase().includes(searchLower) ||
        payment.chapaRef?.toLowerCase().includes(searchLower) ||
        payment.order.user.email.toLowerCase().includes(searchLower) ||
        payment.order.user.name.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Payment Management</h1>
          <p className="text-gray-500 mt-1">Manage and track all payments</p>
        </div>
        <button
          onClick={fetchPayments}
          disabled={isLoading}
          className="form-button-primary flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search payments..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="form-input-base pl-10"
            />
          </div>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="form-input-base"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            value={filters.provider}
            onChange={(e) => setFilters({ ...filters, provider: e.target.value })}
            className="form-input-base"
          >
            <option value="">All Providers</option>
            <option value="chapa">Chapa</option>
            <option value="fake_gateway">Fake Gateway</option>
          </select>
        </div>
      </div>

      {/* Payments List */}
      <div className="bg-white shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>No payments found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleViewPayment(payment.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {payment.chapaRef || payment.id.slice(0, 8)}
                      </div>
                      <div className="text-xs text-gray-500">{payment.provider}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {payment.order.orderNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{payment.order.user.name}</div>
                      <div className="text-xs text-gray-500">{payment.order.user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(payment.amount, payment.currency)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold ${STATUS_BADGE_STYLES[payment.status] || "bg-gray-100 text-gray-700"
                          }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        {payment.status === "pending" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkPaid(payment.id);
                            }}
                            disabled={isActionLoading}
                            className="text-green-600 hover:text-green-700 disabled:opacity-50"
                            title="Mark as paid"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        )}
                        {payment.status === "paid" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRefund(payment.id);
                            }}
                            disabled={isActionLoading}
                            className="text-red-600 hover:text-red-700 disabled:opacity-50"
                            title="Refund"
                          >
                            <DollarSign className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payment Detail Modal */}
      {selectedPayment && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPayment(null)}
        >
          <div
            className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-900">Payment Details</h2>
                <button
                  onClick={() => setSelectedPayment(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Payment ID</label>
                  <p className="text-sm text-gray-900 font-mono">{selectedPayment.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Chapa Reference</label>
                  <p className="text-sm text-gray-900 font-mono">
                    {selectedPayment.chapaRef || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <span
                    className={`px-2 py-1 text-xs font-semibold ${STATUS_BADGE_STYLES[selectedPayment.status] || "bg-gray-100 text-gray-700"
                      }`}
                  >
                    {selectedPayment.status}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Amount</label>
                  <p className="text-sm text-gray-900 font-semibold">
                    {formatCurrency(selectedPayment.amount, selectedPayment.currency)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Order Number</label>
                  <p className="text-sm text-gray-900">{selectedPayment.order.orderNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Customer</label>
                  <p className="text-sm text-gray-900">{selectedPayment.order.user.name}</p>
                  <p className="text-xs text-gray-500">{selectedPayment.order.user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Created At</label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedPayment.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Updated At</label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedPayment.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                {selectedPayment.status === "pending" && (
                  <button
                    onClick={() => {
                      handleMarkPaid(selectedPayment.id);
                    }}
                    disabled={isActionLoading}
                    className="form-button-primary flex-1 bg-green-600 hover:bg-green-700 border-none"
                  >
                    Mark as Paid
                  </button>
                )}
                {selectedPayment.status === "paid" && (
                  <button
                    onClick={() => {
                      handleRefund(selectedPayment.id);
                    }}
                    disabled={isActionLoading}
                    className="form-button-primary flex-1 bg-red-600 hover:bg-red-700 border-none"
                  >
                    Refund
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}









