import { act, cleanup, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ArbitrationCard } from "@/features/world/components/arbitration-card";

const mocks = vi.hoisted(() => ({
    useArbyQuery: vi.fn(),
}));

vi.mock("@/features/world/queries", () => ({
    useArbyQuery: mocks.useArbyQuery,
}));

vi.mock("@/components/event-card", () => ({
    EventCard: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/card-states", () => ({
    CardEmpty: () => <div>empty</div>,
    CardError: () => <div>error</div>,
    CardSkeleton: () => <div>loading</div>,
}));

vi.mock("@/lib/wpep/nodes", () => ({
    resolveNode: (node: string) => ({
        nameZh: node,
        systemNameZh: "System",
        missionTypeZh: "Mission",
    }),
}));

vi.mock("react-i18next", () => ({
    useTranslation: () => [
        (key: string) =>
            ({
                "event.now": "当前",
                "event.next": "下一轮",
                "time.over": "已结束",
            })[key] ?? key,
    ],
}));

describe("ArbitrationCard", () => {
    const initialTimeMs = 2_000_000_000_000;
    const initialTimeSec = initialTimeMs / 1000;

    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(initialTimeMs);
        mocks.useArbyQuery.mockReturnValue({
            data: [
                { activation: initialTimeSec - 10, node: "Node A" },
                { activation: initialTimeSec + 2, node: "Node B" },
                { activation: initialTimeSec + 4, node: "Node C" },
            ],
            isPending: false,
            isError: false,
            error: null,
        });
    });

    afterEach(() => {
        cleanup();
        vi.useRealTimers();
        vi.clearAllMocks();
    });

    it("在当前轮次结束后自动显示新的当前轮次和下一轮", () => {
        render(<ArbitrationCard />);

        expect(screen.getByText(/当前 : Node A/)).toBeInTheDocument();
        expect(screen.getByText(/下一轮 : Node B/)).toBeInTheDocument();

        act(() => {
            vi.advanceTimersByTime(2000);
        });

        expect(screen.queryByText(/当前 : Node A/)).not.toBeInTheDocument();
        expect(screen.getByText(/当前 : Node B/)).toBeInTheDocument();
        expect(screen.getByText(/下一轮 : Node C/)).toBeInTheDocument();
    });
});
