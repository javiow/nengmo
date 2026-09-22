import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Tabs } from "./Tabs";

const tabs = [
  { id: "a", label: "탭 A" },
  { id: "b", label: "탭 B" },
];

describe("Tabs", () => {
  it("모든 탭을 렌더링한다", () => {
    render(<Tabs tabs={tabs} activeTab="a" onChange={vi.fn()} />);

    expect(screen.getByRole("tab", { name: "탭 A" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "탭 B" })).toBeInTheDocument();
  });

  it("activeTab에 해당하는 탭에 aria-selected가 true다", () => {
    render(<Tabs tabs={tabs} activeTab="b" onChange={vi.fn()} />);

    expect(screen.getByRole("tab", { name: "탭 A" })).toHaveAttribute(
      "aria-selected",
      "false",
    );
    expect(screen.getByRole("tab", { name: "탭 B" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("탭 클릭 시 onChange가 해당 id와 함께 호출된다", () => {
    const onChange = vi.fn();
    render(<Tabs tabs={tabs} activeTab="a" onChange={onChange} />);

    fireEvent.click(screen.getByRole("tab", { name: "탭 B" }));

    expect(onChange).toHaveBeenCalledWith("b");
  });
});
