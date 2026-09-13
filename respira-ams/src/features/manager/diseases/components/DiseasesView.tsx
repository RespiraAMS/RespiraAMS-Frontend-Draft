"use client";

import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { TableTitle } from "@/features/manager/components/TableTitle";
import { DiseasesTable } from "./DiseasesTable";
import { DiseaseForm } from "./DiseaseForm";
import { type DiseaseItem, type CreateDiseaseRequest } from "../types";

type ActiveView = "create" | "update" | "delete" | null;

// ─── DiseasesView ─────────────────────────────────────────────────────────────

export function DiseasesView() {
	const [activeView, setActiveView] = useState<ActiveView>(null);
	const [selected, setSelected] = useState<DiseaseItem | null>(null);

	const openView = (view: ActiveView, item?: DiseaseItem) => {
		setSelected(item ?? null);
		setActiveView(view);
	};

	const closeView = () => {
		setActiveView(null);
		setSelected(null);
	};

	// UI-only: simulate view detail
	const handleView = (item: DiseaseItem) => {
		setSelected(item);
		setActiveView(null);
		// In real implementation: router.push(`/manage/diseases/${item.id}`)
	};

	// UI-only: simulate submit
	const handleSubmit = (_data: CreateDiseaseRequest) => {
		closeView();
	};

	return (
		<>
			<TableTitle
				title="Bệnh truyền nhiễm"
				description="Quản lý danh sách bệnh truyền nhiễm đường hô hấp và tiêu chí nhập ICU."
				buttonLabel="Thêm bệnh"
				onClick={() => openView("create")}
			/>

			<DiseasesTable
				onView={handleView}
				onEdit={(item) => openView("update", item)}
				onDelete={(item) => openView("delete", item)}
			/>

			{/* Create / Update Dialog */}
			<Dialog
				open={activeView === "create" || activeView === "update"}
				onOpenChange={(open) => { if (!open) closeView(); }}
			>
				<DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>
							{activeView === "create" && "Tạo mới Bệnh truyền nhiễm"}
							{activeView === "update" && "Cập nhật Bệnh truyền nhiễm"}
						</DialogTitle>
						<DialogDescription>
							{activeView === "create" && "Điền thông tin để tạo bệnh mới."}
							{activeView === "update" && "Chỉnh sửa thông tin bệnh truyền nhiễm."}
						</DialogDescription>
					</DialogHeader>

					<div className="py-2">
						{(activeView === "create" || (activeView === "update" && selected)) && (
							<DiseaseForm
								initialData={activeView === "update" ? selected : null}
								onSubmit={handleSubmit}
								onCancel={closeView}
							/>
						)}
					</div>
				</DialogContent>
			</Dialog>

			{/* Delete Sheet */}
			<Sheet
				open={activeView === "delete"}
				onOpenChange={(open) => { if (!open) closeView(); }}
			>
				<SheetContent side="right">
					<SheetHeader>
						<SheetTitle>Xóa Bệnh truyền nhiễm</SheetTitle>
						<SheetDescription>
							Xác nhận xóa bệnh{" "}
							<strong className="text-red-600">{selected?.name}</strong>. Thao tác này
							không thể hoàn tác.
						</SheetDescription>
					</SheetHeader>

					<div className="mt-6 flex flex-col gap-4 px-1">
						<div className="rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-700">
							Bạn có chắc chắn muốn xóa bệnh{" "}
							<span className="font-bold">{selected?.name}</span> không?
						</div>
						<div className="flex gap-2 justify-end">
							<Button
								variant="outline"
								onClick={closeView}
								id="delete-disease-cancel"
							>
								Hủy
							</Button>
							<Button
								variant="destructive"
								onClick={closeView}
								id="delete-disease-confirm"
							>
								Xác nhận Xóa
							</Button>
						</div>
					</div>
				</SheetContent>
			</Sheet>
		</>
	);
}
