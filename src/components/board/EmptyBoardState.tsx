"use client";

interface EmptyBoardStateProps {
  onAddStore: () => void;
}

export function EmptyBoardState({ onAddStore }: EmptyBoardStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <p className="text-sm text-gray-500">자주 가는 가게를 등록해보세요.</p>
      <button
        type="button"
        onClick={onAddStore}
        className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
      >
        가게 추가
      </button>
    </div>
  );
}
