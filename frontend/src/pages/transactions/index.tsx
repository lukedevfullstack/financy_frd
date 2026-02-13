import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { useTransactionsPaginated } from "@/hooks/useTransactionsPaginated";
import { Plus } from "lucide-react";
import { getTransactionsColumns } from "./components/transactions-columns";
import { TransactionDialog } from "./components/create-transaction-dialog";
import { DeleteTransactionDialog } from "./components/delete-transaction-dialog";
import { TransactionsFilters } from "./components/transactions-filters";
import { useDeleteTransaction } from "@/hooks/useDeleteTransaction";
import { useState, useCallback } from "react";
import type { Transaction, TransactionFilterInput } from "@/types";

export function Transactions() {
  const [filters, setFilters] = useState<TransactionFilterInput>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data } = useTransactionsPaginated({
    filters,
    pagination: {
      page: currentPage,
      limit: pageSize,
    },
  });

  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deletingTransaction, setDeletingTransaction] =
    useState<Transaction | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { mutate: deleteTransaction, isPending: isDeleting } =
    useDeleteTransaction();

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setEditDialogOpen(true);
  };

  const handleDelete = (transaction: Transaction) => {
    setDeletingTransaction(transaction);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingTransaction) {
      deleteTransaction(deletingTransaction.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setDeletingTransaction(null);
        },
      });
    }
  };

  const handleFiltersChange = useCallback(
    (newFilters: TransactionFilterInput) => {
      setFilters(newFilters);
      setCurrentPage(1); // Reset to first page when filters change
    },
    [],
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const columns = getTransactionsColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-800 font-bold leading-8 text-2xl">
            Transações
          </h1>
          <span className="text-gray-600 leading-6 text-base">
            Gerencie todas as suas transações financeiras
          </span>
        </div>
        <TransactionDialog>
          <Button size="sm">
            <Plus /> Nova transação
          </Button>
        </TransactionDialog>
      </div>

      <TransactionsFilters onFiltersChange={handleFiltersChange} />

      <DataTable
        columns={columns}
        data={data?.transactions || []}
        pageSize={pageSize}
        showPagination={true}
        emptyMessage="Nenhum registro encontrado."
        serverSidePagination={{
          currentPage: data?.page || 1,
          totalPages: data?.totalPages || 1,
          totalItems: data?.total || 0,
          onPageChange: handlePageChange,
          onPageSizeChange: handlePageSizeChange,
        }}
      />

      <TransactionDialog
        transaction={editingTransaction}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />

      <DeleteTransactionDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        transactionDescription={deletingTransaction?.description || ""}
        isDeleting={isDeleting}
      />
    </div>
  );
}
