import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
    useCreateOrderMutation,
    useEditOrderMutation,
    useCloseOrderMutation,
    useDeleteOrderMutation,
} from "@/features/market/queries";
import type { SubmitItemOrder } from "@/types/wf-market";

/**
 * 订单写操作的统一入口：把 create/edit/close/delete 四个 mutation
 * 包成带 toast 成功/失败反馈的 handler，供弹窗、订单卡片等组件直接调用。
 *
 * 校验、表单状态、乐观更新留在各调用方；本 hook 只负责「发请求 + 反馈」。
 * 每个 handler 返回 boolean 表示是否成功，方便调用方据此清表单/关弹窗。
 */
export function useOrderActions() {
    const { t } = useTranslation();
    const createMut = useCreateOrderMutation();
    const editMut = useEditOrderMutation();
    const closeMut = useCloseOrderMutation();
    const deleteMut = useDeleteOrderMutation();

    const fail = (e: unknown) =>
        toast.error(e instanceof Error ? e.message : String(e));

    const handleSubmit = async (order: SubmitItemOrder): Promise<boolean> => {
        try {
            await createMut.mutateAsync(order);
            toast.success(t("order.submit.success"));
            return true;
        } catch (e) {
            fail(e);
            return false;
        }
    };

    const handleEdit = async (
        id: string,
        order: SubmitItemOrder,
    ): Promise<boolean> => {
        try {
            await editMut.mutateAsync({ id, order });
            toast.success(t("order.edit.success"));
            return true;
        } catch (e) {
            fail(e);
            return false;
        }
    };

    const handleClose = async (
        id: string,
        order: SubmitItemOrder,
    ): Promise<boolean> => {
        try {
            await closeMut.mutateAsync({ id, order });
            toast.success(t("order.close.success"));
            return true;
        } catch (e) {
            fail(e);
            return false;
        }
    };

    const handleDelete = async (id: string): Promise<boolean> => {
        try {
            await deleteMut.mutateAsync(id);
            toast.success(t("order.delete.success"));
            return true;
        } catch (e) {
            fail(e);
            return false;
        }
    };

    return {
        handleSubmit,
        handleEdit,
        handleClose,
        handleDelete,
        creating: createMut.isPending,
        editing: editMut.isPending,
        closing: closeMut.isPending,
        deleting: deleteMut.isPending,
    };
}
